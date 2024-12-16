import { NextResponse } from "next/server";
import { extract, formatter } from "documind";
import { v4 as uuidv4 } from "uuid";

interface Issue {
  id: string;
  type: string;
  title: string;
  description: string;
}

interface Section {
  id: string;
  type: string;
  range: [number, number];
}

export const dynamic = "force-dynamic";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const fileUrl = body.fileUrl;

    if (!fileUrl) {
      return NextResponse.json({ error: "File URL is required" }, { status: 400 });
    }

    // Analyze the contract
    const analyzedText = await extract({
      file: fileUrl,
      schema: [
        {
          "name": "contractSuggestions",
          "type": "array",
          "description": "An array of clause suggestions extracted from the contract document.",
          "children": [
            {
              "name": "type",
              "type": "string",
              "description": "This field indicates the level of attention the clause requires. high suggests critical examination, medium is a caution, and low might offer a beneficial negotiation point or a general advantage."
            },
            {
              "name": "title",
              "type": "string",
              "description": "A concise label for easy identification of the clause and its implications."
            },
            {
              "name": "description",
              "type": "string",
              "description": "This field is for the contextual reasoning for the assigned type, detailing potential risks, disadvantages, or advantages and what should be done or avoided."
            },
            {
              "name": "exactClause",
              "type": "string",
              "description": "This field is for the exact text of the clause, ensuring fidelity to the source document and accuracy in evaluation."
            }
          ]
        }
      ],
    });

    const suggestions = analyzedText?.data?.contractSuggestions || [];
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      return NextResponse.json({ error: "No contract suggestions found." }, { status: 400 });
    }

    // Extract plaintext from the file
    const extractedText = await formatter.plaintext({ file: fileUrl });

    // Initialize result with explicit types
    const result: { issues: Issue[]; sections: Section[] } = {
      issues: [],
      sections: [],
    };

    for (const suggestion of suggestions) {
      const id = uuidv4(); // Generate a unique ID
      const type = suggestion.type.toLowerCase();

      // Add to issues array
      result.issues.push({
        id,
        type,
        title: suggestion.title,
        description: suggestion.description,
      });

      // Find the range for `exactClause`
      const start = extractedText.indexOf(suggestion.exactClause);
      const end = start + suggestion.exactClause.length;

      if (start === -1 || end === -1) {
        console.warn(`Could not find exactClause in extracted text: ${suggestion.exactClause}`);
      }

      // Add to sections array
      result.sections.push({
        id,
        type,
        range: [start, end],
      });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: error || "An unknown error occurred" },
      { status: 500 }
    );
  }
};
