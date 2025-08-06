'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  Processed_Date?: string;
  Processed_Time?: string;
  Sentiment?: string;
}

interface CacheInfo {
  source: string;
  file_path?: string;
  record_count?: number;
  last_modified?: string;
  age_hours?: string;
  note?: string;
}

interface NewsResponse {
  news: NewsItem[];
  cache_info: CacheInfo;
}

export default function DynamicNews() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = forceRefresh ? '/api/news/smart?refresh=true' : '/api/news/smart';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: NewsResponse = await response.json();
      setNewsData(data.news);
      setCacheInfo(data.cache_info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleRefresh = () => {
    fetchNews(true);
  };

  const getStatusColor = (source: string) => {
    switch (source) {
      case 'today_file':
      case 'newly_fetched':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'latest_available':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'force_refresh':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusText = (source: string) => {
    switch (source) {
      case 'today_file':
        return 'Today\'s Data';
      case 'newly_fetched':
        return 'Fresh Data';
      case 'latest_available':
        return 'Latest Available';
      case 'force_refresh':
        return 'Force Refreshed';
      default:
        return 'Unknown Source';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-6 rounded-lg shadow-xl">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-600 dark:text-blue-400">Loading news data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900 dark:to-pink-900 p-6 rounded-lg shadow-xl">
        <div className="text-center py-8">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading News</h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => fetchNews(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Header */}
      {cacheInfo && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cacheInfo.source)}`}>
                {getStatusText(cacheInfo.source)}
              </span>
              {cacheInfo.record_count && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {cacheInfo.record_count} articles
                </span>
              )}
              {cacheInfo.age_hours && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {cacheInfo.age_hours}h old
                </span>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          {cacheInfo.note && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
              {cacheInfo.note}
            </p>
          )}
        </div>
      )}

      {/* News Grid */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-200">
          Latest News
        </h2>
        
        {newsData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No news articles available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsData.slice(0, 6).map((item, index) => (
              <Link 
                href={item.link}
                key={index}
                target="_blank"
                className="p-4 border border-blue-200 dark:border-blue-700 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
              >
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.pubDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="font-semibold mb-2 text-indigo-700 dark:text-indigo-300 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-blue-600 dark:text-blue-300 line-clamp-3 text-sm">
                  {item.description}
                </p>
                <div className="mt-2 flex items-center justify-end">
                  <span className="text-sm text-indigo-600 dark:text-indigo-400">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 