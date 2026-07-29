"use client";

import Link from "next/link";
import { useCallback, useRef, useState, type DragEvent } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  FileText,
  Gauge,
  Loader2,
  LockKeyhole,
  PenLine,
  RotateCcw,
  ScanLine,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

import { ATSDashboard } from "./ATSDashboard";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { extractTextFromPDF } from "@/shared/lib/extractors/client-pdf";
import type { ResumeAnalysis } from "../index";

type AnalysisState = "idle" | "extracting" | "uploading" | "analyzing" | "success" | "error";

interface AnalyzeResponse {
  success: boolean;
  data?: ResumeAnalysis;
  error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function validateResumeFile(file: File) {
  const fileName = file.name.toLowerCase();
  const extensionAllowed = ALLOWED_EXTENSIONS.some((extension) => fileName.endsWith(extension));

  if (!extensionAllowed) {
    return "Choose a PDF or DOCX file.";
  }
  if (file.size === 0) {
    return "This file is empty. Choose a resume that contains text.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "This file is larger than 10MB. Choose a smaller resume.";
  }
  return null;
}

function ResumeScanVisual({
  status,
}: {
  status: "idle" | "dragging" | "ready";
}) {
  const isReady = status === "ready";

  return (
    <div
      className={[
        "analyzer-upload-visual relative flex h-[88px] w-[106px] items-center justify-center",
        status === "dragging"
          ? "analyzer-upload-visual--dragging text-[#315b46]"
          : "text-[var(--brand-ink)]",
      ].join(" ")}
      aria-hidden="true"
    >
      <span className="absolute inset-x-3 bottom-0 h-4 rounded-full bg-[#6f8978]/15 blur-md" />
      <svg
        viewBox="0 0 106 88"
        className="relative h-full w-full overflow-visible"
        fill="none"
      >
        <path
          d="M32 8.5h31.5L78 23v49.5a7 7 0 0 1-7 7H32a7 7 0 0 1-7-7v-57a7 7 0 0 1 7-7Z"
          fill="#fff"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M63.5 9v10a4 4 0 0 0 4 4h10"
          fill="#edf3ed"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M36 34h30M36 43h24M36 52h27" stroke="#91a097" strokeWidth="2.2" strokeLinecap="round" />

        {!isReady && (
          <>
            <path
              d="M17 28v-7a5 5 0 0 1 5-5h7M89 28v-7a5 5 0 0 0-5-5h-7M17 60v7a5 5 0 0 0 5 5h7M89 60v7a5 5 0 0 1-5 5h-7"
              stroke="#789584"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <g className="analyzer-scan-beam">
              <path d="M19 31h68" stroke="#4f8067" strokeWidth="2" strokeLinecap="round" />
              <path d="M24 34h58" stroke="#82c7a5" strokeWidth="5" strokeLinecap="round" opacity=".16" />
            </g>
          </>
        )}

        {isReady && (
          <g className="analyzer-ready-check">
            <circle cx="78" cy="65" r="13" fill="#315b46" stroke="#fff" strokeWidth="3" />
            <path
              d="m72.5 65 3.5 3.5 7-7.5"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
}

export function ResumeAnalyzer() {
  const [state, setState] = useState<AnalysisState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((file: File) => {
    const validationError = validateResumeFile(file);
    setAnalysis(null);
    setState("idle");

    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    setError(null);
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) handleFileChange(file);
    },
    [handleFileChange]
  );

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const openFilePicker = useCallback(() => {
    if (!inputRef.current) return;
    // Reset first so choosing the same file again still fires `onChange`.
    inputRef.current.value = "";
    inputRef.current.click();
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
    setState("idle");
    setSelectedFile(null);
    setAnalysis(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  if (state === "analyzing" || state === "uploading" || state === "extracting") {
    return <LoadingState phase={state === "extracting" ? "extracting" : "analyzing"} />;
  }

  if (state === "success" && analysis) {
    return (
      <section className="w-full space-y-5">
        <div className="flex flex-col gap-4 rounded-lg border border-black/10 bg-white/90 p-4 shadow-[0_16px_50px_rgba(23,26,23,0.10)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-[#f6ecd0] text-[var(--premium-panel)]">
              <BadgeCheck className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[var(--premium-ink)]">Analysis complete</h1>
              <p className="max-w-full truncate text-sm text-muted-foreground">
                {selectedFile?.name}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              asChild
              className="h-10 justify-center gap-2 bg-[var(--brand-ink)] px-4 text-white hover:bg-[#293630]"
            >
              <Link href="/builder">
                <PenLine className="size-4" />
                Build improved resume
              </Link>
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-10 justify-center gap-2 border-black/10 bg-white/75 text-[var(--premium-ink)] hover:bg-white"
            >
              <RotateCcw className="size-4" />
              Analyze another
            </Button>
          </div>
        </div>
        <ATSDashboard analysis={analysis} />
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

  const reportItems = [
    {
      title: "ATS score",
      detail: "A clear overall health check",
    },
    {
      title: "Keyword gaps",
      detail: "Missing terms and weak coverage",
    },
    {
      title: "Practical fixes",
      detail: "Prioritized edits you can apply",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-[1160px]">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,1.1fr)] lg:items-stretch lg:gap-16">
        <div className="analyzer-enter-copy flex h-full max-w-xl flex-col">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#4f6659]">
            <ScanLine className="size-4" />
            ATS resume analyzer
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.055em] text-[var(--brand-ink)] sm:text-5xl lg:text-[58px]">
            See what your resume says before you send it.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-[var(--brand-muted)] sm:text-lg">
            Get a focused ATS score, identify missing keywords, and leave with a practical edit
            plan.
          </p>

          <div className="mt-8 border-y border-black/10">
            {reportItems.map((item) => (
              <div
                key={item.title}
                className="analyzer-enter-row grid grid-cols-[28px_1fr] gap-3 border-b border-black/10 py-3.5 last:border-b-0"
              >
                <span className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-[#dce9d1] text-[#35533f]">
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <p className="text-sm font-bold text-[var(--brand-ink)]">{item.title}</p>
                  <p className="text-xs text-[var(--brand-muted)]">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs text-[var(--brand-muted)] lg:mt-auto lg:pt-5">
            <LockKeyhole className="size-3.5" />
            Your resume is used only to create this report.
          </p>
        </div>

        <div className="analyzer-enter-card flex h-full flex-col rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_24px_70px_rgba(22,32,28,0.10)] transition-[border-color,box-shadow] duration-300 hover:border-black/15 hover:shadow-[0_30px_80px_rgba(22,32,28,0.14)] sm:p-7 lg:min-h-[520px]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3ed] text-[#35533f]">
                <FileText className="size-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-lg font-bold tracking-[-0.025em] text-[var(--brand-ink)]">
                  Upload your resume
                </p>
                <p className="mt-1 text-sm text-[var(--brand-muted)]">
                  PDF or DOCX, up to 10MB
                </p>
              </div>
            </div>
            <span className="hidden shrink-0 rounded-full bg-[#eef2ec] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#536058] sm:inline-flex">
              Free analysis
            </span>
          </div>

          <input
            ref={inputRef}
            id="resume-file"
            type="file"
            accept=".pdf,.docx"
            className="sr-only"
            onChange={(event) =>
              event.target.files?.[0] && handleFileChange(event.target.files[0])
            }
          />

          <div
            role="button"
            tabIndex={0}
            aria-label={
              selectedFile
                ? `Selected resume: ${selectedFile.name}. Press Enter to replace it.`
                : "Choose a PDF or DOCX resume"
            }
            aria-describedby={error ? "resume-file-error" : undefined}
            onClick={openFilePicker}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openFilePicker();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "copy";
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsDragging(false);
              }
            }}
            onDrop={onDrop}
            className={[
              "group mt-6 flex min-h-52 flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-7 text-center outline-none transition focus-visible:ring-3 focus-visible:ring-[#7ba48b]/25",
              isDragging
                ? "scale-[1.01] border-[#47725c] bg-[#edf5ef] shadow-[inset_0_0_0_1px_rgba(71,114,92,0.12)]"
                : selectedFile
                  ? "border-[#a9c6b3] bg-[#f2f7f3] hover:border-[#789584]"
                  : "border-black/20 bg-[#fafaf7] hover:border-[#789584] hover:bg-[#f5f8f4]",
            ].join(" ")}
          >
            {selectedFile ? (
              <>
                <ResumeScanVisual status="ready" />
                <p
                  title={selectedFile.name}
                  className="mt-2 max-w-full truncate text-sm font-bold text-[var(--brand-ink)]"
                >
                  {selectedFile.name}
                </p>
                <p className="mt-1 text-xs text-[var(--brand-muted)]">
                  {formatFileSize(selectedFile.size)} · Ready to analyze
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-bold text-[var(--brand-ink)]">
                    Replace file
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFile();
                    }}
                    className="flex size-8 items-center justify-center rounded-full text-[var(--brand-muted)] transition hover:bg-white hover:text-red-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-red-200"
                    aria-label="Remove selected file"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <ResumeScanVisual status={isDragging ? "dragging" : "idle"} />
                <p className="mt-2 text-base font-bold tracking-[-0.02em] text-[var(--brand-ink)]">
                  {isDragging ? "Drop your resume here" : "Choose a resume"}
                </p>
                <span className="mt-3 rounded-full border border-black/10 bg-white px-4 py-2 text-[11px] font-bold text-[var(--brand-ink)] shadow-xs transition group-hover:border-[#789584]">
                  Browse files
                </span>
                <p className="mt-2 text-[11px] leading-5 text-[var(--brand-muted)]">
                  or drag and drop a PDF or DOCX
                </p>
              </>
            )}
          </div>

          {error && (
            <p
              id="resume-file-error"
              role="alert"
              className="mt-3 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700"
            >
              {error}
            </p>
          )}

          <Button
            onClick={handleUpload}
            className="mt-4 h-12 w-full gap-2 rounded-xl bg-[var(--brand-ink)] text-sm font-bold text-white shadow-sm hover:bg-[#27332f] disabled:bg-[#e1e5e0] disabled:text-[#737b75] disabled:opacity-100"
            disabled={!selectedFile || state !== "idle"}
            size="lg"
          >
            {state !== "idle" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : selectedFile ? (
              <Gauge className="size-4" />
            ) : (
              <ScanLine className="size-4" />
            )}
            {state !== "idle"
              ? "Analyzing"
              : selectedFile
                ? "Analyze my resume"
                : "Choose a file to continue"}
            {state === "idle" && selectedFile && <ArrowUpRight className="size-4" />}
          </Button>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-black/8 pt-4 text-[11px] text-[var(--brand-muted)]">
            <span className="flex items-center gap-1.5">
              <LockKeyhole className="size-3.5" />
              Private document review
            </span>
            <span>Score · gaps · edit plan</span>
          </div>
        </div>
      </div>
    </section>
  );
}
