import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function GET() {
  try {
    // Get all CSV files in the data directory
    const dataDir = path.join(process.cwd(), 'data');
    const files = fs.readdirSync(dataDir).filter(file => file.startsWith('headline_') && file.endsWith('.csv'));
    
    // Sort files by date (newest first) and get the latest file
    const latestFile = files.sort().reverse()[0];
    
    if (!latestFile) {
      return NextResponse.json({ news: [] });
    }

    const filePath = path.join(dataDir, latestFile);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    return NextResponse.json({ news: records });
  } catch (error) {
    console.error('Error reading news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}