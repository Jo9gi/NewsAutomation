import React, { useState } from 'react';

interface NewsItem {
  title: string;
  description: string;
  link: string;
  Sentiment: string;
  Summary: string;
}

async function fetchNews() {
  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL
      ? process.env.NEXT_PUBLIC_BASE_URL
      : 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/news`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.news || [];
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  let label = 'Neutral', color = 'bg-yellow-200 text-yellow-800';
  try {
    const s = JSON.parse(sentiment);
    if (s.label === 'POSITIVE') { label = 'Positive'; color = 'bg-green-200 text-green-800'; }
    else if (s.label === 'NEGATIVE') { label = 'Negative'; color = 'bg-red-200 text-red-800'; }
  } catch {}
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{label}</span>;
}

export default async function NewsList() {
  try {
    const news: NewsItem[] = await fetchNews();
    if (!news.length) {
      return (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No news found for today.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Latest News</h2>
        {news.map((item, idx) => (
          <div key={idx} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-2 text-black">{item.title}</h3>
            <p className="mb-2 text-gray-700 line-clamp-3">{item.description}</p>
            <div className="flex items-center gap-4 text-sm mb-2">
              <SentimentBadge sentiment={item.Sentiment} />
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Read more</a>
            </div>
            {item.Summary && (
              <details className="mt-2 cursor-pointer">
                <summary className="text-gray-600 hover:text-gray-800">Show Summary</summary>
                <div className="mt-1 text-gray-800 text-sm whitespace-pre-line p-2 bg-gray-50 rounded">{item.Summary}</div>
              </details>
            )}
          </div>
        ))}
      </div>
    );
  } catch {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-500">Error loading news. Please try again later.</p>
      </div>
    );
  }
}