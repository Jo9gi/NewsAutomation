import os
import json
import datetime
from pathlib import Path
from typing import Dict, Any, Optional

class CacheManager:
    def __init__(self, cache_dir: str = "cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        self.metadata_file = self.cache_dir / "metadata.json"
        self.load_metadata()

    def load_metadata(self):
        """Load cache metadata from file"""
        if self.metadata_file.exists():
            try:
                with open(self.metadata_file, 'r') as f:
                    self.metadata = json.load(f)
            except:
                self.metadata = {}
        else:
            self.metadata = {}

    def save_metadata(self):
        """Save cache metadata to file"""
        with open(self.metadata_file, 'w') as f:
            json.dump(self.metadata, f, indent=2)

    def is_data_fresh(self, data_type: str = "news", max_age_hours: int = 6) -> bool:
        """
        Check if cached data is fresh enough
        
        Args:
            data_type: Type of data (e.g., 'news', 'articles')
            max_age_hours: Maximum age in hours before data is considered stale
            
        Returns:
            bool: True if data is fresh, False if stale or missing
        """
        if data_type not in self.metadata:
            return False

        last_fetch = self.metadata[data_type].get('last_fetch')
        if not last_fetch:
            return False

        try:
            last_fetch_time = datetime.datetime.fromisoformat(last_fetch)
            now = datetime.datetime.now()
            age = now - last_fetch_time
            
            # Check if data is within the acceptable age
            return age.total_seconds() < (max_age_hours * 3600)
        except:
            return False

    def update_cache_metadata(self, data_type: str, file_path: str, record_count: int):
        """Update cache metadata after fetching new data"""
        self.metadata[data_type] = {
            'last_fetch': datetime.datetime.now().isoformat(),
            'file_path': file_path,
            'record_count': record_count,
            'status': 'success'
        }
        self.save_metadata()

    def get_cache_info(self, data_type: str) -> Optional[Dict[str, Any]]:
        """Get information about cached data"""
        if data_type in self.metadata:
            return self.metadata[data_type]
        return None

    def clear_cache(self, data_type: str = None):
        """Clear cache for specific data type or all cache"""
        if data_type:
            if data_type in self.metadata:
                del self.metadata[data_type]
        else:
            self.metadata = {}
        self.save_metadata()

    def get_latest_csv_file(self, data_dir: str = "data") -> Optional[str]:
        """Get the path to the latest CSV file"""
        data_path = Path(data_dir)
        if not data_path.exists():
            return None

        csv_files = list(data_path.glob("headline_*.csv"))
        if not csv_files:
            return None

        # Sort by modification time (newest first)
        latest_file = max(csv_files, key=lambda x: x.stat().st_mtime)
        return str(latest_file)

    def should_fetch_new_data(self, data_type: str = "news", max_age_hours: int = 6) -> bool:
        """
        Determine if new data should be fetched
        
        Returns:
            bool: True if new data should be fetched, False if cached data is fresh
        """
        # Check if we have fresh cached data
        if self.is_data_fresh(data_type, max_age_hours):
            print(f"✅ Cached {data_type} data is fresh (less than {max_age_hours} hours old)")
            return False

        # Check if today's file exists
        today = datetime.datetime.now().strftime('%Y-%m-%d')
        today_file = f"data/headline_{today}.csv"
        
        if os.path.exists(today_file):
            # Check if file was created today and is recent
            file_stat = os.stat(today_file)
            file_time = datetime.datetime.fromtimestamp(file_stat.st_mtime)
            now = datetime.datetime.now()
            
            if (now - file_time).total_seconds() < (max_age_hours * 3600):
                print(f"✅ Today's {data_type} file exists and is recent")
                self.update_cache_metadata(data_type, today_file, 0)  # We'll update count later
                return False

        print(f"🔄 {data_type} data is stale or missing, fetching new data...")
        return True 