import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import jsPDF from 'jspdf';
import { getPrompt } from '@/lib/prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const workflowId = formData.get('workflowId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Early size check to return a JSON error before attempting heavy processing.
    // Note: some platforms reject large requests before reaching this handler.
    const MAX_BYTES = 8 * 1024 * 1024; // 8MB
    // The File API exposes size in browsers; handle when available
    // @ts-ignore
    const fileSize = (file as any).size;
    if (fileSize && fileSize > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large. Max 8MB allowed.' }, { status: 413 });
    }

    if (!workflowId) {
      return NextResponse.json({ error: 'No workflow specified' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    // Get the appropriate system prompt
    const systemPrompt = getPrompt(workflowId as any);

    // Call Gemini API with the PDF to extract/convert handwriting
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const response = await model.generateContent([
      { text: systemPrompt },
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64,
        },
      },
    ]);

    const processedText = response.response.text();

    // Create PDF from processed text
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    doc.setFont('helvetica');
    doc.setFontSize(12);

    const title = workflowId || 'Processed Notes';
    if (title) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, 20);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 7;
    let yPosition = title ? 35 : 20;

    const lines = doc.splitTextToSize(processedText, maxWidth);
    for (let i = 0; i < lines.length; i++) {
      if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(lines[i], margin, yPosition);
      yPosition += lineHeight;
    }

    const pdfArray = doc.output('arraybuffer');
    const pdfBase64 = Buffer.from(pdfArray).toString('base64');

    return NextResponse.json({ success: true, processedText, pdfBase64 });
  } catch (error: any) {
    console.error('Error processing handwritten PDF:', error);
    if (error?.status === 429) {
      return NextResponse.json(
        {
          error: 'API quota exceeded. Please wait a moment and try again, or check your Google Gemini API quota limits.',
          quotaExceeded: true,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: error?.message || 'Failed to process PDF.' }, { status: 500 });
  }
}
