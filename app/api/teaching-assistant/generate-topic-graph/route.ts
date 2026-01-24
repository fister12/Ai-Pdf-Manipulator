import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPTS } from '@/lib/prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { topic, description, flashcards } = await request.json();

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const systemPrompt = SYSTEM_PROMPTS.TEACHING_ASSISTANT_TOPIC_GRAPH.prompt;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create a comprehensive prompt for visualization
    const flashcardContext = flashcards && flashcards.length > 0
      ? `\n\nKey concepts from flashcards:\n${flashcards.slice(0, 8).map((card: any, i: number) => `${i + 1}. ${card.question}`).join('\n')}`
      : '';

    const userMessage = `Generate a topic visualization guide for: "${topic}"${description ? `\n\nAdditional context: ${description}` : ''}${flashcardContext}`;

    const response = await model.generateContent([
      { text: systemPrompt },
      { text: userMessage },
    ]);

    const responseText = response.response.text();

    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse visualization guide from AI response');
    }

    const visualizationData = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      topic,
      visualization: visualizationData,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating topic graph:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate topic graph' },
      { status: 500 }
    );
  }
}
