"use client";

import React from "react";
import { Download, Maximize2, Minimize2 } from "lucide-react";
import type { CoverLetterTheme, ThemeOption, TypographyFont, PageSpacing, ColorSwatch } from "../../types/cover-letter";
import { TemplateSelectorPopover } from "./template-selector-popover";
import { DesignControlsPopover } from "./design-controls-popover";

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
}

export function CoverLetterCanvasHeader({
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
}: CoverLetterCanvasHeaderProps) {
  return (
    <div className="no-print absolute inset-x-0 top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-black/10 bg-white/90 px-3 backdrop-blur sm:px-4 lg:px-5">
      <div className="flex flex-1 items-center gap-2 min-w-0 overflow-hidden sm:gap-2.5">
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex size-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
          <p className="whitespace-nowrap text-xs font-bold tracking-tight">Letter Studio</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 z-10">
        {isFullscreen && (
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-[11px] font-bold text-[var(--brand-ink)] transition hover:bg-black/5 shadow-xs sm:px-3 animate-in fade-in cursor-pointer"
            title="Export PDF Document"
          >
            <Download className="size-3.5 text-emerald-600" />
            <span className="whitespace-nowrap">Export PDF</span>
          </button>
        )}

        <TemplateSelectorPopover
          showTemplatesMenu={showTemplatesMenu}
          setShowTemplatesMenu={setShowTemplatesMenu}
          setShowDesignMenu={setShowDesignMenu}
          theme={theme}
          setTheme={setTheme}
          themes={themes}
        />

        <DesignControlsPopover
          showDesignMenu={showDesignMenu}
          setShowDesignMenu={setShowDesignMenu}
          setShowTemplatesMenu={setShowTemplatesMenu}
          activeAccent={activeAccent}
          setCustomAccent={setCustomAccent}
          font={font}
          setFont={setFont}
          pageSpacing={pageSpacing}
          setPageSpacing={setPageSpacing}
          colorSwatches={colorSwatches}
        />

        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="builder-icon-button shrink-0 cursor-pointer"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
        >
          {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </button>
      </div>
    </div>
  );
}
