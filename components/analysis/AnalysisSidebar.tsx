"use client";

import { useRef, useEffect } from "react";
import IssueCard from "./IssueCard";
import { Issue } from "./types";

interface AnalysisSidebarProps {
  issues: Issue[];
  selectedIssueId: string | null;
  onIssueSelect: (id: string) => void;
}

export default function AnalysisSidebar({
  issues,
  selectedIssueId,
  onIssueSelect
}: AnalysisSidebarProps) {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedIssueId && cardsRef.current) {
      const selectedCard = cardsRef.current.querySelector(`[data-id="${selectedIssueId}"]`);
      if (selectedCard) {
        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedIssueId]);

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="mb-6">
        <h2 className="font-arizona text-2xl text-white">Review</h2>
        <p className="text-gray-400 text-sm mt-1 font-vietnam">
          {issues.length} Suggestions
        </p>
      </div>

      <div 
        className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-scroll scrollbar-hide" 
        ref={cardsRef}
      >
        {issues.map((issue) => (
          <div key={issue.id} data-id={issue.id}>
            <IssueCard
              issue={issue}
              isSelected={selectedIssueId === issue.id}
              onClick={() => onIssueSelect(issue.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}