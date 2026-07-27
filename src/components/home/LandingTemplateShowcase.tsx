"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImageOff,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [filter, setFilter] = useState<TemplateFilter>("all");
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const updatePages = () => {
      const count = Math.max(
        1,
        Math.ceil(carousel.scrollWidth / carousel.clientWidth),
      );
      setPageCount(count);
      setActivePage((current) => Math.min(current, count - 1));
    };
    const updateActivePage = () => {
      const page = Math.round(carousel.scrollLeft / carousel.clientWidth);
      setActivePage(Math.min(page, pageCount - 1));
    };
    const observer = new ResizeObserver(updatePages);

    updatePages();
    carousel.addEventListener("scroll", updateActivePage, {
      passive: true,
    });
    observer.observe(carousel);

    return () => {
      carousel.removeEventListener("scroll", updateActivePage);
      observer.disconnect();
    };
  }, [pageCount, visibleTemplates]);

  const goToPage = (page: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const nextPage = Math.max(0, Math.min(page, pageCount - 1));
    carousel.scrollTo({
      left: nextPage * carousel.clientWidth,
      behavior: "smooth",
    });
    setActivePage(nextPage);
  };

  const selectFilter = (nextFilter: TemplateFilter) => {
    setFilter(nextFilter);
    setActivePage(0);
    carouselRef.current?.scrollTo({ left: 0 });
  };

  return (
    <>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectFilter(item.id)}
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

      <div
        ref={carouselRef}
        className="grid snap-x snap-mandatory grid-flow-col grid-rows-2 auto-cols-[86%] gap-5 overflow-x-auto pb-5 scroll-smooth [scrollbar-width:none] sm:auto-cols-[48%] lg:auto-cols-[31.8%] [&::-webkit-scrollbar]:hidden"
      >
        {visibleTemplates.map((template, index) => (
          <Link
            key={template.id}
            href={
              template.audience === "fresher"
                ? `/builder?template=${template.id}&starter=fresher`
                : `/builder?template=${template.id}`
            }
            className="group snap-start rounded-[24px] border border-black/[0.08] bg-white/55 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(22,32,28,0.11)] sm:p-5"
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

      <div className="mt-2 flex items-center gap-4">
        <button
          type="button"
          onClick={() => goToPage(activePage - 1)}
          disabled={activePage === 0}
          aria-label="Previous templates"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white transition hover:bg-[var(--brand-lime)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft className="size-4" />
        </button>

        <div className="relative flex flex-1 items-center justify-center">
          <span className="absolute inset-x-0 h-px bg-black/15" />
          <div className="relative flex items-center gap-2 rounded-full bg-[var(--brand-canvas)] px-4">
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToPage(index)}
                aria-label={`Show template page ${index + 1}`}
                aria-current={activePage === index ? "page" : undefined}
                className={cn(
                  "size-2.5 rounded-full border-2 border-[var(--brand-canvas)] ring-1 ring-black/20 transition",
                  activePage === index
                    ? "scale-125 bg-[var(--brand-ink)]"
                    : "bg-[#c6cbc4] hover:bg-[var(--brand-lime)]",
                )}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => goToPage(activePage + 1)}
          disabled={activePage === pageCount - 1}
          aria-label="Next templates"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white transition hover:bg-[var(--brand-lime)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </>
  );
}
