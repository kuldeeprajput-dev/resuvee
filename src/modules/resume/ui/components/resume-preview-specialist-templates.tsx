import Image from "next/image";
import type { ResumeData, ResumeTemplate } from "../../types/resume";
import { cn } from "@/shared/lib/utils";
import { ProfilePhoto, SectionTitle, ContactList, SummarySection, ExperienceSection, EducationSection, SkillsSection, ProjectsSection, CertificationsSection, Sheet } from "./resume-preview-shared";

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

function AnalystRuleTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 border-b border-black/70 pb-1 text-[11px] font-bold tracking-[0.015em] text-black/90">
      {children}
    </h2>
  );
}
export function AnalystTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  const certifications = data.certifications ?? [];

  return (
    <Sheet
      pagePadding={pagePadding}
      className={cn("bg-white px-8 py-6 font-serif text-[#202020] flex flex-col justify-between min-h-[842px] h-[842px]", className)}
    >
      <div>
        <header className="text-center">
          <h1 className="text-[25px] font-semibold leading-none tracking-[0.045em]">
            {data.basics.fullName || "Your Name"}
          </h1>
          <p className="mt-1.5 text-[13px] font-semibold leading-none">
            {data.basics.headline || "Data Analyst"}
          </p>
          <div className="mt-2.5 flex justify-center">
            <ContactList data={data} horizontal />
          </div>
        </header>

        <main className="mt-4 space-y-2.5">
          {data.basics.summary && (
            <section>
              <AnalystRuleTitle>Summary</AnalystRuleTitle>
              <p className="text-[8.5px] leading-[1.38] text-black/75">{data.basics.summary}</p>
            </section>
          )}

          {data.skillGroups.length > 0 && (
            <section>
              <AnalystRuleTitle>Skills</AnalystRuleTitle>
              <div className="space-y-0.5 text-[8.2px] leading-[1.3] text-black/75">
                {data.skillGroups.map((group) => (
                  <p key={group.id}>
                    <span className="font-bold text-black/90">{group.name}:</span>{" "}
                    {group.skills.join(", ")}
                  </p>
                ))}
              </div>
            </section>
          )}

          {data.experience.length > 0 && (
            <section>
              <AnalystRuleTitle>Experience</AnalystRuleTitle>
              <div className="space-y-2">
                {data.experience.map((item) => (
                  <article key={item.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-[9px] font-bold">{item.role}</h3>
                      <p className="shrink-0 text-[8px] font-bold">
                        {[item.startDate, item.current ? "Present" : item.endDate]
                          .filter(Boolean)
                          .join(" – ")}
                      </p>
                    </div>
                    <div className="mt-0.5 flex items-baseline justify-between gap-4 text-[7.8px] italic text-black/65">
                      <p>{item.company}</p>
                      <p className="text-right">{item.location}</p>
                    </div>
                    <ul className="mt-1 space-y-0.5 pl-3.5 text-[7.8px] leading-[1.3] text-black/72">
                      {item.highlights.filter(Boolean).map((highlight, index) => (
                        <li key={`${item.id}-${index}`} className="list-[square]">
                          {highlight}
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
              <AnalystRuleTitle>Projects</AnalystRuleTitle>
              <div className="space-y-2">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="min-w-0 text-[8.8px] font-bold">
                        {project.name}
                        {project.description && (
                          <span className="font-normal italic text-black/60">
                            {" "}
                            · {project.description}
                          </span>
                        )}
                      </h3>
                      <p className="shrink-0 text-[7.8px] font-bold">{project.date}</p>
                    </div>
                    <ul className="mt-0.5 space-y-0.5 pl-3.5 text-[7.8px] leading-[1.3] text-black/72">
                      {project.highlights.filter(Boolean).map((highlight, index) => (
                        <li key={`${project.id}-${index}`} className="list-[square]">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <AnalystRuleTitle>Awards & certifications</AnalystRuleTitle>
              <ul className="space-y-0.5 pl-3.5 text-[7.8px] leading-[1.3] text-black/72">
                {certifications.map((item) => (
                  <li key={item.id} className="list-disc">
                    <span className="font-bold text-black/88">{item.title}</span>
                    {item.issuer && <span> — {item.issuer}</span>}
                    {item.date && <span> ({item.date})</span>}
                    {item.description && item.description !== item.issuer && (
                      <span>: {item.description}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.education.length > 0 && (
            <section>
              <AnalystRuleTitle>Education</AnalystRuleTitle>
              {data.education.map((item) => (
                <article key={item.id} className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-[8.8px] font-bold">{item.degree}</h3>
                    <p className="mt-0.5 text-[7.8px] italic text-black/65">
                      {[item.school, item.location].filter(Boolean).join(", ")}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[8px] font-bold">
                      {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
                    </p>
                    <p className="mt-0.5 text-[7.5px] italic text-black/60">{item.details}</p>
                  </div>
                </article>
              ))}
            </section>
          )}
        </main>
      </div>

      <div className="mt-auto pt-2 flex items-center justify-end text-[5px] uppercase tracking-[0.14em] text-black/20">
        Resuvee · {template.name}
      </div>
    </Sheet>
  );
}

export function FresherTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet pagePadding={pagePadding} className={cn("bg-white px-11 py-10", className)}>
      <header className="text-center">
        <h1 className="text-[29px] font-bold leading-none tracking-[-0.045em] text-black/90">
          {data.basics.fullName || "Your Name"}
        </h1>
        <p
          className="mt-2 text-[7px] font-bold uppercase tracking-[0.17em]"
          style={{ color: template.accent }}
        >
          {data.basics.headline || "Graduate candidate"}
        </p>
        <div className="mt-3 flex justify-center">
          <ContactList data={data} horizontal hideIcons />
        </div>
        <div className="mx-auto mt-4 h-1 w-16" style={{ backgroundColor: template.accent }} />
      </header>

      <main className="mt-6 space-y-5">
        <SummarySection data={data} accent={template.accent} compact />
        <EducationSection data={data} accent={template.accent} compact />
        <ProjectsSection data={data} accent={template.accent} compact />
        <SkillsSection data={data} accent={template.accent} compact pills />
      </main>

      <div className="absolute bottom-5 left-11 right-11 flex justify-between border-t border-black/10 pt-2 text-[5px] uppercase tracking-[0.14em] text-black/22">
        <span>Education · Projects · Skills</span>
        <span>Resuvee · {template.name}</span>
      </div>
    </Sheet>
  );
}

export function FirstStepTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet
      pagePadding={pagePadding}
      className={cn("grid grid-cols-[176px_1fr] bg-[#fbfcff]", className)}
    >
      <aside className="relative bg-[#edf3f9] px-6 py-9">
        <div
          className="absolute inset-x-0 top-0 h-2"
          style={{ backgroundColor: template.accent }}
        />
        <div className="space-y-6 pt-20">
          <EducationSection data={data} accent={template.accent} compact />
          <SkillsSection data={data} accent={template.accent} compact pills />
        </div>
        <p className="absolute bottom-5 left-6 text-[5px] uppercase tracking-[0.14em] text-black/25">
          Resuvee · {template.name}
        </p>
      </aside>

      <main className="px-8 py-9">
        <header className="border-b-2 pb-5" style={{ borderColor: template.accent }}>
          <p
            className="text-[7px] font-bold uppercase tracking-[0.17em]"
            style={{ color: template.accent }}
          >
            {data.basics.headline || "Internship candidate"}
          </p>
          <h1 className="mt-2 text-[29px] font-bold leading-none tracking-[-0.045em] text-[#172c43]">
            {data.basics.fullName || "Your Name"}
          </h1>
          <div className="mt-3">
            <ContactList data={data} horizontal hideIcons />
          </div>
        </header>

        <div className="mt-6 space-y-6">
          <SummarySection data={data} accent={template.accent} compact />
          <ProjectsSection data={data} accent={template.accent} compact />
        </div>
      </main>
    </Sheet>
  );
}

export function PivotTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet
      pagePadding={pagePadding}
      className={cn("grid grid-cols-[164px_1fr] bg-[#fffdfd]", className)}
    >
      <aside className="flex flex-col bg-[#f3edef] px-5 py-8">
        <div
          aria-hidden="true"
          className="mb-7 h-1 w-12 rounded-full"
          style={{ backgroundColor: template.accent }}
        />
        <div className="space-y-6">
          <SkillsSection data={data} accent={template.accent} compact pills />
          <EducationSection data={data} accent={template.accent} compact />
        </div>
        <p className="mt-auto text-[5px] uppercase tracking-[0.14em] text-black/25">
          Transferable strengths
        </p>
      </aside>

      <main className="px-8 py-8">
        <header className="border-b border-black/15 pb-5">
          <p
            className="text-[7px] font-extrabold uppercase tracking-[0.16em]"
            style={{ color: template.accent }}
          >
            {data.basics.headline}
          </p>
          <h1 className="mt-2 text-[29px] font-bold leading-none tracking-[-0.045em]">
            {data.basics.fullName || "Your Name"}
          </h1>
          <div className="mt-3">
            <ContactList data={data} horizontal hideIcons />
          </div>
        </header>

        <div className="mt-5 space-y-5">
          <SummarySection data={data} accent={template.accent} compact />
          <div className="rounded-xl bg-[#f7f4f5] p-4">
            <ProjectsSection data={data} accent={template.accent} compact />
          </div>
          <ExperienceSection data={data} accent={template.accent} compact />
        </div>
        <p className="absolute bottom-5 right-8 text-[5px] uppercase tracking-[0.14em] text-black/22">
          Resuvee · {template.name}
        </p>
      </main>
    </Sheet>
  );
}

