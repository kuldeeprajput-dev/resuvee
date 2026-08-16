"use client";

import React from "react";
import { FilePlus } from "lucide-react";

interface CoverLetterStartFreshModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function CoverLetterStartFreshModal({
  onCancel,
  onConfirm,
}: CoverLetterStartFreshModalProps) {
  return (
    <div className="no-print fixed inset-0 z-200 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-black/15 bg-white p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
            <FilePlus className="size-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-(--brand-ink)">Start fresh?</h3>
            <p className="text-xs text-(--brand-muted)">Clear all text and start blank</p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-(--brand-muted) mb-6">
          All current letter sections and details will be cleared to a completely blank template.
          Are you sure you want to start fresh?
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 rounded-xl border border-black/15 bg-white px-4 text-xs font-bold text-(--brand-ink) hover:bg-black/5 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-9 rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition cursor-pointer"
          >
            Start fresh
          </button>
        </div>
      </div>
    </div>
  );
}
