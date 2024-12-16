"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const loadingSteps = [
  "Scanning document... 🔍",
  "Analyzing clauses... ⚖️",
  "Identifying issues... 🎯",
  "Preparing insights... 💡"
];

export default function LoadingView() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 text-xl font-ghost text-white">
          <Loader2 className="h-5 w-5 animate-spin text-[#7834b5]" />
          <span>{loadingSteps[currentStep]}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[350px,1fr] gap-6">
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4 bg-white/5" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full bg-white/5" />
          ))}
        </div>
        <Skeleton className="h-[400px] bg-white/5" />
      </div>
    </div>
  );
}