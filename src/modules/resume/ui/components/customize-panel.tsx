"use client";

import { useState, useEffect } from "react";
import { Check, Palette, Pipette, RotateCcw, Type, UserRound, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export interface ResumeStyle {
  accent: string;
  font: "template" | "sans" | "serif" | "mono";
  showPhoto: boolean;
  pagePadding?: "compact" | "normal" | "spacious";
  sectionSpacing?: "compact" | "normal" | "spacious";
  fontSizeScale?: 0.9 | 1.0 | 1.1;
  lineHeight?: "tight" | "normal" | "relaxed";
}

interface CustomizePanelProps {
  style: ResumeStyle;
  templateAccent: string;
  supportsPhoto: boolean;
  onChange: (style: ResumeStyle) => void;
  onClose: () => void;
}

export const defaultResumeStyle: ResumeStyle = {
  accent: "#000000",
  font: "template",
  showPhoto: true,
  pagePadding: "normal",
  sectionSpacing: "normal",
  fontSizeScale: 1.0,
  lineHeight: "normal",
};

const colors = [
  { name: "Black", value: "#000000" },
  { name: "Forest", value: "#28785b" },
  { name: "Ink", value: "#243934" },
  { name: "Ocean", value: "#2f6fa3" },
  { name: "Navy", value: "#203b57" },
  { name: "Plum", value: "#6c4c70" },
];

const fonts: {
  id: ResumeStyle["font"];
  name: string;
  sampleClass: string;
  description: string;
}[] = [
  {
    id: "template",
    name: "Template",
    sampleClass: "font-sans",
    description: "Designed pairing",
  },
  {
    id: "sans",
    name: "Modern",
    sampleClass: "font-sans",
    description: "Clean and direct",
  },
  {
    id: "serif",
    name: "Editorial",
    sampleClass: "font-serif",
    description: "Classic and formal",
  },
  {
    id: "mono",
    name: "Technical",
    sampleClass: "font-mono",
    description: "Structured and precise",
  },
];

export function resumeFontClass(font: ResumeStyle["font"]) {
  if (font === "sans") return "font-sans";
  if (font === "serif") return "font-serif";
  if (font === "mono") return "font-mono";
  return undefined;
}

export function CustomizePanel({
  style,
  templateAccent,
  supportsPhoto,
  onChange,
  onClose,
}: CustomizePanelProps) {
  const activeAccent = style.accent || templateAccent;
  const [panelWidth, setPanelWidth] = useState(440);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      const minW = Math.min(440, window.innerWidth);
      const maxW = Math.min(850, window.innerWidth - 80);
      const clampedWidth = Math.min(Math.max(newWidth, minW), maxW);
      setPanelWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="no-print fixed inset-0 z-[300] flex justify-end bg-black/15">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close customization"
        className="absolute inset-0 cursor-default"
      />
      <aside
        style={{ width: `${panelWidth}px` }}
        className="relative flex h-full w-full min-w-[320px] sm:min-w-[440px] max-w-[95vw] flex-col overflow-hidden bg-[#f7f6f1] shadow-2xl"
      >
        <div
          onMouseDown={handleMouseDown}
          className="group absolute left-0 top-0 bottom-0 z-50 flex w-3 cursor-col-resize items-center justify-center transition-colors hover:bg-emerald-500/20"
          title="Drag left/right to adjust panel width"
        >
          <div className="h-12 w-1 rounded-full bg-black/20 group-hover:bg-emerald-600 transition-colors" />
        </div>
        <header className="flex items-start justify-between border-b border-black/10 bg-white px-5 py-5 sm:px-7">
          <div className="flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-[var(--brand-ink)] text-[var(--brand-lime)]">
              <Palette className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#bd593a]">
                Design controls
              </p>
              <h2 className="text-xl font-bold tracking-[-0.035em]">Make it feel like you</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customization"
            className="builder-icon-button"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          <section>
            <div className="flex items-center gap-2">
              <Palette className="size-4 text-[#4d7141]" />
              <h3 className="text-sm font-bold">Accent color</h3>
            </div>
            <p className="mt-1 text-xs leading-5 text-[var(--brand-muted)]">
              Keep contrast strong for a professional, readable document.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {/* Custom Color Wheel Swatch on Left Side */}
              <label
                className={cn(
                  "relative flex size-10 cursor-pointer items-center justify-center rounded-full border-4 border-white shadow-sm ring-offset-2 transition hover:scale-105 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-500 via-green-500 via-blue-500 to-red-500",
                  !colors.some((c) => c.value.toLowerCase() === activeAccent.toLowerCase()) &&
                    "ring-2 ring-black/65"
                )}
                title="Choose custom color"
              >
                <input
                  type="color"
                  value={activeAccent.startsWith("#") ? activeAccent : "#28785b"}
                  onChange={(e) => onChange({ ...style, accent: e.target.value })}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
                <Pipette className="size-4 text-white drop-shadow-md" />
              </label>

              {/* Custom Hex Color Code Input */}
              <div className="flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-1.5 shadow-xs">
                <span className="text-xs font-bold text-[var(--brand-muted)]">Hex</span>
                <input
                  type="text"
                  value={style.accent}
                  onChange={(e) => onChange({ ...style, accent: e.target.value })}
                  placeholder={templateAccent || "#28785b"}
                  className="w-20 bg-transparent text-xs font-mono font-bold text-[var(--brand-ink)] focus:outline-none"
                />
              </div>

              <span className="h-6 w-px bg-black/15 mx-1" />

              {/* Preset Color Swatches */}
              {colors.map((color) => {
                const selected = activeAccent.toLowerCase() === color.value.toLowerCase();
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => onChange({ ...style, accent: color.value })}
                    title={color.name}
                    aria-label={`Use ${color.name} accent`}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full border-4 border-white shadow-sm ring-offset-2 transition hover:scale-105",
                      selected && "ring-2 ring-black/65"
                    )}
                    style={{ backgroundColor: color.value }}
                  >
                    {selected && <Check className="size-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-8 border-t border-black/10 pt-7">
            <div className="flex items-center gap-2">
              <Type className="size-4 text-[#4d7141]" />
              <h3 className="text-sm font-bold">Typography</h3>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {fonts.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => onChange({ ...style, font: font.id })}
                  className={cn(
                    "rounded-2xl border bg-white p-4 text-left transition",
                    style.font === font.id
                      ? "border-[#537c45] ring-2 ring-[#8baa54]/15"
                      : "border-black/10 hover:border-black/25"
                  )}
                >
                  <span className={cn("block text-2xl leading-none", font.sampleClass)}>Aa</span>
                  <span className="mt-3 block text-xs font-bold">{font.name}</span>
                  <span className="mt-1 block text-[10px] text-[var(--brand-muted)]">
                    {font.description}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {supportsPhoto && (
            <section className="mt-8 border-t border-black/10 pt-7">
              <div className="flex items-center gap-2">
                <UserRound className="size-4 text-[#4d7141]" />
                <h3 className="text-sm font-bold">Profile photo</h3>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={style.showPhoto}
                onClick={() => onChange({ ...style, showPhoto: !style.showPhoto })}
                className="mt-4 flex w-full items-center justify-between rounded-2xl border border-black/10 bg-white p-4 text-left"
              >
                <span>
                  <span className="block text-xs font-bold">Show photo when supported</span>
                  <span className="mt-1 block text-[10px] text-[var(--brand-muted)]">
                    Some regions and roles prefer a photo-free resume.
                  </span>
                </span>
                <span
                  className={cn(
                    "flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition",
                    style.showPhoto ? "bg-[#668d49]" : "bg-black/15"
                  )}
                >
                  <span
                    className={cn(
                      "size-5 rounded-full bg-white shadow-sm transition",
                      style.showPhoto && "translate-x-5"
                    )}
                  />
                </span>
              </button>
            </section>
          )}
        </div>

        <footer className="flex gap-2 border-t border-black/10 bg-white px-5 py-4 sm:px-7">
          <Button
            type="button"
            variant="outline"
            onClick={() => onChange(defaultResumeStyle)}
            className="h-11 rounded-xl border-black/10 px-4 font-bold"
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-xl bg-[var(--brand-ink)] font-bold text-white"
          >
            Apply design
          </Button>
        </footer>
      </aside>
    </div>
  );
}
