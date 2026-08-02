"use client";

import { Check, Grid } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { CanvasTheme } from "../../types/cover-letter";

interface CanvasThemeSelectorProps {
  canvasTheme: CanvasTheme;
  setCanvasTheme: (theme: CanvasTheme) => void;
  showThemeMenu: boolean;
  setShowThemeMenu: (value: boolean) => void;
  setShowPresetsMenu: (value: boolean) => void;
}

export function CanvasThemeSelector({
  canvasTheme,
  setCanvasTheme,
  showThemeMenu,
  setShowThemeMenu,
  setShowPresetsMenu,
}: CanvasThemeSelectorProps) {
  return (
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
  );
}
