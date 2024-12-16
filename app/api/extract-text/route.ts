import { NextResponse } from "next/server";
import { formatter } from "documind";

export const dynamic = "force-dynamic";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const fileUrl = body.fileUrl;

    if (!fileUrl) {
      return NextResponse.json({ error: "File URL is required" }, { status: 400 });
    }

    // Use documind directly
    const extractedText = await formatter.plaintext({ file: fileUrl });

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: error || "An unknown error occurred" },
      { status: 500 }
    );
  }
};
