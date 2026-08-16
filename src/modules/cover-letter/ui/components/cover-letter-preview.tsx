"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import type {
  CoverLetterData,
  CoverLetterTheme,
  TypographyFont,
  PageSpacing,
} from "../../types/cover-letter";

interface CoverLetterPreviewProps {
  data: CoverLetterData;
  theme: CoverLetterTheme;
  accent: string;
  font?: TypographyFont;
  pageSpacing?: PageSpacing;
  onSelectField?: (e: React.MouseEvent<HTMLElement>, field: keyof CoverLetterData) => void;
  selectedField?: keyof CoverLetterData | null;
  isHandTool?: boolean;
}

function CoverLetterPreviewBase({
  data,
  theme,
  accent,
  font = "template",
  pageSpacing = "normal",
  onSelectField,
  selectedField,
  isHandTool = false,
}: CoverLetterPreviewProps) {
  const fontClass =
    font === "sans"
      ? "cl-font-modern"
      : font === "serif"
        ? "font-sans"
        : font === "mono"
          ? "font-mono"
          : "font-serif";

  const spacingClass =
    pageSpacing === "compact"
      ? "px-9 py-7"
      : pageSpacing === "spacious"
        ? "px-14 py-12"
        : "px-11 py-9";

  const getFieldClass = (field: keyof CoverLetterData) =>
    cn(
      isHandTool ? "cursor-inherit" : "lg:cursor-pointer cursor-default",
      selectedField === field && "cl-field-active",
      "wrap-break-word wrap-anywhere",
      !data[field] && "inline-block min-h-5 min-w-12"
    );

  return (
    <article
      className={cn(
        "cover-letter-print-area cover-letter-preview-sheet cover-letter-print-sheet relative flex flex-col justify-between w-148.75 h-210.5 shrink-0 overflow-hidden bg-white text-[#232824] shadow-[0_24px_65px_rgba(22,32,28,0.18)] wrap-break-word",
        spacingClass,
        fontClass,
        isHandTool && "hand-mode"
      )}
    >
      {theme === "signal" && (
        <div
          className="absolute inset-y-0 left-0 w-3 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]"
          style={{ backgroundColor: accent }}
        />
      )}
      {theme === "linen" && (
        <div className="absolute -right-20 -top-24 size-64 rounded-full bg-[#e7f1e8] [-webkit-print-color-adjust:exact] [print-color-adjust:exact]" />
      )}
      <header className="relative border-b pb-4" style={{ borderColor: accent }}>
        <h1
          data-field="fullName"
          onClick={(e) => onSelectField?.(e, "fullName")}
          className={cn(
            "text-[26px] font-bold leading-none tracking-[-0.045em]",
            getFieldClass("fullName")
          )}
        >
          {data.fullName}
        </h1>
        <p
          data-field="headline"
          onClick={(e) => onSelectField?.(e, "headline")}
          className={cn(
            "mt-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-(--brand-muted)",
            getFieldClass("headline")
          )}
        >
          {data.headline
            ? data.headline
                .replace(/SENIORPRODUCTSPECIALIST/i, "SENIOR PRODUCT SPECIALIST")
                .replace(/PRODUCTMANAGER/i, "PRODUCT MANAGER")
                .replace(/SOFTWAREENGINEER/i, "SOFTWARE ENGINEER")
                .replace(/([a-z])([A-Z])/g, "$1 $2")
            : ""}
        </p>
      </header>

      <section className="relative mt-4 flex-1 space-y-3 text-xs leading-normal text-[#2d342f]">
        <div className="space-y-1 text-[11px] text-(--brand-muted)">
          <div className="flex items-center justify-between font-medium">
            <p
              data-field="date"
              onClick={(e) => onSelectField?.(e, "date")}
              className={getFieldClass("date")}
            >
              {data.date}
            </p>
            <div className="flex items-center gap-1.5">
              {data.company && (
                <span
                  data-field="company"
                  onClick={(e) => onSelectField?.(e, "company")}
                  className={getFieldClass("company")}
                >
                  {data.company}
                </span>
              )}
              {data.company && data.role && <span>·</span>}
              {data.role && (
                <span
                  data-field="role"
                  onClick={(e) => onSelectField?.(e, "role")}
                  className={getFieldClass("role")}
                >
                  {data.role}
                </span>
              )}
            </div>
          </div>
          {(data.recipient || selectedField === "recipient") && (
            <p
              data-field="recipient"
              onClick={(e) => onSelectField?.(e, "recipient")}
              className={cn("font-medium text-[#1e2320]", getFieldClass("recipient"))}
            >
              {data.recipient}
            </p>
          )}
        </div>

        <div className="pt-2">
          <p
            data-field="greeting"
            onClick={(e) => onSelectField?.(e, "greeting")}
            className={cn("font-bold", getFieldClass("greeting"))}
          >
            {data.greeting}
          </p>
        </div>

        <p
          data-field="opening"
          onClick={(e) => onSelectField?.(e, "opening")}
          className={cn("whitespace-pre-wrap", getFieldClass("opening"))}
        >
          {data.opening}
        </p>

        <p
          data-field="evidence"
          onClick={(e) => onSelectField?.(e, "evidence")}
          className={cn("whitespace-pre-wrap", getFieldClass("evidence"))}
        >
          {data.evidence}
        </p>

        <p
          data-field="closing"
          onClick={(e) => onSelectField?.(e, "closing")}
          className={cn("whitespace-pre-wrap", getFieldClass("closing"))}
        >
          {data.closing}
        </p>

        <div className="pt-4">
          <p
            data-field="signoff"
            onClick={(e) => onSelectField?.(e, "signoff")}
            className={cn("font-semibold", getFieldClass("signoff"))}
          >
            {data.signoff}
          </p>
          <p
            data-field="fullName"
            onClick={(e) => onSelectField?.(e, "fullName")}
            className={cn("mt-2 font-bold", getFieldClass("fullName"))}
          >
            {data.fullName}
          </p>
        </div>
      </section>

      {(data.email || data.phone || data.location || data.website) && (
        <footer className="relative mt-8 border-t border-black/10 pt-4 text-[9px] text-(--brand-muted) flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {data.email && (
              <span
                data-field="email"
                onClick={(e) => onSelectField?.(e, "email")}
                className={getFieldClass("email")}
              >
                {data.email}
              </span>
            )}
            {data.email && (data.phone || data.location || data.website) && (
              <span className="text-black/30">·</span>
            )}
            {data.phone && (
              <span
                data-field="phone"
                onClick={(e) => onSelectField?.(e, "phone")}
                className={getFieldClass("phone")}
              >
                {data.phone}
              </span>
            )}
            {data.phone && (data.location || data.website) && (
              <span className="text-black/30">·</span>
            )}
            {data.location && (
              <span
                data-field="location"
                onClick={(e) => onSelectField?.(e, "location")}
                className={getFieldClass("location")}
              >
                {data.location}
              </span>
            )}
            {data.location && data.website && <span className="text-black/30">·</span>}
            {data.website && (
              <span
                data-field="website"
                onClick={(e) => onSelectField?.(e, "website")}
                className={getFieldClass("website")}
              >
                {data.website}
              </span>
            )}
          </div>
        </footer>
      )}
    </article>
  );
}

export const CoverLetterPreview = React.memo(CoverLetterPreviewBase);
