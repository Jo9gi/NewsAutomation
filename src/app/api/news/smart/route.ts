import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface CacheMetadata {
  last_fetch: string;
  file_path: string;
  record_count: number;
  status: string;
}

interface CacheData {
  [key: string]: CacheMetadata;
}

// Helper function to check if data is fresh (within 6 hours)
function isDataFresh(lastFetch: string, maxAgeHours: number = 6): boolean {
  const lastFetchTime = new Date(lastFetch);
  const now = new Date();
  const ageInHours = (now.getTime() - lastFetchTime.getTime()) / (1000 * 60 * 60);
  return ageInHours < maxAgeHours;
}

// Helper function to get cache metadata
function getCacheMetadata(): CacheData {
  const cachePath = path.join(process.cwd(), 'python', 'cache', 'metadata.json');
  try {
    if (fs.existsSync(cachePath)) {
      const cacheContent = fs.readFileSync(cachePath, 'utf-8');
      return JSON.parse(cacheContent);
    }
  } catch (error) {
    console.error('Error reading cache metadata:', error);
  }
  return {};
}

// Helper function to get the latest CSV file
function getLatestCSVFile(): string | null {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(dataDir)) {
      return null;
    }
    
    const files = fs.readdirSync(dataDir)
      .filter(file => file.startsWith('headline_') && file.endsWith('.csv'))
      .sort()
      .reverse();
    
    return files[0] ? path.join(dataDir, files[0]) : null;
  } catch (error) {
    console.error('Error finding latest CSV file:', error);
    return null;
  }
}

// Helper function to check if today's CSV file exists
function getTodayCSVFile(): string | null {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const todayFile = path.join(process.cwd(), 'data', `headline_${today}.csv`);
  return fs.existsSync(todayFile) ? todayFile : null;
}

// Helper function to trigger Python data fetching
async function triggerDataFetch(): Promise<boolean> {
  try {
    console.log('🔄 Triggering Python data fetch...');
    const pythonDir = path.join(process.cwd(), 'python');
    const { stdout, stderr } = await execAsync('python simple_automate.py', { cwd: pythonDir });
    
    if (stderr) {
      console.error('Python script stderr:', stderr);
    }
    
    console.log('Python script output:', stdout);
    return true;
  } catch (error) {
    console.error('Error running Python script:', error);
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';
    const maxAgeHours = parseInt(searchParams.get('maxAge') || '6');

    console.log('🔍 Smart news API called');
    console.log(`📊 Force refresh: ${forceRefresh}, Max age: ${maxAgeHours} hours`);

    // Check if today's CSV file exists
    const todayFile = getTodayCSVFile();
    const latestFile = getLatestCSVFile();

    // If force refresh is requested, trigger data fetch
    if (forceRefresh) {
      console.log('🔄 Force refresh requested, triggering data fetch...');
      await triggerDataFetch();
      
      // Wait a moment for the file to be created
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Try to get the updated file
      const updatedFile = getTodayCSVFile() || getLatestCSVFile();
      if (updatedFile && fs.existsSync(updatedFile)) {
        const fileContent = fs.readFileSync(updatedFile, 'utf-8');
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        });

        return NextResponse.json({
          news: records,
          cache_info: {
            source: 'force_refresh',
            file_path: updatedFile,
            record_count: records.length,
            note: 'Data refreshed by force request'
          }
        });
      }
    }

    // Check if we have today's file and it's recent
    if (todayFile && fs.existsSync(todayFile)) {
      const fileStat = fs.statSync(todayFile);
      const fileTime = new Date(fileStat.mtime);
      const now = new Date();
      const ageInHours = (now.getTime() - fileTime.getTime()) / (1000 * 60 * 60);

      if (ageInHours < maxAgeHours) {
        console.log('✅ Today\'s CSV file exists and is recent');
        const fileContent = fs.readFileSync(todayFile, 'utf-8');
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        });

        return NextResponse.json({
          news: records,
          cache_info: {
            source: 'today_file',
            file_path: todayFile,
            record_count: records.length,
            last_modified: fileTime.toISOString(),
            age_hours: ageInHours.toFixed(2)
          }
        });
      } else {
        console.log(`⚠️ Today's file exists but is ${ageInHours.toFixed(2)} hours old`);
      }
    }

    // If we reach here, we need to fetch new data
    console.log('🔄 No recent CSV file found, triggering data fetch...');
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Trigger Python data fetching
    const fetchSuccess = await triggerDataFetch();
    
    if (fetchSuccess) {
      // Wait for the file to be created
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Try to get the newly created file
      const newFile = getTodayCSVFile() || getLatestCSVFile();
      if (newFile && fs.existsSync(newFile)) {
        console.log(`✅ New data fetched and saved to: ${newFile}`);
        const fileContent = fs.readFileSync(newFile, 'utf-8');
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        });

        return NextResponse.json({
          news: records,
          cache_info: {
            source: 'newly_fetched',
            file_path: newFile,
            record_count: records.length,
            note: 'Data freshly fetched from API'
          }
        });
      }
    }

    // Fallback to latest available file if fetch failed
    if (latestFile && fs.existsSync(latestFile)) {
      console.log(`📊 Using latest available file: ${latestFile}`);
      const fileContent = fs.readFileSync(latestFile, 'utf-8');
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      });

      return NextResponse.json({
        news: records,
        cache_info: {
          source: 'latest_available',
          file_path: latestFile,
          record_count: records.length,
          note: 'Using latest available data (fetch failed)'
        }
      });
    }

    // No data available
    console.log('❌ No data available');
    return NextResponse.json({
      news: [],
      cache_info: {
        source: 'none',
        note: 'No data available and fetch failed'
      }
    });

  } catch (error) {
    console.error('Error in smart news API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 