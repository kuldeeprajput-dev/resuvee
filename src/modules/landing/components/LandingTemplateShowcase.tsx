"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ImageOff, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TemplateThumbnail, resumeTemplates } from "@/modules/resume";
import { cn } from "@/shared/lib/utils";

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
    count: resumeTemplates.filter((item) => item.audience === "fresher").length,
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
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const carouselRef = useRef<HTMLDivElement>(null);

  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Update items per page based on responsive breakpoints
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerPage(3);
      } else if (width >= 640) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(visibleTemplates.length / itemsPerPage));
  }, [visibleTemplates.length, itemsPerPage]);

  const goToPage = useCallback(
    (pageIndex: number) => {
      const carousel = carouselRef.current;
      if (!carousel || carousel.children.length === 0) return;

      const validPage = Math.max(0, Math.min(pageIndex, pageCount - 1));

      // Lock scroll tracking during programmatic scroll
      isProgrammaticScrollRef.current = true;
      setActivePage(validPage);

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      if (validPage === pageCount - 1) {
        // Last page: scroll smoothly to max right position
        carousel.scrollTo({
          left: carousel.scrollWidth - carousel.clientWidth,
          behavior: "smooth",
        });
      } else {
        const targetItemIndex = validPage * itemsPerPage;
        const targetElement = carousel.children[targetItemIndex] as HTMLElement;

        if (targetElement) {
          carousel.scrollTo({
            left: targetElement.offsetLeft - carousel.offsetLeft,
            behavior: "smooth",
          });
        }
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 450);
    },
    [pageCount, itemsPerPage]
  );

  const handleScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    const carousel = carouselRef.current;
    if (!carousel || carousel.children.length === 0) return;

    requestAnimationFrame(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (maxScroll <= 0) {
        setActivePage(0);
        return;
      }

      // If scrolled near max right edge, active page is the last page
      if (carousel.scrollLeft >= maxScroll - 15) {
        setActivePage(pageCount - 1);
        return;
      }

      const carouselLeft = carousel.getBoundingClientRect().left;
      let closestItemIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < carousel.children.length; i++) {
        const item = carousel.children[i] as HTMLElement;
        const itemLeft = item.getBoundingClientRect().left - carouselLeft;
        const distance = Math.abs(itemLeft);
        if (distance < minDistance) {
          minDistance = distance;
          closestItemIndex = i;
        }
      }

      const calculatedPage = Math.min(Math.floor(closestItemIndex / itemsPerPage), pageCount - 1);

      setActivePage((current) => (current !== calculatedPage ? calculatedPage : current));
    });
  }, [itemsPerPage, pageCount]);

  const selectFilter = (nextFilter: TemplateFilter) => {
    isProgrammaticScrollRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    setFilter(nextFilter);
    setActivePage(0);

    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 150);
  };

  return (
    <>
      <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none scrollbar-none sm:mx-0 sm:mb-8 sm:px-0 [&::-webkit-scrollbar]:hidden">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectFilter(item.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-200",
              filter === item.id
                ? "bg-(--brand-ink) text-white"
                : "border border-black/10 bg-white/75 text-(--brand-muted) hover:bg-white"
            )}
          >
            {item.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[9px]",
                filter === item.id ? "bg-white/12" : "bg-black/5"
              )}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="grid snap-x snap-mandatory grid-flow-col grid-rows-1 auto-cols-[82%] gap-3.5 overflow-x-auto pb-0 scroll-smooth items-start scrollbar-none sm:auto-cols-[calc((100%-1.25rem)/2)] sm:gap-5 sm:pb-5 sm:items-stretch lg:auto-cols-[calc((100%-2.5rem)/3)] [&::-webkit-scrollbar]:hidden"
      >
        {visibleTemplates.map((template, index) => (
          <Link
            key={template.id}
            href={
              template.audience === "fresher"
                ? `/builder?template=${template.id}&starter=fresher`
                : `/builder?template=${template.id}&starter=template`
            }
            className="group snap-start flex flex-col rounded-[20px] border border-black/8 bg-white/55 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-white sm:h-full sm:justify-between sm:rounded-[24px] sm:p-5 [content-visibility:auto] [contain-intrinsic-size:360px_480px]"
          >
            <div className="relative overflow-hidden rounded-xl bg-[#e9ece8] p-3 sm:rounded-2xl sm:p-8 md:p-10">
              <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.12em] text-black/55 shadow-sm sm:left-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-[9px]">
                {String(index + 1).padStart(2, "0")}
              </span>
              {template.popular && (
                <span className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-(--brand-lime) px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.08em] sm:right-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-[9px]">
                  <Sparkles className="size-2.5" />
                  Popular
                </span>
              )}
              <TemplateThumbnail
                template={template}
                showLabel
                className="mx-auto bg-white transition-transform duration-500 group-hover:scale-[1.025] group-hover:-rotate-1"
              />
            </div>

            <div className="flex flex-col px-1 pb-0.5 pt-3 sm:justify-between sm:flex-1 sm:pt-5">
              <div className="flex items-start justify-between gap-2.5 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0 sm:gap-2 sm:flex-wrap">
                    <h3 className="truncate text-base font-bold tracking-tight sm:text-xl">
                      {template.name}
                    </h3>
                    <span
                      className="size-2 shrink-0 rounded-full sm:size-2.5"
                      style={{ backgroundColor: template.accent }}
                    />
                  </div>
                  <p className="mt-0.5 truncate text-[11px] leading-4 text-(--brand-muted) sm:line-clamp-none sm:mt-1 sm:text-sm sm:leading-normal">
                    {template.suitableFor}
                  </p>
                </div>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-black/10 transition-colors group-hover:bg-(--brand-lime) sm:size-9">
                  <ArrowRight className="size-3.5 -rotate-45 transition-transform group-hover:rotate-0 sm:size-4" />
                </span>
              </div>

              <div className="mt-2.5 flex flex-nowrap items-center gap-1.5 overflow-hidden text-[8.5px] font-bold uppercase tracking-[0.08em] text-black/45 sm:mt-4 sm:flex-wrap sm:gap-2 sm:text-[9px]">
                <span className="inline-flex min-w-0 max-w-[120px] shrink items-center gap-1 truncate rounded-full bg-[#eff1ec] px-1.5 py-1 sm:max-w-none sm:shrink-0 sm:px-2 sm:py-1.5">
                  <Check className="size-2 shrink-0 text-[#4f7946] sm:size-2.5" />
                  <span className="truncate">{template.eyebrow}</span>
                </span>
                {!template.supportsPhoto && (
                  <span className="inline-flex min-w-0 shrink-0 items-center gap-1 rounded-full bg-[#eff1ec] px-1.5 py-1 sm:px-2 sm:py-1.5">
                    <ImageOff className="size-2 shrink-0 sm:size-2.5" />
                    <span>Photo-free</span>
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-2 hidden items-center gap-4 sm:flex">
        <button
          type="button"
          onClick={() => goToPage(activePage - 1)}
          disabled={activePage === 0}
          aria-label="Previous templates"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white transition-colors duration-200 hover:bg-(--brand-lime) disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft className="size-4" />
        </button>

        <div className="relative flex flex-1 items-center justify-center">
          <span className="absolute inset-x-0 h-px bg-black/15" />
          <div className="relative flex items-center gap-2 rounded-full bg-(--brand-canvas) px-4">
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToPage(index)}
                aria-label={`Show template page ${index + 1}`}
                aria-current={activePage === index ? "page" : undefined}
                className={cn(
                  "size-2.5 rounded-full border-2 border-(--brand-canvas) ring-1 ring-black/20 transition-all duration-200",
                  activePage === index
                    ? "scale-125 bg-(--brand-ink)"
                    : "bg-[#c6cbc4] hover:bg-(--brand-lime)"
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
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white transition-colors duration-200 hover:bg-(--brand-lime) disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </>
  );
}
