"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Cloud, Download, Eye, FileText, Sparkles, RotateCcw, Loader2, Check, Upload } from "lucide-react";
import { Brand } from "@/shared/components/layout/SiteHeader";

interface CoverLetterStudioHeaderProps {
  documentTitle: string;
  isSaving: boolean;
  saveStatus: "idle" | "saved" | "error";
  handleSaveToCloud: () => void;
  setShowAiDrawer: (v: boolean) => void;
  setShowStartFreshModal: (v: boolean) => void;
  handleExportPdf: () => void;
  setShowMobilePreview: (v: boolean) => void;
  onUploadLetter?: (file: File) => void;
  isImportingLetter?: boolean;
}

export function CoverLetterStudioHeader({
  documentTitle,
  isSaving,
  saveStatus,
  handleSaveToCloud,
  setShowAiDrawer,
  setShowStartFreshModal,
  handleExportPdf,
  setShowMobilePreview,
  onUploadLetter,
  isImportingLetter,
}: CoverLetterStudioHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <header className="no-print flex h-14 sm:h-16 items-center justify-between border-b border-black/10 bg-[#f8f7f2] px-3 sm:px-5">
      <div className="flex h-full items-center min-w-0 gap-1.5 sm:gap-3">
        {/* Back Button on Mobile */}
        <Link
          href="/"
          aria-label="Back to home"
          className="flex size-8 sm:size-9 items-center justify-center rounded-xl border border-black/10 text-[var(--brand-muted)] transition hover:bg-black/5 hover:text-[var(--brand-ink)] lg:hidden shrink-0"
        >
          <ArrowLeft className="size-4" />
        </Link>

        {/* Brand Logo on Desktop */}
        <div className="hidden lg:block">
          <Brand />
        </div>
        <span className="hidden h-6 w-px bg-black/10 lg:block" />

        {/* Document Title */}
        <div className="min-w-0 pl-1.5 sm:pl-1">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <FileText className="hidden size-4 shrink-0 text-[var(--brand-muted)] sm:block" />
            <p
              className="hidden max-w-[100px] truncate text-xs font-bold sm:block sm:max-w-[220px] sm:text-sm md:max-w-[300px] lg:max-w-[380px]"
              title={documentTitle}
            >
              {documentTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Top Header Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.docx,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && onUploadLetter) {
              onUploadLetter(file);
              e.target.value = "";
            }
          }}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImportingLetter}
          className="h-8.5 sm:h-10 rounded-xl border border-black/15 bg-white px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold text-[var(--brand-ink)] shadow-2xs transition hover:bg-black/5 hover:border-black/25 flex items-center gap-1.5 cursor-pointer"
          title="Upload outside cover letter (PDF, DOCX, TXT) to edit"
        >
          {isImportingLetter ? (
            <Loader2 className="size-3.5 sm:size-4 animate-spin text-emerald-600" />
          ) : (
            <Upload className="size-3.5 sm:size-4 text-emerald-600" />
          )}
          <span className="hidden sm:inline">{isImportingLetter ? "Uploading..." : "Upload Letter"}</span>
          <span className="sm:hidden">{isImportingLetter ? "..." : "Upload"}</span>
        </button>
        <button
          type="button"
          onClick={handleSaveToCloud}
          disabled={isSaving}
          className="h-8.5 sm:h-10 rounded-xl border border-black/15 bg-white px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold text-[var(--brand-ink)] shadow-2xs transition hover:bg-black/5 hover:border-black/25 flex items-center gap-1.5 cursor-pointer"
          title="Save cover letter to your account"
        >
          {isSaving ? (
            <Loader2 className="size-3.5 sm:size-4 animate-spin text-emerald-600" />
          ) : saveStatus === "saved" ? (
            <Check className="size-3.5 sm:size-4 text-emerald-600" />
          ) : (
            <Cloud className="size-3.5 sm:size-4 text-emerald-600" />
          )}
          <span>{isSaving ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save"}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowAiDrawer(true)}
          className="h-8.5 sm:h-10 rounded-xl border border-black/15 bg-white px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold text-[var(--brand-ink)] shadow-2xs transition hover:bg-black/5 hover:border-black/25 flex items-center gap-1.5 cursor-pointer"
          title="Open AI Cover Letter Assistant"
        >
          <Sparkles className="size-3.5 sm:size-4 text-emerald-600 animate-pulse" />
          <span className="hidden sm:inline">Writing with AI</span>
          <span className="sm:hidden">AI Write</span>
        </button>

        <button
          type="button"
          onClick={() => setShowStartFreshModal(true)}
          className="hidden h-9 sm:h-10 rounded-xl border border-black/15 bg-white px-2.5 sm:px-3 text-xs font-bold text-[var(--brand-ink)] shadow-2xs transition hover:bg-black/5 hover:border-black/25 md:flex items-center gap-1.5 cursor-pointer"
          title="Start fresh with a clean cover letter"
        >
          <RotateCcw className="size-3.5 text-[var(--brand-muted)]" />
          <span>Start fresh</span>
        </button>

        {/* Mobile Preview Button */}
        <button
          type="button"
          onClick={() => setShowMobilePreview(true)}
          className="h-8.5 sm:h-10 rounded-xl border border-black/15 bg-white px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold text-[var(--brand-ink)] shadow-2xs transition hover:bg-black/5 hover:border-black/25 flex items-center gap-1.5 cursor-pointer lg:hidden"
          title="Preview cover letter document"
        >
          <Eye className="size-3.5 sm:size-4 text-emerald-600" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        {/* Export PDF Button */}
        <button
          type="button"
          onClick={handleExportPdf}
          className="h-8.5 sm:h-10 rounded-xl border border-black/15 bg-white px-2.5 sm:px-3.5 text-[11px] sm:text-xs font-bold text-[var(--brand-ink)] shadow-2xs transition hover:bg-black/5 hover:border-black/25 flex items-center gap-1.5 cursor-pointer"
          title="Export PDF Document"
        >
          <Download className="size-3.5 sm:size-4 text-emerald-600" />
          <span className="hidden sm:inline">Export PDF</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>
    </header>
  );
}
