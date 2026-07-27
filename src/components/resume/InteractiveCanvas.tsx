"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Compass,
  Grid,
  Hand,
  LayoutTemplate,
  Maximize2,
  Minimize2,
  Minus,
  MousePointer,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import type { ResumeData, ResumeTemplate } from "@/types/resume";
import { ResumePreview } from "./ResumePreview";
import { resumeFontClass, type ResumeStyle } from "./CustomizePanel";
import { cn } from "@/lib/utils";

export type CanvasTheme = "dots" | "grid" | "studio" | "clean";

interface InteractiveCanvasProps {
  data: ResumeData;
  template: ResumeTemplate;
  previewTemplate: ResumeTemplate;
  showPhoto: boolean;
  font: ResumeStyle["font"];
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onShowTemplates: () => void;
  onCloseMobilePreview?: () => void;
  isMobilePreview?: boolean;
}

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

export function InteractiveCanvas({
  data,
  template,
  previewTemplate,
  showPhoto,
  font,
  zoom,
  onZoomChange,
  onShowTemplates,
  onCloseMobilePreview,
  isMobilePreview = false,
}: InteractiveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHandTool, setIsHandTool] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>("dots");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const resetPanAndZoom = useCallback(() => {
    setPan({ x: 0, y: 0 });
    onZoomChange(80);
  }, [onZoomChange]);

  // Keyboard shortcut listeners for Space-drag and zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept keypresses when typing in inputs/textareas
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea") return;

      if (e.code === "Space" && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        onZoomChange(zoom + 10);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        onZoomChange(zoom - 10);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        resetPanAndZoom();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isSpacePressed, zoom, onZoomChange, resetPanAndZoom]);

  // Handle Wheel Events for Ctrl+Wheel Zoom & Smooth Pan
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 8 : -8;
        onZoomChange(zoom + delta);
      } else {
        // Pan with wheel when not zooming
        setPan((prev) => ({
          x: prev.x - e.deltaX * 0.8,
          y: prev.y - e.deltaY * 0.8,
        }));
      }
    },
    [zoom, onZoomChange],
  );

  const activeHand = isHandTool || isSpacePressed;

  const handleMouseDown = (e: React.MouseEvent) => {
    // Enable drag on middle button, hand tool, spacebar, or clicking background
    if (
      e.button === 1 ||
      activeHand ||
      (e.target as HTMLElement).classList.contains("canvas-bg")
    ) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const fitToWidth = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 80;
    const calculatedZoom = Math.round((containerWidth / 595) * 100);
    onZoomChange(calculatedZoom);
    setPan({ x: 0, y: 0 });
  };

  const fitToPage = () => {
    if (!containerRef.current) return;
    const containerHeight = containerRef.current.clientHeight - 160;
    const calculatedZoom = Math.round((containerHeight / 842) * 100);
    onZoomChange(calculatedZoom);
    setPan({ x: 0, y: 0 });
  };

  // Background style classes
  const themeStyles: Record<CanvasTheme, string> = {
    dots: "bg-[#e5e7e2] [background-image:radial-gradient(#b8beb5_1.2px,transparent_1.2px)] [background-size:20px_20px]",
    grid: "bg-[#e8e9e4] [background-image:linear-gradient(to_right,#d2d6cd_1px,transparent_1px),linear-gradient(to_bottom,#d2d6cd_1px,transparent_1px)] [background-size:24px_24px]",
    studio: "bg-[#1e2320] [background-image:radial-gradient(#3a453f_1.5px,transparent_1.5px)] [background-size:24px_24px]",
    clean: "bg-[#dfe2dc]",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden select-none transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-[120] bg-black" : "h-full w-full",
      )}
    >
      {/* Top Header Bar */}
      <div className="no-print absolute inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-black/10 bg-white/90 px-4 backdrop-blur lg:px-5">
        <div className="flex items-center gap-3">
          {isMobilePreview && (
            <button
              type="button"
              onClick={onCloseMobilePreview}
              className="builder-icon-button lg:hidden"
              aria-label="Close preview"
            >
              <X className="size-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-bold tracking-tight">Studio Canvas</p>
          </div>
          <span className="hidden rounded-full bg-[var(--brand-lime)] px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[var(--brand-ink)] sm:inline">
            {template.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Template Selector Button */}
          <button
            type="button"
            onClick={onShowTemplates}
            className="flex h-8 items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 text-[11px] font-bold transition hover:bg-black/5 shadow-xs"
          >
            <LayoutTemplate className="size-3.5 text-[var(--brand-muted)]" />
            <span>Templates</span>
          </button>

          {/* Canvas Specs Info Pill */}
          <span className="hidden items-center gap-1.5 rounded-xl border border-black/10 bg-white/70 px-2.5 py-1 text-[10px] font-semibold text-[var(--brand-muted)] xl:flex">
            <Compass className="size-3 text-emerald-600" />
            A4 · 210 × 297 mm
          </span>

          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="builder-icon-button"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          >
            {isFullscreen ? (
              <Minimize2 className="size-4" />
            ) : (
              <Maximize2 className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={cn(
          "canvas-bg relative flex-1 overflow-hidden transition-colors duration-300",
          themeStyles[canvasTheme],
          activeHand
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-default",
        )}
      >
        {/* Rendered Document Sheet Container */}
        <div
          className="canvas-bg absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0)`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
        >
          <div
            className="pointer-events-auto transition-transform duration-100 ease-out shadow-[0_28px_85px_rgba(0,0,0,0.22)]"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center center",
            }}
          >
            <ResumePreview
              data={data}
              template={previewTemplate}
              showPhoto={showPhoto}
              className={resumeFontClass(font)}
            />
          </div>
        </div>
      </div>

      {/* Floating Bottom-Center Glassmorphic Toolbar */}
      <div className="no-print absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/40 bg-white/85 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-md">
        {/* Select vs Hand/Pan Tool Switcher */}
        <div className="flex items-center rounded-xl bg-black/5 p-0.5">
          <button
            type="button"
            onClick={() => setIsHandTool(false)}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-xs font-bold transition",
              !isHandTool && !isSpacePressed
                ? "bg-white text-[var(--brand-ink)] shadow-xs"
                : "text-[var(--brand-muted)] hover:text-black",
            )}
            title="Select Mode"
          >
            <MousePointer className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsHandTool(true)}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-xs font-bold transition",
              isHandTool || isSpacePressed
                ? "bg-[var(--brand-ink)] text-white shadow-xs"
                : "text-[var(--brand-muted)] hover:text-black",
            )}
            title="Pan / Hand Tool (Drag Canvas)"
          >
            <Hand className="size-3.5" />
          </button>
        </div>

        <span className="h-5 w-px bg-black/10 mx-1" />

        {/* Zoom Out Button */}
        <button
          type="button"
          onClick={() => onZoomChange(zoom - 10)}
          className="builder-icon-button"
          title="Zoom Out (Ctrl + -)"
        >
          <Minus className="size-3.5" />
        </button>

        {/* Zoom Level & Presets Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowPresetsMenu(!showPresetsMenu);
              setShowThemeMenu(false);
            }}
            className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold text-[var(--brand-ink)] hover:bg-black/5"
          >
            <span>{Math.round(zoom)}%</span>
            <ChevronDown className="size-3 text-[var(--brand-muted)]" />
          </button>

          {showPresetsMenu && (
            <div className="absolute bottom-11 left-1/2 z-50 min-w-[120px] -translate-x-1/2 rounded-2xl border border-black/10 bg-white p-1.5 shadow-xl backdrop-blur">
              <button
                type="button"
                onClick={() => {
                  fitToWidth();
                  setShowPresetsMenu(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[var(--brand-ink)] hover:bg-black/5"
              >
                <span>Fit Width</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  fitToPage();
                  setShowPresetsMenu(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[var(--brand-ink)] hover:bg-black/5"
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
                    setShowPresetsMenu(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-[11px] font-medium transition hover:bg-black/5",
                    Math.round(zoom) === preset.value &&
                      "font-bold text-emerald-700 bg-emerald-50",
                  )}
                >
                  <span>{preset.label}</span>
                  {Math.round(zoom) === preset.value && (
                    <Check className="size-3" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zoom In Button */}
        <button
          type="button"
          onClick={() => onZoomChange(zoom + 10)}
          className="builder-icon-button"
          title="Zoom In (Ctrl + +)"
        >
          <Plus className="size-3.5" />
        </button>

        <span className="h-5 w-px bg-black/10 mx-1" />

        {/* Reset Pan & Zoom Button */}
        <button
          type="button"
          onClick={resetPanAndZoom}
          className="builder-icon-button"
          title="Reset Pan & Zoom (Ctrl + 0)"
        >
          <RotateCcw className="size-3.5" />
        </button>

        {/* Canvas Background Theme Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowThemeMenu(!showThemeMenu);
              setShowPresetsMenu(false);
            }}
            className="builder-icon-button"
            title="Canvas Theme"
          >
            <Grid className="size-3.5" />
          </button>

          {showThemeMenu && (
            <div className="absolute bottom-11 right-0 z-50 min-w-[130px] rounded-2xl border border-black/10 bg-white p-1.5 shadow-xl">
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
                    setCanvasTheme(theme.id as CanvasTheme);
                    setShowThemeMenu(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-medium hover:bg-black/5",
                    canvasTheme === theme.id &&
                      "font-bold text-emerald-700 bg-emerald-50",
                  )}
                >
                  <span>{theme.label}</span>
                  {canvasTheme === theme.id && <Check className="size-3" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
