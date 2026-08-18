"use client";

import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ResumeData, ResumeTemplate } from "../../types/resume";
import { cn } from "@/shared/lib/utils";
import { ResumePreview } from "./resume-preview";
import {
  activeAtoms,
  dataForPage,
  itemElementsForSection,
  containerForHeading,
  mergeAtoms,
  prepareContinuationSheet,
  ResumeContinuationPage,
  sectionFromHeading,
  sectionsForAtoms,
  type PageAtom,
  type PageSection,
} from "./resume-continuation-sheet";

interface PaginatedResumePreviewProps {
  data: ResumeData;
  template: ResumeTemplate;
  className?: string;
  showPhoto?: boolean;
  pagePadding?: "compact" | "normal" | "spacious";
  sectionSpacing?: "compact" | "normal" | "spacious";
  fontSizeScale?: number;
  lineHeight?: "tight" | "normal" | "relaxed";
}

const MAX_PAGES = 6;
const PAGE_BOTTOM_GUARD = 14;

function PaginatedResumePreviewInner({
  data,
  template,
  className,
  showPhoto,
  pagePadding,
  sectionSpacing,
  fontSizeScale,
  lineHeight,
}: PaginatedResumePreviewProps) {
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const atoms = useMemo(() => activeAtoms(data, template), [data, template]);
  const [pages, setPages] = useState<PageAtom[][]>(() => [atoms]);
  const pagesKey = pages.map((page) => page.map((atom) => atom.key).join(",")).join("|");

  const measurePages = useCallback(() => {
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
      const pageRoot = pageRefs.current[pageIndex];
      const sheet = prepareContinuationSheet(
        pageRoot,
        pageIndex,
        pages.length,
        data.basics.fullName,
        template.accent,
        template.renderer === "analyst"
      );
      if (!sheet) continue;

      const sheetRect = sheet.getBoundingClientRect();
      const scale = sheet.offsetHeight > 0 ? sheetRect.height / sheet.offsetHeight : 1;
      const safeBottom = sheetRect.bottom - PAGE_BOTTOM_GUARD * scale;
      const internationalSidebar =
        template.renderer === "meridian" && pageIndex === 0
          ? sheet.querySelector<HTMLElement>("aside")
          : null;
      const pinnedSidebarSections =
        internationalSidebar && internationalSidebar.getBoundingClientRect().bottom <= safeBottom
          ? new Set<PageSection>(["skills", "certifications", "education"])
          : null;
      const measuredSections = Array.from(sheet.querySelectorAll<HTMLElement>("h2"))
        .map((heading) => {
          const key = sectionFromHeading(heading.textContent ?? "");
          const element = containerForHeading(heading);
          return key && element ? { key, element } : null;
        })
        .filter((item): item is { key: PageSection; element: HTMLElement } => Boolean(item));

      const overflowing = new Set(
        measuredSections
          .filter(({ element }) => element.getBoundingClientRect().bottom > safeBottom)
          .map(({ key }) => key)
      );

      if (!overflowing.size && sheet.scrollHeight <= sheet.clientHeight + 1) continue;

      const currentPage = pages[pageIndex];
      const movingKeys = new Set<string>();

      for (const { key: section, element } of measuredSections) {
        // The International template has a dedicated supporting-detail rail.
        // Keep that rail populated while it fits; only the main column should
        // drive page creation in this state.
        if (pinnedSidebarSections?.has(section)) continue;
        if (!overflowing.has(section)) continue;

        const sectionAtoms = currentPage.filter((atom) => atom.section === section);
        if (!sectionAtoms.length) continue;

        const itemElements = itemElementsForSection(element, section);
        const firstOverflowingItem = itemElements.findIndex(
          (item) => item.getBoundingClientRect().bottom > safeBottom
        );

        if (firstOverflowingItem >= 0 && itemElements.length === sectionAtoms.length) {
          // Move one trailing entry per measurement pass. Re-measuring after
          // each move guarantees the current page retains the maximum number
          // of complete entries that safely fit inside the printable area.
          movingKeys.add(sectionAtoms[sectionAtoms.length - 1].key);
        } else if (element.getBoundingClientRect().top >= safeBottom) {
          movingKeys.add(sectionAtoms[sectionAtoms.length - 1].key);
        } else if (sectionAtoms.length > 1) {
          // Custom template markup may not expose one semantic element per
          // entry. Moving only the final entry still fills the current page
          // more effectively than moving the entire section.
          movingKeys.add(sectionAtoms[sectionAtoms.length - 1].key);
        } else {
          movingKeys.add(sectionAtoms[0].key);
        }
      }

      const finalMovingAtom = [...currentPage]
        .reverse()
        .find(
          (atom) =>
            movingKeys.has(atom.key) && !pinnedSidebarSections?.has(atom.section)
        );
      let moving = finalMovingAtom ? [finalMovingAtom] : [];

      // Unknown custom markup falls back to the final logical section so
      // content is never silently clipped.
      if (!moving.length && currentPage.length > 1) {
        const fallbackAtom = [...currentPage]
          .reverse()
          .find((atom) => !pinnedSidebarSections?.has(atom.section));
        moving = fallbackAtom ? [fallbackAtom] : [];
      }

      const movingAtomKeys = new Set(moving.map((atom) => atom.key));
      const remaining = currentPage.filter((atom) => !movingAtomKeys.has(atom.key));
      if (!moving.length || !remaining.length || pages.length >= MAX_PAGES) continue;

      setPages((currentPages) => {
        if (
          currentPages[pageIndex]?.map((atom) => atom.key).join(",") !==
          currentPage.map((atom) => atom.key).join(",")
        ) {
          return currentPages;
        }
        const nextPages = currentPages.map((page) => [...page]);
        nextPages[pageIndex] = remaining;
        nextPages[pageIndex + 1] = mergeAtoms(moving, nextPages[pageIndex + 1] ?? []);
        return nextPages;
      });
      return;
    }
  }, [data.basics.fullName, pages, template.accent, template.renderer]);

  useLayoutEffect(() => {
    let cancelled = false;
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        if (!cancelled) measurePages();
      });
    });

    void document.fonts?.ready.then(() => {
      if (!cancelled) measurePages();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [measurePages, pagesKey]);

  return (
    <div className="resume-page-stack flex items-start gap-8">
      {pages.map((pageAtoms, pageIndex) => {
        const pageSections = sectionsForAtoms(pageAtoms);
        const pageData = dataForPage(data, pageAtoms, pageIndex > 0);

        return (
          <div
            key={String(pageIndex) + "-" + pageAtoms.map((atom) => atom.key).join("-")}
            ref={(node) => {
              pageRefs.current[pageIndex] = node;
            }}
            className="resume-page-shell relative shrink-0"
            data-resume-page={pageIndex + 1}
          >
            {pageIndex === 0 || template.renderer === "analyst" ? (
              <ResumePreview
                data={pageData}
                template={template}
                showPhoto={pageIndex === 0 ? showPhoto : false}
                pagePadding={pagePadding}
                sectionSpacing={sectionSpacing}
                fontSizeScale={fontSizeScale}
                lineHeight={lineHeight}
                className={cn(className, "resume-paginated-sheet")}
              />
            ) : (
              <ResumeContinuationPage
                data={pageData}
                template={template}
                sections={pageSections}
                pageIndex={pageIndex}
                pageCount={pages.length}
                pagePadding={pagePadding}
                className={cn(className, "resume-paginated-sheet")}
              />
            )}
            {pages.length > 1 && (
              <span className="no-print absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-black/10 bg-white/90 px-2 py-0.5 text-[9px] font-bold text-black/45 shadow-sm">
                Page {pageIndex + 1} of {pages.length}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Renders the selected template unchanged, measures its semantic sections,
 * and fills each A4 page at safe entry boundaries before creating a continuation page.
 */
export function PaginatedResumePreview(props: PaginatedResumePreviewProps) {
  const signature = useMemo(
    () =>
      JSON.stringify({
        data: props.data,
        renderer: props.template.renderer,
        pagePadding: props.pagePadding,
        sectionSpacing: props.sectionSpacing,
        fontSizeScale: props.fontSizeScale,
        lineHeight: props.lineHeight,
        showPhoto: props.showPhoto,
      }),
    [
      props.data,
      props.template.renderer,
      props.pagePadding,
      props.sectionSpacing,
      props.fontSizeScale,
      props.lineHeight,
      props.showPhoto,
    ]
  );

  return <PaginatedResumePreviewInner key={signature} {...props} />;
}
