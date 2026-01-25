import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are an AI Study Helper, a friendly and knowledgeable educational assistant. Your role is to:

1. Help students understand complex topics by breaking them down into simpler concepts
2. Answer questions clearly and concisely
3. Provide examples and analogies when helpful
4. Encourage learning and provide constructive feedback
5. Suggest study techniques and resources when appropriate

Guidelines:
- Be conversational but educational
- Use markdown formatting for better readability (headers, lists, code blocks, bold/italic)
- If asked about code, provide well-commented examples
- If you don't know something, admit it and suggest where to find the answer
- Keep responses focused and avoid unnecessary verbosity`;

export async function POST(request: NextRequest) {
    try {
        const { message, conversationHistory, modelId } = await request.json();

        if (!message || message.trim().length === 0) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Use provided model or fallback to default
        const selectedModel = modelId || 'gemini-2.5-flash';
        const model = genAI.getGenerativeModel({ model: selectedModel });

        // Build conversation context
        const messages = [];

        // Add system prompt
        messages.push({ text: SYSTEM_PROMPT });

        // Add conversation history if provided
        if (conversationHistory && Array.isArray(conversationHistory)) {
            for (const msg of conversationHistory.slice(-10)) { // Keep last 10 messages for context
                messages.push({ text: `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}` });
            }
        }

        // Add current message
        messages.push({ text: `User: ${message}` });
        messages.push({ text: 'Assistant:' });

        const response = await model.generateContent(messages);
        const responseText = response.response.text();

        return NextResponse.json({
            success: true,
            message: responseText,
            model: selectedModel,
        });
    } catch (error: any) {
        console.error('Error in chat:', error);

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
            { error: error?.message || 'Failed to generate response' },
            { status: 500 }
        );
    }
}
