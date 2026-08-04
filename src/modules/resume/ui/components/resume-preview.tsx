import Image from "next/image";
import type { ResumeData, ResumeTemplate } from "../../types/resume";
import { cn } from "@/shared/lib/utils";
import { ProfilePhoto, ContactList, SummarySection, ExperienceSection, EducationSection, SkillsSection, ProjectsSection, CertificationsSection, Sheet } from "./resume-preview-shared";
import { BlueprintTemplate, ChronologicalTemplate, CompactTemplate, HybridTemplate, FinanceTemplate, HealthcareTemplate, SalesTemplate } from "./resume-preview-templates";
import { AnalystTemplate, FresherTemplate, FirstStepTemplate, PivotTemplate } from "./resume-preview-specialist-templates";

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

function MeridianTemplate(props: ResumePreviewProps) {
  const { data, template, className, showPhoto = true, pagePadding } = props;
  return (
    <Sheet pagePadding={pagePadding} className={cn("bg-[#fbfdfb]", className)}>
      <div className="absolute -left-16 -top-20 size-60 rounded-full bg-[#d9f1e4]" />
      <div className="absolute left-10 top-8 size-[100px] rounded-[32px] bg-[#9ddbb8]/70" />
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

      <div className="relative grid grid-cols-[165px_1fr] gap-7 px-11 pb-10">
        <aside className="space-y-5 rounded-[18px] bg-[#edf6f0] px-4 py-5">
          <SkillsSection data={data} accent={template.accent} compact pills />
          <ProjectsSection data={data} accent={template.accent} compact />
          <CertificationsSection data={data} accent={template.accent} compact />
          <EducationSection data={data} accent={template.accent} compact />
        </aside>
        <main className="space-y-5">
          <SummarySection data={data} accent={template.accent} compact />
          <ExperienceSection data={data} accent={template.accent} compact />
        </main>
      </div>
      <p className="absolute bottom-5 right-11 text-[5.5px] font-semibold uppercase tracking-[0.14em] text-black/25">
        Resuvee · {template.name}
      </p>
    </Sheet>
  );
}

function EditorialTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet
      pagePadding={pagePadding}
      className={cn("bg-[#fffefb] px-9 py-7 font-serif flex flex-col justify-between min-h-[842px] h-[842px]", className)}
    >
      <div>
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
          {data.basics.summary && (
            <section className="border-b border-black/25 pb-2 text-center">
              <h2 className="mb-0.5 text-[8px] font-bold">Professional profile</h2>
              <p className="mx-auto max-w-[475px] text-[6.8px] leading-[1.4] text-black/58">
                {data.basics.summary}
              </p>
            </section>
          )}
          <div className="space-y-3 pt-3 font-sans">
            <SkillsSection data={data} accent={template.accent} compact pills />
            <ExperienceSection data={data} accent={template.accent} compact />
            <ProjectsSection data={data} accent={template.accent} compact />
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

function SummitTemplate(props: ResumePreviewProps) {
  const { data, template, className, showPhoto = true, pagePadding } = props;
  return (
    <Sheet
      pagePadding={pagePadding}
      className={cn("grid grid-cols-[1fr_178px] bg-[#fcfdff]", className)}
    >
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
          <EducationSection data={data} accent={template.accent} compact />
        </div>
      </main>

      <aside
        className="relative flex flex-col px-5 py-8 text-white"
        style={{ backgroundColor: template.accent }}
      >
        <div className="absolute right-0 top-0 h-24 w-12 bg-white/[0.06]" />
        <ProfilePhoto
          data={data}
          hidden={!showPhoto}
          className="relative z-10 mb-6 size-[90px] self-center rounded-full border-4 border-white/20"
        />
        <div className="space-y-6">
          <ProjectsSection data={data} accent={template.accent} inverted compact />
          <SkillsSection data={data} accent={template.accent} inverted compact />
        </div>
        <p className="mt-auto text-[5px] uppercase tracking-[0.14em] text-white/25">
          Resuvee · {template.name}
        </p>
      </aside>
    </Sheet>
  );
}

function ColumnTemplate(props: ResumePreviewProps) {
  const { data, template, className, pagePadding } = props;
  return (
    <Sheet pagePadding={pagePadding} className={cn("bg-white px-11 py-10", className)}>
      <header className="mb-6 flex items-end justify-between gap-6 border-b border-black/70 pb-4">
        <div>
          <h1 className="text-[30px] font-light leading-none tracking-[-0.05em] text-black/90">
            {data.basics.fullName || "Your Name"}
          </h1>
          <p className="mt-2 text-[7px] font-bold uppercase tracking-[0.2em] text-black/50">
            {data.basics.headline}
          </p>
        </div>
        <div className="max-w-[210px]">
          <ContactList data={data} horizontal hideIcons />
        </div>
      </header>

      <div className="grid grid-cols-[138px_1fr] gap-8">
        <aside className="space-y-6 border-r border-black/10 pr-6">
          <SkillsSection data={data} accent={template.accent} compact />
          <EducationSection data={data} accent={template.accent} compact />
          <ProjectsSection data={data} accent={template.accent} compact />
        </aside>
        <main className="space-y-5">
          <SummarySection data={data} accent={template.accent} compact />
          <ExperienceSection data={data} accent={template.accent} compact />
        </main>
      </div>
      <p className="absolute bottom-5 left-11 text-[5px] uppercase tracking-[0.18em] text-black/20">
        Resuvee · {template.name}
      </p>
    </Sheet>
  );
}

function HorizonTemplate(props: ResumePreviewProps) {
  const { data, template, className, showPhoto = true, pagePadding } = props;
  return (
    <Sheet pagePadding={pagePadding} className={cn("bg-[#fbfdff]", className)}>
      <div className="absolute -right-16 -top-24 h-52 w-[430px] rotate-6 rounded-[50%] bg-[#dceeff]" />
      <div className="absolute -right-6 -top-20 h-44 w-[350px] rotate-6 rounded-[50%] border-[18px] border-white/55" />
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

      <div className="relative grid grid-cols-[1.3fr_0.7fr] gap-7 px-10 pb-9">
        <main className="space-y-5">
          <SummarySection data={data} accent={template.accent} compact />
          <ExperienceSection data={data} accent={template.accent} compact />
        </main>
        <aside className="space-y-5 border-l border-[#9fc9f0]/40 pl-6">
          <ProjectsSection data={data} accent={template.accent} compact />
          <SkillsSection data={data} accent={template.accent} compact pills />
          <EducationSection data={data} accent={template.accent} compact />
        </aside>
      </div>
      <p className="absolute bottom-5 right-10 text-[5px] uppercase tracking-[0.14em] text-[#2d70a6]/35">
        Resuvee · {template.name}
      </p>
    </Sheet>
  );
}

export function ResumePreview(props: ResumePreviewProps) {
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
