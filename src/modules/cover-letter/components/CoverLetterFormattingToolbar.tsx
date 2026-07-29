"use client";

import React from "react";
import {
  Bold,
  Italic,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Trash2,
  X,
  Pipette,
  CaseSensitive,
  RemoveFormatting,
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
  const handleFontSize = (delta: number) => {
    if (!selectedDomRef.current) return;
    const currentSize = window.getComputedStyle(selectedDomRef.current).fontSize;
    const currentPx = parseFloat(currentSize) || 14;
    const newPx = Math.max(8, Math.min(48, currentPx + delta));
    selectedDomRef.current.style.fontSize = `${newPx}px`;
  };

  const handleCaseTransform = () => {
    if (!selectedDomRef.current) return;
    const isUpper = selectedDomRef.current.style.textTransform === "uppercase";
    const nextCase = isUpper ? "none" : "uppercase";
    selectedDomRef.current.style.textTransform = nextCase;
  };

  const handleClearFormatting = () => {
    if (!selectedDomRef.current) return;
    selectedDomRef.current.classList.remove("font-bold", "italic", "underline");
    selectedDomRef.current.style.fontSize = "";
    selectedDomRef.current.style.color = "";
    selectedDomRef.current.style.textAlign = "";
    selectedDomRef.current.style.textTransform = "";
  };

  const handleTrashField = () => {
    setInlineText("");
    update(selectedField, "");
  };

  return (
    <div
      ref={toolbarRef}
      onClick={(e) => e.stopPropagation()}
      className="no-print absolute z-50 flex flex-wrap items-center gap-1.5 rounded-full border border-black/15 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95 overflow-visible"
      style={{
        top: `${toolbarPos.top}px`,
        left: `${toolbarPos.left}px`,
      }}
    >
      {/* AI Icon & Inline Text Input Pill Container */}
      <div className="flex items-center gap-1.5 rounded-full bg-black/5 px-2 py-1 shrink-0">
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
          className="flex size-6 items-center justify-center rounded-full hover:bg-black/10 transition cursor-pointer"
          title="AI Refine Field Text"
        >
          <Sparkles className="size-3.5 text-[#059669]" />
        </button>
        <input
          type="text"
          value={inlineText}
          onChange={(e) => {
            setInlineText(e.target.value);
            update(selectedField, e.target.value);
          }}
          className="h-7 w-36 sm:w-48 rounded-xl bg-white px-2.5 text-xs font-bold text-[var(--brand-ink)] shadow-xs outline-none focus:ring-1 focus:ring-[#059669]"
          placeholder="Edit text inline..."
        />
      </div>

      <span className="h-4 w-px bg-black/10 mx-0.5 shrink-0" />

      {/* A- / A+ Font Size Control Pill */}
      <div className="flex items-center rounded-xl bg-black/5 p-0.5 shrink-0">
        <button
          type="button"
          onClick={() => handleFontSize(-1)}
          className="flex h-7 px-2 items-center justify-center rounded-lg text-xs font-bold text-[var(--brand-ink)] hover:bg-white hover:shadow-xs transition cursor-pointer"
          title="Decrease font size"
        >
          A-
        </button>
        <button
          type="button"
          onClick={() => handleFontSize(1)}
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
          onClick={handleCaseTransform}
          className="builder-icon-button cursor-pointer"
          title="Toggle UPPERCASE / Normal Case (AB)"
        >
          <CaseSensitive className="size-4" />
        </button>

        <button
          type="button"
          onClick={handleClearFormatting}
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

      <span className="h-4 w-px bg-black/10 mx-0.5 shrink-0" />

      {/* Green Paint Palette & Trash Icon Beside It */}
      <div className="relative flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="builder-icon-button cursor-pointer"
          title="Text / Accent Color"
        >
          <Palette className="size-3.5 text-[#059669]" />
        </button>

        <button
          type="button"
          onClick={handleTrashField}
          className="builder-icon-button text-red-600 hover:bg-red-50 cursor-pointer"
          title="Clear field text"
        >
          <Trash2 className="size-3.5" />
        </button>

        {showColorPicker && (
          <div className="absolute top-12 right-0 z-[100] flex items-center gap-2 rounded-full border border-black/15 bg-white p-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-auto">
            {/* Color Wheel Picker */}
            <label
              className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/20 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-500 via-green-500 via-blue-500 to-red-500 shadow-xs transition hover:scale-105"
              title="Pick Custom Color"
            >
              <input
                type="color"
                value={activeAccent}
                onChange={(e) => {
                  setCustomAccent(e.target.value);
                  if (selectedDomRef.current) {
                    selectedDomRef.current.style.color = e.target.value;
                  }
                }}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
              />
              <Pipette className="size-3 text-white drop-shadow-md" />
            </label>

            {/* Hex Input */}
            <input
              type="text"
              value={activeAccent}
              onChange={(e) => {
                setCustomAccent(e.target.value);
                if (selectedDomRef.current) {
                  selectedDomRef.current.style.color = e.target.value;
                }
              }}
              placeholder="#243d36"
              className="w-16 h-7 rounded-xl border border-black/15 bg-black/5 px-2 text-[10px] font-mono font-bold text-[var(--brand-ink)] outline-none focus:bg-white"
            />

            <span className="h-4 w-px bg-black/15 mx-0.5 shrink-0" />

            {/* Swatches Side-by-Side */}
            <div className="flex items-center gap-1.5">
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
