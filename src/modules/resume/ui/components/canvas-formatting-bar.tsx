"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CaseSensitive,
  Italic,
  Loader2,
  Maximize2,
  Minimize2,
  Palette,
  Pipette,
  RemoveFormatting,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { SelectedCanvasElement } from "./interactive-canvas";
import type { ResumeTemplate } from "../../types/resume";
import type { ResumeStyle } from "./customize-panel";

const COLOR_SWATCHES = [
  { name: "Forest", value: "#28785b" },
  { name: "Ink", value: "#243934" },
  { name: "Ocean", value: "#2f6fa3" },
  { name: "Navy", value: "#203b57" },
  { name: "Plum", value: "#6c4c70" },
];

interface CanvasFormattingBarProps {
  selectedElement: SelectedCanvasElement;
  toolbarPos: { top: number; left: number };
  toolbarRef: React.RefObject<HTMLDivElement | null>;
  inlineText: string;
  isRefining: boolean;
  isExpanded: boolean;
  showColorPicker: boolean;
  template: ResumeTemplate;
  resumeStyle?: ResumeStyle;
  selectedDomRef: React.RefObject<HTMLElement | null>;
  handleAiRefine: () => void;
  handleRealtimeTextChange: (newText: string) => void;
  setIsExpanded: (expanded: boolean) => void;
  changeFontSize: (delta: number) => void;
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleCase: () => void;
  clearFormatting: () => void;
  setTextAlign: (align: "left" | "center" | "right") => void;
  setShowColorPicker: (show: boolean) => void;
  deleteSelected: () => void;
  clearSelection: () => void;
}

export function CanvasFormattingBar({
  selectedElement,
  toolbarPos,
  toolbarRef,
  inlineText,
  isRefining,
  isExpanded,
  showColorPicker,
  template,
  resumeStyle,
  selectedDomRef,
  handleAiRefine,
  handleRealtimeTextChange,
  setIsExpanded,
  changeFontSize,
  toggleBold,
  toggleItalic,
  toggleCase,
  clearFormatting,
  setTextAlign,
  setShowColorPicker,
  deleteSelected,
  clearSelection,
}: CanvasFormattingBarProps) {
  return (
    <div
      ref={toolbarRef}
      onClick={(e) => e.stopPropagation()}
      className="no-print absolute z-50 hidden lg:flex items-center gap-1.5 rounded-full border border-black/15 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95 overflow-visible"
      style={{
        top: `${toolbarPos.top}px`,
        left: `${toolbarPos.left}px`,
      }}
    >
      {/* AI Icon & Inline Text Input Pill Container */}
      <div className="relative flex items-center gap-1.5 rounded-full bg-black/5 px-2 py-1 shrink-0">
        <button
          type="button"
          onClick={handleAiRefine}
          disabled={isRefining}
          className="flex size-6 shrink-0 items-center justify-center rounded-full hover:bg-black/10 transition cursor-pointer disabled:opacity-50"
          title="AI Smart Refine Text"
        >
          {isRefining ? (
            <Loader2 className="size-3.5 text-[#059669] animate-spin" />
          ) : (
            <Sparkles className="size-3.5 text-[#059669]" />
          )}
        </button>

        <input
          type="text"
          value={inlineText}
          onChange={(e) => handleRealtimeTextChange(e.target.value)}
          className="h-7 w-32 sm:w-44 rounded-xl bg-white px-2.5 text-xs font-bold text-[var(--brand-ink)] shadow-xs outline-none focus:ring-1 focus:ring-[#059669] truncate"
          placeholder="Edit inline..."
        />

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full transition cursor-pointer",
            isExpanded
              ? "bg-[#059669] text-white"
              : "hover:bg-black/10 text-[var(--brand-muted)]"
          )}
          title={isExpanded ? "Collapse Editor Card" : "Expand Full Paragraph Editor Card"}
        >
          {isExpanded ? <Minimize2 className="size-3" /> : <Maximize2 className="size-3" />}
        </button>

        {/* Expandable Floating Paragraph Editor Card */}
        {isExpanded && (
          <div className="absolute top-12 left-0 z-[100] flex w-80 sm:w-[400px] flex-col gap-2 rounded-2xl border border-black/15 bg-white p-3 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-auto">
            <div className="flex items-center justify-between border-b border-black/10 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#059669] border border-emerald-500/20">
                  {selectedElement.title || selectedElement.field || "Section"}
                </span>
                <span className="text-[10px] font-semibold text-[var(--brand-muted)]">
                  {inlineText.length} chars
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleAiRefine}
                  disabled={isRefining}
                  className="flex h-7 items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200 px-2.5 text-[11px] font-bold text-[#059669] hover:bg-emerald-100 transition cursor-pointer disabled:opacity-50"
                >
                  {isRefining ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Sparkles className="size-3" />
                  )}
                  <span>AI Refine</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="flex size-7 items-center justify-center rounded-xl hover:bg-black/5 text-[var(--brand-muted)] transition cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            <textarea
              rows={5}
              value={inlineText}
              onChange={(e) => handleRealtimeTextChange(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-black/5 p-2.5 text-xs font-medium leading-relaxed text-[var(--brand-ink)] outline-none focus:border-[#059669] focus:bg-white resize-y scrollbar-thin transition-all"
              placeholder="Type or edit full section text..."
              autoFocus
            />
          </div>
        )}
      </div>

      <span className="h-4 w-px bg-black/10 mx-0.5 shrink-0" />

      {/* A- / A+ Font Size Control Pill */}
      <div className="flex items-center rounded-xl bg-black/5 p-0.5 shrink-0">
        <button
          type="button"
          onClick={() => changeFontSize(-1)}
          className="flex h-7 px-2 items-center justify-center rounded-lg text-xs font-bold text-[var(--brand-ink)] hover:bg-white hover:shadow-xs transition cursor-pointer"
          title="Decrease font size"
        >
          A-
        </button>
        <button
          type="button"
          onClick={() => changeFontSize(1)}
          className="flex h-7 px-2 items-center justify-center rounded-lg text-xs font-bold text-[var(--brand-ink)] hover:bg-white hover:shadow-xs transition cursor-pointer"
          title="Increase font size"
        >
          A+
        </button>
      </div>

      {/* Bold, Italic, Case Transform, Clear Formatting */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={toggleBold}
          className="builder-icon-button cursor-pointer"
          title="Bold text formatting"
        >
          <Bold className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={toggleItalic}
          className="builder-icon-button cursor-pointer"
          title="Italic text formatting"
        >
          <Italic className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={toggleCase}
          className="builder-icon-button cursor-pointer"
          title="Toggle UPPERCASE / Normal Case (AB)"
        >
          <CaseSensitive className="size-4" />
        </button>

        <button
          type="button"
          onClick={clearFormatting}
          className="builder-icon-button cursor-pointer"
          title="Clear text formatting (Tx)"
        >
          <RemoveFormatting className="size-4" />
        </button>
      </div>

      <span className="h-4 w-px bg-black/10 mx-0.5 shrink-0" />

      {/* Text Alignment */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={() => setTextAlign("left")}
          className="builder-icon-button cursor-pointer"
          title="Align Left"
        >
          <AlignLeft className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setTextAlign("center")}
          className="builder-icon-button cursor-pointer"
          title="Align Center"
        >
          <AlignCenter className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setTextAlign("right")}
          className="builder-icon-button cursor-pointer"
          title="Align Right"
        >
          <AlignRight className="size-3.5" />
        </button>
      </div>

      <span className="h-4 w-px bg-black/10 mx-0.5 shrink-0" />

      {/* Color Swatch & Trash Picker */}
      <div className="relative flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="builder-icon-button cursor-pointer"
          title="Text / Accent Color"
        >
          <Palette className="size-3.5 text-[#059669]" />
        </button>

        {selectedElement.id && (
          <button
            type="button"
            onClick={deleteSelected}
            className="builder-icon-button text-red-600 hover:bg-red-50 cursor-pointer"
            title="Delete item"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}

        {showColorPicker && (
          <div className="absolute top-12 right-0 z-[100] flex items-center gap-2 rounded-full border border-black/15 bg-white p-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-auto">
            {/* Custom Color Wheel Swatch */}
            <label
              className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/20 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-500 via-green-500 via-blue-500 to-red-500 shadow-xs transition hover:scale-105"
              title="Pick Custom Color"
            >
              <input
                type="color"
                value={
                  (resumeStyle?.accent || template.accent || "#059669").startsWith("#")
                    ? resumeStyle?.accent || template.accent || "#059669"
                    : "#059669"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (selectedDomRef.current) {
                    selectedDomRef.current.style.color = val;
                  }
                }}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
              />
              <Pipette className="size-3 text-white drop-shadow-md" />
            </label>

            {/* Custom Hex Code Input */}
            <input
              type="text"
              value={resumeStyle?.accent || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (selectedDomRef.current && val.startsWith("#") && val.length >= 4) {
                  selectedDomRef.current.style.color = val;
                }
              }}
              placeholder="#059669"
              className="w-16 h-7 rounded-xl border border-black/15 bg-black/5 px-2 text-[10px] font-mono font-bold text-[var(--brand-ink)] outline-none focus:bg-white"
            />

            <span className="h-4 w-px bg-black/15 mx-0.5 shrink-0" />

            {/* Preset Swatches */}
            <div className="flex items-center gap-1.5">
              {COLOR_SWATCHES.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => {
                    if (selectedDomRef.current) {
                      selectedDomRef.current.style.color = color.value;
                    }
                    setShowColorPicker(false);
                  }}
                  className="size-6 rounded-full border border-black/20 shadow-xs transition hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <span className="h-4 w-px bg-black/10 mx-0.5 shrink-0" />

      {/* Close Formatting Bar Button */}
      <button
        type="button"
        onClick={clearSelection}
        className="builder-icon-button cursor-pointer shrink-0"
        title="Close formatting bar"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
