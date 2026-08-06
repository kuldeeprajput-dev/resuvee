"use client";

import React, { useRef, useState } from "react";
import { Download, LayoutTemplate, Palette, Pipette, Check, X, Maximize2, Minimize2, Upload, Loader2, ChevronDown, FileText, FileSpreadsheet, Sparkles, Cloud } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { CoverLetterTheme, ThemeOption, TypographyFont, PageSpacing, ColorSwatch } from "../../types/cover-letter";

interface CoverLetterCanvasHeaderProps {
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  showTemplatesMenu: boolean;
  setShowTemplatesMenu: (value: boolean) => void;
  showDesignMenu: boolean;
  setShowDesignMenu: (value: boolean) => void;
  theme: CoverLetterTheme;
  setTheme: (theme: CoverLetterTheme) => void;
  themes: ThemeOption[];
  activeAccent: string;
  setCustomAccent: (color: string) => void;
  font: TypographyFont;
  setFont: (font: TypographyFont) => void;
  pageSpacing: PageSpacing;
  setPageSpacing: (spacing: PageSpacing) => void;
  colorSwatches: ColorSwatch[];
  isMobilePreview?: boolean;
  onCloseMobilePreview?: () => void;
  onUploadLetter?: (file: File) => void;
  isImportingLetter?: boolean;
  setShowAiDrawer?: (v: boolean) => void;
  handleExportPdf?: () => void;
  handleExportDocx?: () => void;
  handleSaveToCloud?: () => void;
  isSaving?: boolean;
  saveStatus?: string;
}

function CoverLetterCanvasHeaderBase({
  isFullscreen,
  setIsFullscreen,
  showTemplatesMenu,
  setShowTemplatesMenu,
  showDesignMenu,
  setShowDesignMenu,
  theme,
  setTheme,
  themes,
  activeAccent,
  setCustomAccent,
  font,
  setFont,
  pageSpacing,
  setPageSpacing,
  colorSwatches,
  isMobilePreview,
  onCloseMobilePreview,
  onUploadLetter,
  isImportingLetter,
  setShowAiDrawer,
  handleExportPdf,
  handleExportDocx,
  handleSaveToCloud,
  isSaving,
  saveStatus,
}: CoverLetterCanvasHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const currentThemeObj = themes.find((t) => t.id === theme);
  const activeTemplateName = (currentThemeObj?.name || theme).toUpperCase();

  return (
    <div className="no-print absolute inset-x-0 top-0 z-[55] flex h-14 items-center justify-between gap-2 border-b border-black/10 bg-white/90 px-3 backdrop-blur sm:px-4 lg:px-5">
      <div className="flex flex-1 items-center gap-2 min-w-0 overflow-hidden sm:gap-2.5">
        {onCloseMobilePreview && (
          <button
            type="button"
            onClick={onCloseMobilePreview}
            className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-black/15 bg-white text-[var(--brand-ink)] shadow-2xs transition hover:bg-black/5 lg:hidden cursor-pointer"
            aria-label="Close preview"
            title="Close preview"
          >
            <X className="size-4 text-[var(--brand-ink)]" />
          </button>
        )}
        <div className="hidden lg:flex shrink-0 items-center gap-2">
          <span className="flex size-2 shrink-0 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
          <p className="whitespace-nowrap text-xs font-extrabold tracking-tight text-[var(--brand-ink)]">
            Letter Studio
          </p>
          <span className="text-black/25 text-xs font-semibold mx-0.5">·</span>
          <span className="shrink-0 max-w-[140px] truncate text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#059669] border-b-2 border-[#059669] pb-0.5 transition-all">
            {activeTemplateName}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 z-10">
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

        {/* Upload Letter Button - Only visible in Zoom / Fullscreen Cover Mode */}
        {isFullscreen && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImportingLetter}
            className="group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 text-xs font-bold text-[var(--brand-ink)] shadow-xs transition hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857] cursor-pointer"
            title="Upload outside cover letter (PDF, DOCX, TXT) to edit"
          >
            {isImportingLetter ? (
              <Loader2 className="size-3.5 animate-spin text-emerald-600" />
            ) : (
              <Upload className="size-3.5 text-emerald-600 transition-colors group-hover:text-[#059669]" />
            )}
            <span className="hidden sm:inline">{isImportingLetter ? "Uploading..." : "Upload Letter"}</span>
            <span className="sm:hidden">{isImportingLetter ? "..." : "Upload"}</span>
          </button>
        )}

        {/* Writing with AI Button - Visible in Zoom / Fullscreen Cover Mode */}
        {isFullscreen && setShowAiDrawer && (
          <button
            type="button"
            onClick={() => setShowAiDrawer(true)}
            className="group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 text-xs font-bold text-[var(--brand-ink)] shadow-xs transition hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857] cursor-pointer"
            title="Generate or refine letter with AI"
          >
            <Sparkles className="size-3.5 text-emerald-600 animate-pulse transition-colors group-hover:text-[#059669]" />
            <span className="hidden sm:inline">Writing with AI</span>
            <span className="sm:hidden">AI Write</span>
          </button>
        )}

        {/* Templates Selector Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowTemplatesMenu(!showTemplatesMenu);
              setShowDesignMenu(false);
              setShowExportMenu(false);
            }}
            className={cn(
              "group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold shadow-xs transition cursor-pointer",
              showTemplatesMenu
                ? "border-[#10b981] bg-[#ecfdf5] text-[#047857] ring-2 ring-emerald-500/30"
                : "border-black/15 bg-white text-[var(--brand-ink)] hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857]"
            )}
          >
            <LayoutTemplate className={cn("size-3.5 transition-colors", showTemplatesMenu ? "text-[#059669]" : "text-emerald-600 group-hover:text-[#059669]")} />
            <span>Templates</span>
          </button>

          {showTemplatesMenu && (
            <div className="absolute top-10 right-0 z-50 w-64 rounded-2xl border border-black/15 bg-white p-2.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
              <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)] border-b border-black/10 mb-1.5">
                Letter Templates
              </p>
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t.id);
                    setShowTemplatesMenu(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition mb-1 cursor-pointer",
                    theme === t.id
                      ? "bg-emerald-50 text-emerald-950 font-bold border border-emerald-500/30"
                      : "hover:bg-black/5 text-[var(--brand-ink)]"
                  )}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: t.accent }}
                      />
                      <span className="text-xs font-bold">{t.name}</span>
                    </div>
                    <span className="text-[10px] text-[var(--brand-muted)] font-normal block pl-4">
                      {t.description}
                    </span>
                  </div>
                  {theme === t.id && <Check className="size-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Design Controls Button & Popover (Desktop Only) */}
        <div className="relative hidden lg:block">
          <button
            type="button"
            onClick={() => {
              setShowDesignMenu(!showDesignMenu);
              setShowTemplatesMenu(false);
            }}
            className={cn(
              "group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold shadow-xs transition cursor-pointer",
              showDesignMenu
                ? "border-[#10b981] bg-[#ecfdf5] text-[#047857] ring-2 ring-emerald-500/30"
                : "border-black/15 bg-white text-[var(--brand-ink)] hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857]"
            )}
          >
            <Palette className={cn("size-3.5 transition-colors", showDesignMenu ? "text-[#059669]" : "text-emerald-600 group-hover:text-[#059669]")} />
            <span>Design</span>
          </button>

          {showDesignMenu && (
            <div className="absolute top-10 right-0 z-50 w-72 sm:w-80 rounded-2xl border border-black/15 bg-white p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2.5 border-b border-black/10 mb-3">
                <div className="flex items-center gap-2">
                  <Palette className="size-4 text-emerald-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-ink)]">
                    LETTER DESIGN
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDesignMenu(false)}
                  className="builder-icon-button cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              {/* Accent Color Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[var(--brand-ink)]">Accent Color</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-[var(--brand-muted)]">
                      {activeAccent}
                    </span>
                    <span
                      className="size-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: activeAccent }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Custom Color Wheel Swatch on Left Side */}
                  <label
                    className={cn(
                      "relative flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/20 shadow-xs transition hover:scale-110 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-500 via-green-500 via-blue-500 to-red-500",
                      !colorSwatches.some(
                        (c) => c.value.toLowerCase() === activeAccent.toLowerCase()
                      ) && "ring-2 ring-emerald-600 ring-offset-1"
                    )}
                    title="Pick Custom Color"
                  >
                    <input
                      type="color"
                      value={activeAccent}
                      onChange={(e) => setCustomAccent(e.target.value)}
                      className="absolute inset-0 size-full cursor-pointer opacity-0"
                    />
                    <Pipette className="size-3 text-white drop-shadow-md" />
                  </label>

                  {/* Custom Hex Code Text Input */}
                  <input
                    type="text"
                    value={activeAccent}
                    onChange={(e) => setCustomAccent(e.target.value)}
                    placeholder="#28785b"
                    className="w-16 h-6 rounded-lg border border-black/15 bg-black/5 px-1.5 text-[10px] font-mono font-bold text-[var(--brand-ink)] outline-none focus:bg-white"
                  />

                  <span className="h-4 w-px bg-black/15 mx-0.5 shrink-0" />

                  {/* Preset Swatches Side-by-Side */}
                  <div className="flex items-center gap-1.5">
                    {colorSwatches.map((color) => {
                      const isSelected = activeAccent.toLowerCase() === color.value.toLowerCase();
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setCustomAccent(color.value)}
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
                <label className="block text-xs font-bold text-[var(--brand-ink)] mb-2">
                  Font / Typography
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "template", name: "Template", desc: "Designed pairing", cls: "font-sans" },
                    { id: "sans", name: "Modern", desc: "Clean & Direct", cls: "font-sans" },
                    { id: "serif", name: "Editorial", desc: "Classic & Formal", cls: "font-serif" },
                    { id: "mono", name: "Technical", desc: "Structured", cls: "font-mono" },
                  ].map((f) => {
                    const isSelected = font === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFont(f.id as TypographyFont)}
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
                        <span className="text-[9px] text-[var(--brand-muted)]">{f.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Page Spacing Section */}
              <div className="pt-3 border-t border-black/10">
                <label className="block text-xs font-bold text-[var(--brand-ink)] mb-2">
                  Page Spacing
                </label>
                <div className="flex gap-1.5">
                  {[
                    { id: "compact", label: "Compact" },
                    { id: "normal", label: "Normal" },
                    { id: "spacious", label: "Spacious" },
                  ].map((p) => {
                    const isSelected = pageSpacing === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPageSpacing(p.id as PageSpacing)}
                        className={cn(
                          "flex-1 rounded-xl border py-1.5 text-center text-xs font-bold transition cursor-pointer",
                          isSelected
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-black/10 bg-white text-[var(--brand-muted)] hover:border-black/25"
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

        {/* Save Button - Shown in Fullscreen/Zoom mode beside left of Export */}
        {(isFullscreen || isMobilePreview) && handleSaveToCloud && (
          <button
            type="button"
            onClick={handleSaveToCloud}
            disabled={isSaving}
            className="group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 text-xs font-bold text-[var(--brand-ink)] shadow-xs transition hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857] cursor-pointer"
            title="Save cover letter to your account"
          >
            {isSaving ? (
              <Loader2 className="size-3.5 animate-spin text-[#059669]" />
            ) : saveStatus === "saved" ? (
              <Check className="size-3.5 text-emerald-600 transition-colors group-hover:text-[#059669]" />
            ) : (
              <Cloud className="size-3.5 text-emerald-600 transition-colors group-hover:text-[#059669]" />
            )}
            <span>{isSaving ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save"}</span>
          </button>
        )}

        {/* Export Dropdown Button - Shown in Fullscreen/Zoom mode beside Fullscreen toggle */}
        {(isFullscreen || isMobilePreview) && (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowExportMenu(!showExportMenu);
                setShowTemplatesMenu(false);
                setShowDesignMenu(false);
              }}
              className={cn(
                "group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold shadow-xs transition cursor-pointer",
                showExportMenu
                  ? "border-[#10b981] bg-[#ecfdf5] text-[#047857] ring-2 ring-emerald-500/30"
                  : "border-black/15 bg-white text-[var(--brand-ink)] hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857]"
              )}
              title="Export cover letter options"
            >
              <Download className={cn("size-3.5 transition-colors", showExportMenu ? "text-[#059669]" : "text-emerald-600 group-hover:text-[#059669]")} />
              <span>Export</span>
              <ChevronDown className={cn("size-3.5 transition-colors", showExportMenu ? "text-[#059669]" : "text-[var(--brand-muted)] group-hover:text-[#059669]")} />
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 top-10 z-50 w-52 rounded-2xl border border-black/15 bg-white p-1.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      if (handleExportPdf) handleExportPdf();
                      else window.print();
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
                      if (handleExportDocx) handleExportDocx();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-bold text-[var(--brand-ink)] transition hover:bg-black/5 cursor-pointer"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <FileSpreadsheet className="size-4" />
                    </span>
                    <div className="text-left">
                      <p className="font-bold text-[var(--brand-ink)]">Word Document</p>
                      <p className="text-[10px] text-[var(--brand-muted)] font-normal">Export editable .docx file</p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Fullscreen Toggle (Desktop Only) */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-black/15 bg-white text-[var(--brand-ink)] shadow-xs transition hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857] cursor-pointer hidden lg:flex"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
        >
          {isFullscreen ? (
            <Minimize2 className="size-3.5 text-[var(--brand-muted)] transition-colors group-hover:text-[#059669]" />
          ) : (
            <Maximize2 className="size-3.5 text-[var(--brand-muted)] transition-colors group-hover:text-[#059669]" />
          )}
        </button>
      </div>
    </div>
  );
}

export const CoverLetterCanvasHeader = React.memo(CoverLetterCanvasHeaderBase);
