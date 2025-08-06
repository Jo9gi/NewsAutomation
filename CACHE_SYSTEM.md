# Smart Caching System for News Automation

## Overview

The News Automation project now includes a smart caching system that automatically checks if data is fresh before fetching new information. This prevents unnecessary API calls and improves performance.

## How It Works

### 1. Automatic Cache Checking
- **Default Cache Duration**: 6 hours
- **Smart Detection**: Checks if today's data file exists and is recent
- **Fallback**: Uses latest available data if cache is stale

### 2. Cache Storage
- **Location**: `python/cache/metadata.json`
- **Data**: Tracks last fetch time, file path, record count, and status
- **Persistence**: Cache metadata survives application restarts

## Usage

### Web Interface
1. **Check Status**: Visit the homepage to see cache status
2. **Manual Refresh**: Click "Refresh" button to force new data fetch
3. **Real-time Updates**: Cache status updates automatically

### Command Line Tools

#### Check Cache Status
```bash
cd python
python refresh_data.py check
```

#### Force Refresh Data
```bash
cd python
python refresh_data.py refresh
```

#### Clear Cache
```bash
cd python
python refresh_data.py clear
```

#### Run with Smart Caching
```bash
cd python
python refresh_data.py auto --hours 12
```

### API Endpoints

#### Smart News API
- **URL**: `/api/news/smart`
- **Method**: GET
- **Parameters**:
  - `refresh=true` - Force refresh (ignore cache)
  - `maxAge=6` - Set cache age in hours

#### Examples
```bash
# Get cached data (if fresh)
curl /api/news/smart

# Force refresh
curl /api/news/smart?refresh=true

# Set custom cache age (12 hours)
curl /api/news/smart?maxAge=12
```

## Cache Behavior

### Fresh Data (✅)
- Data fetched within cache duration
- Uses cached data immediately
- No API calls made

### Stale Data (⚠️)
- Data older than cache duration
- Uses latest available file as fallback
- Triggers background refresh

### No Data (❌)
- No cached data available
- Forces new data fetch
- Creates new cache entry

## Configuration

### Cache Duration
- **Default**: 6 hours
- **Customizable**: Via command line or API parameters
- **Recommended**: 6-12 hours for news data

### Cache Location
- **Metadata**: `python/cache/metadata.json`
- **Data Files**: `data/headline_YYYY-MM-DD.csv`
- **Backup**: Cache survives application restarts

## Benefits

1. **Performance**: Faster loading with cached data
2. **Cost Savings**: Fewer API calls to NewsData.io
3. **Reliability**: Fallback to latest available data
4. **Transparency**: Clear cache status indicators
5. **Control**: Manual refresh when needed

## Troubleshooting

### Cache Issues
```bash
# Clear cache and start fresh
python refresh_data.py clear
python refresh_data.py refresh
```

### Force Refresh
```bash
# Ignore cache completely
python refresh_data.py refresh
```

### Check Cache Health
```bash
# Verify cache status
python refresh_data.py check
```

## Integration

The caching system is automatically integrated into:
- **Python automation scripts** (`automate.py`)
- **Web API endpoints** (`/api/news/smart`)
- **Frontend components** (`CacheStatus.tsx`)
- **Command line tools** (`refresh_data.py`)

## Monitoring

Monitor cache performance through:
- Web interface cache status
- Command line cache check
- API response cache info
- Log files and console output 