"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Cloud,
  Download,
  FileSpreadsheet,
  FileText,
  LayoutTemplate,
  Loader2,
  Maximize2,
  Minimize2,
  Palette,
  Pipette,
  ScanSearch,
  SpellCheck2,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { ResumeTemplate } from "../../types/resume";
import type { ResumeStyle } from "./customize-panel";

const COLOR_SWATCHES = [
  { name: "Forest", value: "#28785b" },
  { name: "Ink", value: "#243934" },
  { name: "Ocean", value: "#2f6fa3" },
  { name: "Navy", value: "#203b57" },
  { name: "Plum", value: "#6c4c70" },
];

const FONT_OPTIONS = [
  { label: "Inter", value: "inter" },
  { label: "Merriweather", value: "merriweather" },
  { label: "Playfair", value: "playfair" },
  { label: "Lato", value: "lato" },
  { label: "Roboto Slab", value: "roboto-slab" },
];

interface CanvasTopBarProps {
  template: ResumeTemplate;
  resumeStyle?: ResumeStyle;
  isMobilePreview?: boolean;
  isFullscreen: boolean;
  showDesignMenu: boolean;
  onCloseMobilePreview?: () => void;
  onShowTemplates: () => void;
  onShowWritingCheck?: () => void;
  onShowTailor?: () => void;
  onToggleDesignMenu: () => void;
  onCloseDesignMenu: () => void;
  onUpdateStyle?: (style: ResumeStyle) => void;
  onToggleFullscreen?: () => void;
  onExportPdf?: () => void;
  onExportDocx?: () => void;
  isExportingDocx?: boolean;
  exportDocxStatus?: "idle" | "exported" | "error";
  onUploadResume?: (file: File) => void;
  isImportingResume?: boolean;
  uploadFileInputRef?: React.RefObject<HTMLInputElement | null>;
  onSave?: () => void;
  isSaving?: boolean;
  saveStatus?: "idle" | "saved" | "error";
}

export function CanvasTopBar({
  template,
  resumeStyle,
  isMobilePreview,
  isFullscreen,
  showDesignMenu,
  onCloseMobilePreview,
  onShowTemplates,
  onShowWritingCheck,
  onShowTailor,
  onToggleDesignMenu,
  onCloseDesignMenu,
  onUpdateStyle,
  onToggleFullscreen,
  onExportPdf,
  onExportDocx,
  isExportingDocx,
  exportDocxStatus,
  onUploadResume,
  isImportingResume,
  uploadFileInputRef,
  onSave,
  isSaving,
  saveStatus,
}: CanvasTopBarProps) {
  // Internal file input ref — used when no external ref is provided
  const internalFileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = (uploadFileInputRef ??
    internalFileInputRef) as React.RefObject<HTMLInputElement>;

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Drag-and-drop handlers
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!onUploadResume) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    },
    [onUploadResume]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only dismiss if leaving the drop zone itself (not a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (!onUploadResume) return;
      const file = e.dataTransfer.files?.[0];
      if (file) {
        onUploadResume(file);
      }
    },
    [onUploadResume]
  );

  const showFullscreenControls = isFullscreen || isMobilePreview;

  return (
    <>
      {/* Drag-and-drop overlay — shown when a file is dragged over the canvas in fullscreen */}
      {showFullscreenControls && isDragOver && (
        <div
          className="pointer-events-none fixed inset-0 z-400 flex flex-col items-center justify-center gap-3 bg-emerald-950/60 backdrop-blur-sm"
          aria-hidden
        >
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-emerald-400/80 bg-emerald-900/60 px-10 py-8 shadow-2xl backdrop-blur">
            <Upload className="size-10 text-emerald-300 animate-bounce" />
            <p className="text-lg font-bold text-white">Drop to import resume</p>
            <p className="text-sm text-emerald-300/80">PDF · DOCX · DOC · TXT · Max 10 MB</p>
          </div>
        </div>
      )}

      <div
        className="no-print absolute inset-x-0 top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-black/10 bg-white/90 px-3 backdrop-blur sm:px-4 lg:px-5"
        onDragOver={showFullscreenControls ? handleDragOver : undefined}
        onDragLeave={showFullscreenControls ? handleDragLeave : undefined}
        onDrop={showFullscreenControls ? handleDrop : undefined}
      >
        <div className="flex flex-1 items-center gap-2 min-w-0 overflow-hidden sm:gap-2.5">
          {isMobilePreview && (
            <button
              type="button"
              onClick={onCloseMobilePreview}
              className="builder-icon-button shrink-0 lg:hidden"
              aria-label="Close preview"
            >
              <X className="size-4" />
            </button>
          )}
          <div className="hidden lg:flex shrink-0 items-center gap-2">
            <span className="flex size-2 shrink-0 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
            <p className="whitespace-nowrap text-xs font-extrabold tracking-tight text-(--brand-ink)">
              Studio Canvas
            </p>
            <span className="text-black/25 text-xs font-semibold mx-0.5">·</span>
            <span className="shrink-0 max-w-[140px] truncate text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#059669] border-b-2 border-[#059669] pb-0.5 transition-all">
              {template.name}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 pl-2 ml-auto z-10">
          {/* Upload Resume — only in desktop fullscreen */}
          {isFullscreen && !isMobilePreview && onUploadResume && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onUploadResume) {
                    onUploadResume(file);
                  }
                }}
                accept=".pdf,.docx"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImportingResume}
                className="group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 text-xs font-bold text-(--brand-ink) shadow-xs transition hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857] cursor-pointer animate-in fade-in disabled:opacity-60"
                title="Upload resume from PDF or Word document (or drag & drop onto canvas)"
              >
                {isImportingResume ? (
                  <Loader2 className="size-3.5 animate-spin text-[#059669]" />
                ) : (
                  <Upload className="size-3.5 text-emerald-600 transition-colors group-hover:text-[#059669]" />
                )}
                <span className="whitespace-nowrap">
                  {isImportingResume ? "Importing..." : "Upload Resume"}
                </span>
              </button>
            </>
          )}

          {/* Check with AI — only in desktop fullscreen */}
          {isFullscreen && !isMobilePreview && onShowWritingCheck && (
            <button
              type="button"
              onClick={onShowWritingCheck}
              className="group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 text-xs font-bold text-(--brand-ink) shadow-xs transition hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857] cursor-pointer animate-in fade-in"
              title="Scan and improve resume text with AI writing check"
            >
              <SpellCheck2 className="size-3.5 text-emerald-600 transition-colors group-hover:text-[#059669]" />
              <span className="whitespace-nowrap">Check with AI</span>
            </button>
          )}

          {/* Role match — only in desktop fullscreen */}
          {isFullscreen && !isMobilePreview && onShowTailor && (
            <button
              type="button"
              onClick={onShowTailor}
              className="group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 text-xs font-bold text-(--brand-ink) shadow-xs transition hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857] cursor-pointer animate-in fade-in"
              title="Compare with job description keywords"
            >
              <ScanSearch className="size-3.5 text-emerald-600 transition-colors group-hover:text-[#059669]" />
              <span className="whitespace-nowrap">Role match</span>
            </button>
          )}

          {/* Templates */}
          <button
            type="button"
            onClick={onShowTemplates}
            className="group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 text-xs font-bold text-(--brand-ink) shadow-xs transition hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857] cursor-pointer"
          >
            <LayoutTemplate className="size-3.5 text-emerald-600 transition-colors group-hover:text-[#059669]" />
            <span className="whitespace-nowrap">Templates</span>
          </button>

          {/* Design Controls Button */}
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={onToggleDesignMenu}
              className={cn(
                "group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold shadow-xs transition cursor-pointer",
                showDesignMenu
                  ? "border-[#10b981] bg-[#ecfdf5] text-[#047857] ring-2 ring-emerald-500/30"
                  : "border-black/15 bg-white text-(--brand-ink) hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857]"
              )}
            >
              <Palette
                className={cn(
                  "size-3.5 transition-colors",
                  showDesignMenu ? "text-[#059669]" : "text-emerald-600 group-hover:text-[#059669]"
                )}
              />
              <span className="whitespace-nowrap">Design</span>
            </button>

            {showDesignMenu && (
              <div className="absolute top-10 right-0 z-50 w-72 sm:w-80 rounded-2xl border border-black/15 bg-white p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2.5 border-b border-black/10 mb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="size-4 text-emerald-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-(--brand-ink)">
                      CANVAS DESIGN
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={onCloseDesignMenu}
                    className="builder-icon-button cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                {/* Accent Color Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-(--brand-ink)">Accent Color</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-(--brand-muted)">
                        {resumeStyle?.accent || template.accent || "#28785b"}
                      </span>
                      <span
                        className="size-3.5 rounded-full border border-black/20"
                        style={{
                          backgroundColor: resumeStyle?.accent || template.accent || "#28785b",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Custom Color Wheel Swatch on Left Side */}
                    <label
                      className={cn(
                        "relative flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/20 shadow-xs transition hover:scale-110 bg-[conic-gradient(at_center,var(--tw-gradient-stops))] from-red-500 via-green-500 via-blue-500 to-red-500",
                        !COLOR_SWATCHES.some(
                          (c) =>
                            c.value.toLowerCase() ===
                            (resumeStyle?.accent || template.accent || "").toLowerCase()
                        ) && "ring-2 ring-emerald-600 ring-offset-1"
                      )}
                      title="Pick Custom Color"
                    >
                      <input
                        type="color"
                        value={
                          (resumeStyle?.accent || template.accent || "#28785b").startsWith("#")
                            ? resumeStyle?.accent || template.accent || "#28785b"
                            : "#28785b"
                        }
                        onChange={(e) =>
                          onUpdateStyle?.({ ...resumeStyle, accent: e.target.value } as ResumeStyle)
                        }
                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                      />
                      <Pipette className="size-3 text-white drop-shadow-md" />
                    </label>

                    {/* Custom Hex Code Text Input */}
                    <input
                      type="text"
                      value={resumeStyle?.accent || ""}
                      onChange={(e) =>
                        onUpdateStyle?.({ ...resumeStyle, accent: e.target.value } as ResumeStyle)
                      }
                      placeholder={template.accent || "#28785b"}
                      className="w-16 h-6 rounded-lg border border-black/15 bg-black/5 px-1.5 text-[10px] font-mono font-bold text-(--brand-ink) outline-none focus:bg-white"
                    />

                    <span className="h-4 w-px bg-black/15 mx-0.5 shrink-0" />

                    {/* Preset Swatches Side-by-Side */}
                    <div className="flex items-center gap-1.5">
                      {COLOR_SWATCHES.map((color) => {
                        const isSelected =
                          (resumeStyle?.accent || template.accent).toLowerCase() ===
                          color.value.toLowerCase();
                        return (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() =>
                              onUpdateStyle?.({
                                ...resumeStyle,
                                accent: color.value,
                              } as ResumeStyle)
                            }
                            className={cn(
                              "size-6 rounded-full border border-black/20 transition hover:scale-110 flex items-center justify-center shrink-0 cursor-pointer",
                              isSelected && "ring-2 ring-emerald-600 ring-offset-1"
                            )}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          >
                            {isSelected && <Check className="size-3 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Font / Typography Section */}
                <div className="pt-3 border-t border-black/10 mb-4">
                  <label className="block text-xs font-bold text-(--brand-ink) mb-2">
                    Font / Typography
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        id: "template",
                        name: "Template",
                        desc: "Designed pairing",
                        cls: "font-sans",
                      },
                      { id: "sans", name: "Modern", desc: "Clean & Direct", cls: "font-sans" },
                      {
                        id: "serif",
                        name: "Editorial",
                        desc: "Classic & Formal",
                        cls: "font-serif",
                      },
                      { id: "mono", name: "Technical", desc: "Structured", cls: "font-mono" },
                    ].map((f) => {
                      const isSelected = (resumeStyle?.font || "template") === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() =>
                            onUpdateStyle?.({
                              ...resumeStyle,
                              font: f.id as ResumeStyle["font"],
                            } as ResumeStyle)
                          }
                          className={cn(
                            "flex flex-col items-start rounded-xl border p-2.5 text-left transition cursor-pointer",
                            isSelected
                              ? "border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600/30"
                              : "border-black/10 bg-white hover:border-black/25"
                          )}
                        >
                          <span className={cn("text-base font-bold leading-none mb-1", f.cls)}>
                            Aa
                          </span>
                          <span className="text-[11px] font-bold leading-tight">{f.name}</span>
                          <span className="text-[9px] text-(--brand-muted)">{f.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Page Spacing Section */}
                <div className="pt-3 border-t border-black/10">
                  <label className="block text-xs font-bold text-(--brand-ink) mb-2">
                    Page Spacing
                  </label>
                  <div className="flex gap-1.5">
                    {[
                      { id: "compact", label: "Compact" },
                      { id: "normal", label: "Normal" },
                      { id: "spacious", label: "Spacious" },
                    ].map((p) => {
                      const isSelected = (resumeStyle?.pagePadding || "normal") === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() =>
                            onUpdateStyle?.({
                              ...resumeStyle,
                              pagePadding: p.id as ResumeStyle["pagePadding"],
                              sectionSpacing: p.id as ResumeStyle["sectionSpacing"],
                            } as ResumeStyle)
                          }
                          className={cn(
                            "flex-1 rounded-xl border py-1.5 text-center text-xs font-bold transition cursor-pointer",
                            isSelected
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-black/10 bg-white text-(--brand-muted) hover:border-black/25"
                          )}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button — only in fullscreen / mobile preview */}
          {showFullscreenControls && onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 text-xs font-bold text-(--brand-ink) shadow-xs transition hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857] cursor-pointer animate-in fade-in disabled:opacity-50"
              title="Save changes to cloud"
            >
              {isSaving ? (
                <Loader2 className="size-3.5 animate-spin text-[#059669]" />
              ) : saveStatus === "saved" ? (
                <Check className="size-3.5 text-emerald-600 transition-colors group-hover:text-[#059669]" />
              ) : (
                <Cloud className="size-3.5 text-emerald-600 transition-colors group-hover:text-[#059669]" />
              )}
              <span className="whitespace-nowrap">
                {isSaving ? "Saving..." : saveStatus === "saved" ? "Saved" : "Save"}
              </span>
            </button>
          )}

          {/* Export Options Dropdown — only in fullscreen / mobile preview */}
          {showFullscreenControls && (
            <div className="relative animate-in fade-in">
              <button
                type="button"
                onClick={() => {
                  setShowExportMenu(!showExportMenu);
                  onCloseDesignMenu();
                }}
                disabled={isExportingDocx}
                className={cn(
                  "group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-60",
                  showExportMenu || exportDocxStatus === "exported"
                    ? "border-[#10b981] bg-[#ecfdf5] text-[#047857] ring-2 ring-emerald-500/30"
                    : "border-black/15 bg-white text-(--brand-ink) hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857]"
                )}
                title="Export resume"
              >
                {isExportingDocx ? (
                  <Loader2 className="size-3.5 animate-spin text-[#059669]" />
                ) : exportDocxStatus === "exported" ? (
                  <Check className={cn("size-3.5 transition-colors text-[#059669]")} />
                ) : (
                  <Download
                    className={cn(
                      "size-3.5 transition-colors",
                      showExportMenu
                        ? "text-[#059669]"
                        : "text-emerald-600 group-hover:text-[#059669]"
                    )}
                  />
                )}
                <span>
                  {isExportingDocx
                    ? "Exporting..."
                    : exportDocxStatus === "exported"
                      ? "Exported!"
                      : "Export"}
                </span>
                {!isExportingDocx && exportDocxStatus !== "exported" && (
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-colors",
                      showExportMenu
                        ? "text-[#059669]"
                        : "text-(--brand-muted) group-hover:text-[#059669]"
                    )}
                  />
                )}
              </button>

              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                  <div className="absolute right-0 top-10 z-50 w-56 rounded-2xl border border-black/15 bg-white p-1.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
                    {/* PDF */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowExportMenu(false);
                        if (onExportPdf) onExportPdf();
                        else window.print();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-bold text-(--brand-ink) transition hover:bg-black/5 cursor-pointer"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                        <FileText className="size-4" />
                      </span>
                      <div className="text-left">
                        <p className="font-bold text-(--brand-ink)">PDF Document</p>
                        <p className="text-[10px] text-(--brand-muted) font-normal">
                          Print-perfect layout
                        </p>
                      </div>
                    </button>

                    {/* DOCX */}
                    <button
                      type="button"
                      disabled={isExportingDocx}
                      onClick={() => {
                        setShowExportMenu(false);
                        if (onExportDocx) onExportDocx();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-bold text-(--brand-ink) transition hover:bg-black/5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                        {isExportingDocx ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <FileSpreadsheet className="size-4" />
                        )}
                      </span>
                      <div className="text-left">
                        <p className="font-bold text-(--brand-ink)">
                          {isExportingDocx ? "Generating..." : "Word Document"}
                        </p>
                        <p className="text-[10px] text-(--brand-muted) font-normal">
                          {isExportingDocx ? "Please wait..." : "Editable .docx file"}
                        </p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Fullscreen Toggle Button */}
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="group flex size-8 shrink-0 items-center justify-center rounded-xl border border-black/15 bg-white shadow-xs transition hover:bg-black/5 cursor-pointer hidden lg:flex"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
            >
              {isFullscreen ? (
                <Minimize2 className="size-3.5 text-(--brand-ink) transition-colors group-hover:text-black" />
              ) : (
                <Maximize2 className="size-3.5 text-(--brand-ink) transition-colors group-hover:text-black" />
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
