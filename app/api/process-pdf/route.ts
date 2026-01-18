import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPrompt } from '@/lib/prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const workflowId = formData.get('workflowId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!workflowId) {
      return NextResponse.json(
        { error: 'No workflow specified' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    // Get the appropriate system prompt
    const systemPrompt = getPrompt(workflowId as any);

    // Call Gemini API with the PDF
    // Using gemini-pro-vision which supports PDF and multimodal inputs
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const response = await model.generateContent([
      {
        text: systemPrompt,
      },
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64,
        },
      },
    ]);

    const processedText = response.response.text();

    return NextResponse.json({
      success: true,
      processedText,
      workflow: workflowId,
    });
  } catch (error: any) {
    console.error('Error processing PDF:', error);
    
    // Handle rate limit errors specifically
    if (error?.status === 429) {
      return NextResponse.json(
        { 
          error: 'API quota exceeded. Please wait a moment and try again, or check your Google Gemini API quota limits.',
          quotaExceeded: true
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: error?.message || 'Failed to process PDF. Please try again.' },
      { status: 500 }
    );
  }
}
