import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

// Types
interface Article {
  id: number;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
}

// Helper function to get the latest CSV file
const getLatestCSV = () => {
  const dataDir = path.join(process.cwd(), 'data');
  const files = fs.readdirSync(dataDir)
    .filter(file => file.startsWith('headline_'))
    .sort()
    .reverse();
  return files[0] ? path.join(dataDir, files[0]) : null;
};

// GET all articles
export async function GET() {
  try {
    const csvFile = getLatestCSV();
    if (!csvFile) {
      return NextResponse.json({ articles: [] });
    }

    const fileContent = fs.readFileSync(csvFile, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    return NextResponse.json({ articles: records });
  } catch (error) {
    console.error('Error reading articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST new article
export async function POST(request: Request) {
  try {
    const article = await request.json();
    const csvFile = getLatestCSV();
    
    if (!csvFile) {
      return NextResponse.json(
        { error: 'No CSV file found' },
        { status: 404 }
      );
    }

    // Read existing articles
    const fileContent = fs.readFileSync(csvFile, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Add new article
    const newArticle = {
      ...article,
      id: records.length + 1,
      pubDate: new Date().toISOString()
    };
    records.push(newArticle);

    // Write back to CSV
    const csvContent = stringify(records, { header: true });
    fs.writeFileSync(csvFile, csvContent);

    return NextResponse.json({ article: newArticle }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

// PUT update article
export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    const csvFile = getLatestCSV();
    
    if (!csvFile) {
      return NextResponse.json(
        { error: 'No CSV file found' },
        { status: 404 }
      );
    }

    // Read existing articles
    const fileContent = fs.readFileSync(csvFile, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Find and update article
    const index = records.findIndex((record: any) => record.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    records[index] = { ...records[index], ...updates };

    // Write back to CSV
    const csvContent = stringify(records, { header: true });
    fs.writeFileSync(csvFile, csvContent);

    return NextResponse.json({ article: records[index] });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE article
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const csvFile = getLatestCSV();
    
    if (!csvFile) {
      return NextResponse.json(
        { error: 'No CSV file found' },
        { status: 404 }
      );
    }

    // Read existing articles
    const fileContent = fs.readFileSync(csvFile, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Find and remove article
    const index = records.findIndex((record: any) => record.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    records.splice(index, 1);

    // Write back to CSV
    const csvContent = stringify(records, { header: true });
    fs.writeFileSync(csvFile, csvContent);

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
} 