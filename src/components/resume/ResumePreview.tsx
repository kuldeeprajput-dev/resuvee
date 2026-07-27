import {
  Globe2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type {
  ResumeData,
  ResumeTemplate,
  ResumeTemplateId,
} from "@/types/resume";
import { cn } from "@/lib/utils";

interface ResumePreviewProps {
  data: ResumeData;
  template: ResumeTemplate;
  className?: string;
}

const themeClasses: Record<
  ResumeTemplateId,
  { paper: string; heading: string; body: string; divider: string }
> = {
  nova: {
    paper: "bg-[#fbfaf5] font-sans",
    heading: "font-sans tracking-[-0.035em]",
    body: "text-[#34433d]",
    divider: "border-[#214e45]/20",
  },
  classic: {
    paper: "bg-[#fffdfa] font-serif",
    heading: "font-serif tracking-[-0.015em]",
    body: "text-[#3f3732]",
    divider: "border-[#7a2e2e]/25",
  },
  executive: {
    paper: "bg-white font-sans",
    heading: "font-serif tracking-[-0.02em]",
    body: "text-[#384253]",
    divider: "border-[#23334f]/25",
  },
  minimal: {
    paper: "bg-white font-sans",
    heading: "font-sans tracking-[-0.045em]",
    body: "text-[#424242]",
    divider: "border-black/15",
  },
  studio: {
    paper: "bg-[#fffaf5] font-sans",
    heading: "font-serif italic tracking-[-0.025em]",
    body: "text-[#4f3d34]",
    divider: "border-[#b34f2d]/20",
  },
  terminal: {
    paper: "bg-[#fbfdf9] font-mono",
    heading: "font-mono tracking-[-0.035em]",
    body: "text-[#304037]",
    divider: "border-[#315f45]/25",
  },
};

function SectionHeading({
  children,
  template,
  inverted = false,
}: {
  children: React.ReactNode;
  template: ResumeTemplate;
  inverted?: boolean;
}) {
  const isTerminal = template.id === "terminal";
  const isClassic = template.id === "classic";
  const isMinimal = template.id === "minimal";

  return (
    <div
      className={cn(
        "mb-3 flex items-center gap-3",
        isClassic && "justify-center",
      )}
    >
      <h2
        className={cn(
          "shrink-0 text-[9px] font-bold uppercase tracking-[0.18em]",
          inverted ? "text-white/75" : "",
          isClassic && "font-serif text-[10px]",
          isMinimal && "tracking-[0.28em]",
          isTerminal && "normal-case tracking-normal",
        )}
        style={!inverted ? { color: template.accent } : undefined}
      >
        {isTerminal ? `// ${children}` : children}
      </h2>
      {!isClassic && (
        <span
          className={cn(
            "h-px flex-1",
            inverted ? "bg-white/25" : "bg-black/10",
          )}
        />
      )}
    </div>
  );
}

function ContactList({
  data,
  inverted = false,
  horizontal = false,
}: {
  data: ResumeData;
  inverted?: boolean;
  horizontal?: boolean;
}) {
  const items = [
    { icon: Mail, value: data.basics.email },
    { icon: Phone, value: data.basics.phone },
    { icon: MapPin, value: data.basics.location },
    { icon: Globe2, value: data.basics.website },
  ].filter((item) => item.value.trim());

  return (
    <div
      className={cn(
        "text-[8px] leading-[1.45]",
        horizontal
          ? "flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5"
          : "space-y-2.5",
        inverted ? "text-white/70" : "text-black/55",
      )}
    >
      {items.map((item) => (
        <div key={item.value} className="flex items-center gap-1.5">
          <item.icon className="size-2.5 shrink-0 opacity-70" />
          <span className="break-all">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function ExperienceSection({
  data,
  template,
}: {
  data: ResumeData;
  template: ResumeTemplate;
}) {
  return (
    <section>
      <SectionHeading template={template}>Experience</SectionHeading>
      <div className="space-y-4">
        {data.experience.map((item) => (
          <article key={item.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[10.5px] font-bold leading-tight text-black/85">
                  {item.role || "Role title"}
                </h3>
                <p
                  className="mt-0.5 text-[8.5px] font-semibold"
                  style={{ color: template.accent }}
                >
                  {[item.company, item.location].filter(Boolean).join(" · ") ||
                    "Company"}
                </p>
              </div>
              <p className="shrink-0 text-[7.5px] font-semibold text-black/45">
                {[item.startDate, item.current ? "Present" : item.endDate]
                  .filter(Boolean)
                  .join(" — ")}
              </p>
            </div>
            <ul className="mt-2 space-y-1.5">
              {item.highlights.filter(Boolean).map((highlight, index) => (
                <li
                  key={`${item.id}-${index}`}
                  className="flex gap-2 text-[8px] leading-[1.48]"
                >
                  <span
                    className="mt-[4px] size-1 shrink-0 rounded-full"
                    style={{ backgroundColor: template.accent }}
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
  template,
  inverted = false,
}: {
  data: ResumeData;
  template: ResumeTemplate;
  inverted?: boolean;
}) {
  return (
    <section>
      <SectionHeading template={template} inverted={inverted}>
        Education
      </SectionHeading>
      <div className="space-y-3">
        {data.education.map((item) => (
          <article key={item.id}>
            <h3
              className={cn(
                "text-[9px] font-bold leading-tight",
                inverted ? "text-white" : "text-black/85",
              )}
            >
              {item.degree || "Degree"}
            </h3>
            <p
              className={cn(
                "mt-1 text-[8px] leading-snug",
                inverted ? "text-white/65" : "text-black/55",
              )}
            >
              {item.school || "School"}
            </p>
            <p
              className={cn(
                "mt-1 text-[7px]",
                inverted ? "text-white/45" : "text-black/40",
              )}
            >
              {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
            </p>
            {item.details && (
              <p
                className={cn(
                  "mt-1 text-[7.5px]",
                  inverted ? "text-white/55" : "text-black/50",
                )}
              >
                {item.details}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function SkillsSection({
  data,
  template,
  inverted = false,
}: {
  data: ResumeData;
  template: ResumeTemplate;
  inverted?: boolean;
}) {
  return (
    <section>
      <SectionHeading template={template} inverted={inverted}>
        Skills
      </SectionHeading>
      <div className="space-y-3">
        {data.skillGroups.map((group) => (
          <div key={group.id}>
            <h3
              className={cn(
                "mb-1.5 text-[8px] font-bold",
                inverted ? "text-white" : "text-black/75",
              )}
            >
              {group.name || "Skills"}
            </h3>
            <p
              className={cn(
                "text-[7.5px] leading-[1.65]",
                inverted ? "text-white/60" : "text-black/55",
              )}
            >
              {group.skills.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({
  data,
  template,
}: {
  data: ResumeData;
  template: ResumeTemplate;
}) {
  if (data.projects.length === 0) return null;

  return (
    <section>
      <SectionHeading template={template}>Projects</SectionHeading>
      <div className="space-y-3">
        {data.projects.map((project) => (
          <article key={project.id}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[9.5px] font-bold text-black/85">
                {project.name || "Project name"}
              </h3>
              {project.link && (
                <p className="text-[7px] text-black/40">{project.link}</p>
              )}
            </div>
            <p className="mt-1 text-[8px] leading-[1.5]">
              {project.description}
            </p>
            {project.highlights.filter(Boolean).map((highlight, index) => (
              <p
                key={`${project.id}-${index}`}
                className="mt-1 text-[7.5px] leading-[1.45] text-black/60"
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

function ResumeHeader({
  data,
  template,
  centered = false,
}: {
  data: ResumeData;
  template: ResumeTemplate;
  centered?: boolean;
}) {
  const theme = themeClasses[template.id];
  return (
    <header className={cn(centered && "text-center")}>
      <p
        className={cn(
          "mb-2 text-[8px] font-bold uppercase tracking-[0.2em]",
          template.id === "terminal" && "normal-case tracking-normal",
        )}
        style={{ color: template.accent }}
      >
        {template.id === "terminal"
          ? "$ candidate --profile"
          : data.basics.headline}
      </p>
      <h1
        className={cn(
          "text-[29px] font-bold leading-[0.98] text-black/90",
          theme.heading,
          template.id === "executive" && "text-[31px]",
          template.id === "minimal" && "font-light",
        )}
      >
        {data.basics.fullName || "Your Name"}
      </h1>
      {template.id === "terminal" && (
        <p className="mt-2 text-[8px] text-black/55">
          {data.basics.headline}
        </p>
      )}
    </header>
  );
}

export function ResumePreview({
  data,
  template,
  className,
}: ResumePreviewProps) {
  const theme = themeClasses[template.id];
  const isSidebar = template.layout === "sidebar";
  const isClassic = template.id === "classic";
  const isExecutive = template.id === "executive";

  if (isSidebar) {
    return (
      <article
        className={cn(
          "resume-print-area relative grid aspect-[210/297] min-h-[842px] w-[595px] grid-cols-[172px_1fr] overflow-hidden shadow-[0_24px_65px_rgba(22,32,28,0.18)]",
          theme.paper,
          theme.body,
          className,
        )}
      >
        <aside
          className="flex flex-col px-6 py-10 text-white"
          style={{ backgroundColor: template.accent }}
        >
          <div className="mb-9 flex size-16 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xl font-bold">
            {data.basics.fullName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="space-y-8">
            <section>
              <SectionHeading template={template} inverted>
                Contact
              </SectionHeading>
              <ContactList data={data} inverted />
            </section>
            <SkillsSection data={data} template={template} inverted />
            <EducationSection data={data} template={template} inverted />
          </div>
          <p className="mt-auto pt-8 text-[6.5px] uppercase tracking-[0.18em] text-white/35">
            Resume · {new Date().getFullYear()}
          </p>
        </aside>

        <div className="px-9 py-10">
          <ResumeHeader data={data} template={template} />
          <div
            className="my-6 h-[2px] w-16"
            style={{ backgroundColor: template.accent }}
          />
          {data.basics.summary && (
            <section className="mb-6">
              <SectionHeading template={template}>Profile</SectionHeading>
              <p className="text-[8.5px] leading-[1.62]">
                {data.basics.summary}
              </p>
            </section>
          )}
          <div className="space-y-6">
            <ExperienceSection data={data} template={template} />
            <ProjectsSection data={data} template={template} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "resume-print-area aspect-[210/297] min-h-[842px] w-[595px] overflow-hidden px-12 py-11 shadow-[0_24px_65px_rgba(22,32,28,0.18)]",
        theme.paper,
        theme.body,
        className,
      )}
    >
      <div
        className={cn(
          "pb-6",
          isClassic && "border-b text-center",
          isExecutive &&
            "-mx-12 -mt-11 bg-[#23334f] px-12 pb-7 pt-10 text-white [&_h1]:text-white",
          theme.divider,
        )}
      >
        <ResumeHeader
          data={data}
          template={template}
          centered={isClassic}
        />
        {isExecutive && (
          <p className="mt-2 text-[9px] text-white/60">
            {data.basics.headline}
          </p>
        )}
        <div className={cn("mt-4", isExecutive && "[&_div]:text-white/60")}>
          <ContactList data={data} horizontal />
        </div>
      </div>

      <div className={cn("space-y-6 pt-6", isClassic && "pt-7")}>
        {data.basics.summary && (
          <section>
            <SectionHeading template={template}>Profile</SectionHeading>
            <p
              className={cn(
                "text-[8.5px] leading-[1.65]",
                isClassic && "text-center italic",
              )}
            >
              {data.basics.summary}
            </p>
          </section>
        )}
        <ExperienceSection data={data} template={template} />
        <div className="grid grid-cols-[1.25fr_0.75fr] gap-8">
          <div className="space-y-6">
            <ProjectsSection data={data} template={template} />
            <EducationSection data={data} template={template} />
          </div>
          <SkillsSection data={data} template={template} />
        </div>
      </div>
    </article>
  );
}
