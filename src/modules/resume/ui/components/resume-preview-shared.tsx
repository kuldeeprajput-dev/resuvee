import Image from "next/image";
import { Globe2, Mail, MapPin, Phone } from "lucide-react";
import type { ResumeData, ResumeTemplate } from "../../types/resume";
import { cn } from "@/shared/lib/utils";

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

export function ProfilePhoto({
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
        className
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

export function SectionTitle({
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
          inverted ? "bg-white/12 text-white" : "text-white"
        )}
        style={!inverted ? { backgroundColor: accent } : undefined}
      >
        {children}
      </h2>
    );
  }

  return (
    <div className={cn("mb-2.5 flex items-center gap-2", centered && "justify-center")}>
      {!centered && (
        <span
          className={cn("size-1.5 shrink-0 rounded-[2px]", inverted && "bg-white/80")}
          style={!inverted ? { backgroundColor: accent } : undefined}
        />
      )}
      <h2
        className={cn(
          "shrink-0 text-[9px] font-extrabold uppercase tracking-[0.13em]",
          inverted ? "text-white/85" : "text-black/80"
        )}
      >
        {children}
      </h2>
      <span className={cn("h-px flex-1", inverted ? "bg-white/25" : "bg-black/14")} />
    </div>
  );
}

export function ContactList({
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
        horizontal ? "flex flex-wrap items-center gap-x-3 gap-y-1" : "space-y-2",
        inverted ? "text-white/65" : "text-black/52"
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

export function SummarySection({ data, accent, inverted = false, compact = false }: SectionProps) {
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
          inverted ? "text-white/65" : "text-black/62"
        )}
      >
        {data.basics.summary}
      </p>
    </section>
  );
}

export function ExperienceSection({ data, accent, inverted = false, compact = false }: SectionProps) {
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
                    inverted ? "text-white" : "text-black/85"
                  )}
                >
                  {item.role || "Role title"}
                </h3>
                <p
                  className={cn("mt-0.5 text-[8.5px] font-bold", inverted && "text-white/65")}
                  style={!inverted ? { color: accent } : undefined}
                >
                  {[item.company, item.location].filter(Boolean).join(" · ") || "Company"}
                </p>
              </div>
              <p
                className={cn(
                  "shrink-0 text-[7.5px] font-semibold",
                  inverted ? "text-white/45" : "text-black/42"
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
                    inverted ? "text-white/62" : "text-black/58"
                  )}
                >
                  <span
                    className={cn(
                      "mt-[3.5px] size-1 shrink-0 rounded-full",
                      inverted && "bg-white/50"
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

export function EducationSection({ data, accent, inverted = false, compact = false }: SectionProps) {
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
                inverted ? "text-white" : "text-black/82"
              )}
            >
              {item.degree || "Degree"}
            </h3>
            <p
              className={cn(
                "mt-0.5 text-[8.2px] leading-snug",
                inverted ? "text-white/62" : "text-black/55"
              )}
            >
              {item.school || "School"}
            </p>
            <div
              className={cn(
                "mt-0.5 flex flex-wrap justify-between gap-1 text-[7.2px]",
                inverted ? "text-white/40" : "text-black/38"
              )}
            >
              <span>{[item.startDate, item.endDate].filter(Boolean).join(" — ")}</span>
              <span>{item.details}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SkillsSection({
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
                inverted ? "text-white/88" : "text-black/72"
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
                      inverted ? "bg-white/10 text-white/65" : "bg-black/[0.045] text-black/58"
                    )}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p
                  className={cn(
                    "text-[8.1px] leading-[1.5]",
                    inverted ? "text-white/58" : "text-black/52"
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

export function ProjectsSection({ data, accent, inverted = false, compact = false }: SectionProps) {
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
                  inverted ? "text-white" : "text-black/82"
                )}
              >
                {project.name || "Project name"}
              </h3>
              {project.link && (
                <span className={cn("text-[6.8px]", inverted ? "text-white/38" : "text-black/35")}>
                  {project.link}
                </span>
              )}
            </div>
            <p
              className={cn(
                "mt-0.5 text-[8.1px] leading-[1.45]",
                inverted ? "text-white/58" : "text-black/52"
              )}
            >
              {project.description}
            </p>
            {project.highlights.filter(Boolean).map((highlight, index) => (
              <p
                key={`${project.id}-${index}`}
                className={cn(
                  "mt-0.5 text-[7.7px] leading-[1.4]",
                  inverted ? "text-white/45" : "text-black/45"
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

export function Sheet({
  children,
  className,
  style,
  pagePadding = "normal",
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  pagePadding?: "compact" | "normal" | "spacious";
}) {
  return (
    <article
      data-page-padding={pagePadding}
      className={cn(
        "resume-print-area relative aspect-[210/297] min-h-[842px] w-[595px] overflow-hidden bg-white font-sans text-[#202823] shadow-[0_24px_65px_rgba(22,32,28,0.18)] transition-all duration-200",
        pagePadding === "compact" && "resume-padding-compact",
        pagePadding === "spacious" && "resume-padding-spacious",
        className
      )}
      style={style}
    >
      {children}
    </article>
  );
}

