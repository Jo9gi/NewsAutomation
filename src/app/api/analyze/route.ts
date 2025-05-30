import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Call Python script for summarization
    const summary = await runPythonScript('summarize_article', url);
    
    // Call Python script for sentiment analysis
    const sentiment = await runPythonScript('analyse_sentiment', summary);

    return NextResponse.json({
      summary,
      sentiment
    });
  } catch (error) {
    console.error('Error analyzing article:', error);
    return NextResponse.json(
      { error: 'Failed to analyze article' },
      { status: 500 }
    );
  }
}

function runPythonScript(scriptName: string, input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'automate.py'),
      scriptName,
      input
    ]);

    let output = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script failed: ${error}`));
      } else {
        resolve(output.trim());
      }
    });
  });
} 