import React from 'react';

interface SentimentBadgeProps {
  sentiment: 'positive' | 'negative' | 'neutral';
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment }) => {
  const colors = {
    positive: 'bg-green-100 text-green-800',
    negative: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[sentiment]}`}>
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </span>
  );
};