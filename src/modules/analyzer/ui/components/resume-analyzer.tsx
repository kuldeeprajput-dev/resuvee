"use client";

import { useCallback, useState } from "react";
import { ATSDashboard } from "./ats-dashboard";
import { LoadingState } from "./loading-state";
import { ErrorState } from "./error-state";
import { AnalyzerHeroCopy } from "./analyzer-hero-copy";
import { AnalyzerUploadCard } from "./analyzer-upload-card";
import { extractTextFromPDF } from "@/shared/lib/extractors/client-pdf";
import type { ResumeAnalysis } from "../../types";

type AnalysisState = "idle" | "extracting" | "uploading" | "analyzing" | "success" | "error";

interface AnalyzeResponse {
  success: boolean;
  data?: ResumeAnalysis;
  error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];

function validateResumeFile(file: File) {
  const fileName = file.name.toLowerCase();
  const extensionAllowed = ALLOWED_EXTENSIONS.some((extension) => fileName.endsWith(extension));

  if (!extensionAllowed) return "Choose a PDF or DOCX file.";
  if (file.size === 0) return "This file is empty. Choose a resume that contains text.";
  if (file.size > MAX_FILE_SIZE) return "This file is larger than 10MB. Choose a smaller resume.";
  return null;
}

export function ResumeAnalyzer() {
  const [state, setState] = useState<AnalysisState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((file: File) => {
    const validationError = validateResumeFile(file);
    setAnalysis(null);
    setState("idle");

    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError(null);
  }, []);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setError(null);
    try {
      const isPDF = selectedFile.name.toLowerCase().endsWith(".pdf");
      let response: Response;

      if (isPDF) {
        setState("extracting");
        const text = await extractTextFromPDF(selectedFile);
        setState("analyzing");
        response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      } else {
        setState("analyzing");
        const formData = new FormData();
        formData.append("file", selectedFile);
        response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });
      }

      const data = (await response.json().catch(() => null)) as AnalyzeResponse | null;
      if (!response.ok) {
        throw new Error(data?.error || "The analyzer could not process this file.");
      }
      if (!data?.success || !data.data) {
        throw new Error(data?.error || "Analysis failed");
      }
      setAnalysis(data.data);
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setState("error");
    }
  }, [selectedFile]);

  const handleRetry = useCallback(() => {
    handleUpload();
  }, [handleUpload]);

  const handleReset = useCallback(() => {
    void fetch("/api/analyze", { method: "DELETE", cache: "no-store" }).catch(() => undefined);
    setState("idle");
    setSelectedFile(null);
    setAnalysis(null);
    setError(null);
  }, []);

  if (state === "analyzing" || state === "uploading" || state === "extracting") {
    return <LoadingState phase={state === "extracting" ? "extracting" : "analyzing"} />;
  }

  if (state === "success" && analysis) {
    return (
      <section className="w-full">
        <ATSDashboard analysis={analysis} fileName={selectedFile?.name} onReset={handleReset} />
      </section>
    );
  }

  if (state === "error") {
    return (
      <ErrorState
        error={error || "An unknown error occurred"}
        onRetry={handleRetry}
        onReset={handleReset}
      />
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1160px]">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,1.1fr)] lg:items-stretch lg:gap-16">
        <AnalyzerHeroCopy />
        <AnalyzerUploadCard
          selectedFile={selectedFile}
          state={state}
          error={error}
          isDragging={isDragging}
          onFileSelect={handleFileChange}
          onRemoveFile={removeFile}
          onUpload={handleUpload}
          setIsDragging={setIsDragging}
        />
      </div>
    </section>
  );
}
