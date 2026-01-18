import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';

export async function POST(request: NextRequest) {
  try {
    const { text, title } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Set font and size
    doc.setFont('helvetica');
    doc.setFontSize(12);

    // Add title if provided
    if (title) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, 20);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
    }

    // Calculate margins and max width
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = 7;
    let yPosition = title ? 35 : 20;

    // Split text into lines that fit within page width
    const lines = doc.splitTextToSize(text, maxWidth);

    // Add lines to PDF with page breaks
    for (let i = 0; i < lines.length; i++) {
      // Check if we need a new page
      if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      doc.text(lines[i], margin, yPosition);
      yPosition += lineHeight;
    }

    // Convert PDF to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="processed-notes.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
