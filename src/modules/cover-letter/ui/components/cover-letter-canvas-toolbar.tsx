"use client";

import React from "react";
import { MousePointer, Hand, Undo2, Redo2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { CanvasTheme } from "../../types/cover-letter";
import { ZoomControls } from "./zoom-controls";
import { CanvasThemeSelector } from "./canvas-theme-selector";

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

export function CoverLetterCanvasToolbar({
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
    <div className="no-print absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-black/15 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md transition-all duration-200">
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

      <ZoomControls
        zoom={zoom}
        setZoom={setZoom}
        setPan={setPan}
        showPresetsMenu={showPresetsMenu}
        setShowPresetsMenu={setShowPresetsMenu}
        setShowThemeMenu={setShowThemeMenu}
      />

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
        <Redo2 className="size-3.5 text-white" />
      </button>

      <span className="h-4 w-px bg-black/10 mx-0.5" />

      <CanvasThemeSelector
        canvasTheme={canvasTheme}
        setCanvasTheme={setCanvasTheme}
        showThemeMenu={showThemeMenu}
        setShowThemeMenu={setShowThemeMenu}
        setShowPresetsMenu={setShowPresetsMenu}
      />
    </div>
  );
}
