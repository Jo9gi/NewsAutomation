'use client';
import { useState } from 'react';
import axios from 'axios';

export default function AnalyzeBox() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSummary('');
    setSentiment('');
    try {
      const response = await axios.post('/api/analyze', { url });
      setSummary(response.data.summary);
      setSentiment(response.data.sentiment);
    } catch {
      setSummary('Error analyzing article.');
      setSentiment('');
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
        <div className="flex w-full gap-2 mb-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter article URL"
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {(summary || sentiment) && (
          <div className="w-full text-center mt-2">
            {summary && (
              <div className="mb-2">
                <h2 className="text-lg font-semibold mb-1">Summary</h2>
                <p className="text-gray-700">{summary}</p>
              </div>
            )}
            {sentiment && (
              <div>
                <h2 className="text-lg font-semibold mb-1">Sentiment</h2>
                <p className="text-gray-700">{sentiment}</p>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}