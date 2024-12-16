import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabase } from "@/lib/supabase";

export const POST = async (req: Request) => {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Define page dimensions and margins
    const pageWidth = 600;
    const pageHeight = 800;
    const margin = 50;
    const fontSize = 12;
    const lineHeight = fontSize * 1.5; // Line spacing
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    // Add a new page
    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;

    // Split text into lines using \n as the delimiter
    const lines = text.split("\n");

    // Draw each line of text, handling page overflow
    for (const line of lines) {
      const wrappedLines = wrapText(line, font, fontSize, usableWidth);
      for (const wrappedLine of wrappedLines) {
        if (currentY - lineHeight < margin) {
          // Add a new page if we run out of space
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }

        // Draw the current line of text
        currentPage.drawText(wrappedLine, {
          x: margin,
          y: currentY - lineHeight,
          font,
          size: fontSize,
          color: rgb(0, 0, 0),
        });

        // Move the cursor down for the next line
        currentY -= lineHeight;
      }
    }

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    const fileName = `contracts/${Math.random().toString(36).substring(7)}.pdf`;

    // Upload the PDF to Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("pdfAttachments")
      .upload(fileName, pdfBytes, { contentType: "application/pdf" });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Generate a signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from("pdfAttachments")
      .createSignedUrl(fileName, 3600);

    if (urlError || !urlData?.signedUrl) {
      return NextResponse.json(
        { error: "Failed to generate signed URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: urlData.signedUrl });
  } catch (error: any) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
};

// Helper function to wrap text within the usable width
function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const lineWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (lineWidth > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
