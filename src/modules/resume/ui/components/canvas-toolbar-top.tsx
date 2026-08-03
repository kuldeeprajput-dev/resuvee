"use client";

import {
  Check,
  Download,
  LayoutTemplate,
  Maximize2,
  Minimize2,
  Palette,
  Pipette,
  ScanSearch,
  SpellCheck2,
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
}: CanvasTopBarProps) {
  return (
    <div className="no-print absolute inset-x-0 top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-black/10 bg-white/90 px-3 backdrop-blur sm:px-4 lg:px-5">
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
          <p className="whitespace-nowrap text-xs font-extrabold tracking-tight text-[var(--brand-ink)]">
            Studio Canvas
          </p>
          <span className="text-black/25 text-xs font-semibold mx-0.5">·</span>
          <span className="shrink-0 max-w-[140px] truncate text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#059669] border-b-2 border-[#059669] pb-0.5 transition-all">
            {template.name}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 pl-2 ml-auto z-10">
        {isFullscreen && onShowWritingCheck && (
          <button
            type="button"
            onClick={onShowWritingCheck}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-[11px] font-bold text-[var(--brand-ink)] transition hover:bg-black/5 shadow-xs sm:px-3 cursor-pointer animate-in fade-in"
            title="Scan and improve resume text with AI writing check"
          >
            <SpellCheck2 className="size-3.5 text-emerald-600" />
            <span className="whitespace-nowrap">Check with AI</span>
          </button>
        )}

        {isFullscreen && onShowTailor && (
          <button
            type="button"
            onClick={onShowTailor}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-[11px] font-bold text-[var(--brand-ink)] transition hover:bg-black/5 shadow-xs sm:px-3 cursor-pointer animate-in fade-in"
            title="Compare with job description keywords"
          >
            <ScanSearch className="size-3.5 text-emerald-600" />
            <span className="whitespace-nowrap">Role match</span>
          </button>
        )}

        <button
          type="button"
          onClick={onShowTemplates}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-[11px] font-bold transition hover:bg-black/5 shadow-xs sm:px-3 cursor-pointer"
        >
          <LayoutTemplate className="size-3.5 text-[var(--brand-muted)]" />
          <span className="whitespace-nowrap">Templates</span>
        </button>

        {isMobilePreview && (
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-[11px] font-bold text-[var(--brand-ink)] transition hover:bg-black/5 shadow-xs sm:px-3 animate-in fade-in cursor-pointer lg:hidden"
            title="Export PDF Document"
          >
            <Download className="size-3.5 text-emerald-600" />
            <span className="whitespace-nowrap">Export</span>
          </button>
        )}

        {isFullscreen && !isMobilePreview && (
          <button
            type="button"
            onClick={() => window.print()}
            className="hidden lg:flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-[11px] font-bold text-[var(--brand-ink)] transition hover:bg-black/5 shadow-xs sm:px-3 animate-in fade-in cursor-pointer"
            title="Export PDF Document"
          >
            <Download className="size-3.5 text-emerald-600" />
            <span className="whitespace-nowrap">Export PDF</span>
          </button>
        )}

        {/* Design Controls Button */}
        <div className="relative hidden lg:block">
          <button
            type="button"
            onClick={onToggleDesignMenu}
            className={cn(
              "flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-[11px] font-bold transition hover:bg-black/5 shadow-xs sm:px-3 cursor-pointer",
              showDesignMenu &&
                "border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50 text-emerald-800"
            )}
          >
            <Palette className="size-3.5 text-emerald-600" />
            <span className="whitespace-nowrap">Design</span>
          </button>

          {showDesignMenu && (
            <div className="absolute top-10 right-0 z-50 w-72 sm:w-80 rounded-2xl border border-black/15 bg-white p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2.5 border-b border-black/10 mb-3">
                <div className="flex items-center gap-2">
                  <Palette className="size-4 text-emerald-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-ink)]">
                    Canvas Design
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onCloseDesignMenu}
                  className="builder-icon-button"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              {/* Accent Color */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[var(--brand-ink)]">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-[var(--brand-muted)] font-bold">
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

                <div className="flex flex-wrap items-center gap-2">
                  <label
                    className={cn(
                      "relative flex size-6 cursor-pointer items-center justify-center rounded-full border border-black/20 shadow-xs transition hover:scale-110 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-500 via-green-500 via-blue-500 to-red-500",
                      !COLOR_SWATCHES.some(
                        (c) => c.value.toLowerCase() === (resumeStyle?.accent || "").toLowerCase()
                      ) && "ring-2 ring-emerald-600 ring-offset-1"
                    )}
                    title="Pick Any Custom Color"
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

                  <input
                    type="text"
                    value={resumeStyle?.accent || ""}
                    onChange={(e) =>
                      onUpdateStyle?.({ ...resumeStyle, accent: e.target.value } as ResumeStyle)
                    }
                    placeholder={template.accent || "#28785b"}
                    className="w-16 h-6 rounded-lg border border-black/15 bg-black/5 px-1.5 text-[10px] font-mono font-bold text-[var(--brand-ink)] focus:outline-none focus:bg-white"
                  />

                  <span className="h-4 w-px bg-black/15 mx-0.5" />

                  {COLOR_SWATCHES.map((color) => {
                    const isSelected =
                      (resumeStyle?.accent || template.accent).toLowerCase() ===
                      color.value.toLowerCase();
                    return (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() =>
                          onUpdateStyle?.({ ...resumeStyle, accent: color.value } as ResumeStyle)
                        }
                        className={cn(
                          "size-6 rounded-full border border-black/20 transition hover:scale-110 flex items-center justify-center",
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

              {/* Font Picker */}
              <div>
                <label className="text-xs font-bold text-[var(--brand-ink)] mb-2 block">
                  Font Style
                </label>
                <div className="grid grid-cols-1 gap-1">
                  {FONT_OPTIONS.map((font) => {
                    const isSelected = (resumeStyle?.font || "inter") === font.value;
                    return (
                      <button
                        key={font.value}
                        type="button"
                        onClick={() =>
                          onUpdateStyle?.({
                            ...resumeStyle,
                            font: font.value as ResumeStyle["font"],
                          } as ResumeStyle)
                        }
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer",
                          isSelected
                            ? "bg-emerald-50 text-emerald-900 border border-emerald-300/80"
                            : "hover:bg-black/5 text-[var(--brand-ink)] border border-transparent"
                        )}
                      >
                        <span>{font.label}</span>
                        {isSelected && <Check className="size-3 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen Toggle Button */}
        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="builder-icon-button shrink-0 hidden lg:flex cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          >
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
