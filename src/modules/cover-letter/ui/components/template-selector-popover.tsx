"use client";

import { Check, LayoutTemplate } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { CoverLetterTheme, ThemeOption } from "../../types/cover-letter";

interface TemplateSelectorPopoverProps {
  showTemplatesMenu: boolean;
  setShowTemplatesMenu: (show: boolean) => void;
  setShowDesignMenu: (show: boolean) => void;
  theme: CoverLetterTheme;
  setTheme: (theme: CoverLetterTheme) => void;
  themes: ThemeOption[];
}

export function TemplateSelectorPopover({
  showTemplatesMenu,
  setShowTemplatesMenu,
  setShowDesignMenu,
  theme,
  setTheme,
  themes,
}: TemplateSelectorPopoverProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setShowTemplatesMenu(!showTemplatesMenu);
          setShowDesignMenu(false);
        }}
        className={cn(
          "group flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold shadow-xs transition cursor-pointer",
          showTemplatesMenu
            ? "border-[#10b981] bg-[#ecfdf5] text-[#047857] ring-2 ring-emerald-500/30"
            : "border-black/15 bg-white text-[var(--brand-ink)] hover:border-[#10b981] hover:bg-[#ecfdf5] hover:text-[#047857]"
        )}
      >
        <LayoutTemplate
          className={cn(
            "size-3.5 transition-colors",
            showTemplatesMenu ? "text-[#059669]" : "text-[var(--brand-muted)] group-hover:text-[#059669]"
          )}
        />
        <span>Templates</span>
      </button>

      {showTemplatesMenu && (
        <div className="absolute top-10 right-0 z-50 w-64 rounded-2xl border border-black/15 bg-white p-2.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)] border-b border-black/10 mb-1.5">
            Letter Templates
          </p>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTheme(t.id);
                setShowTemplatesMenu(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition mb-1 cursor-pointer",
                theme === t.id
                  ? "bg-emerald-50 text-emerald-950 font-bold border border-emerald-500/30"
                  : "hover:bg-black/5 text-[var(--brand-ink)]"
              )}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: t.accent }}
                  />
                  <span className="text-xs font-bold">{t.name}</span>
                </div>
                <span className="text-[10px] text-[var(--brand-muted)] font-normal block pl-4">
                  {t.description}
                </span>
              </div>
              {theme === t.id && <Check className="size-3.5 text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
