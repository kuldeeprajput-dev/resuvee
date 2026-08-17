"use client";

import { useState, useRef } from "react";
import { Plus, Pencil, Check, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface DisplayLabelControlProps {
  currentValue?: string;
  defaultShortLabel: string;
  customLabel?: string;
  align?: "left" | "right";
  onSetLabel: (text: string | undefined) => void;
}

export function DisplayLabelControl({
  currentValue,
  defaultShortLabel,
  customLabel,
  align = "right",
  onSetLabel,
}: DisplayLabelControlProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(customLabel || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const isCustomized = Boolean(customLabel && customLabel.trim().length > 0);

  const handleOpen = () => {
    setDraft(customLabel || defaultShortLabel);
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed.length > 0) {
      onSetLabel(trimmed);
    } else {
      onSetLabel(undefined);
    }
    setOpen(false);
  };

  const handleClear = () => {
    onSetLabel(undefined);
    setDraft("");
    setOpen(false);
  };

  return (
    <div className="relative inline-flex items-center">
      {isCustomized ? (
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 shadow-2xs hover:bg-emerald-100 transition cursor-pointer"
          title={`Display text: "${customLabel}". Click to edit.`}
        >
          <span className="max-w-[100px] truncate">{customLabel}</span>
          <Pencil className="size-2.5 opacity-60 shrink-0" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1 rounded-lg border border-black/8 bg-black/4 px-2 py-0.5 text-[10px] font-semibold text-(--brand-muted) hover:bg-black/8 hover:text-(--brand-ink) transition cursor-pointer"
          title={`Customize how this appears on the resume (e.g. "${defaultShortLabel}")`}
        >
          <span>Display text</span>
          <Plus className="size-2.5 opacity-60" />
        </button>
      )}

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              handleSave();
            }}
          />
          <div
            className={cn(
              "absolute top-full mt-1.5 z-50 w-72 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-black/15 bg-white p-3.5 shadow-2xl space-y-2.5",
              align === "left" ? "left-0 sm:-left-2" : "right-0 sm:-right-2"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-(--brand-ink)">Custom Display Text</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-black/40 hover:bg-black/5 hover:text-black transition cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <p className="text-[10px] leading-relaxed text-(--brand-muted)">
              Enter custom text to show on the resume instead of the full link/value.
            </p>

            <div className="space-y-1.5">
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSave();
                  } else if (e.key === "Escape") {
                    setOpen(false);
                  }
                }}
                placeholder={`e.g. ${defaultShortLabel}`}
                className="h-8 w-full rounded-lg border border-black/15 bg-white px-2.5 text-xs text-(--brand-ink) outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
              />

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => setDraft(defaultShortLabel)}
                  className="rounded-md bg-black/5 px-2 py-0.5 text-[9.5px] font-semibold text-black/70 hover:bg-emerald-50 hover:text-emerald-800 transition cursor-pointer"
                >
                  {defaultShortLabel}
                </button>
                {currentValue && currentValue.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      const cleaned = currentValue.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
                      setDraft(cleaned);
                    }}
                    className="max-w-[140px] truncate rounded-md bg-black/5 px-2 py-0.5 text-[9.5px] font-semibold text-black/70 hover:bg-emerald-50 hover:text-emerald-800 transition cursor-pointer"
                    title={currentValue}
                  >
                    {currentValue.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-black/8">
              {isCustomized ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[10px] font-bold text-red-600 hover:text-red-700 transition cursor-pointer"
                >
                  Reset to full
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1 rounded-lg bg-[#047857] px-3 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-[#036046] transition cursor-pointer"
              >
                <Check className="size-3" />
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
