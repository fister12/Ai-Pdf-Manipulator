import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPTS } from '@/lib/prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    // Get the system prompt
    const systemPrompt = SYSTEM_PROMPTS.TEACHING_ASSISTANT_NOTES.prompt;

    // Call Gemini API with the document
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const response = await model.generateContent([
      { text: systemPrompt },
      {
        inlineData: {
          mimeType: file.type === 'application/pdf' ? 'application/pdf' : 'image/jpeg',
          data: base64,
        },
      },
    ]);

    const processedText = response.response.text();

    // Parse the response to extract structured sections
    const result = parseProcessedNotes(processedText);

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error processing notes:', error);
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
      { error: error?.message || 'Failed to process notes' },
      { status: 500 }
    );
  }
}

function parseProcessedNotes(text: string) {
  // Extract sections from the structured response
  const sections = {
    typedNotes: '',
    summary: '',
    keyConcepts: [] as string[],
    takeaways: [] as string[],
    questionsToStudy: [] as string[],
  };

  // Parse Typed Notes
  const notesMatch = text.match(/## Typed & Organized Notes\n([\s\S]*?)(?=##|$)/);
  sections.typedNotes = notesMatch ? notesMatch[1].trim() : text;

  // Parse Summary
  const summaryMatch = text.match(/## Summary\n([\s\S]*?)(?=##|$)/);
  sections.summary = summaryMatch
    ? summaryMatch[1].trim()
    : 'Summary not extracted. Please review the full notes.';

  // Parse Key Concepts
  const conceptsMatch = text.match(/## Key Concepts\n([\s\S]*?)(?=##|$)/);
  if (conceptsMatch) {
    sections.keyConcepts = conceptsMatch[1]
      .split('\n')
      .filter((line) => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map((line) => line.replace(/^[-•]\s*/, '').trim())
      .filter((line) => line.length > 0);
  }

  // Parse Takeaways
  const takeawaysMatch = text.match(/## Key Takeaways\n([\s\S]*?)(?=##|$)/);
  if (takeawaysMatch) {
    sections.takeaways = takeawaysMatch[1]
      .split('\n')
      .filter((line) => line.trim().match(/^\d+\./))
      .map((line) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((line) => line.length > 0);
  }

  // Parse Questions
  const questionsMatch = text.match(/## Questions to Study\n([\s\S]*?)(?=##|$)/);
  if (questionsMatch) {
    sections.questionsToStudy = questionsMatch[1]
      .split('\n')
      .filter((line) => line.trim().startsWith('-') || line.trim().match(/^[QA]\d+:/))
      .map((line) => line.replace(/^[-]\s*|^[QA]\d+:\s*/, '').trim())
      .filter((line) => line.length > 0);
  }

  // Ensure we have reasonable defaults if parsing failed
  if (sections.keyConcepts.length === 0) {
    sections.keyConcepts = [
      'Please review the typed notes above for key concepts',
    ];
  }

  if (sections.takeaways.length === 0) {
    sections.takeaways = [
      'Please review the summary above for key takeaways',
    ];
  }

  if (sections.questionsToStudy.length === 0) {
    sections.questionsToStudy = [
      'Review the main concepts and create your own study questions',
    ];
  }

  return sections;
}
