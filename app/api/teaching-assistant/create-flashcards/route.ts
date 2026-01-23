import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPTS } from '@/lib/prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { topic, description } = await request.json();

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const systemPrompt = SYSTEM_PROMPTS.TEACHING_ASSISTANT_FLASHCARDS.prompt;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const userMessage = description
      ? `Create flashcards for the topic: "${topic}"\n\nAdditional context:\n${description}`
      : `Create flashcards for the topic: "${topic}"`;

    const response = await model.generateContent([
      { text: systemPrompt },
      { text: userMessage },
    ]);

    const responseText = response.response.text();

    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse flashcards from AI response');
    }

    const flashcardsData = JSON.parse(jsonMatch[0]);

    // Validate and normalize the data
    if (!flashcardsData.flashcards || !Array.isArray(flashcardsData.flashcards)) {
      throw new Error('Invalid flashcards format');
    }

    const validatedFlashcards = flashcardsData.flashcards.map(
      (card: any, idx: number) => ({
        id: card.id || idx + 1,
        question: card.question || '',
        answer: card.answer || '',
        difficulty: ['easy', 'medium', 'hard'].includes(card.difficulty)
          ? card.difficulty
          : 'medium',
      })
    );

    return NextResponse.json({
      success: true,
      topic: flashcardsData.topic || topic,
      flashcards: validatedFlashcards,
      totalCards: validatedFlashcards.length,
    });
  } catch (error: any) {
    console.error('Error creating flashcards:', error);

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
      { error: error?.message || 'Failed to create flashcards' },
      { status: 500 }
    );
  }
}
