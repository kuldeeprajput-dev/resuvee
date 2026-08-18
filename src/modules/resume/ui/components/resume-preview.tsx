import React, { memo } from "react";
import Image from "next/image";
import type { ResumeData, ResumeTemplate } from "../../types/resume";
import { cn } from "@/shared/lib/utils";
import {
  ProfilePhoto,
  SectionTitle,
  ContactList,
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  ProjectsSection,
  CertificationsSection,
  Sheet,
} from "./resume-preview-shared";
import {
  BlueprintTemplate,
  ChronologicalTemplate,
  CompactTemplate,
  HybridTemplate,
  FinanceTemplate,
  HealthcareTemplate,
  SalesTemplate,
} from "./resume-preview-templates";
import {
  AnalystTemplate,
  FresherTemplate,
  FirstStepTemplate,
  PivotTemplate,
} from "./resume-preview-specialist-templates";

interface ResumePreviewProps {
  data: ResumeData;
  template: ResumeTemplate;
  className?: string;
  showPhoto?: boolean;
  pagePadding?: "compact" | "normal" | "spacious";
  sectionSpacing?: "compact" | "normal" | "spacious";
  fontSizeScale?: number;
  lineHeight?: "tight" | "normal" | "relaxed";
}

// ---------------------------------------------------------------------------
// Shared helpers (local to resume-preview.tsx)
// ---------------------------------------------------------------------------

/** Inline project links badge */
function InlineProjectLinks({
  link,
  linkLabel,
  githubUrl,
  githubLabel,
  inverted = false,
}: {
  link?: string;
  linkLabel?: string;
  githubUrl?: string;
  githubLabel?: string;
  inverted?: boolean;
}) {
  const parts = [
    link ? linkLabel || link : null,
    githubUrl ? githubLabel || githubUrl : null,
  ].filter(Boolean) as string[];
  if (!parts.length) return null;
  return (
    <span
      className={cn(
        "ml-1.5 text-[7px] font-normal",
        inverted ? "text-white/45" : "text-black/42"
      )}
    >
      ({parts.join(" · ")})
    </span>
  );
}

/** Date range helper */
function fmtDate(start?: string, end?: string, current?: boolean) {
  return [start, current ? "Present" : end].filter(Boolean).join(" – ");
}

// ---------------------------------------------------------------------------
// MeridianTemplate — International (photo optional, sidebar right)
// ---------------------------------------------------------------------------
function MeridianTemplate(props: ResumePreviewProps) {
  const { data, template, className, showPhoto = true, pagePadding } = props;
  return (
    <Sheet pagePadding={pagePadding} className={cn("bg-[#fbfdfb]", className)}>
      {/* Decorative blobs */}
      <div className="absolute -left-16 -top-20 size-60 rounded-full bg-[#d9f1e4]" />
      <div className="absolute left-10 top-8 size-[100px] rounded-[32px] bg-[#9ddbb8]/70" />

      {/* Header */}
      <header className="relative grid grid-cols-[112px_1fr] items-center gap-6 px-11 pb-7 pt-9">
        <ProfilePhoto
          data={data}
          hidden={!showPhoto}
          className="size-[92px] rounded-[28px] border-[5px] border-white shadow-md"
        />
        <div>
          <p
            className="mb-1.5 text-[7px] font-extrabold uppercase tracking-[0.18em]"
            style={{ color: template.accent }}
          >
            {data.basics.headline}
          </p>
          <h1 className="text-[30px] font-bold leading-none tracking-[-0.045em] text-[#19342a]">
            {data.basics.fullName || "Your Name"}
          </h1>
          <div className="mt-3">
            <ContactList data={data} horizontal />
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="relative grid grid-cols-[165px_1fr] gap-7 px-11 pb-10">
        {/* Aside — Skills, Certifications, Education only */}
        <aside className="space-y-5 rounded-[18px] bg-[#edf6f0] px-4 py-5">
          {data.skillGroups.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Skills</SectionTitle>
              <div className="space-y-2">
                {data.skillGroups.map((group) => (
                  <div key={group.id}>
                    <p className="mb-0.5 text-[7px] font-extrabold text-black/65">{group.name}</p>
                    <div className="flex flex-wrap gap-0.5">
                      {group.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="rounded-[3px] bg-black/5 px-1 py-0.5 text-[6.8px] text-black/55"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <CertificationsSection data={data} accent={template.accent} compact sidebarOnly />
          <EducationSection data={data} accent={template.accent} compact />
        </aside>

        {/* Main — Summary, Experience, Projects */}
        <main className="space-y-5 border-l border-black/[0.06] pl-7">
          <SummarySection data={data} accent={template.accent} compact />
          <ExperienceSection data={data} accent={template.accent} compact />

          {data.projects.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Selected projects</SectionTitle>
              <div className="space-y-2.5">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-[9px] font-extrabold text-black/82">
                        {project.name}
                        <InlineProjectLinks
                          link={project.link}
                          linkLabel={project.linkLabel}
                          githubUrl={project.githubUrl}
                          githubLabel={project.githubLabel}
                        />
                      </h3>
                      {project.date && (
                        <span className="shrink-0 text-[7.2px] text-black/38">{project.date}</span>
                      )}
                    </div>
                    {project.description && (
                      <p className="mt-0.5 text-[8px] leading-[1.4] text-black/52">
                        {project.description}
                      </p>
                    )}
                    {project.highlights.filter(Boolean).map((h, i) => (
                      <p key={i} className="mt-0.5 text-[7.5px] leading-[1.38] text-black/42">
                        — {h}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <p className="absolute bottom-5 right-11 text-[5.5px] font-semibold uppercase tracking-[0.14em] text-black/25">
        Resuvee · {template.name}
      </p>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// EditorialTemplate — Academic (serif, formal, typography-led)
// ---------------------------------------------------------------------------
function EditorialTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet
      pagePadding={pagePadding}
      className={cn(
        "bg-[#fffefb] px-9 py-7 font-serif flex flex-col justify-between min-h-[842px] h-[842px]",
        className
      )}
    >
      <div>
        {/* Header */}
        <header className="border-b border-black/55 pb-3 text-center">
          <h1 className="text-[25px] font-semibold uppercase leading-none tracking-[0.08em] text-black/85">
            {data.basics.fullName || "Your Name"}
          </h1>
          <p
            className="mt-1.5 text-[7px] font-bold uppercase tracking-[0.16em]"
            style={{ color: template.accent }}
          >
            {data.basics.headline}
          </p>
          <div className="mt-1.5 flex justify-center font-sans">
            <ContactList data={data} horizontal hideIcons />
          </div>
        </header>

        <main className="pt-3">
          {/* Summary */}
          {data.basics.summary && (
            <section className="border-b border-black/25 pb-2 text-center">
              <h2 className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.1em]">
                Professional profile
              </h2>
              <p className="mx-auto max-w-[475px] text-[7px] leading-[1.45] text-black/58">
                {data.basics.summary}
              </p>
            </section>
          )}

          <div className="space-y-3 pt-3 font-sans">
            {/* Skills with group names */}
            {data.skillGroups.length > 0 && (
              <section>
                <SectionTitle accent={template.accent}>Skills</SectionTitle>
                <div className="space-y-1">
                  {data.skillGroups.map((group) => (
                    <p key={group.id} className="text-[8px] leading-[1.38] text-black/62">
                      <span className="font-extrabold text-black/78">{group.name}:</span>{" "}
                      {group.skills.join(", ")}
                    </p>
                  ))}
                </div>
              </section>
            )}

            <ExperienceSection data={data} accent={template.accent} compact />

            {/* Projects with links */}
            {data.projects.length > 0 && (
              <section>
                <SectionTitle accent={template.accent}>Selected projects</SectionTitle>
                <div className="space-y-2">
                  {data.projects.map((project) => (
                    <article key={project.id}>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-[9px] font-extrabold text-black/82">
                          {project.name}
                          <InlineProjectLinks
                            link={project.link}
                            linkLabel={project.linkLabel}
                            githubUrl={project.githubUrl}
                            githubLabel={project.githubLabel}
                          />
                        </h3>
                        {project.date && (
                          <span className="shrink-0 text-[7.2px] text-black/38">{project.date}</span>
                        )}
                      </div>
                      {project.description && (
                        <p className="mt-0.5 text-[7.8px] leading-[1.4] text-black/50">
                          {project.description}
                        </p>
                      )}
                      {project.highlights.filter(Boolean).map((h, i) => (
                        <p key={i} className="mt-0.5 text-[7.3px] leading-[1.35] text-black/42">
                          — {h}
                        </p>
                      ))}
                    </article>
                  ))}
                </div>
              </section>
            )}

            <CertificationsSection data={data} accent={template.accent} compact />
            <EducationSection data={data} accent={template.accent} compact />
          </div>
        </main>
      </div>

      <div className="mt-auto pt-2 flex items-center justify-between border-t border-black/15 font-sans text-[5px] uppercase tracking-[0.12em] text-black/25">
        <span>{data.basics.website}</span>
        <span>Resuvee · {template.name}</span>
      </div>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// SummitTemplate — Executive (dark sidebar right, experience left)
// ---------------------------------------------------------------------------
function SummitTemplate(props: ResumePreviewProps) {
  const { data, template, className, showPhoto = true, pagePadding } = props;
  return (
    <Sheet
      pagePadding={pagePadding}
      className={cn("grid grid-cols-[1fr_178px] bg-[#fcfdff]", className)}
    >
      {/* Main */}
      <main className="px-9 py-9">
        <header className="mb-5 border-b-2 pb-4" style={{ borderColor: template.accent }}>
          <p
            className="text-[7px] font-bold uppercase tracking-[0.16em]"
            style={{ color: template.accent }}
          >
            {data.basics.headline}
          </p>
          <h1 className="mt-1.5 text-[28px] font-bold leading-none tracking-[-0.04em] text-[#182435]">
            {data.basics.fullName || "Your Name"}
          </h1>
          <div className="mt-3">
            <ContactList data={data} horizontal />
          </div>
        </header>
        <div className="space-y-5">
          <SummarySection data={data} accent={template.accent} compact />
          <ExperienceSection data={data} accent={template.accent} compact />

          {/* Projects in main column */}
          {data.projects.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Selected projects</SectionTitle>
              <div className="space-y-2.5">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-[9px] font-extrabold text-black/82">
                        {project.name}
                        <InlineProjectLinks
                          link={project.link}
                          linkLabel={project.linkLabel}
                          githubUrl={project.githubUrl}
                          githubLabel={project.githubLabel}
                        />
                      </h3>
                      {project.date && (
                        <span className="shrink-0 text-[7.2px] text-black/38">{project.date}</span>
                      )}
                    </div>
                    {project.description && (
                      <p className="mt-0.5 text-[8px] leading-[1.4] text-black/52">
                        {project.description}
                      </p>
                    )}
                    {project.highlights.filter(Boolean).map((h, i) => (
                      <p key={i} className="mt-0.5 text-[7.5px] leading-[1.38] text-black/42">
                        — {h}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Dark aside — Photo, Skills, Certifications, Education */}
      <aside
        className="relative flex flex-col px-5 py-8 text-white"
        style={{ backgroundColor: template.accent }}
      >
        <div className="absolute right-0 top-0 h-24 w-12 bg-white/6" />
        <ProfilePhoto
          data={data}
          hidden={!showPhoto}
          className="relative z-10 mb-6 size-[90px] self-center rounded-full border-4 border-white/20"
        />
        <div className="space-y-5">
          {/* Skills (inverted) with group names */}
          {data.skillGroups.length > 0 && (
            <section>
              <SectionTitle accent={template.accent} inverted>
                Skills
              </SectionTitle>
              <div className="space-y-1.5">
                {data.skillGroups.map((group) => (
                  <p key={group.id} className="text-[7.5px] leading-[1.38] text-white/65">
                    <span className="font-extrabold text-white/85">{group.name}:</span>{" "}
                    {group.skills.join(", ")}
                  </p>
                ))}
              </div>
            </section>
          )}

          <EducationSection data={data} accent={template.accent} compact inverted />
          <CertificationsSection data={data} accent={template.accent} compact sidebarOnly inverted />
        </div>
        <p className="mt-auto text-[5px] uppercase tracking-[0.14em] text-white/25">
          Resuvee · {template.name}
        </p>
      </aside>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// ColumnTemplate — Modern ATS (two-column, structured)
// ---------------------------------------------------------------------------
function ColumnTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet pagePadding={pagePadding} className={cn("bg-white px-11 py-10", className)}>
      <header className="mb-6 flex items-end justify-between gap-6 border-b border-black/70 pb-4">
        <div>
          <h1 className="text-[30px] font-light leading-none tracking-tighter text-black/90">
            {data.basics.fullName || "Your Name"}
          </h1>
          <p
            className="mt-2 text-[7px] font-extrabold uppercase tracking-[0.2em]"
            style={{ color: template.accent }}
          >
            {data.basics.headline}
          </p>
        </div>
        <div className="max-w-[210px]">
          <ContactList data={data} horizontal hideIcons />
        </div>
      </header>

      <div className="grid grid-cols-[138px_1fr] gap-8">
        {/* Aside — Skills, Education, Certifications only */}
        <aside className="space-y-5 border-r border-black/10 pr-6">
          {data.skillGroups.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Skills</SectionTitle>
              <div className="space-y-2">
                {data.skillGroups.map((group) => (
                  <div key={group.id}>
                    <p className="mb-0.5 text-[7px] font-extrabold text-black/65">{group.name}</p>
                    <p className="text-[7.5px] leading-[1.38] text-black/55">
                      {group.skills.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <EducationSection data={data} accent={template.accent} compact />
          <CertificationsSection data={data} accent={template.accent} compact sidebarOnly />
        </aside>

        {/* Main — Summary, Experience, Projects */}
        <main className="space-y-5">
          <SummarySection data={data} accent={template.accent} compact />

          {data.experience.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Experience</SectionTitle>
              <div className="space-y-3">
                {data.experience.map((item) => (
                  <article key={item.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-[10px] font-extrabold leading-tight text-black/85">
                          {item.role || "Role title"}
                        </h3>
                        <p
                          className="mt-0.5 text-[8.5px] font-bold"
                          style={{ color: template.accent }}
                        >
                          {[item.company, item.location].filter(Boolean).join(" · ") || "Company"}
                        </p>
                      </div>
                      <p className="shrink-0 text-[7.5px] font-semibold text-black/42">
                        {fmtDate(item.startDate, item.endDate, item.current)}
                      </p>
                    </div>
                    <ul className="mt-1.5 space-y-0.5">
                      {item.highlights.filter(Boolean).map((h, i) => (
                        <li key={i} className="flex gap-1.5 text-[8.7px] leading-[1.42] text-black/58">
                          <span
                            className="mt-[3.5px] size-1 shrink-0 rounded-full"
                            style={{ backgroundColor: template.accent }}
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          )}

          {data.projects.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Selected projects</SectionTitle>
              <div className="space-y-2.5">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-[9px] font-extrabold text-black/82">
                        {project.name}
                        <InlineProjectLinks
                          link={project.link}
                          linkLabel={project.linkLabel}
                          githubUrl={project.githubUrl}
                          githubLabel={project.githubLabel}
                        />
                      </h3>
                      {project.date && (
                        <span className="shrink-0 text-[7.2px] text-black/38">{project.date}</span>
                      )}
                    </div>
                    {project.description && (
                      <p className="mt-0.5 text-[8px] leading-[1.4] text-black/52">
                        {project.description}
                      </p>
                    )}
                    {project.highlights.filter(Boolean).map((h, i) => (
                      <p key={i} className="mt-0.5 text-[7.5px] leading-[1.38] text-black/42">
                        — {h}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <p className="absolute bottom-5 left-11 text-[5px] uppercase tracking-[0.18em] text-black/20">
        Resuvee · {template.name}
      </p>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// HorizonTemplate — Contemporary (curved masthead, photo, two-column)
// ---------------------------------------------------------------------------
function HorizonTemplate(props: ResumePreviewProps) {
  const { data, template, className, showPhoto = true, pagePadding } = props;
  return (
    <Sheet pagePadding={pagePadding} className={cn("bg-[#fbfdff]", className)}>
      {/* Decorative curved blobs */}
      <div className="absolute -right-16 -top-24 h-52 w-[430px] rotate-6 rounded-[50%] bg-[#dceeff]" />
      <div className="absolute -right-6 -top-20 h-44 w-[350px] rotate-6 rounded-[50%] border-18 border-white/55" />

      {/* Header */}
      <header className="relative flex min-h-[150px] items-center justify-between gap-6 px-10 py-8">
        <div className="max-w-[360px]">
          <p
            className="text-[7px] font-extrabold uppercase tracking-[0.16em]"
            style={{ color: template.accent }}
          >
            {data.basics.headline}
          </p>
          <h1 className="mt-1.5 text-[29px] font-bold leading-none tracking-[-0.04em] text-[#1b3a57]">
            {data.basics.fullName || "Your Name"}
          </h1>
          <div className="mt-3">
            <ContactList data={data} horizontal />
          </div>
        </div>
        <ProfilePhoto
          data={data}
          hidden={!showPhoto}
          className="size-[82px] rounded-[22px] border-4 border-white shadow-lg"
        />
      </header>

      {/* Body */}
      <div className="relative grid grid-cols-[1.3fr_0.7fr] gap-7 px-10 pb-9">
        {/* Main — Summary, Experience, Projects */}
        <main className="space-y-5">
          <SummarySection data={data} accent={template.accent} compact />
          <ExperienceSection data={data} accent={template.accent} compact />

          {data.projects.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Selected projects</SectionTitle>
              <div className="space-y-2.5">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-[9px] font-extrabold text-black/82">
                        {project.name}
                        <InlineProjectLinks
                          link={project.link}
                          linkLabel={project.linkLabel}
                          githubUrl={project.githubUrl}
                          githubLabel={project.githubLabel}
                        />
                      </h3>
                      {project.date && (
                        <span className="shrink-0 text-[7.2px] text-black/38">{project.date}</span>
                      )}
                    </div>
                    {project.description && (
                      <p className="mt-0.5 text-[8px] leading-[1.4] text-black/52">
                        {project.description}
                      </p>
                    )}
                    {project.highlights.filter(Boolean).map((h, i) => (
                      <p key={i} className="mt-0.5 text-[7.5px] leading-[1.38] text-black/42">
                        — {h}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Aside — Skills, Education, Certifications only */}
        <aside className="space-y-5 border-l border-[#9fc9f0]/40 pl-6">
          {data.skillGroups.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Skills</SectionTitle>
              <div className="space-y-1.5">
                {data.skillGroups.map((group) => (
                  <div key={group.id}>
                    <p className="mb-0.5 text-[7px] font-extrabold text-black/65">{group.name}</p>
                    <div className="flex flex-wrap gap-0.5">
                      {group.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="rounded-[3px] bg-[#dceeff]/60 px-1 py-0.5 text-[6.8px] text-black/55"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <EducationSection data={data} accent={template.accent} compact />
          <CertificationsSection data={data} accent={template.accent} compact sidebarOnly />
        </aside>
      </div>

      <p className="absolute bottom-5 right-10 text-[5px] uppercase tracking-[0.14em] text-[#2d70a6]/35">
        Resuvee · {template.name}
      </p>
    </Sheet>
  );
}

function ResumePreviewInner(props: ResumePreviewProps) {
  switch (props.template.renderer) {
    case "meridian":
      return <MeridianTemplate {...props} />;
    case "editorial":
      return <EditorialTemplate {...props} />;
    case "summit":
      return <SummitTemplate {...props} />;
    case "column":
      return <ColumnTemplate {...props} />;
    case "horizon":
      return <HorizonTemplate {...props} />;
    case "blueprint":
      return <BlueprintTemplate {...props} />;
    case "chronological":
      return <ChronologicalTemplate {...props} />;
    case "compact":
      return <CompactTemplate {...props} />;
    case "hybrid":
      return <HybridTemplate {...props} />;
    case "fresher":
      return <FresherTemplate {...props} />;
    case "first-step":
      return <FirstStepTemplate {...props} />;
    case "pivot":
      return <PivotTemplate {...props} />;
    case "finance":
      return <FinanceTemplate {...props} />;
    case "healthcare":
      return <HealthcareTemplate {...props} />;
    case "sales":
      return <SalesTemplate {...props} />;
    case "analyst":
      return <AnalystTemplate {...props} />;
  }
}

/**
 * Memoized resume preview — only re-renders when data, template, or style
 * props actually change. This prevents the expensive canvas re-render on
 * every keystroke when other builder state (panels, zoom, selection) updates.
 */
export const ResumePreview = memo(ResumePreviewInner);
