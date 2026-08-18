"use client";

import {
  Check,
  Grid,
  Hand,
  MousePointer,
  Redo2,
  RotateCcw,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { CanvasTheme } from "./interactive-canvas";

const ZOOM_PRESETS = [
  { label: "25%", value: 25 },
  { label: "50%", value: 50 },
  { label: "75%", value: 75 },
  { label: "100%", value: 100 },
  { label: "125%", value: 125 },
  { label: "150%", value: 150 },
  { label: "200%", value: 200 },
  { label: "300%", value: 300 },
];

interface CanvasBottomToolbarProps {
  zoom: number;
  canvasTheme: CanvasTheme;
  isHandTool: boolean;
  activeHand: boolean;
  canUndo: boolean;
  canRedo: boolean;
  showPresetsMenu: boolean;
  showThemeMenu: boolean;
  onZoomChange: (zoom: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetPan: () => void;
  onFitToWidth: () => void;
  onFitToPage: () => void;
  onSetHandTool: (hand: boolean) => void;
  onCanvasThemeChange: (theme: CanvasTheme) => void;
  onUndo: () => void;
  onRedo: () => void;
  onTogglePresetsMenu: () => void;
  onToggleThemeMenu: () => void;
}

export function CanvasBottomToolbar({
  zoom,
  canvasTheme,
  activeHand,
  canUndo,
  canRedo,
  showPresetsMenu,
  showThemeMenu,
  onZoomChange,
  onZoomIn,
  onZoomOut,
  onResetPan,
  onFitToWidth,
  onFitToPage,
  onSetHandTool,
  onCanvasThemeChange,
  onUndo,
  onRedo,
  onTogglePresetsMenu,
  onToggleThemeMenu,
}: CanvasBottomToolbarProps) {
  return (
    <div className="no-print absolute bottom-6 left-1/2 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1.5 rounded-full border border-black/15 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md transition-all duration-200">
      {/* Select vs Hand/Pan Tool Switcher */}
      <div className="flex items-center rounded-xl bg-black/5 p-0.5">
        <button
          type="button"
          onClick={() => onSetHandTool(false)}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg text-xs font-bold transition cursor-pointer",
            !activeHand
              ? "bg-white text-(--brand-ink) shadow-xs"
              : "text-(--brand-muted) hover:text-black"
          )}
          title="Select Mode (Click text on PDF to highlight & edit)"
        >
          <MousePointer className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onSetHandTool(true)}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg text-xs font-bold transition cursor-pointer",
            activeHand
              ? "bg-white text-(--brand-ink) shadow-xs"
              : "text-(--brand-muted) hover:text-black"
          )}
          title="Pan / Hand Tool (Drag Canvas)"
        >
          <Hand className="size-3.5" />
        </button>
      </div>

      <span className="h-4 w-px bg-black/10 mx-0.5" />

      {/* Zoom Out */}
      <button
        type="button"
        onClick={onZoomOut}
        className="builder-icon-button cursor-pointer"
        title="Zoom Out (Ctrl + -)"
      >
        <ZoomOut className="size-3.5" />
      </button>

      {/* Zoom Level & Presets Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={onTogglePresetsMenu}
          className="flex h-8 items-center gap-1 rounded-xl bg-black/5 px-2.5 text-xs font-bold text-(--brand-ink) transition hover:bg-black/10 cursor-pointer"
          title="Choose Zoom Scale"
        >
          <span>{Math.round(zoom)}%</span>
          <span className="text-[10px] text-(--brand-muted)">▼</span>
        </button>

        {showPresetsMenu && (
          <div className="absolute bottom-11 left-1/2 z-50 min-w-[120px] -translate-x-1/2 rounded-2xl border border-black/15 bg-white p-1.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => {
                onFitToWidth();
                onTogglePresetsMenu();
              }}
              className="flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold text-(--brand-ink) hover:bg-black/5 cursor-pointer"
            >
              <span>Fit Width</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onFitToPage();
                onTogglePresetsMenu();
              }}
              className="flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold text-(--brand-ink) hover:bg-black/5 cursor-pointer"
            >
              <span>Fit Page</span>
            </button>
            <div className="my-1 h-px bg-black/10" />
            {ZOOM_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => {
                  onZoomChange(preset.value);
                  onTogglePresetsMenu();
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-2.5 py-1 text-xs font-bold transition cursor-pointer",
                  Math.round(zoom) === preset.value
                    ? "bg-emerald-50 text-emerald-900 font-extrabold"
                    : "text-(--brand-ink) hover:bg-black/5"
                )}
              >
                <span>{preset.label}</span>
                {Math.round(zoom) === preset.value && <Check className="size-3 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom In */}
      <button
        type="button"
        onClick={onZoomIn}
        className="builder-icon-button cursor-pointer"
        title="Zoom In (Ctrl + +)"
      >
        <ZoomIn className="size-3.5" />
      </button>

      {/* Reset Pan & Zoom */}
      <button
        type="button"
        onClick={onResetPan}
        className="builder-icon-button cursor-pointer"
        title="Reset Pan & Zoom (Ctrl + 0)"
      >
        <RotateCcw className="size-3.5" />
      </button>

      <span className="h-4 w-px bg-black/10 mx-0.5" />

      {/* Undo */}
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className="builder-icon-button disabled:opacity-30 cursor-pointer"
        title="Undo (Ctrl + Z)"
        aria-label="Undo"
      >
        <Undo2 className="size-3.5" />
      </button>

      {/* Redo */}
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        className="builder-icon-button disabled:opacity-30 cursor-pointer"
        title="Redo (Ctrl + Y)"
        aria-label="Redo"
      >
        <Redo2 className="size-3.5" />
      </button>

      <span className="h-4 w-px bg-black/10 mx-0.5" />

      {/* Canvas Theme Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={onToggleThemeMenu}
          className="builder-icon-button cursor-pointer"
          title="Canvas Theme"
        >
          <Grid className="size-3.5 text-(--brand-ink)" />
        </button>

        {showThemeMenu && (
          <div className="absolute bottom-11 right-0 z-50 min-w-[130px] rounded-2xl border border-black/15 bg-white p-1.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
            {[
              { id: "dots", label: "Studio Dots" },
              { id: "grid", label: "CAD Grid" },
              { id: "studio", label: "Dark Studio" },
              { id: "clean", label: "Clean Paper" },
            ].map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  onCanvasThemeChange(theme.id as CanvasTheme);
                  onToggleThemeMenu();
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer",
                  canvasTheme === theme.id
                    ? "bg-emerald-50 text-emerald-900 font-extrabold"
                    : "text-(--brand-ink) hover:bg-black/5"
                )}
              >
                <span>{theme.label}</span>
                {canvasTheme === theme.id && <Check className="size-3 text-emerald-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
