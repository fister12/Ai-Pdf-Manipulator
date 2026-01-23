import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { topic, material } = await request.json();

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are a Socratic educator teaching a student about "${topic}". 
Your response must start with the exact format below. Do not add any other text before it:

📚 **Teaching Point:** [2-3 sentence explanation of a key concept]

❓ **Question:** [A specific, answerable question about what you just taught]

Rules:
1. Teaching point should explain one concept clearly
2. Question should test understanding of that concept
3. Only use information relevant to the topic
4. If given study material, base teaching on that
5. No hallucinations - only factual information`;

    const userMessage = material
      ? `Topic to teach: "${topic}"\n\nStudy Material:\n${material}\n\nPlease teach the first concept about this topic and ask a question.`
      : `Topic to teach: "${topic}"\n\nPlease teach the first concept about this topic and ask a question.`;

    const response = await model.generateContent([
      { text: systemPrompt },
      { text: userMessage },
    ]);

    const responseText = response.response.text();

    // Parse the teaching point and question
    const teachingMatch = responseText.match(/📚 \*\*Teaching Point:\*\*([\s\S]*?)(?=❓|$)/);
    const questionMatch = responseText.match(/❓ \*\*Question:\*\*([\s\S]*?)$/);

    const teachingPoint = teachingMatch ? teachingMatch[1].trim() : responseText;
    const question = questionMatch ? questionMatch[1].trim() : 'What did you learn from the teaching point above?';

    return NextResponse.json({
      success: true,
      teachingPoint,
      question,
      topic,
    });
  } catch (error: any) {
    console.error('Error in study mode:', error);

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
      { error: error?.message || 'Failed to start study session' },
      { status: 500 }
    );
  }
}
