"use client";

import React from "react";
import {
  Bold,
  Italic,
  Underline,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  X,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { CoverLetterData, ColorSwatch } from "../types/cover-letter";

interface CoverLetterFormattingToolbarProps {
  toolbarRef: React.RefObject<HTMLDivElement | null>;
  toolbarPos: { top: number; left: number };
  selectedField: keyof CoverLetterData;
  inlineText: string;
  setInlineText: (text: string) => void;
  update: (field: keyof CoverLetterData, value: string) => void;
  selectedDomRef: React.RefObject<HTMLElement | null>;
  showColorPicker: boolean;
  setShowColorPicker: (value: boolean) => void;
  activeAccent: string;
  setCustomAccent: (color: string) => void;
  colorSwatches: ColorSwatch[];
  clearSelection: () => void;
}

export function CoverLetterFormattingToolbar({
  toolbarRef,
  toolbarPos,
  selectedField,
  inlineText,
  setInlineText,
  update,
  selectedDomRef,
  showColorPicker,
  setShowColorPicker,
  activeAccent,
  setCustomAccent,
  colorSwatches,
  clearSelection,
}: CoverLetterFormattingToolbarProps) {
  return (
    <div
      ref={toolbarRef}
      onClick={(e) => e.stopPropagation()}
      className="no-print absolute z-50 flex flex-wrap items-center gap-1.5 rounded-2xl border border-black/15 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95"
      style={{
        top: `${toolbarPos.top}px`,
        left: `${toolbarPos.left}px`,
      }}
    >
      <div className="flex items-center gap-1 border-r border-black/10 pr-1.5 pl-1">
        <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20">
          {selectedField}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <input
          type="text"
          value={inlineText}
          onChange={(e) => {
            setInlineText(e.target.value);
            update(selectedField, e.target.value);
          }}
          className="h-8 w-44 sm:w-56 rounded-xl border border-black/15 bg-black/5 px-2.5 text-xs font-semibold text-[var(--brand-ink)] outline-none focus:border-emerald-600 focus:bg-white transition-colors"
          placeholder="Edit text inline..."
        />
      </div>

      <div className="flex items-center gap-0.5 border-l border-black/10 pl-1">
        <button
          type="button"
          onClick={() => {
            if (!selectedDomRef.current) return;
            const currentVal = inlineText;
            const enhanced = currentVal
              ? `${currentVal.trim()} (Refined)`
              : "Enhanced professional response detailing leadership and impact.";
            setInlineText(enhanced);
            update(selectedField, enhanced);
          }}
          className="flex h-8 items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-50 px-2 text-[11px] font-bold text-emerald-800 transition hover:bg-emerald-100 cursor-pointer"
          title="AI Smart Refine Text"
        >
          <Sparkles className="size-3 text-emerald-600" />
          <span className="hidden sm:inline">AI Refine</span>
        </button>
      </div>

      <div className="flex items-center gap-0.5 border-l border-black/10 pl-1">
        <button
          type="button"
          onClick={() => {
            if (selectedDomRef.current) {
              selectedDomRef.current.classList.toggle("font-bold");
            }
          }}
          className="builder-icon-button cursor-pointer"
          title="Bold text formatting"
        >
          <Bold className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (selectedDomRef.current) {
              selectedDomRef.current.classList.toggle("italic");
            }
          }}
          className="builder-icon-button cursor-pointer"
          title="Italic text formatting"
        >
          <Italic className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (selectedDomRef.current) {
              selectedDomRef.current.classList.toggle("underline");
            }
          }}
          className="builder-icon-button cursor-pointer"
          title="Underline text formatting"
        >
          <Underline className="size-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-0.5 border-l border-black/10 pl-1">
        <button
          type="button"
          onClick={() => {
            if (selectedDomRef.current) {
              selectedDomRef.current.style.textAlign = "left";
            }
          }}
          className="builder-icon-button cursor-pointer"
          title="Align Left"
        >
          <AlignLeft className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (selectedDomRef.current) {
              selectedDomRef.current.style.textAlign = "center";
            }
          }}
          className="builder-icon-button cursor-pointer"
          title="Align Center"
        >
          <AlignCenter className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (selectedDomRef.current) {
              selectedDomRef.current.style.textAlign = "right";
            }
          }}
          className="builder-icon-button cursor-pointer"
          title="Align Right"
        >
          <AlignRight className="size-3.5" />
        </button>
      </div>

      <div className="relative border-l border-black/10 pl-1">
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="builder-icon-button flex items-center gap-1 cursor-pointer"
          title="Text / Accent Color"
        >
          <Palette className="size-3.5 text-emerald-600" />
          <span
            className="size-2.5 rounded-full border border-black/20"
            style={{ backgroundColor: activeAccent }}
          />
        </button>

        {showColorPicker && (
          <div className="absolute top-10 right-0 z-50 flex w-48 flex-col gap-2 rounded-2xl border border-black/15 bg-white p-3 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
              Color Palette
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {colorSwatches.map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={() => {
                    setCustomAccent(swatch.value);
                    if (selectedDomRef.current) {
                      selectedDomRef.current.style.color = swatch.value;
                    }
                    setShowColorPicker(false);
                  }}
                  className="size-6 rounded-full border border-black/20 shadow-xs transition hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: swatch.value }}
                  title={swatch.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-l border-black/10 pl-1">
        <button
          type="button"
          onClick={clearSelection}
          className="builder-icon-button text-red-600 hover:bg-red-50 hover:text-red-700"
          title="Close formatting bar"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
