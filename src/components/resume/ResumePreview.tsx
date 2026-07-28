import Image from "next/image";
import {
  Globe2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type {
  ResumeData,
  ResumeTemplate,
} from "@/types/resume";
import { cn } from "@/lib/utils";

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

interface SectionProps {
  data: ResumeData;
  accent: string;
  inverted?: boolean;
  compact?: boolean;
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CV"
  );
}

function ProfilePhoto({
  data,
  className,
  hidden = false,
}: {
  data: ResumeData;
  className?: string;
  hidden?: boolean;
}) {
  if (hidden) return null;
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-[#dde4e0] font-sans text-lg font-bold text-[#39534a]",
        className,
      )}
    >
      {data.basics.photo ? (
        <Image
          src={data.basics.photo}
          alt={`${data.basics.fullName || "Candidate"} profile`}
          fill
          unoptimized
          sizes="120px"
          className="object-cover"
        />
      ) : (
        initials(data.basics.fullName)
      )}
    </div>
  );
}

function SectionTitle({
  children,
  accent,
  inverted = false,
  centered = false,
  boxed = false,
}: {
  children: React.ReactNode;
  accent: string;
  inverted?: boolean;
  centered?: boolean;
  boxed?: boolean;
}) {
  if (boxed) {
    return (
      <h2
        className={cn(
          "mb-2.5 inline-flex rounded-[3px] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.13em]",
          inverted ? "bg-white/12 text-white" : "text-white",
        )}
        style={!inverted ? { backgroundColor: accent } : undefined}
      >
        {children}
      </h2>
    );
  }

  return (
    <div
      className={cn(
        "mb-2.5 flex items-center gap-2",
        centered && "justify-center",
      )}
    >
      {!centered && (
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-[2px]",
            inverted && "bg-white/80",
          )}
          style={!inverted ? { backgroundColor: accent } : undefined}
        />
      )}
      <h2
        className={cn(
          "shrink-0 text-[9px] font-extrabold uppercase tracking-[0.13em]",
          inverted ? "text-white/85" : "text-black/80",
        )}
      >
        {children}
      </h2>
      <span
        className={cn(
          "h-px flex-1",
          inverted ? "bg-white/25" : "bg-black/14",
        )}
      />
    </div>
  );
}

function ContactList({
  data,
  inverted = false,
  horizontal = false,
  hideIcons = false,
}: {
  data: ResumeData;
  inverted?: boolean;
  horizontal?: boolean;
  hideIcons?: boolean;
}) {
  const items = [
    { id: "email", icon: Mail, value: data.basics.email },
    { id: "phone", icon: Phone, value: data.basics.phone },
    { id: "location", icon: MapPin, value: data.basics.location },
    { id: "website", icon: Globe2, value: data.basics.website },
  ].filter((item) => item.value?.trim());

  return (
    <div
      className={cn(
        "text-[8px] leading-[1.42]",
        horizontal
          ? "flex flex-wrap items-center gap-x-3 gap-y-1"
          : "space-y-2",
        inverted ? "text-white/65" : "text-black/52",
      )}
    >
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-1.5">
          {!hideIcons && <item.icon className="size-2 shrink-0 opacity-70" />}
          <span className="break-all">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function SummarySection({
  data,
  accent,
  inverted = false,
  compact = false,
}: SectionProps) {
  if (!data.basics.summary) return null;
  return (
    <section>
      <SectionTitle accent={accent} inverted={inverted}>
        Profile
      </SectionTitle>
      <p
        className={cn(
          compact ? "text-[9.2px]" : "text-[9.8px]",
          "leading-[1.5]",
          inverted ? "text-white/65" : "text-black/62",
        )}
      >
        {data.basics.summary}
      </p>
    </section>
  );
}

function ExperienceSection({
  data,
  accent,
  inverted = false,
  compact = false,
}: SectionProps) {
  if (!data.experience.length) return null;

  return (
    <section>
      <SectionTitle accent={accent} inverted={inverted}>
        Experience
      </SectionTitle>
      <div className={compact ? "space-y-3" : "space-y-4"}>
        {data.experience.map((item) => (
          <article key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3
                  className={cn(
                    "text-[10px] font-extrabold leading-tight",
                    inverted ? "text-white" : "text-black/85",
                  )}
                >
                  {item.role || "Role title"}
                </h3>
                <p
                  className={cn(
                    "mt-0.5 text-[8.5px] font-bold",
                    inverted && "text-white/65",
                  )}
                  style={!inverted ? { color: accent } : undefined}
                >
                  {[item.company, item.location].filter(Boolean).join(" · ") ||
                    "Company"}
                </p>
              </div>
              <p
                className={cn(
                  "shrink-0 text-[7.5px] font-semibold",
                  inverted ? "text-white/45" : "text-black/42",
                )}
              >
                {[item.startDate, item.current ? "Present" : item.endDate]
                  .filter(Boolean)
                  .join(" — ")}
              </p>
            </div>
            <ul className={cn("mt-1.5", compact ? "space-y-0.5" : "space-y-1")}>
              {item.highlights.filter(Boolean).map((highlight, index) => (
                <li
                  key={`${item.id}-${index}`}
                  className={cn(
                    "flex gap-1.5 leading-[1.42]",
                    compact ? "text-[8.7px]" : "text-[9.2px]",
                    inverted ? "text-white/62" : "text-black/58",
                  )}
                >
                  <span
                    className={cn(
                      "mt-[3.5px] size-1 shrink-0 rounded-full",
                      inverted && "bg-white/50",
                    )}
                    style={!inverted ? { backgroundColor: accent } : undefined}
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function EducationSection({
  data,
  accent,
  inverted = false,
  compact = false,
}: SectionProps) {
  if (!data.education.length) return null;
  return (
    <section>
      <SectionTitle accent={accent} inverted={inverted}>
        Education
      </SectionTitle>
      <div className={compact ? "space-y-2.5" : "space-y-3"}>
        {data.education.map((item) => (
          <article key={item.id}>
            <h3
              className={cn(
                "text-[9.2px] font-extrabold leading-tight",
                inverted ? "text-white" : "text-black/82",
              )}
            >
              {item.degree || "Degree"}
            </h3>
            <p
              className={cn(
                "mt-0.5 text-[8.2px] leading-snug",
                inverted ? "text-white/62" : "text-black/55",
              )}
            >
              {item.school || "School"}
            </p>
            <div
              className={cn(
                "mt-0.5 flex flex-wrap justify-between gap-1 text-[7.2px]",
                inverted ? "text-white/40" : "text-black/38",
              )}
            >
              <span>
                {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
              </span>
              <span>{item.details}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SkillsSection({
  data,
  accent,
  inverted = false,
  pills = false,
}: SectionProps & { pills?: boolean }) {
  if (!data.skillGroups.length) return null;
  return (
    <section>
      <SectionTitle accent={accent} inverted={inverted}>
        Skills
      </SectionTitle>
      <div className="space-y-2.5">
        {data.skillGroups.map((group) => (
          <div key={group.id}>
            <h3
              className={cn(
                "mb-1 text-[8px] font-extrabold",
                inverted ? "text-white/88" : "text-black/72",
              )}
            >
              {group.name || "Skills"}
            </h3>
            <div className={cn(pills && "flex flex-wrap gap-1")}>
              {pills ? (
                group.skills.map((skill, index) => (
                  <span
                    key={`${group.id}-${index}`}
                    className={cn(
                      "rounded-[3px] px-1.5 py-0.5 text-[7.3px]",
                      inverted
                        ? "bg-white/10 text-white/65"
                        : "bg-black/[0.045] text-black/58",
                    )}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p
                  className={cn(
                    "text-[8.1px] leading-[1.5]",
                    inverted ? "text-white/58" : "text-black/52",
                  )}
                >
                  {group.skills.join(" · ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({
  data,
  accent,
  inverted = false,
  compact = false,
}: SectionProps) {
  if (!data.projects.length) return null;
  return (
    <section>
      <SectionTitle accent={accent} inverted={inverted}>
        Selected projects
      </SectionTitle>
      <div className={compact ? "space-y-2.5" : "space-y-3"}>
        {data.projects.map((project) => (
          <article key={project.id}>
            <div className="flex items-baseline justify-between gap-2">
              <h3
                className={cn(
                  "text-[9.2px] font-extrabold",
                  inverted ? "text-white" : "text-black/82",
                )}
              >
                {project.name || "Project name"}
              </h3>
              {project.link && (
                <span
                  className={cn(
                    "text-[6.8px]",
                    inverted ? "text-white/38" : "text-black/35",
                  )}
                >
                  {project.link}
                </span>
              )}
            </div>
            <p
              className={cn(
                "mt-0.5 text-[8.1px] leading-[1.45]",
                inverted ? "text-white/58" : "text-black/52",
              )}
            >
              {project.description}
            </p>
            {project.highlights.filter(Boolean).map((highlight, index) => (
              <p
                key={`${project.id}-${index}`}
                className={cn(
                  "mt-0.5 text-[7.7px] leading-[1.4]",
                  inverted ? "text-white/45" : "text-black/45",
                )}
              >
                — {highlight}
              </p>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}

function Sheet({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <article
      className={cn(
        "resume-print-area relative aspect-[210/297] min-h-[842px] w-[595px] overflow-hidden bg-white font-sans text-[#202823] shadow-[0_24px_65px_rgba(22,32,28,0.18)] transition-all duration-200",
        className,
      )}
      style={style}
    >
      {children}
    </article>
  );
}

function MeridianTemplate({
  data,
  template,
  className,
  showPhoto = true,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("bg-[#fbfdfb]", className)}>
      <div className="absolute -left-16 -top-20 size-60 rounded-full bg-[#d9f1e4]" />
      <div className="absolute left-16 top-4 size-24 rounded-[32px] bg-[#9ddbb8]/70" />
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
          <SkillsSection
            data={data}
            accent={template.accent}
            compact
            pills
          />
          <ProjectsSection
            data={data}
            accent={template.accent}
            compact
          />
          <EducationSection
            data={data}
            accent={template.accent}
            compact
          />
        </aside>
        <main className="space-y-5">
          <SummarySection data={data} accent={template.accent} compact />
          <ExperienceSection data={data} accent={template.accent} compact />
        </main>
      </div>
      <p className="absolute bottom-5 right-11 text-[5.5px] font-semibold uppercase tracking-[0.14em] text-black/25">
        Resulyra · {template.name}
      </p>
    </Sheet>
  );
}

function EditorialTemplate({
  data,
  template,
  className,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("bg-[#fffefb] px-10 py-9 font-serif", className)}>
      <header className="border-b border-black/55 pb-4 text-center">
        <h1 className="text-[27px] font-semibold uppercase leading-none tracking-[0.08em] text-black/85">
          {data.basics.fullName || "Your Name"}
        </h1>
        <p
          className="mt-2 text-[7px] font-bold uppercase tracking-[0.16em]"
          style={{ color: template.accent }}
        >
          {data.basics.headline}
        </p>
        <div className="mt-2 flex justify-center font-sans">
          <ContactList data={data} horizontal hideIcons />
        </div>
      </header>

      <main className="pt-4">
        {data.basics.summary && (
          <section className="border-b border-black/25 pb-3 text-center">
            <h2 className="mb-1 text-[8px] font-bold">Professional profile</h2>
            <p className="mx-auto max-w-[475px] text-[6.8px] leading-[1.5] text-black/58">
              {data.basics.summary}
            </p>
          </section>
        )}
        <div className="space-y-4 pt-4 font-sans">
          <ExperienceSection data={data} accent={template.accent} compact />
          <EducationSection data={data} accent={template.accent} compact />
          <div className="grid grid-cols-2 gap-8 border-t border-black/20 pt-4">
            <ProjectsSection data={data} accent={template.accent} compact />
            <SkillsSection
              data={data}
              accent={template.accent}
              compact
              pills
            />
          </div>
        </div>
      </main>
      <div className="absolute inset-x-10 bottom-5 flex items-center justify-between border-t border-black/15 pt-2 font-sans text-[5px] uppercase tracking-[0.12em] text-black/25">
        <span>{data.basics.website}</span>
        <span>Resulyra · {template.name}</span>
      </div>
    </Sheet>
  );
}

function SummitTemplate({
  data,
  template,
  className,
  showPhoto = true,
}: ResumePreviewProps) {
  return (
    <Sheet
      className={cn(
        "grid grid-cols-[1fr_178px] bg-[#fcfdff]",
        className,
      )}
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
          <ProjectsSection
            data={data}
            accent={template.accent}
            inverted
            compact
          />
          <SkillsSection
            data={data}
            accent={template.accent}
            inverted
            compact
          />
        </div>
        <p className="mt-auto text-[5px] uppercase tracking-[0.14em] text-white/25">
          Resulyra · {template.name}
        </p>
      </aside>
    </Sheet>
  );
}

function ColumnTemplate({
  data,
  template,
  className,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("bg-white px-11 py-10", className)}>
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
          <SkillsSection
            data={data}
            accent={template.accent}
            compact
          />
          <EducationSection
            data={data}
            accent={template.accent}
            compact
          />
          <ProjectsSection
            data={data}
            accent={template.accent}
            compact
          />
        </aside>
        <main className="space-y-5">
          <SummarySection data={data} accent={template.accent} compact />
          <ExperienceSection data={data} accent={template.accent} compact />
        </main>
      </div>
      <p className="absolute bottom-5 left-11 text-[5px] uppercase tracking-[0.18em] text-black/20">
        Resulyra · {template.name}
      </p>
    </Sheet>
  );
}

function HorizonTemplate({
  data,
  template,
  className,
  showPhoto = true,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("bg-[#fbfdff]", className)}>
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
          <ProjectsSection
            data={data}
            accent={template.accent}
            compact
          />
          <SkillsSection
            data={data}
            accent={template.accent}
            compact
            pills
          />
          <EducationSection
            data={data}
            accent={template.accent}
            compact
          />
        </aside>
      </div>
      <p className="absolute bottom-5 right-10 text-[5px] uppercase tracking-[0.14em] text-[#2d70a6]/35">
        Resulyra · {template.name}
      </p>
    </Sheet>
  );
}

function BlueprintTemplate({
  data,
  template,
  className,
  showPhoto = true,
}: ResumePreviewProps) {
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
          <SkillsSection
            data={data}
            accent={template.accent}
            inverted
            compact
            pills
          />
          <ProjectsSection
            data={data}
            accent={template.accent}
            inverted
            compact
          />
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
          <div
            className="mt-4 h-[3px] w-14"
            style={{ backgroundColor: template.accent }}
          />
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

function ChronologicalTemplate({
  data,
  template,
  className,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("bg-white px-11 py-10", className)}>
      <header
        className="border-b-2 pb-4"
        style={{ borderColor: template.accent }}
      >
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
          <SkillsSection
            data={data}
            accent={template.accent}
            compact
            pills
          />
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

function CompactTemplate({
  data,
  template,
  className,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("bg-white px-9 py-8", className)}>
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

function HybridTemplate({
  data,
  template,
  className,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("bg-white px-10 py-9", className)}>
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
        <div
          className="mt-4 h-1.5 w-full"
          style={{ backgroundColor: template.accent }}
        />
      </header>

      <main className="mt-5 space-y-5">
        <SummarySection data={data} accent={template.accent} compact />
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-8 rounded-xl bg-[#f4f5f2] p-4">
          <SkillsSection
            data={data}
            accent={template.accent}
            compact
            pills
          />
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

function FinanceTemplate({
  data,
  template,
  className,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("bg-[#fffefd]", className)}>
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

function HealthcareTemplate({
  data,
  template,
  className,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("grid grid-cols-[174px_1fr] bg-[#fcfefe]", className)}>
      <aside className="relative bg-[#e7f2f0] px-6 py-8">
        <div
          className="flex size-14 items-center justify-center rounded-2xl text-[18px] font-bold text-white shadow-sm"
          style={{ backgroundColor: template.accent }}
        >
          {initials(data.basics.fullName)}
        </div>
        <section className="mt-7">
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

function SalesTemplate({
  data,
  template,
  className,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("bg-[#fffdfb]", className)}>
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

function FresherTemplate({
  data,
  template,
  className,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("bg-white px-11 py-10", className)}>
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
        <div
          className="mx-auto mt-4 h-1 w-16"
          style={{ backgroundColor: template.accent }}
        />
      </header>

      <main className="mt-6 space-y-5">
        <SummarySection data={data} accent={template.accent} compact />
        <EducationSection data={data} accent={template.accent} compact />
        <ProjectsSection data={data} accent={template.accent} compact />
        <SkillsSection
          data={data}
          accent={template.accent}
          compact
          pills
        />
      </main>

      <div className="absolute bottom-5 left-11 right-11 flex justify-between border-t border-black/10 pt-2 text-[5px] uppercase tracking-[0.14em] text-black/22">
        <span>Education · Projects · Skills</span>
        <span>Resulyra · {template.name}</span>
      </div>
    </Sheet>
  );
}

function FirstStepTemplate({
  data,
  template,
  className,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("grid grid-cols-[176px_1fr] bg-[#fbfcff]", className)}>
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
          Resulyra · {template.name}
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

function PivotTemplate({
  data,
  template,
  className,
}: ResumePreviewProps) {
  return (
    <Sheet className={cn("grid grid-cols-[164px_1fr] bg-[#fffdfd]", className)}>
      <aside className="flex flex-col bg-[#f3edef] px-5 py-8">
        <div
          className="mb-7 h-10 w-10 rounded-xl"
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
          Resulyra · {template.name}
        </p>
      </main>
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
  }
}
