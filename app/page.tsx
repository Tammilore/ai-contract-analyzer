"use client";

import { useState } from "react";
import { analyzeContract, uploadTextAsPDF } from '@/lib/actions';
import AnalysisView from "@/components/analysis/AnalysisView";
import InitialView from "@/components/InitialView";
import LoadingView from "@/components/LoadingView";

export default function Home() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ issues: any[]; sections: any[] } | null>(null);
  // State to store the analysis result

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    const fileUrl = await uploadTextAsPDF(text);
    const analysis = await analyzeContract(fileUrl);
    setAnalysisResult(analysis); // Store the analysis result in state
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const handleTextExtracted = (extractedText: string) => {
    setText(extractedText);
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <h1 className="font-arizona text-4xl md:text-5xl lg:text-6xl text-white text-center mb-4">
          Contract Analysis
        </h1>
        <p className="text-gray-400 text-center text-lg mb-12 font-ghost">
          Upload contracts and legal documents and let AI analyze it for potential issues
        </p>

        {isAnalyzing ? (
          <LoadingView />
        ) : !analysisComplete ? (
          <InitialView
            text={text}
            onTextChange={setText}
            onTextExtracted={handleTextExtracted}
            onAnalyze={handleAnalysis}
          />
        ) : (
          <AnalysisView text={text} analysis={analysisResult!} />
        )}
      </div>
    </main>
  );
}