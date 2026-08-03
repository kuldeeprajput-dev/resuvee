"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Cloud,
  Download,
  Eye,
  FilePlus2,
  FileText,
  Loader2,
  ScanSearch,
  SpellCheck2,
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
  onExport: () => void;
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
  onExport,
}: ResumeBuilderHeaderProps) {
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
            className="flex size-8 sm:size-9 items-center justify-center rounded-xl border border-black/10 text-[var(--brand-muted)] transition hover:bg-black/5 hover:text-[var(--brand-ink)] lg:hidden shrink-0"
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
          <ScanSearch className="size-4 text-[var(--brand-ink)]" />
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
          <FilePlus2 className="size-4 text-[var(--brand-muted)]" />
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

        <Button
          type="button"
          variant="outline"
          onClick={onExport}
          className="h-8.5 sm:h-10 rounded-xl border-black/10 bg-white px-2.5 sm:px-3.5 text-[11px] sm:text-xs font-bold text-[var(--brand-ink)]"
        >
          <Download className="size-3.5 sm:size-4 text-emerald-600" />
          <span className="hidden sm:inline">Export PDF</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>
    </header>
  );
}
