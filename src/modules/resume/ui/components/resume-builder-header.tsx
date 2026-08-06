"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Cloud,
  Download,
  Eye,
  FilePlus2,
  FileSpreadsheet,
  FileText,
  Loader2,
  ScanSearch,
  SpellCheck2,
  Upload,
} from "lucide-react";
import { Brand } from "@/shared/components/layout/SiteHeader";
import { Button } from "@/shared/components/ui/button";
import type { ResumeData } from "../../types/resume";

interface ResumeBuilderHeaderProps {
  fullName: string;
  isSaving: boolean;
  saveStatus: "idle" | "saved" | "error";
  hideLeftSidebar: boolean;
  onSave: () => void;
  onStartFresh: () => void;
  onShowMobilePreview: () => void;
  onShowTailor: () => void;
  onShowWritingCheck: () => void;
  onExportPdf: () => void;
  onExportDocx: () => void;
  onUploadResume?: (file: File) => void;
  isImportingResume?: boolean;
  data: ResumeData;
}

export function ResumeBuilderHeader({
  fullName,
  isSaving,
  saveStatus,
  hideLeftSidebar,
  onSave,
  onStartFresh,
  onShowMobilePreview,
  onShowTailor,
  onShowWritingCheck,
  onExportPdf,
  onExportDocx,
  onUploadResume,
  isImportingResume,
}: ResumeBuilderHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const cn = (...classes: (string | boolean | undefined)[]) =>
    classes.filter(Boolean).join(" ");

  return (
    <header className="no-print flex h-14 sm:h-16 items-center justify-between border-b border-black/10 bg-[var(--brand-paper)] px-3 sm:px-5">
      <div className="flex h-full items-center min-w-0">
        {/* Logo / Back Button */}
        <div
          className={cn(
            "flex h-full items-center px-1 sm:px-5",
            !hideLeftSidebar ? "lg:w-[220px] lg:shrink-0 lg:justify-center" : "w-auto"
          )}
        >
          <Link
            href="/"
            aria-label="Back to home"
            className="flex size-8 sm:size-9 items-center justify-center rounded-xl border border-black/10 bg-white shadow-2xs text-[var(--brand-muted)] transition hover:bg-black/5 hover:text-[var(--brand-ink)] lg:hidden shrink-0"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="hidden lg:block">
            <Brand />
          </div>
        </div>

        {/* Document Title */}
        <div className="min-w-0 pl-1.5 sm:pl-1">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <FileText className="hidden size-4 shrink-0 text-[var(--brand-muted)] sm:block" />
            <p
              className="hidden max-w-[100px] truncate text-xs font-bold sm:block sm:max-w-[220px] sm:text-sm md:max-w-[300px] lg:max-w-[380px]"
              title={fullName ? `${fullName} — Resume` : "Untitled resume"}
            >
              {fullName ? `${fullName} — Resume` : "Untitled resume"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.docx,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && onUploadResume) {
              onUploadResume(file);
              e.target.value = "";
            }
          }}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImportingResume}
          className="hidden sm:flex h-8.5 sm:h-10 rounded-xl border border-black/15 bg-white px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold text-[var(--brand-ink)] shadow-2xs transition hover:bg-black/5 hover:border-black/25 items-center gap-1.5 cursor-pointer"
          title="Upload outside resume (PDF, DOCX, TXT) to edit"
        >
          {isImportingResume ? (
            <Loader2 className="size-3.5 sm:size-4 animate-spin text-emerald-600" />
          ) : (
            <Upload className="size-3.5 sm:size-4 text-emerald-600" />
          )}
          <span>{isImportingResume ? "Uploading..." : "Upload Resume"}</span>
        </button>
        <Button
          type="button"
          variant="outline"
          onClick={onShowWritingCheck}
          className="hidden h-9 sm:h-10 rounded-xl border-black/10 bg-white px-2.5 sm:px-3 text-xs font-bold lg:inline-flex"
        >
          <SpellCheck2 className="size-4 text-emerald-600" />
          Check with AI
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onShowTailor}
          className="hidden h-9 sm:h-10 rounded-xl border-black/10 bg-white px-2.5 sm:px-3 text-xs font-bold sm:inline-flex"
        >
          <ScanSearch className="size-4 text-emerald-600" />
          Role match
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onSave}
          disabled={isSaving}
          className="h-8.5 sm:h-10 rounded-xl border-black/10 bg-white px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold text-[var(--brand-ink)] shadow-2xs transition cursor-pointer"
          title="Save resume to your account"
        >
          {isSaving ? (
            <Loader2 className="size-3.5 sm:size-4 animate-spin text-emerald-600" />
          ) : saveStatus === "saved" ? (
            <Check className="size-3.5 sm:size-4 text-emerald-600" />
          ) : (
            <Cloud className="size-3.5 sm:size-4 text-emerald-600" />
          )}
          <span>{isSaving ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save"}</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onStartFresh}
          className="hidden h-9 sm:h-10 rounded-xl border-black/10 bg-white px-2.5 sm:px-3 text-xs font-bold text-[var(--brand-ink)] md:inline-flex"
        >
          <FilePlus2 className="size-4 text-emerald-600" />
          Start fresh
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onShowMobilePreview}
          className="h-8.5 sm:h-10 rounded-xl border-black/10 bg-white px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold lg:hidden"
        >
          <Eye className="size-3.5 sm:size-4 text-emerald-600" />
          <span className="hidden sm:inline">Preview</span>
        </Button>

        {/* Export Dropdown Button with PDF & DOCX Options */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="h-8.5 sm:h-10 rounded-xl border border-black/15 bg-white px-2.5 sm:px-3.5 text-[11px] sm:text-xs font-bold text-[var(--brand-ink)] shadow-2xs transition hover:bg-black/5 hover:border-black/25 flex items-center gap-1.5 cursor-pointer"
            title="Export resume options"
          >
            <Download className="size-3.5 sm:size-4 text-emerald-600" />
            <span>Export</span>
            <ChevronDown className="size-3.5 text-[var(--brand-muted)]" />
          </button>

          {showExportMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-52 rounded-2xl border border-black/15 bg-white p-1.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportPdf();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-bold text-[var(--brand-ink)] transition hover:bg-black/5 cursor-pointer"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <FileText className="size-4" />
                  </span>
                  <div className="text-left">
                    <p className="font-bold text-[var(--brand-ink)]">PDF Document</p>
                    <p className="text-[10px] text-[var(--brand-muted)] font-normal">Export layout as PDF</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportDocx();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-bold text-[var(--brand-ink)] transition hover:bg-black/5 cursor-pointer"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <FileSpreadsheet className="size-4" />
                  </span>
                  <div className="text-left">
                    <p className="font-bold text-[var(--brand-ink)]">Word Document</p>
                    <p className="text-[10px] text-[var(--brand-muted)] font-normal">Export editable .doc file</p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
