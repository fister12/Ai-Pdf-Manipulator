import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TEACHING_PROMPTS } from '@/lib/prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { syllabus, pyqs, modelId } = await request.json();

    if (!syllabus?.trim() && !pyqs?.trim()) {
      return NextResponse.json(
        { error: 'Please provide syllabus and/or past year questions' },
        { status: 400 }
      );
    }

    // Use provided model or fallback to default
    const selectedModel = modelId || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({ model: selectedModel });

    const userContent = `
SYLLABUS:
${syllabus || '[No syllabus provided]'}

PAST YEAR QUESTIONS:
${pyqs || '[No PYQs provided]'}

Please analyze this content and provide study priorities for maximum exam success.`;

    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: userContent }],
        },
      ],
      systemInstruction: TEACHING_PROMPTS.ANALYZE_EXAM_PREP,
    });

    const resultText = response.response.text();

    // Extract JSON from response
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Failed to parse analysis results' },
        { status: 500 }
      );
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ result: analysis });
  } catch (error) {
    console.error('Error in exam-prep:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze exam content';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
