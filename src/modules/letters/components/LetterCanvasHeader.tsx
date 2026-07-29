"use client";

import React from "react";
import { Download, LayoutTemplate, Palette, Pipette, Check, X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { LetterTheme, ThemeOption, TypographyFont, PageSpacing, ColorSwatch } from "../types/letter";

interface LetterCanvasHeaderProps {
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  showTemplatesMenu: boolean;
  setShowTemplatesMenu: (value: boolean) => void;
  showDesignMenu: boolean;
  setShowDesignMenu: (value: boolean) => void;
  theme: LetterTheme;
  setTheme: (theme: LetterTheme) => void;
  themes: ThemeOption[];
  activeAccent: string;
  setCustomAccent: (color: string) => void;
  font: TypographyFont;
  setFont: (font: TypographyFont) => void;
  pageSpacing: PageSpacing;
  setPageSpacing: (spacing: PageSpacing) => void;
  colorSwatches: ColorSwatch[];
}

export function LetterCanvasHeader({
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
}: LetterCanvasHeaderProps) {
  return (
    <div className="no-print absolute inset-x-0 top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-black/10 bg-white/90 px-3 backdrop-blur sm:px-4 lg:px-5">
      <div className="flex flex-1 items-center gap-2 min-w-0 overflow-hidden sm:gap-2.5">
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex size-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
          <p className="whitespace-nowrap text-xs font-bold tracking-tight">Letter Studio</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 z-10">
        {/* Export PDF Button in Fullscreen */}
        {isFullscreen && (
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-[11px] font-bold text-[var(--brand-ink)] transition hover:bg-black/5 shadow-xs sm:px-3 animate-in fade-in"
            title="Export PDF Document"
          >
            <Download className="size-3.5 text-emerald-600" />
            <span className="whitespace-nowrap">Export PDF</span>
          </button>
        )}

        {/* Templates Selector Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowTemplatesMenu(!showTemplatesMenu);
              setShowDesignMenu(false);
            }}
            className={cn(
              "group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold shadow-xs transition",
              showTemplatesMenu
                ? "border-[#10b981] bg-[#ecfdf5] text-[#047857] ring-2 ring-emerald-500/30"
                : "border-black/15 bg-white text-[var(--brand-ink)] hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857]"
            )}
          >
            <LayoutTemplate className={cn("size-3.5 transition-colors", showTemplatesMenu ? "text-[#059669]" : "text-[var(--brand-muted)] group-hover:text-[#059669]")} />
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
                    "flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition mb-1",
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

        {/* Design Controls Button & Popover (Fixed Layout Swatches Overflow) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowDesignMenu(!showDesignMenu);
              setShowTemplatesMenu(false);
            }}
            className={cn(
              "group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold shadow-xs transition",
              showDesignMenu
                ? "border-[#10b981] bg-[#ecfdf5] text-[#047857] ring-2 ring-emerald-500/30"
                : "border-black/15 bg-white text-[var(--brand-ink)] hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857]"
            )}
          >
            <Palette className={cn("size-3.5 transition-colors", showDesignMenu ? "text-[#059669]" : "text-[var(--brand-muted)] group-hover:text-[#059669]")} />
            <span>Design</span>
          </button>

          {showDesignMenu && (
            <div className="absolute top-10 right-0 z-50 w-72 sm:w-80 rounded-2xl border border-black/15 bg-white p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2.5 border-b border-black/10 mb-3">
                <div className="flex items-center gap-2">
                  <Palette className="size-4 text-emerald-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-ink)]">
                    CANVAS DESIGN
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDesignMenu(false)}
                  className="builder-icon-button"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              {/* Accent Color Section with Responsive Flex Wrap */}
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
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/20 shadow-xs transition hover:scale-110 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-500 via-green-500 via-blue-500 to-red-500"
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
                  <input
                    type="text"
                    value={activeAccent}
                    onChange={(e) => setCustomAccent(e.target.value)}
                    className="w-20 rounded-lg border border-black/15 bg-black/5 px-2 py-1 font-mono text-xs font-bold text-[var(--brand-ink)] outline-none focus:border-emerald-600 focus:bg-white"
                    placeholder="#203b57"
                  />
                  <span className="h-6 w-px bg-black/10 mx-0.5 shrink-0" />
                  <div className="flex flex-wrap items-center gap-1.5 max-w-full">
                    {colorSwatches.map((color) => {
                      const isSelected = activeAccent.toLowerCase() === color.value.toLowerCase();
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setCustomAccent(color.value)}
                          className="relative flex size-6 shrink-0 items-center justify-center rounded-full border border-black/15 shadow-xs transition hover:scale-110"
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {isSelected && <Check className="size-3 text-white drop-shadow-xs" />}
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
                          "flex flex-col items-start rounded-xl border p-2.5 text-left transition",
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
                          "flex-1 rounded-xl border py-1.5 text-center text-xs font-bold transition",
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

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="builder-icon-button shrink-0"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
        >
          {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </button>
      </div>
    </div>
  );
}
