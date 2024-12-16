"use client";

import { cn } from "@/lib/utils";
import { TextSection } from "./types";

interface ContractTextProps {
  text: string;
  sections: TextSection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ContractText({
  text,
  sections,
  selectedId,
  onSelect,
}: ContractTextProps) {
  const getHighlightColor = (type: TextSection["type"]) => {
    switch (type) {
      case "high":
        return "bg-red-500/20 text-white hover:bg-red-500/30 border-b-2 border-red-500";
      case "medium":
        return "bg-yellow-500/20 text-white hover:bg-yellow-500/30 border-b-2 border-yellow-500";
      case "low":
        return "bg-green-500/20 text-white hover:bg-green-500/30 border-b-2 border-green-500";
      default:
        return "bg-gray-500/20 text-white hover:bg-gray-500/30 border-b-2 border-gray-500";
    }
  };

  const renderText = () => {
    let result = [];
    let currentIndex = 0;
    const sortedSections = [...sections].sort((a, b) => a.range[0] - b.range[0]);

    for (const section of sortedSections) {
      if (currentIndex < section.range[0]) {
        result.push(
          <span key={`text-${currentIndex}`} className="text-gray-200 font-vietnam font-medium">
            {text.slice(currentIndex, section.range[0])}
          </span>
        );
      }

      result.push(
        <span
          key={section.id}
          className={cn(
            "cursor-pointer transition-colors rounded-sm px-1 py-0.5 font-vietnam font-medium",
            getHighlightColor(section.type),
            selectedId === section.id && "ring-2 ring-[#7834b5]"
          )}
          onClick={() => onSelect(section.id)}
        >
          {text.slice(section.range[0], section.range[1])}
        </span>
      );

      currentIndex = section.range[1];
    }

    if (currentIndex < text.length) {
      result.push(
        <span key={`text-${currentIndex}`} className="text-gray-200 font-vietnam font-medium">
          {text.slice(currentIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <div className="prose prose-invert max-w-none">
      <div className="whitespace-pre-wrap leading-relaxed">
        {renderText()}
      </div>
    </div>
  );
}