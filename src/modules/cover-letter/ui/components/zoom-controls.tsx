"use client";

import React from "react";
import { Check, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ZoomControlsProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setPan: (pan: { x: number; y: number }) => void;
  showPresetsMenu: boolean;
  setShowPresetsMenu: (value: boolean) => void;
  setShowThemeMenu: (value: boolean) => void;
}

const ZOOM_PRESETS = [50, 72, 85, 100, 125, 150];

export function ZoomControls({
  zoom,
  setZoom,
  setPan,
  showPresetsMenu,
  setShowPresetsMenu,
  setShowThemeMenu,
}: ZoomControlsProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => setZoom((z) => Math.max(30, z - 10))}
        className="builder-icon-button cursor-pointer"
        title="Zoom Out"
      >
        <ZoomOut className="size-3.5" />
      </button>

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

      <button
        type="button"
        onClick={() => setZoom((z) => Math.min(200, z + 10))}
        className="builder-icon-button cursor-pointer"
        title="Zoom In"
      >
        <ZoomIn className="size-3.5" />
      </button>

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
    </>
  );
}
