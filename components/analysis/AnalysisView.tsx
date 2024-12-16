"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import AnalysisSidebar from "./AnalysisSidebar";
import ContractText from "./ContractText";

interface AnalysisViewProps {
  text: string;
  analysis: {
    issues: any[];
    sections: any[];
  };
}

export default function AnalysisView({ text, analysis }: AnalysisViewProps) {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[350px,1fr] gap-6">
      <AnalysisSidebar
        issues={analysis.issues}
        selectedIssueId={selectedIssueId}
        onIssueSelect={setSelectedIssueId}
      />
      <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
        <ContractText
          text={text}
          sections={analysis.sections}
          selectedId={selectedIssueId}
          onSelect={setSelectedIssueId}
        />
      </Card>
    </div>
  );
}