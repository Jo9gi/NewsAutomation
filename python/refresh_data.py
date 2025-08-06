#!/usr/bin/env python3
"""
Data Refresh Script for News Automation
This script allows manual control over data fetching and cache management.
"""

import sys
import os
from cache_manager import CacheManager
from automate import main as run_automation

def main():
    cache_manager = CacheManager()
    
    if len(sys.argv) < 2:
        print("""
🔄 News Data Refresh Tool

Usage:
  python refresh_data.py [command] [options]

Commands:
  check     - Check cache status
  refresh   - Force refresh data (ignore cache)
  clear     - Clear cache
  auto      - Run with smart caching (default behavior)

Options:
  --hours N - Set cache age in hours (default: 6)

Examples:
  python refresh_data.py check
  python refresh_data.py refresh
  python refresh_data.py clear
  python refresh_data.py auto --hours 12
        """)
        return

    command = sys.argv[1].lower()
    
    # Parse options
    max_age_hours = 6
    if '--hours' in sys.argv:
        try:
            hours_index = sys.argv.index('--hours')
            max_age_hours = int(sys.argv[hours_index + 1])
        except (ValueError, IndexError):
            print("❌ Invalid --hours value")
            return

    if command == 'check':
        print("🔍 Checking cache status...")
        cache_info = cache_manager.get_cache_info("news")
        
        if cache_info:
            print(f"📊 Last fetch: {cache_info['last_fetch']}")
            print(f"📁 File: {cache_info['file_path']}")
            print(f"📈 Records: {cache_info['record_count']}")
            print(f"✅ Status: {cache_info['status']}")
            
            is_fresh = cache_manager.is_data_fresh("news", max_age_hours)
            print(f"🕐 Fresh (within {max_age_hours}h): {'Yes' if is_fresh else 'No'}")
        else:
            print("❌ No cache data found")
            
    elif command == 'refresh':
        print("🔄 Force refreshing data...")
        # Clear cache to force refresh
        cache_manager.clear_cache("news")
        run_automation()
        
    elif command == 'clear':
        print("🗑️ Clearing cache...")
        cache_manager.clear_cache("news")
        print("✅ Cache cleared")
        
    elif command == 'auto':
        print(f"🤖 Running with smart caching (max age: {max_age_hours}h)...")
        run_automation()
        
    else:
        print(f"❌ Unknown command: {command}")
        print("Use 'check', 'refresh', 'clear', or 'auto'")

if __name__ == "__main__":
    main() 