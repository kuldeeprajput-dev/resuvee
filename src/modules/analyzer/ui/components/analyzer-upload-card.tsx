"use client";

import { useRef, type DragEvent } from "react";
import { ArrowUpRight, FileText, Gauge, Loader2, LockKeyhole, ScanLine, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ResumeScanVisual } from "./resume-scan-visual";

interface AnalyzerUploadCardProps {
  selectedFile: File | null;
  state: string;
  error: string | null;
  isDragging: boolean;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  onUpload: () => void;
  setIsDragging: (dragging: boolean) => void;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export function AnalyzerUploadCard({
  selectedFile,
  state,
  error,
  isDragging,
  onFileSelect,
  onRemoveFile,
  onUpload,
  setIsDragging,
}: AnalyzerUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    if (!inputRef.current) return;
    inputRef.current.value = "";
    inputRef.current.click();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  return (
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
            <p className="mt-1 text-sm text-[var(--brand-muted)]">PDF or DOCX, up to 10MB</p>
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
        onChange={(event) => event.target.files?.[0] && onFileSelect(event.target.files[0])}
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
        onDrop={handleDrop}
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
                  onRemoveFile();
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
        onClick={onUpload}
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
  );
}
