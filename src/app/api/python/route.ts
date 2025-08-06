import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'fetch_news') {
      const pythonDir = path.join(process.cwd(), 'python');
      const { stdout, stderr } = await execAsync('python simple_automate.py', { 
        cwd: pythonDir,
        timeout: 30000 // 30 second timeout
      });
      
      if (stderr) {
        console.error('Python stderr:', stderr);
      }
      
      return NextResponse.json({ 
        success: true, 
        output: stdout,
        message: 'News data fetched successfully' 
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Python execution error:', error);
    return NextResponse.json({ 
      error: 'Failed to execute Python script',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}