import { NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_URL = "https://newsdata.io/api/1/news";

const NEGATIVE_KEYWORDS = [
  "lawsuit", "hack", "breach", "shutdown", "failure",
  "cyberattack", "fraud", "crime", "scam", "layoffs"
];

export async function GET() {
  try {
    const params = new URLSearchParams({
      apikey: NEWS_API_KEY || '',
      q: 'IT innovation',
      language: 'en',
      category: 'technology'
    });

    const response = await fetch(`${NEWS_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const articles = data.results || [];

    // Filter positive news
    const positiveNews = articles
      .filter((article: any) => {
        const fullText = `${article.title} ${article.description}`.toLowerCase();
        return !NEGATIVE_KEYWORDS.some(keyword => fullText.includes(keyword));
      })
      .map((article: any) => ({
        title: article.title,
        description: article.description,
        link: article.link,
        pubDate: article.pubDate,
        Sentiment: 'POSITIVE',
        Summary: article.description?.substring(0, 200) + '...'
      }));

    return NextResponse.json({ news: positiveNews });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ news: [] }, { status: 500 });
  }
}