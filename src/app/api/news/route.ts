import { NextResponse } from 'next/server';
import { staticNewsData } from '../lib/staticNews';

export async function GET() {
  try {
    // Fetch live news from API
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
      
    const liveResponse = await fetch(`${baseUrl}/api/news/live`);
    const liveData = await liveResponse.json();
    return NextResponse.json(liveData);
    
  } catch (error) {
    console.error('Error fetching live news:', error);
    // Fallback to static data
    return NextResponse.json({ news: staticNewsData });
  }
}