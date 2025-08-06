import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { staticNewsData } from '../lib/staticNews';

export async function GET() {
  try {
    // Try to get CSV files first (for local development)
    const dataDir = path.join(process.cwd(), 'data');
    
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir).filter(file => file.startsWith('headline_') && file.endsWith('.csv'));
      const latestFile = files.sort().reverse()[0];
      
      if (latestFile) {
        const filePath = path.join(dataDir, latestFile);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        });
        return NextResponse.json({ news: records });
      }
    }
    
    // Fallback to live API for production (Vercel)
    console.log('No CSV files found, fetching live news');
    const liveResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/news/live`);
    const liveData = await liveResponse.json();
    return NextResponse.json(liveData);
    
  } catch (error) {
    console.error('Error reading news:', error);
    // Final fallback to static data
    return NextResponse.json({ news: staticNewsData });
  }
}