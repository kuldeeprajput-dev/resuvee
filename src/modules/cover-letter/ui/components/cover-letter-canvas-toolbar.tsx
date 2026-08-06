"use client";

import React from "react";
import { MousePointer, Hand, ZoomOut, ZoomIn, RotateCcw, Undo2, Redo2, Grid, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { CanvasTheme } from "../../types/cover-letter";

interface CoverLetterCanvasToolbarProps {
  isHandTool: boolean;
  setIsHandTool: (value: boolean) => void;
  isSpacePressed: boolean;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setPan: (pan: { x: number; y: number }) => void;
  historyLength: number;
  futureLength: number;
  handleUndo: () => void;
  handleRedo: () => void;
  canvasTheme: CanvasTheme;
  setCanvasTheme: (theme: CanvasTheme) => void;
  showThemeMenu: boolean;
  setShowThemeMenu: (value: boolean) => void;
  showPresetsMenu: boolean;
  setShowPresetsMenu: (value: boolean) => void;
}

const ZOOM_PRESETS = [50, 72, 85, 100, 125, 150];

function CoverLetterCanvasToolbarBase({
  isHandTool,
  setIsHandTool,
  isSpacePressed,
  zoom,
  setZoom,
  setPan,
  historyLength,
  futureLength,
  handleUndo,
  handleRedo,
  canvasTheme,
  setCanvasTheme,
  showThemeMenu,
  setShowThemeMenu,
  showPresetsMenu,
  setShowPresetsMenu,
}: CoverLetterCanvasToolbarProps) {
  return (
    <div className="no-print absolute bottom-6 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-1.5 rounded-full border border-black/15 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md transition-all duration-200 lg:flex">
      {/* Select Mode vs Hand/Pan Tool Switcher */}
      <div className="flex items-center rounded-xl bg-black/5 p-0.5">
        <button
          type="button"
          onClick={() => setIsHandTool(false)}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg text-xs font-bold transition cursor-pointer",
            !isHandTool && !isSpacePressed
              ? "bg-white text-[var(--brand-ink)] shadow-xs"
              : "text-[var(--brand-muted)] hover:text-black"
          )}
          title="Select Mode (Click text on PDF to highlight & edit)"
        >
          <MousePointer className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setIsHandTool(true)}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg text-xs font-bold transition cursor-pointer",
            isHandTool || isSpacePressed
              ? "bg-white text-[var(--brand-ink)] shadow-xs"
              : "text-[var(--brand-muted)] hover:text-black"
          )}
          title="Hand Tool (Click & drag canvas to pan view)"
        >
          <Hand className="size-3.5" />
        </button>
      </div>

      <span className="h-4 w-px bg-black/10 mx-0.5" />

      {/* Zoom Out Button */}
      <button
        type="button"
        onClick={() => setZoom((z) => Math.max(30, z - 10))}
        className="builder-icon-button cursor-pointer"
        title="Zoom Out"
      >
        <ZoomOut className="size-3.5" />
      </button>

      {/* Interactive Zoom Level Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowPresetsMenu(!showPresetsMenu);
            setShowThemeMenu(false);
          }}
          className="flex h-8 items-center gap-1 rounded-xl bg-black/5 px-2.5 text-xs font-bold text-[var(--brand-ink)] transition hover:bg-black/10 cursor-pointer"
          title="Choose Zoom Scale"
        >
          <span>{zoom}%</span>
          <span className="text-[10px] text-[var(--brand-muted)]">▼</span>
        </button>

        {showPresetsMenu && (
          <div className="absolute bottom-11 left-1/2 z-50 -translate-x-1/2 w-28 rounded-2xl border border-black/15 bg-white p-1.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
            {ZOOM_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setZoom(p);
                  setShowPresetsMenu(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer",
                  zoom === p
                    ? "bg-emerald-50 text-emerald-900 font-extrabold"
                    : "text-[var(--brand-ink)] hover:bg-black/5"
                )}
              >
                {p}%
                {zoom === p && <Check className="size-3 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom In Button */}
      <button
        type="button"
        onClick={() => setZoom((z) => Math.min(200, z + 10))}
        className="builder-icon-button cursor-pointer"
        title="Zoom In"
      >
        <ZoomIn className="size-3.5" />
      </button>

      {/* Reset Zoom & Pan Button */}
      <button
        type="button"
        onClick={() => {
          setZoom(72);
          setPan({ x: 0, y: 0 });
        }}
        className="builder-icon-button cursor-pointer"
        title="Reset Pan & Zoom"
      >
        <RotateCcw className="size-3.5" />
      </button>

      <span className="h-4 w-px bg-black/10 mx-0.5" />

      {/* Undo Button */}
      <button
        type="button"
        onClick={handleUndo}
        disabled={historyLength === 0}
        className="builder-icon-button disabled:opacity-30 cursor-pointer"
        title="Undo (Ctrl + Z)"
      >
        <Undo2 className="size-3.5" />
      </button>

      {/* Redo Button */}
      <button
        type="button"
        onClick={handleRedo}
        disabled={futureLength === 0}
        className="builder-icon-button disabled:opacity-30 cursor-pointer"
        title="Redo (Ctrl + Y)"
      >
        <Redo2 className="size-3.5" />
      </button>

      <span className="h-4 w-px bg-black/10 mx-0.5" />

      {/* Canvas Background Theme Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowThemeMenu(!showThemeMenu);
            setShowPresetsMenu(false);
          }}
          className="builder-icon-button cursor-pointer"
          title="Canvas Background Pattern"
        >
          <Grid className="size-3.5" />
        </button>

        {showThemeMenu && (
          <div className="absolute bottom-11 right-0 z-50 w-40 rounded-2xl border border-black/15 bg-white p-2 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
            <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
              Canvas Theme
            </p>
            {(["dots", "grid", "studio", "clean"] as CanvasTheme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setCanvasTheme(t);
                  setShowThemeMenu(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold transition capitalize cursor-pointer",
                  canvasTheme === t
                    ? "bg-emerald-50 text-emerald-900 font-extrabold"
                    : "text-[var(--brand-ink)] hover:bg-black/5"
                )}
              >
                {t}
                {canvasTheme === t && <Check className="size-3.5 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const CoverLetterCanvasToolbar = React.memo(CoverLetterCanvasToolbarBase);
