"use client";

import Link from "next/link";
import { ArrowRight, Check, ImageOff, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { TemplateThumbnail } from "@/components/resume/TemplateThumbnail";
import { resumeTemplates } from "@/lib/resume-data";
import { cn } from "@/lib/utils";

type TemplateFilter = "popular" | "all" | "fresher" | "photo-free";

const filters: {
  id: TemplateFilter;
  label: string;
  count: number;
}[] = [
  {
    id: "popular",
    label: "Most used",
    count: resumeTemplates.filter((item) => item.popular).length,
  },
  { id: "all", label: "All templates", count: resumeTemplates.length },
  {
    id: "fresher",
    label: "Fresher",
    count: resumeTemplates.filter((item) => item.audience === "fresher")
      .length,
  },
  {
    id: "photo-free",
    label: "Without photo",
    count: resumeTemplates.filter((item) => !item.supportsPhoto).length,
  },
];

export function LandingTemplateShowcase() {
  const [filter, setFilter] = useState<TemplateFilter>("popular");
  const visibleTemplates = useMemo(() => {
    if (filter === "popular") {
      return resumeTemplates.filter((item) => item.popular);
    }
    if (filter === "fresher") {
      return resumeTemplates.filter((item) => item.audience === "fresher");
    }
    if (filter === "photo-free") {
      return resumeTemplates.filter((item) => !item.supportsPhoto);
    }
    return resumeTemplates;
  }, [filter]);

  return (
    <>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition",
              filter === item.id
                ? "bg-[var(--brand-ink)] text-white"
                : "border border-black/10 bg-white/75 text-[var(--brand-muted)] hover:bg-white",
            )}
          >
            {item.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[9px]",
                filter === item.id ? "bg-white/12" : "bg-black/5",
              )}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTemplates.map((template, index) => (
          <Link
            key={template.id}
            href={
              template.audience === "fresher"
                ? `/builder?template=${template.id}&starter=fresher`
                : `/builder?template=${template.id}`
            }
            className="group rounded-[24px] border border-black/[0.08] bg-white/55 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(22,32,28,0.11)] sm:p-5"
          >
            <div className="relative overflow-hidden rounded-2xl bg-[#e9ece8] p-8 sm:p-10">
              <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-black/55 shadow-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              {template.popular && (
                <span className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-[var(--brand-lime)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em]">
                  <Sparkles className="size-2.5" />
                  Popular
                </span>
              )}
              <TemplateThumbnail
                template={template}
                showLabel
                className="mx-auto max-w-[235px] bg-white transition-transform duration-500 group-hover:scale-[1.025] group-hover:-rotate-1"
              />
            </div>

            <div className="px-1 pb-1 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold tracking-[-0.025em]">
                      {template.name}
                    </h3>
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: template.accent }}
                    />
                  </div>
                  <p className="mt-1 text-sm text-[var(--brand-muted)]">
                    {template.suitableFor}
                  </p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/10 transition-colors group-hover:bg-[var(--brand-lime)]">
                  <ArrowRight className="size-4 -rotate-45 transition-transform group-hover:rotate-0" />
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-[0.08em] text-black/45">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#eff1ec] px-2 py-1.5">
                  <Check className="size-2.5 text-[#4f7946]" />
                  {template.eyebrow}
                </span>
                {!template.supportsPhoto && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#eff1ec] px-2 py-1.5">
                    <ImageOff className="size-2.5" />
                    Photo-free
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
