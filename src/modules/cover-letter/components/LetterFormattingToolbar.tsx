"use client";

import React from "react";
import {
  Edit3,
  AArrowDown,
  AArrowUp,
  Bold,
  Italic,
  CaseUpper,
  RemoveFormatting,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Pipette,
  X,
} from "lucide-react";
import type { CoverLetterData, ColorSwatch } from "../types/cover-letter";

interface LetterFormattingToolbarProps {
  toolbarRef: React.RefObject<HTMLDivElement | null>;
  toolbarPos: { top: number; left: number };
  selectedField: keyof CoverLetterData;
  inlineText: string;
  setInlineText: (val: string) => void;
  update: (field: keyof CoverLetterData, value: string) => void;
  selectedDomRef: React.RefObject<HTMLElement | null>;
  showColorPicker: boolean;
  setShowColorPicker: (val: boolean) => void;
  activeAccent: string;
  setCustomAccent: (color: string) => void;
  colorSwatches: ColorSwatch[];
  clearSelection: () => void;
}

export function LetterFormattingToolbar({
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
}: LetterFormattingToolbarProps) {
  return (
    <div
      ref={toolbarRef}
      onClick={(e) => e.stopPropagation()}
      className="no-print absolute z-50 flex max-w-[calc(100%-24px)] flex-nowrap items-center gap-1 overflow-x-auto rounded-2xl border border-black/15 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md transition-all duration-150 animate-in fade-in zoom-in-95 scrollbar-none"
      style={{
        top: `${toolbarPos.top}px`,
        left: `${toolbarPos.left}px`,
      }}
    >
      {/* Real-Time Inline Input */}
      <div className="flex items-center gap-1 rounded-xl bg-black/5 px-2 py-1 shrink-0">
        <Edit3 className="size-3.5 text-emerald-700 shrink-0" />
        <input
          type="text"
          value={inlineText}
          onChange={(e) => {
            setInlineText(e.target.value);
            update(selectedField, e.target.value);
          }}
          className="w-32 text-xs font-bold text-[var(--brand-ink)] bg-transparent outline-none sm:w-44"
          placeholder="Edit text..."
        />
      </div>

      <span className="h-4 w-px bg-black/10 mx-0.5 shrink-0" />

      {/* Decrease Font Size */}
      <button
        type="button"
        onClick={() => {
          if (!selectedDomRef.current) return;
          const curr = parseFloat(window.getComputedStyle(selectedDomRef.current).fontSize);
          selectedDomRef.current.style.fontSize = `${Math.max(8, curr - 1)}px`;
        }}
        className="builder-icon-button shrink-0"
        title="Decrease Font Size"
      >
        <AArrowDown className="size-3.5" />
      </button>

      {/* Increase Font Size */}
      <button
        type="button"
        onClick={() => {
          if (!selectedDomRef.current) return;
          const curr = parseFloat(window.getComputedStyle(selectedDomRef.current).fontSize);
          selectedDomRef.current.style.fontSize = `${curr + 1}px`;
        }}
        className="builder-icon-button shrink-0"
        title="Increase Font Size"
      >
        <AArrowUp className="size-3.5" />
      </button>

      {/* Bold Toggle */}
      <button
        type="button"
        onClick={() => {
          if (!selectedDomRef.current) return;
          const isBold = selectedDomRef.current.style.fontWeight === "bold" || selectedDomRef.current.style.fontWeight === "700";
          selectedDomRef.current.style.fontWeight = isBold ? "normal" : "bold";
        }}
        className="builder-icon-button shrink-0"
        title="Toggle Bold"
      >
        <Bold className="size-3.5" />
      </button>

      {/* Italic Toggle */}
      <button
        type="button"
        onClick={() => {
          if (!selectedDomRef.current) return;
          const isItalic = selectedDomRef.current.style.fontStyle === "italic";
          selectedDomRef.current.style.fontStyle = isItalic ? "normal" : "italic";
        }}
        className="builder-icon-button shrink-0"
        title="Toggle Italic"
      >
        <Italic className="size-3.5" />
      </button>

      {/* Case Transformer */}
      <button
        type="button"
        onClick={() => {
          if (!selectedDomRef.current) return;
          const currCase = selectedDomRef.current.style.textTransform;
          if (!currCase || currCase === "none") selectedDomRef.current.style.textTransform = "uppercase";
          else if (currCase === "uppercase") selectedDomRef.current.style.textTransform = "capitalize";
          else if (currCase === "capitalize") selectedDomRef.current.style.textTransform = "lowercase";
          else selectedDomRef.current.style.textTransform = "none";
        }}
        className="builder-icon-button shrink-0"
        title="Cycle Text Case (UPPERCASE / Capitalize / lowercase / normal)"
      >
        <CaseUpper className="size-3.5" />
      </button>

      {/* Reset Formatting */}
      <button
        type="button"
        onClick={() => {
          if (!selectedDomRef.current) return;
          selectedDomRef.current.style.fontSize = "";
          selectedDomRef.current.style.fontWeight = "";
          selectedDomRef.current.style.fontStyle = "";
          selectedDomRef.current.style.textTransform = "";
          selectedDomRef.current.style.color = "";
          selectedDomRef.current.style.textAlign = "";
        }}
        className="builder-icon-button shrink-0"
        title="Reset Element Formatting"
      >
        <RemoveFormatting className="size-3.5 text-red-500" />
      </button>

      <span className="h-4 w-px bg-black/10 mx-0.5 shrink-0" />

      {/* Align Left */}
      <button
        type="button"
        onClick={() => {
          if (selectedDomRef.current) selectedDomRef.current.style.textAlign = "left";
        }}
        className="builder-icon-button shrink-0"
        title="Align Left"
      >
        <AlignLeft className="size-3.5" />
      </button>

      {/* Align Center */}
      <button
        type="button"
        onClick={() => {
          if (selectedDomRef.current) selectedDomRef.current.style.textAlign = "center";
        }}
        className="builder-icon-button shrink-0"
        title="Align Center"
      >
        <AlignCenter className="size-3.5" />
      </button>

      {/* Align Right */}
      <button
        type="button"
        onClick={() => {
          if (selectedDomRef.current) selectedDomRef.current.style.textAlign = "right";
        }}
        className="builder-icon-button shrink-0"
        title="Align Right"
      >
        <AlignRight className="size-3.5" />
      </button>

      <span className="h-4 w-px bg-black/10 mx-0.5 shrink-0" />

      {/* Color Swatch Picker */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="builder-icon-button"
          title="Text / Accent Color"
        >
          <Palette className="size-3.5 text-emerald-600" />
        </button>

        {showColorPicker && (
          <div className="absolute top-10 right-0 sm:left-0 z-50 flex items-center gap-2 rounded-2xl border border-black/15 bg-white p-2.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 min-w-[240px] max-w-[calc(100vw-32px)] overflow-x-auto">
            <label
              className="relative flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/20 shadow-xs transition hover:scale-110 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-500 via-green-500 via-blue-500 to-red-500"
              title="Pick Custom Color"
            >
              <input
                type="color"
                value={activeAccent}
                onChange={(e) => {
                  const val = e.target.value;
                  if (selectedDomRef.current) selectedDomRef.current.style.color = val;
                  setCustomAccent(val);
                }}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
              />
              <Pipette className="size-3 text-white drop-shadow-md" />
            </label>

            {colorSwatches.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => {
                  if (selectedDomRef.current)
                    selectedDomRef.current.style.color = color.value;
                  setCustomAccent(color.value);
                  setShowColorPicker(false);
                }}
                className="size-5 rounded-full border border-black/10 transition hover:scale-110 shrink-0"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Close Toolbar */}
      <button type="button" onClick={clearSelection} className="builder-icon-button shrink-0">
        <X className="size-3.5" />
      </button>
    </div>
  );
}
