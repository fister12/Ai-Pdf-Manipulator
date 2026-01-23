import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { topic, material, pointCount = 5 } = await request.json();

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are a Socratic educator. Generate ${pointCount} teaching points and questions for the topic "${topic}".

Return ONLY valid JSON (no other text) with this exact structure:
{
  "points": [
    {
      "teachingPoint": "Clear explanation of one concept (2-3 sentences)",
      "question": "Specific question testing understanding of that concept"
    }
  ]
}

Rules:
1. Each teaching point covers ONE concept
2. Progress from basic to more advanced concepts
3. Questions must be answerable from the teaching point
4. Use only factual information
5. If study material provided, base teaching on that
6. No hallucinations`;

    const userMessage = material
      ? `Topic: "${topic}"\n\nStudy Material:\n${material}`
      : `Topic: "${topic}"`;

    const response = await model.generateContent([
      { text: systemPrompt },
      { text: userMessage },
    ]);

    const responseText = response.response.text();

    // Extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse study points');
    }

    const data = JSON.parse(jsonMatch[0]);

    if (!data.points || !Array.isArray(data.points)) {
      throw new Error('Invalid study points format');
    }

    return NextResponse.json({
      success: true,
      points: data.points.slice(0, pointCount),
    });
  } catch (error: any) {
    console.error('Error generating study points:', error);

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
      { error: error?.message || 'Failed to generate study points' },
      { status: 500 }
    );
  }
}
