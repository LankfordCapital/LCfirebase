import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test environment variables
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    
    // Test AI flow import
    let canImportAI = false;
    try {
      await import('@/ai/flows/ai-assistant');
      canImportAI = true;
    } catch (error) {
      console.error('AI flow import test failed:', error);
    }

    return NextResponse.json({
      status: 'ok',
      environment: {
        hasGeminiKey,
        nodeEnv: process.env.NODE_ENV,
      },
      ai: {
        canImportAI,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Test AI error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
