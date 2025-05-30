export interface Article {
  id: number;
  title: string;
  description: string;
  link: string;
  processedDate: string;
  processedTime: string;
  sentiment: {
    label: string;
    score: number;
  };
  source: string;
}

// Function to parse the sentiment string from CSV
const parseSentiment = (sentimentStr: string) => {
  try {
    const cleaned = sentimentStr.replace(/'/g, '"');
    return JSON.parse(cleaned);
  } catch (e) {
    return { label: 'NEUTRAL', score: 0.5 };
  }
};

// Import the CSV data and transform it into articles
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const getLatestCSV = () => {
  const dataDir = path.join(process.cwd(), 'data');
  const files = fs.readdirSync(dataDir)
    .filter(file => file.startsWith('headline_'))
    .sort()
    .reverse();
  return files[0] ? path.join(dataDir, files[0]) : null;
};

export const getArticles = (): Article[] => {
  const csvFile = getLatestCSV();
  if (!csvFile) return [];

  const fileContent = fs.readFileSync(csvFile, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  return records.map((record: any, index: number) => ({
    id: index + 1,
    title: record.title,
    description: record.description,
    link: record.link,
    processedDate: record.pubDate,
    processedTime: record.Processed_Time,
    sentiment: parseSentiment(record.Sentiment),
    source: new URL(record.link).hostname.replace('www.', '')
  }));
};

export const articles = getArticles();