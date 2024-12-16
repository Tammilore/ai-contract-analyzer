"use client";

import { useState, useCallback } from 'react';
import { FileText, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadFile, extractText } from '@/lib/actions';

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
}

export default function FileUpload({ onTextExtracted }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);
      const fileUrl = await uploadFile(file);
      const extractedText = await extractText(fileUrl);
      onTextExtracted(extractedText);
    } catch (error) {
      console.error('Error processing file:', error);
      // Handle error appropriately
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const file = files[0];
        if (file.type === "application/pdf") {
          await processFile(file);
        }
      }
    },
    [onTextExtracted]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        await processFile(file);
      }
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        isDragging ? "border-[#7834b5] bg-[#7834b5]/5" : "border-gray-700",
        isProcessing && "opacity-50 cursor-not-allowed"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
        disabled={isProcessing}
      />
      <div className="flex flex-col items-center gap-4">
        <Upload className="h-12 w-12 text-[#7834b5]" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-white font-vietnam">
            {isProcessing ? "Processing..." : (
              <>
                Drop your PDF here, or{" "}
                <label
                  htmlFor="file-upload"
                  className="text-[#7834b5] hover:text-[#7834b5]/90 cursor-pointer"
                >
                  browse
                </label>
              </>
            )}
          </p>
          <p className="text-sm text-gray-400 font-vietnam">Supports PDF files</p>
        </div>
      </div>
    </div>
  );
}