"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { ResumeTemplate, ResumeTemplateId } from "../../types/resume";
import { resumeTemplates } from "../../constants/resume-data";
import { TemplateThumbnail } from "./template-thumbnail";

// ─── Template Picker Modal ────────────────────────────────────────────────────

interface TemplatePickerPanelProps {
  templateId: ResumeTemplateId;
  templateFilter: "all" | "popular" | "fresher" | "professional";
  onSelectTemplate: (id: ResumeTemplateId) => void;
  onFilterChange: (filter: "all" | "popular" | "fresher" | "professional") => void;
  onClose: () => void;
}

export function TemplatePickerPanel({
  templateId,
  templateFilter,
  onSelectTemplate,
  onFilterChange,
  onClose,
}: TemplatePickerPanelProps) {
  const filteredTemplates = resumeTemplates.filter((item) => {
    if (templateFilter === "popular") return item.popular;
    if (templateFilter === "fresher") return item.audience === "fresher";
    if (templateFilter === "professional") return item.audience !== "fresher";
    return true;
  });

  return (
    <div className="no-print fixed inset-0 z-300 flex items-end justify-center bg-black/35 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="max-h-[92dvh] w-full max-w-6xl overflow-y-auto rounded-t-[24px] bg-(--brand-paper) p-5 shadow-2xl sm:rounded-[24px] sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c65b38]">
              Original collection
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-[-0.035em]">Choose a template</h2>
            <p className="mt-1 text-sm text-(--brand-muted)">
              Your content stays. Select any template layout for your resume.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="builder-icon-button"
            aria-label="Close templates"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {(
            [
              ["popular", "Most used"],
              ["all", `All ${resumeTemplates.length}`],
              ["fresher", "Fresher"],
              ["professional", "Professional"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onFilterChange(id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-[11px] font-bold transition",
                templateFilter === id
                  ? "bg-(--brand-ink) text-white"
                  : "border border-black/10 bg-white text-(--brand-muted)"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {filteredTemplates.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTemplate(item.id)}
              className={cn(
                "group rounded-2xl border p-2 text-left transition hover:-translate-y-1",
                templateId === item.id
                  ? "border-[#315f45] bg-[#edf4ef] ring-2 ring-[#315f45]/10"
                  : "border-black/10 bg-white hover:shadow-lg"
              )}
            >
              <TemplateThumbnail template={item} size="picker" className="mx-auto shadow-md" />
              <div className="flex items-center justify-between gap-1 px-1 pb-1 pt-2.5">
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold">{item.name}</p>
                  <p className="truncate text-[9px] text-(--brand-muted)">
                    {item.layout === "sidebar" ? "Sidebar" : "Single column"}
                    {" · "}
                    {item.supportsPhoto ? "Photo" : "Photo-free"}
                  </p>
                </div>
                {templateId === item.id && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-(--brand-lime)">
                    <Check className="size-3" />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Start Fresh Confirmation Modal ──────────────────────────────────────────

interface StartFreshModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function StartFreshModal({ onConfirm, onCancel }: StartFreshModalProps) {
  return (
    <div className="no-print fixed inset-0 z-300 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-black/15 bg-white p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
            <RotateCcw className="size-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-(--brand-ink)">Start fresh?</h3>
            <p className="text-xs text-(--brand-muted)">Clear all text and start blank</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-(--brand-muted) mb-6">
          All current resume sections and details will be cleared to a completely blank template.
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
