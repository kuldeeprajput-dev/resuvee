import Image from "next/image";
import type { ResumeData, ResumeTemplate } from "../../types/resume";
import { cn } from "@/shared/lib/utils";
import { ProfilePhoto, SectionTitle, ContactList, SummarySection, ExperienceSection, EducationSection, SkillsSection, ProjectsSection, Sheet } from "./resume-preview-shared";

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

export function BlueprintTemplate({ data, template, className, showPhoto = true }: ResumePreviewProps) {
  return (
    <Sheet className={cn("grid grid-cols-[172px_1fr] bg-[#fbfcfd]", className)}>
      <aside
        className="relative flex flex-col px-5 py-8 text-white"
        style={{ backgroundColor: template.accent }}
      >
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:18px_18px]" />
        <ProfilePhoto
          data={data}
          hidden={!showPhoto}
          className="relative mb-5 size-[78px] rounded-[14px] border-2 border-white/25"
        />
        <div className="relative space-y-6">
          <section>
            <SectionTitle accent={template.accent} inverted>
              Contact
            </SectionTitle>
            <ContactList data={data} inverted />
          </section>
          <SkillsSection data={data} accent={template.accent} inverted compact pills />
          <ProjectsSection data={data} accent={template.accent} inverted compact />
        </div>
        <p className="relative mt-auto text-[5px] uppercase tracking-[0.14em] text-white/25">
          Resulyra · {template.name}
        </p>
      </aside>

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
          <EducationSection data={data} accent={template.accent} compact />
        </div>
      </main>
    </Sheet>
  );
}

export function ChronologicalTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet pagePadding={pagePadding} className={cn("bg-white px-11 py-10", className)}>
      <header className="border-b-2 pb-4" style={{ borderColor: template.accent }}>
        <div className="flex items-end justify-between gap-7">
          <div>
            <h1 className="text-[29px] font-bold leading-none tracking-[-0.045em] text-black/90">
              {data.basics.fullName || "Your Name"}
            </h1>
            <p
              className="mt-2 text-[7px] font-bold uppercase tracking-[0.17em]"
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
        <div className="grid grid-cols-2 gap-8 border-t border-black/12 pt-5">
          <EducationSection data={data} accent={template.accent} compact />
          <SkillsSection data={data} accent={template.accent} compact pills />
        </div>
        {data.projects.length > 0 && (
          <div className="border-t border-black/12 pt-5">
            <ProjectsSection data={data} accent={template.accent} compact />
          </div>
        )}
      </main>

      <div className="absolute bottom-5 left-11 right-11 flex justify-between border-t border-black/10 pt-2 text-[5px] uppercase tracking-[0.14em] text-black/22">
        <span>{data.basics.website}</span>
        <span>Resulyra · {template.name}</span>
      </div>
    </Sheet>
  );
}

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

      <main className="mt-4 grid grid-cols-[1fr_150px] gap-7">
        <div className="space-y-4">
          <SummarySection data={data} accent={template.accent} compact />
          <ExperienceSection data={data} accent={template.accent} compact />
          <ProjectsSection data={data} accent={template.accent} compact />
        </div>
        <aside className="space-y-5 border-l border-black/12 pl-5">
          <SkillsSection data={data} accent={template.accent} compact />
          <EducationSection data={data} accent={template.accent} compact />
        </aside>
      </main>

      <p className="absolute bottom-4 right-9 text-[5px] uppercase tracking-[0.14em] text-black/20">
        Resulyra · {template.name}
      </p>
    </Sheet>
  );
}

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
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-8 rounded-xl bg-[#f4f5f2] p-4">
          <SkillsSection data={data} accent={template.accent} compact pills />
          <ProjectsSection data={data} accent={template.accent} compact />
        </div>
        <ExperienceSection data={data} accent={template.accent} compact />
        <div className="border-t border-black/12 pt-4">
          <EducationSection data={data} accent={template.accent} compact />
        </div>
      </main>

      <p className="absolute bottom-5 right-10 text-[5px] uppercase tracking-[0.14em] text-black/20">
        Resulyra · {template.name}
      </p>
    </Sheet>
  );
}

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
        <div className="rounded-lg border border-black/[0.07] bg-[#f3f5f2] p-4">
          <SummarySection data={data} accent={template.accent} compact />
        </div>
        <div className="mt-6">
          <ExperienceSection data={data} accent={template.accent} compact />
        </div>
        <div className="mt-6 grid grid-cols-[1.15fr_0.85fr] gap-8 border-t border-black/12 pt-5">
          <ProjectsSection data={data} accent={template.accent} compact />
          <div className="space-y-5">
            <SkillsSection data={data} accent={template.accent} compact pills />
            <EducationSection data={data} accent={template.accent} compact />
          </div>
        </div>
      </main>

      <div className="absolute bottom-5 left-10 right-10 flex justify-between border-t border-black/10 pt-2 text-[5px] uppercase tracking-[0.14em] text-black/22">
        <span>Performance · Planning · Decisions</span>
        <span>Resulyra · {template.name}</span>
      </div>
    </Sheet>
  );
}

export function HealthcareTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet
      pagePadding={pagePadding}
      className={cn("grid grid-cols-[174px_1fr] bg-[#fcfefe]", className)}
    >
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
        <div className="mt-7 space-y-6">
          <SkillsSection data={data} accent={template.accent} compact pills />
          <EducationSection data={data} accent={template.accent} compact />
        </div>
        <p className="absolute bottom-5 left-6 text-[5px] uppercase tracking-[0.14em] text-black/25">
          Care · Quality · Outcomes
        </p>
      </aside>

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
          <ExperienceSection data={data} accent={template.accent} compact />
          <div className="rounded-xl bg-[#f1f6f5] p-4">
            <ProjectsSection data={data} accent={template.accent} compact />
          </div>
        </div>
        <p className="absolute bottom-5 right-8 text-[5px] uppercase tracking-[0.14em] text-black/22">
          Resulyra · {template.name}
        </p>
      </main>
    </Sheet>
  );
}

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
        <div className="space-y-5">
          <SummarySection data={data} accent={template.accent} compact />
          <ExperienceSection data={data} accent={template.accent} compact />
        </div>
        <aside className="space-y-5 rounded-xl bg-[#f6eee9] px-4 py-5">
          <ProjectsSection data={data} accent={template.accent} compact />
          <SkillsSection data={data} accent={template.accent} compact pills />
          <EducationSection data={data} accent={template.accent} compact />
        </aside>
      </main>

      <div className="absolute bottom-5 left-9 right-9 flex justify-between border-t border-black/10 pt-2 text-[5px] uppercase tracking-[0.14em] text-black/22">
        <span>Revenue · Relationships · Growth</span>
        <span>Resulyra · {template.name}</span>
      </div>
    </Sheet>
  );
}

function AnalystRuleTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 border-b border-black/70 pb-1 text-[11px] font-bold tracking-[0.015em] text-black/90">
      {children}
    </h2>
  );
}

