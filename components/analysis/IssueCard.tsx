"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Issue } from "./types";

interface IssueCardProps {
  issue: Issue;
  isSelected: boolean;
  onClick: () => void;
}

export default function IssueCard({ issue, isSelected, onClick }: IssueCardProps) {
  const getTypeStyles = (type: Issue["type"]) => {
    switch (type) {
      case "high":
        return "bg-red-50 text-red-700";
      case "medium":
        return "bg-yellow-50 text-yellow-700";
      case "low":
        return "bg-green-50 text-green-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <Card
      className={cn(
        "p-6 cursor-pointer transition-all hover:shadow-lg bg-white rounded-xl",
        isSelected && "ring-2 ring-[#7834b5]"
      )}
      onClick={onClick}
    >
      <div className="space-y-3">
        <span className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
          getTypeStyles(issue.type)
        )}>
          {issue.type === "high" ? "Critical" :
          issue.type === "medium" ? "Warning" : 
           issue.type === "low" ? "Good" : "Other"}
        </span>
        
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 font-vietnam">
            {issue.title}
          </h3>
          <p className="text-gray-700 leading-relaxed font-vietnam">
            {issue.description}
          </p>
        </div>
      </div>
    </Card>
  );
}