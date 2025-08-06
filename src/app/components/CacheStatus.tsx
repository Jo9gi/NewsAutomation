'use client';

import { useState, useEffect } from 'react';

interface CacheInfo {
  source: string;
  last_fetch?: string;
  record_count?: number;
  file_path?: string;
  note?: string;
}

export default function CacheStatus() {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkCacheStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/news/smart');
      const data = await response.json();
      setCacheInfo(data.cache_info);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking cache status:', error);
    } finally {
      setLoading(false);
    }
  };

  const forceRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/news/smart?refresh=true');
      const data = await response.json();
      setCacheInfo(data.cache_info);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error forcing refresh:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkCacheStatus();
  }, []);

  const getStatusColor = (source: string) => {
    switch (source) {
      case 'cache':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'latest_available':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'none':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (source: string) => {
    switch (source) {
      case 'cache':
        return '✅';
      case 'latest_available':
        return '⚠️';
      case 'none':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Data Cache Status
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={checkCacheStatus}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Check'}
          </button>
          <button
            onClick={forceRefresh}
            disabled={loading}
            className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {cacheInfo && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getStatusIcon(cacheInfo.source)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cacheInfo.source)}`}>
              {cacheInfo.source === 'cache' ? 'Fresh Cache' : 
               cacheInfo.source === 'latest_available' ? 'Using Latest Available' : 
               'No Data Available'}
            </span>
          </div>

          {cacheInfo.last_fetch && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Last Updated:</strong> {new Date(cacheInfo.last_fetch).toLocaleString()}
            </div>
          )}

          {cacheInfo.record_count !== undefined && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Articles:</strong> {cacheInfo.record_count}
            </div>
          )}

          {cacheInfo.file_path && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>File:</strong> {cacheInfo.file_path.split('/').pop()}
            </div>
          )}

          {cacheInfo.note && (
            <div className="text-sm text-gray-600 dark:text-gray-400 italic">
              {cacheInfo.note}
            </div>
          )}
        </div>
      )}

      {lastChecked && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
} 