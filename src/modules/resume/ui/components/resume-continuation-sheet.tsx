"use client";

import React from "react";
import type { ResumeData, ResumeTemplate } from "../../types/resume";
import { cn } from "@/shared/lib/utils";
import {
  CertificationsSection,
  EducationSection,
  ExperienceSection,
  ProjectsSection,
  Sheet,
  SkillsSection,
  SummarySection,
} from "./resume-preview-shared";

export type PageSection =
  | "summary"
  | "skills"
  | "experience"
  | "projects"
  | "certifications"
  | "education";

export interface PageAtom {
  key: string;
  section: PageSection;
  itemId: string;
}

export const CONTINUATION_PAPER_COLORS: Record<ResumeTemplate["renderer"], string> = {
  analyst: "#ffffff",
  blueprint: "#fbfcfd",
  chronological: "#ffffff",
  column: "#ffffff",
  compact: "#ffffff",
  editorial: "#fffefb",
  finance: "#fffefd",
  "first-step": "#fbfcff",
  fresher: "#ffffff",
  healthcare: "#fcfefe",
  horizon: "#fbfdff",
  hybrid: "#ffffff",
  meridian: "#fbfdfb",
  pivot: "#fffdfd",
  sales: "#fffdfb",
  summit: "#fcfdff",
};

export function pageAtom(section: PageSection, itemId: string): PageAtom {
  return { key: `${section}:${itemId}`, section, itemId };
}

export function activeAtoms(data: ResumeData, template: ResumeTemplate): PageAtom[] {
  const available: Record<PageSection, PageAtom[]> = {
    summary: data.basics.summary ? [pageAtom("summary", "summary")] : [],
    skills: data.skillGroups.map((item) => pageAtom("skills", item.id)),
    experience: data.experience.map((item) => pageAtom("experience", item.id)),
    projects: data.projects.map((item) => pageAtom("projects", item.id)),
    certifications: (data.certifications ?? []).map((item) =>
      pageAtom("certifications", item.id)
    ),
    education: data.education.map((item) => pageAtom("education", item.id)),
  };

  const declaredOrder = template.sections.filter(
    (section): section is PageSection => section !== "basics"
  );
  const order = [
    ...new Set<PageSection>([
      ...declaredOrder,
      "summary",
      "skills",
      "experience",
      "projects",
      "certifications",
      "education",
    ]),
  ];

  return order.flatMap((section) => available[section]);
}

export function dataForPage(
  data: ResumeData,
  atoms: PageAtom[],
  isContinuationPage: boolean
): ResumeData {
  const idsFor = (section: PageSection) =>
    new Set(atoms.filter((atom) => atom.section === section).map((atom) => atom.itemId));
  const summaryIds = idsFor("summary");
  const skillIds = idsFor("skills");
  const experienceIds = idsFor("experience");
  const projectIds = idsFor("projects");
  const certificationIds = idsFor("certifications");
  const educationIds = idsFor("education");

  return {
    ...data,
    basics: {
      ...data.basics,
      ...(isContinuationPage
        ? {
            photo: "",
            email: "",
            phone: "",
            location: "",
            website: "",
            linkedin: "",
            github: "",
            customLinks: [],
          }
        : {}),
      summary: summaryIds.size ? data.basics.summary : "",
    },
    skillGroups: data.skillGroups.filter((item) => skillIds.has(item.id)),
    experience: data.experience.filter((item) => experienceIds.has(item.id)),
    projects: data.projects.filter((item) => projectIds.has(item.id)),
    certifications: (data.certifications ?? []).filter((item) =>
      certificationIds.has(item.id)
    ),
    education: data.education.filter((item) => educationIds.has(item.id)),
  };
}

export function sectionFromHeading(heading: string): PageSection | null {
  const label = heading.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();

  if (/experience|employment|work history/.test(label)) return "experience";
  if (/project/.test(label)) return "projects";
  if (/award|certif|licen[cs]e/.test(label)) return "certifications";
  if (/education|academic/.test(label)) return "education";
  if (/skill|competenc|expertise|technolog/.test(label)) return "skills";
  if (/summary|profile|objective|about/.test(label)) return "summary";
  return null;
}

export function itemElementsForSection(element: HTMLElement, section: PageSection): HTMLElement[] {
  const articles = Array.from(element.querySelectorAll<HTMLElement>("article"));
  if (articles.length) return articles;

  if (section === "skills") {
    const heading = element.querySelector("h2");
    const titleRow = heading?.parentElement;
    const list = titleRow?.nextElementSibling;
    if (list instanceof HTMLElement) {
      return Array.from(list.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement
      );
    }
  }

  return [];
}

export function containerForHeading(heading: HTMLElement): HTMLElement | null {
  const parent = heading.parentElement;
  if (!parent) return null;

  if (parent.tagName === "SECTION") return parent;

  const titledContainer = parent.parentElement;
  if (titledContainer && titledContainer.querySelectorAll("h2").length === 1) {
    return titledContainer;
  }

  return heading.closest<HTMLElement>("section");
}

export function sectionsForAtoms(atoms: PageAtom[]): PageSection[] {
  return [...new Set(atoms.map((atom) => atom.section))];
}

export function mergeAtoms(first: PageAtom[], second: PageAtom[]) {
  const merged = [...first, ...second];
  return merged.filter(
    (atom, index) => merged.findIndex((candidate) => candidate.key === atom.key) === index
  );
}

export function prepareContinuationSheet(
  pageRoot: HTMLDivElement | null,
  pageIndex: number,
  pageCount: number,
  fullName: string,
  accent: string,
  usesOriginalTemplate: boolean
) {
  const sheet = pageRoot?.querySelector<HTMLElement>("article.resume-print-area");
  if (!sheet || pageIndex === 0 || !usesOriginalTemplate) return sheet;

  sheet.classList.add("resume-continuation-sheet");

  const header = sheet.querySelector<HTMLElement>("header");
  if (header) {
    header.classList.add("resume-continuation-header");
    header.dataset.continuationName = fullName.trim() || "Resume";
    header.dataset.continuationPage = `Page ${pageIndex + 1} of ${pageCount}`;
    header.style.setProperty("--resume-continuation-accent", accent);
  }

  for (const heading of sheet.querySelectorAll<HTMLElement>("h2")) {
    if (heading.textContent?.trim().toLowerCase() !== "contact") continue;
    heading.closest<HTMLElement>("section")?.classList.add("resume-continuation-contact");
  }

  return sheet;
}

export function ContinuationSection({
  section,
  data,
  accent,
}: {
  section: PageSection;
  data: ResumeData;
  accent: string;
}) {
  switch (section) {
    case "summary":
      return <SummarySection data={data} accent={accent} compact />;
    case "skills":
      return <SkillsSection data={data} accent={accent} pills />;
    case "experience":
      return <ExperienceSection data={data} accent={accent} compact />;
    case "projects":
      return <ProjectsSection data={data} accent={accent} compact />;
    case "certifications":
      return <CertificationsSection data={data} accent={accent} compact />;
    case "education":
      return <EducationSection data={data} accent={accent} compact />;
  }
}

export function ResumeContinuationPage({
  data,
  template,
  sections,
  pageIndex,
  pageCount,
  className,
  pagePadding,
}: {
  data: ResumeData;
  template: ResumeTemplate;
  sections: PageSection[];
  pageIndex: number;
  pageCount: number;
  className?: string;
  pagePadding?: "compact" | "normal" | "spacious";
}) {
  const isEditorial = template.renderer === "editorial";

  return (
    <Sheet
      pagePadding={pagePadding}
      style={{ backgroundColor: CONTINUATION_PAPER_COLORS[template.renderer] }}
      className={cn(
        "resume-stable-continuation-page px-10 py-8",
        isEditorial && "font-serif",
        className
      )}
    >
      <header
        className="mb-6 flex min-h-7 items-center justify-between gap-6 border-b pb-2"
        style={{ borderColor: `${template.accent}73` }}
      >
        <p
          className="min-w-0 truncate text-[12px] font-extrabold tracking-[-0.015em]"
          style={{ color: template.accent }}
        >
          {data.basics.fullName.trim() || "Resume"}
        </p>
        <p className="shrink-0 text-[7px] font-bold uppercase tracking-[0.12em] text-black/45">
          Page {pageIndex + 1} of {pageCount}
        </p>
      </header>

      <main className="space-y-5">
        {sections.map((section) => (
          <ContinuationSection
            key={section}
            section={section}
            data={data}
            accent={template.accent}
          />
        ))}
      </main>
    </Sheet>
  );
}
