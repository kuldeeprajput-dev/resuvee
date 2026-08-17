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
// Shared sub-components used across templates
// ---------------------------------------------------------------------------

/** Sharp rule-underlined section heading — mirrors Professional template style */
function RuleTitle({
  children,
  accent,
  inverted = false,
}: {
  children: React.ReactNode;
  accent?: string;
  inverted?: boolean;
}) {
  return (
    <h2
      className={cn(
        "mb-2 pb-0.5 text-[9px] font-extrabold uppercase tracking-[0.13em]",
        inverted
          ? "border-b border-white/30 text-white/85"
          : "border-b border-black/55 text-black/80"
      )}
    >
      {children}
    </h2>
  );
}

/** Inline project links badge — consistent across all templates */
function ProjectLinks({
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

/** Date range string helper */
function dateRange(start?: string, end?: string, current?: boolean) {
  return [start, current ? "Present" : end].filter(Boolean).join(" – ");
}

// ---------------------------------------------------------------------------
// BlueprintTemplate — Technical (sidebar dark, main light, grid layout)
// ---------------------------------------------------------------------------
export function BlueprintTemplate({
  data,
  template,
  className,
  showPhoto = true,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("grid grid-cols-[172px_1fr] bg-[#fbfcfd]", className)}>
      {/* Dark sidebar */}
      <aside
        className="relative flex flex-col px-5 py-8 text-white"
        style={{ backgroundColor: template.accent }}
      >
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] bg-size-[18px_18px]" />
        <ProfilePhoto
          data={data}
          hidden={!showPhoto}
          className="relative mb-5 size-[78px] rounded-[14px] border-2 border-white/25"
        />
        <div className="relative space-y-5">
          {/* Contact */}
          <section>
            <RuleTitle inverted>Contact</RuleTitle>
            <ContactList data={data} inverted />
          </section>

          {/* Skills */}
          {data.skillGroups.length > 0 && (
            <section>
              <RuleTitle inverted>Skills</RuleTitle>
              <div className="space-y-2">
                {data.skillGroups.map((group) => (
                  <div key={group.id}>
                    <p className="mb-0.5 text-[7.5px] font-extrabold uppercase tracking-[0.1em] text-white/75">
                      {group.name}
                    </p>
                    <div className="flex flex-wrap gap-0.5">
                      {group.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="rounded-[3px] bg-white/10 px-1 py-0.5 text-[7px] text-white/70"
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

          {/* Certifications */}
          {(data.certifications?.length ?? 0) > 0 && (
            <section>
              <RuleTitle inverted>Certifications</RuleTitle>
              <div className="space-y-1">
                {data.certifications?.map((cert) => (
                  <div key={cert.id}>
                    <p className="text-[7.5px] font-bold text-white/80">{cert.title}</p>
                    {cert.issuer && (
                      <p className="text-[7px] text-white/50">{cert.issuer}</p>
                    )}
                    {cert.date && (
                      <p className="text-[6.5px] text-white/38">{cert.date}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <p className="relative mt-auto text-[5px] uppercase tracking-[0.14em] text-white/25">
          Resuvee · {template.name}
        </p>
      </aside>

      {/* Main content */}
      <main className="px-8 py-9">
        <header className="mb-5">
          <p
            className="font-mono text-[7px] font-bold uppercase tracking-[0.14em]"
            style={{ color: template.accent }}
          >
            {"// "}
            {data.basics.headline}
          </p>
          <h1 className="mt-2 text-[28px] font-bold leading-none tracking-[-0.045em] text-[#172b24]">
            {data.basics.fullName || "Your Name"}
          </h1>
          <div className="mt-4 h-[3px] w-14" style={{ backgroundColor: template.accent }} />
        </header>

        <div className="space-y-5">
          <SummarySection data={data} accent={template.accent} compact />
          <ExperienceSection data={data} accent={template.accent} compact />

          {/* Projects with link display */}
          {data.projects.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Selected projects</SectionTitle>
              <div className="space-y-2.5">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-[9.2px] font-extrabold text-black/82">
                        {project.name}
                        <ProjectLinks
                          link={project.link}
                          linkLabel={project.linkLabel}
                          githubUrl={project.githubUrl}
                          githubLabel={project.githubLabel}
                        />
                      </h3>
                      {project.date && (
                        <span className="shrink-0 text-[7.5px] font-semibold text-black/40">
                          {project.date}
                        </span>
                      )}
                    </div>
                    {project.description && (
                      <p className="mt-0.5 text-[8.1px] leading-[1.45] text-black/52">
                        {project.description}
                      </p>
                    )}
                    {project.highlights.filter(Boolean).map((h, i) => (
                      <p key={i} className="mt-0.5 text-[7.7px] leading-[1.4] text-black/45">
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
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// ChronologicalTemplate — Data Analyst (single column, newest-first)
// ---------------------------------------------------------------------------
export function ChronologicalTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet pagePadding={pagePadding} className={cn("bg-white px-11 py-10", className)}>
      {/* Header */}
      <header className="border-b-2 pb-4" style={{ borderColor: template.accent }}>
        <div className="flex items-end justify-between gap-7">
          <div>
            <h1 className="text-[29px] font-bold leading-none tracking-[-0.045em] text-black/90">
              {data.basics.fullName || "Your Name"}
            </h1>
            <p
              className="mt-1.5 text-[7px] font-extrabold uppercase tracking-[0.17em]"
              style={{ color: template.accent }}
            >
              {data.basics.headline}
            </p>
          </div>
          <div className="max-w-[230px]">
            <ContactList data={data} horizontal hideIcons />
          </div>
        </div>
      </header>

      <main className="mt-5 space-y-5">
        <SummarySection data={data} accent={template.accent} compact />
        <ExperienceSection data={data} accent={template.accent} compact />

        {/* Projects with inline links */}
        {data.projects.length > 0 && (
          <div className="border-t border-black/12 pt-5">
            <SectionTitle accent={template.accent}>Selected projects</SectionTitle>
            <div className="space-y-2.5">
              {data.projects.map((project) => (
                <article key={project.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[9.2px] font-extrabold text-black/82">
                      {project.name}
                      <ProjectLinks
                        link={project.link}
                        linkLabel={project.linkLabel}
                        githubUrl={project.githubUrl}
                        githubLabel={project.githubLabel}
                      />
                    </h3>
                    {project.date && (
                      <span className="shrink-0 text-[7.5px] font-semibold text-black/40">
                        {project.date}
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className="mt-0.5 text-[8.1px] leading-[1.45] text-black/52">
                      {project.description}
                    </p>
                  )}
                  {project.highlights.filter(Boolean).map((h, i) => (
                    <p key={i} className="mt-0.5 text-[7.7px] leading-[1.4] text-black/45">
                      — {h}
                    </p>
                  ))}
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Education + Skills side-by-side */}
        <div className="grid grid-cols-2 gap-8 border-t border-black/12 pt-5">
          <EducationSection data={data} accent={template.accent} compact />
          <div>
            <SectionTitle accent={template.accent}>Skills</SectionTitle>
            <div className="space-y-2">
              {data.skillGroups.map((group) => (
                <p key={group.id} className="text-[8.2px] leading-[1.38] text-black/65">
                  <span className="font-extrabold text-black/82">{group.name}:</span>{" "}
                  {group.skills.join(", ")}
                </p>
              ))}
            </div>
          </div>
        </div>

        {(data.certifications?.length ?? 0) > 0 && (
          <div className="border-t border-black/12 pt-5">
            <CertificationsSection data={data} accent={template.accent} compact />
          </div>
        )}
      </main>

      <div className="absolute bottom-5 left-11 right-11 flex justify-between border-t border-black/10 pt-2 text-[5px] uppercase tracking-[0.14em] text-black/22">
        <span>{data.basics.website}</span>
        <span>Resuvee · {template.name}</span>
      </div>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// CompactTemplate — Compact Pro (dense two-column, senior specialists)
// ---------------------------------------------------------------------------
export function CompactTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet pagePadding={pagePadding} className={cn("bg-white px-9 py-8", className)}>
      <header className="grid grid-cols-[1fr_225px] items-end gap-5 border-b border-black/45 pb-4">
        <div>
          <p
            className="text-[6.5px] font-bold uppercase tracking-[0.16em]"
            style={{ color: template.accent }}
          >
            {data.basics.headline}
          </p>
          <h1 className="mt-1.5 text-[27px] font-bold leading-none tracking-[-0.04em] text-black/90">
            {data.basics.fullName || "Your Name"}
          </h1>
        </div>
        <ContactList data={data} horizontal hideIcons />
      </header>

      <main className="mt-4 grid grid-cols-[1fr_152px] gap-7">
        {/* Main column */}
        <div className="space-y-4">
          <SummarySection data={data} accent={template.accent} compact />
          <ExperienceSection data={data} accent={template.accent} compact />

          {/* Projects with inline links */}
          {data.projects.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Selected projects</SectionTitle>
              <div className="space-y-2">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-[9px] font-extrabold text-black/82">
                        {project.name}
                        <ProjectLinks
                          link={project.link}
                          linkLabel={project.linkLabel}
                          githubUrl={project.githubUrl}
                          githubLabel={project.githubLabel}
                        />
                      </h3>
                      {project.date && (
                        <span className="shrink-0 text-[7.2px] text-black/38">
                          {project.date}
                        </span>
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
        </div>

        {/* Aside column */}
        <aside className="space-y-4 rounded-xl border border-black/[0.07] bg-[#f7f8f5] px-4 py-4">
          {/* Skills with group names */}
          {data.skillGroups.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Skills</SectionTitle>
              <div className="space-y-2">
                {data.skillGroups.map((group) => (
                  <div key={group.id}>
                    <p className="mb-0.5 text-[7px] font-extrabold text-black/68">
                      {group.name}
                    </p>
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

          <EducationSection data={data} accent={template.accent} compact />
          <CertificationsSection data={data} accent={template.accent} compact />
        </aside>
      </main>

      <p className="absolute bottom-4 right-9 text-[5px] uppercase tracking-[0.14em] text-black/20">
        Resuvee · {template.name}
      </p>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// HybridTemplate — Skills First (functional hybrid, skills + projects lead)
// ---------------------------------------------------------------------------
export function HybridTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet pagePadding={pagePadding} className={cn("bg-white px-10 py-9", className)}>
      <header>
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-[29px] font-bold leading-none tracking-[-0.045em]">
              {data.basics.fullName || "Your Name"}
            </h1>
            <p
              className="mt-2 text-[7px] font-extrabold uppercase tracking-[0.16em]"
              style={{ color: template.accent }}
            >
              {data.basics.headline}
            </p>
          </div>
          <div className="max-w-[225px]">
            <ContactList data={data} horizontal hideIcons />
          </div>
        </div>
        <div className="mt-4 h-1.5 w-full" style={{ backgroundColor: template.accent }} />
      </header>

      <main className="mt-5 space-y-5">
        <SummarySection data={data} accent={template.accent} compact />

        {/* Skills + Projects box */}
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-7 rounded-xl bg-[#f4f5f2] p-4">
          {/* Skills with group labels */}
          {data.skillGroups.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Skills</SectionTitle>
              <div className="space-y-2">
                {data.skillGroups.map((group) => (
                  <div key={group.id}>
                    <p className="mb-0.5 text-[7px] font-extrabold text-black/65">
                      {group.name}
                    </p>
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

          {/* Projects with links */}
          {data.projects.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Selected projects</SectionTitle>
              <div className="space-y-2">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <h3 className="text-[8.8px] font-extrabold text-black/80">
                      {project.name}
                      <ProjectLinks
                        link={project.link}
                        linkLabel={project.linkLabel}
                        githubUrl={project.githubUrl}
                        githubLabel={project.githubLabel}
                      />
                    </h3>
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
        </div>

        <ExperienceSection data={data} accent={template.accent} compact />
        <CertificationsSection data={data} accent={template.accent} compact />
        <div className="border-t border-black/12 pt-4">
          <EducationSection data={data} accent={template.accent} compact />
        </div>
      </main>

      <p className="absolute bottom-5 right-10 text-[5px] uppercase tracking-[0.14em] text-black/20">
        Resuvee · {template.name}
      </p>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// FinanceTemplate — Finance (conservative, metrics-led)
// ---------------------------------------------------------------------------
export function FinanceTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet pagePadding={pagePadding} className={cn("bg-[#fffefd]", className)}>
      <header className="border-b-[3px] px-10 pb-5 pt-9" style={{ borderColor: template.accent }}>
        <div className="flex items-end justify-between gap-8">
          <div>
            <p
              className="text-[8px] font-extrabold uppercase tracking-[0.18em]"
              style={{ color: template.accent }}
            >
              {data.basics.headline}
            </p>
            <h1 className="mt-2 text-[30px] font-bold leading-none tracking-[-0.045em] text-[#172a25]">
              {data.basics.fullName || "Your Name"}
            </h1>
          </div>
          <div className="max-w-[235px]">
            <ContactList data={data} horizontal hideIcons />
          </div>
        </div>
      </header>

      <main className="px-10 py-6">
        {/* Summary with refined box */}
        {data.basics.summary && (
          <div className="mb-6 rounded-lg border border-black/[0.07] bg-[#f3f5f2] px-4 py-3">
            <p className="mb-1.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-black/50">
              Profile
            </p>
            <p className="text-[8.8px] leading-[1.48] text-black/62">{data.basics.summary}</p>
          </div>
        )}

        <ExperienceSection data={data} accent={template.accent} compact />

        {/* Projects + Skills/Certs/Edu grid */}
        <div className="mt-6 grid grid-cols-[1.15fr_0.85fr] gap-8 border-t border-black/12 pt-5">
          {/* Projects with links */}
          {data.projects.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Selected projects</SectionTitle>
              <div className="space-y-2.5">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-[9px] font-extrabold text-black/82">
                        {project.name}
                        <ProjectLinks
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

          {/* Skills + Certs + Edu stacked */}
          <div className="space-y-5">
            {data.skillGroups.length > 0 && (
              <section>
                <SectionTitle accent={template.accent}>Skills</SectionTitle>
                <div className="space-y-1.5">
                  {data.skillGroups.map((group) => (
                    <p key={group.id} className="text-[8px] leading-[1.38] text-black/62">
                      <span className="font-extrabold text-black/78">{group.name}:</span>{" "}
                      {group.skills.join(", ")}
                    </p>
                  ))}
                </div>
              </section>
            )}
            <CertificationsSection data={data} accent={template.accent} compact />
            <EducationSection data={data} accent={template.accent} compact />
          </div>
        </div>
      </main>

      <div className="absolute bottom-5 left-10 right-10 flex justify-between border-t border-black/10 pt-2 text-[5px] uppercase tracking-[0.14em] text-black/22">
        <span>Performance · Planning · Decisions</span>
        <span>Resuvee · {template.name}</span>
      </div>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// HealthcareTemplate — Healthcare (sidebar left, main right)
// ---------------------------------------------------------------------------
export function HealthcareTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet
      pagePadding={pagePadding}
      className={cn("grid grid-cols-[174px_1fr] bg-[#fcfefe]", className)}
    >
      {/* Aside */}
      <aside className="relative bg-[#e7f2f0] px-6 py-8">
        <div
          aria-hidden="true"
          className="mb-7 h-1 w-12 rounded-full"
          style={{ backgroundColor: template.accent }}
        />
        <section>
          <SectionTitle accent={template.accent}>Contact</SectionTitle>
          <ContactList data={data} />
        </section>
        <div className="mt-6 space-y-5">
          {/* Skills with group names */}
          {data.skillGroups.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Skills</SectionTitle>
              <div className="space-y-2">
                {data.skillGroups.map((group) => (
                  <div key={group.id}>
                    <p className="mb-0.5 text-[7px] font-extrabold text-black/65">
                      {group.name}
                    </p>
                    <div className="flex flex-wrap gap-0.5">
                      {group.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="rounded-[3px] bg-white/55 px-1 py-0.5 text-[6.8px] text-black/55"
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
          <CertificationsSection data={data} accent={template.accent} compact />
        </div>
        <p className="absolute bottom-5 left-6 text-[5px] uppercase tracking-[0.14em] text-black/25">
          Care · Quality · Outcomes
        </p>
      </aside>

      {/* Main */}
      <main className="px-8 py-8">
        <header className="border-b border-black/15 pb-5">
          <p
            className="text-[8px] font-extrabold uppercase tracking-[0.17em]"
            style={{ color: template.accent }}
          >
            {data.basics.headline}
          </p>
          <h1 className="mt-2 text-[29px] font-bold leading-none tracking-[-0.045em] text-[#16312f]">
            {data.basics.fullName || "Your Name"}
          </h1>
        </header>
        <div className="mt-5 space-y-5">
          <SummarySection data={data} accent={template.accent} compact />

          {/* Experience with accent-colored company names */}
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
                        {dateRange(item.startDate, item.endDate, item.current)}
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

          {/* Projects with links */}
          {data.projects.length > 0 && (
            <div className="rounded-xl bg-[#f1f6f5] p-4">
              <SectionTitle accent={template.accent}>Selected projects</SectionTitle>
              <div className="space-y-2">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-[8.8px] font-extrabold text-black/80">
                        {project.name}
                        <ProjectLinks
                          link={project.link}
                          linkLabel={project.linkLabel}
                          githubUrl={project.githubUrl}
                          githubLabel={project.githubLabel}
                        />
                      </h3>
                      {project.date && (
                        <span className="shrink-0 text-[7px] text-black/38">{project.date}</span>
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
            </div>
          )}
        </div>
        <p className="absolute bottom-5 right-8 text-[5px] uppercase tracking-[0.14em] text-black/22">
          Resuvee · {template.name}
        </p>
      </main>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// SalesTemplate — Sales Impact (top accent bar, main + aside)
// ---------------------------------------------------------------------------
export function SalesTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet pagePadding={pagePadding} className={cn("bg-[#fffdfb]", className)}>
      <div className="h-3 w-full" style={{ backgroundColor: template.accent }} />
      <header className="mx-9 flex items-end justify-between gap-7 border-b border-black/20 pb-5 pt-7">
        <div>
          <h1 className="text-[30px] font-bold leading-none tracking-[-0.045em] text-[#2d211c]">
            {data.basics.fullName || "Your Name"}
          </h1>
          <p
            className="mt-2 text-[8px] font-extrabold uppercase tracking-[0.17em]"
            style={{ color: template.accent }}
          >
            {data.basics.headline}
          </p>
        </div>
        <div className="max-w-[220px]">
          <ContactList data={data} horizontal hideIcons />
        </div>
      </header>

      <main className="grid grid-cols-[1fr_165px] gap-7 px-9 py-6">
        {/* Main */}
        <div className="space-y-5">
          <SummarySection data={data} accent={template.accent} compact />

          {/* Experience with accent-colored company */}
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
                        {dateRange(item.startDate, item.endDate, item.current)}
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
        </div>

        {/* Aside */}
        <aside className="space-y-5 rounded-xl bg-[#f6eee9] px-4 py-4">
          {/* Projects with links */}
          {data.projects.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Projects</SectionTitle>
              <div className="space-y-2">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <h3 className="text-[8.5px] font-extrabold text-black/80">
                      {project.name}
                      <ProjectLinks
                        link={project.link}
                        linkLabel={project.linkLabel}
                        githubUrl={project.githubUrl}
                        githubLabel={project.githubLabel}
                      />
                    </h3>
                    {project.description && (
                      <p className="mt-0.5 text-[7.5px] leading-[1.4] text-black/50">
                        {project.description}
                      </p>
                    )}
                    {project.highlights.filter(Boolean).map((h, i) => (
                      <p key={i} className="mt-0.5 text-[7px] leading-[1.35] text-black/40">
                        — {h}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Skills with group names */}
          {data.skillGroups.length > 0 && (
            <section>
              <SectionTitle accent={template.accent}>Skills</SectionTitle>
              <div className="space-y-1.5">
                {data.skillGroups.map((group) => (
                  <p key={group.id} className="text-[7.8px] leading-[1.38] text-black/60">
                    <span className="font-extrabold text-black/72">{group.name}:</span>{" "}
                    {group.skills.join(", ")}
                  </p>
                ))}
              </div>
            </section>
          )}

          <EducationSection data={data} accent={template.accent} compact />
          <CertificationsSection data={data} accent={template.accent} compact />
        </aside>
      </main>

      <div className="absolute bottom-5 left-9 right-9 flex justify-between border-t border-black/10 pt-2 text-[5px] uppercase tracking-[0.14em] text-black/22">
        <span>Revenue · Relationships · Growth</span>
        <span>Resuvee · {template.name}</span>
      </div>
    </Sheet>
  );
}
