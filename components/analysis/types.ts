export interface Issue {
  id: string;
  type: string; //"high" | "medium" | "low";
  title: string;
  description: string;
}

export interface TextSection {
  id: string;
  type: string; //"high" | "medium" | "low";
  range: [number, number];
}

export interface AnalysisResult {
  issues: Issue[];
  sections: TextSection[];
}