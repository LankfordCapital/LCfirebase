import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    // Check if GEMINI_API_KEY is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return NextResponse.json({
        answer: "I'm sorry, but the AI assistant is currently unavailable. Please contact our team directly using the 'Contact a Team Member' option, and we'll be happy to help you with your question about our loan products and services."
      });
    }

    // Try to import and use the AI flow
    let result;
    try {
      const { answerVisitorQuestion } = await import('@/ai/flows/ai-assistant');
      result = await answerVisitorQuestion({ question });
    } catch (importError) {
      console.error('Failed to import AI flow:', importError);
      // Provide a fallback response
      result = {
        answer: `Thank you for your question: "${question}". I'm currently experiencing technical difficulties, but our team is here to help! Please use the 'Contact a Team Member' option to get immediate assistance with your inquiry about our loan products and services.`
      };
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Assistant API error:', error);
    
    // Return a helpful fallback response instead of an error
    return NextResponse.json({
      answer: "I'm sorry, but I'm experiencing technical difficulties right now. Please use the 'Contact a Team Member' option to get immediate assistance with your question about our loan products and services. Our team will be happy to help you!"
    });
  }
}
