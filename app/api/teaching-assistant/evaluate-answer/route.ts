import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { question, userAnswer, topic } = await request.json();

    if (!question || !userAnswer || !topic) {
      return NextResponse.json(
        { error: 'Question, userAnswer, and topic are required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are an expert educator evaluating a student's answer about "${topic}".

Evaluate the student's answer to the question and provide constructive feedback.

Your response must be concise, encouraging, and focus on:
1. Whether the answer is correct
2. What they understood well
3. What could be improved or clarified
4. A brief hint if they were partially correct

Keep feedback to 2-3 sentences maximum. Be supportive and educational.`;

    const userMessage = `Question: "${question}"\n\nStudent's Answer: "${userAnswer}"\n\nProvide feedback on their answer.`;

    const response = await model.generateContent([
      { text: systemPrompt },
      { text: userMessage },
    ]);

    const feedback = response.response.text();

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error: any) {
    console.error('Error evaluating answer:', error);

    if (error?.status === 429) {
      return NextResponse.json(
        {
          error: 'API quota exceeded. Please wait a moment and try again.',
          quotaExceeded: true,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}
