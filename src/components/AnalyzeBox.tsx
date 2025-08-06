'use client';

import { useState } from 'react';

export default function AnalyzeBox() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Placeholder for analysis functionality
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        News Analysis
      </h3>
      
      <div className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Analyze sentiment and generate insights from the latest news articles.</p>
        </div>
        
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </div>
          ) : (
            'Analyze News'
          )}
        </button>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Analysis features coming soon...
        </div>
      </div>
    </div>
  );
} 