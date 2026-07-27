import Image from "next/image";
import type { ResumeTemplate } from "@/types/resume";
import { cn } from "@/lib/utils";

interface TemplateThumbnailProps {
  template: ResumeTemplate;
  className?: string;
  showLabel?: boolean;
}

function TextLines({
  count = 4,
  inverted = false,
  compact = false,
}: {
  count?: number;
  inverted?: boolean;
  compact?: boolean;
}) {
  const widths = [96, 88, 93, 76, 90, 68];
  return (
    <div className={compact ? "space-y-[2px]" : "space-y-[3px]"}>
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "block h-px rounded-full",
            inverted ? "bg-white/35" : "bg-black/18",
          )}
          style={{ width: `${widths[index % widths.length]}%` }}
        />
      ))}
    </div>
  );
}

function MiniSection({
  title,
  accent,
  inverted = false,
  lines = 4,
}: {
  title: string;
  accent: string;
  inverted?: boolean;
  lines?: number;
}) {
  return (
    <div>
      <div className="mb-[5px] flex items-center gap-[5px]">
        <span
          className={cn("h-[2px] w-5", inverted && "bg-white/80")}
          style={!inverted ? { backgroundColor: accent } : undefined}
        />
        <span
          className={cn(
            "text-[4.5px] font-extrabold uppercase tracking-[0.1em]",
            inverted ? "text-white/80" : "text-black/65",
          )}
        >
          {title}
        </span>
      </div>
      <TextLines count={lines} inverted={inverted} compact />
    </div>
  );
}

function MiniPortrait({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-2 border-white bg-[#dfe6e2] shadow-sm",
        className,
      )}
    >
      <Image
        src="/assets/mira-shah-profile.webp"
        alt=""
        fill
        sizes="60px"
        className="object-cover"
      />
    </div>
  );
}

function SidebarContent({
  template,
  side = "left",
}: {
  template: ResumeTemplate;
  side?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "absolute bottom-0 top-0 w-[30%] px-[5%] py-[9%]",
        side === "left" ? "left-0" : "right-0",
      )}
      style={{ backgroundColor: template.accent }}
    >
      {template.supportsPhoto && (
        <MiniPortrait className="mb-[20%] aspect-square w-[68%] rounded-full" />
      )}
      <div className="space-y-[18%]">
        <MiniSection
          title="Profile"
          accent={template.accent}
          inverted
          lines={3}
        />
        <MiniSection
          title="Skills"
          accent={template.accent}
          inverted
          lines={5}
        />
        <MiniSection
          title="Education"
          accent={template.accent}
          inverted
          lines={3}
        />
        <MiniSection
          title="Projects"
          accent={template.accent}
          inverted
          lines={4}
        />
      </div>
    </div>
  );
}

export function TemplateThumbnail({
  template,
  className,
  showLabel = false,
}: TemplateThumbnailProps) {
  const isMeridian = template.renderer === "meridian";
  const isEditorial = template.renderer === "editorial";
  const isSummit = template.renderer === "summit";
  const isColumn = template.renderer === "column";
  const isHorizon = template.renderer === "horizon";
  const isBlueprint = template.renderer === "blueprint";
  const isChronological = template.renderer === "chronological";
  const isCompact = template.renderer === "compact";
  const isHybrid = template.renderer === "hybrid";
  const isFresher = template.renderer === "fresher";
  const hasLeftRail = isBlueprint;
  const hasRightRail = isSummit;

  return (
    <div
      className={cn(
        "relative aspect-[0.707] w-full overflow-hidden rounded-[3px] border border-black/10 bg-white shadow-[0_12px_35px_rgba(22,32,28,0.13)]",
        className,
      )}
      aria-label={`${template.name} template preview`}
    >
      {hasLeftRail && <SidebarContent template={template} />}
      {hasRightRail && <SidebarContent template={template} side="right" />}

      {isMeridian && template.supportsPhoto && (
        <>
          <div className="absolute -left-[8%] -top-[6%] size-[38%] rounded-full bg-[#d9f1e4]" />
          <MiniPortrait className="absolute left-[8%] top-[7%] aspect-square w-[18%] rounded-[28%]" />
        </>
      )}

      {isHorizon && template.supportsPhoto && (
        <>
          <div className="absolute -right-[18%] -top-[13%] h-[34%] w-[85%] rotate-6 rounded-[50%] bg-[#dceeff]" />
          <MiniPortrait className="absolute right-[8%] top-[7%] aspect-square w-[17%] rounded-[24%]" />
        </>
      )}

      <div
        className={cn(
          "absolute inset-0 p-[8%]",
          hasLeftRail && "left-[30%]",
          hasRightRail && "right-[30%]",
        )}
      >
        <header
          className={cn(
            "relative",
            isEditorial && "border-b border-black/45 pb-[5%] text-center",
            isMeridian && "ml-[24%] pt-[2%]",
            isHorizon && "mr-[24%] pt-[2%]",
            (isChronological || isCompact) &&
              "border-b-2 pb-[5%] text-left",
            isFresher && "border-b pb-[5%] text-center",
            isHybrid && "border-b-[3px] pb-[5%]",
          )}
        >
          <p
            className={cn(
              "text-[5px] font-extrabold uppercase tracking-[0.12em]",
              isEditorial && "text-[4px]",
            )}
            style={{ color: template.accent }}
          >
            Senior product & strategy lead
          </p>
          <p
            className={cn(
              "mt-[2%] text-[11px] font-bold leading-none tracking-[-0.04em] text-black/80",
              isEditorial && "font-serif uppercase tracking-[0.06em]",
              isColumn && "font-light",
              isFresher && "text-[10px]",
            )}
          >
            Mira Shah
          </p>
          <div
            className={cn(
              "mt-[4%] flex gap-[3px]",
              isEditorial && "justify-center",
            )}
          >
            {[24, 20, 18].map((width) => (
              <span
                key={width}
                className="h-px rounded-full bg-black/18"
                style={{ width: `${width}%` }}
              />
            ))}
          </div>
        </header>

        <div
          className={cn(
            "relative mt-[8%]",
            isColumn && "grid grid-cols-[28%_1fr] gap-[8%]",
            isMeridian && "grid grid-cols-[32%_1fr] gap-[8%]",
            isHorizon && "grid grid-cols-[1.3fr_0.7fr] gap-[8%]",
            isCompact && "grid grid-cols-[1fr_30%] gap-[8%]",
            isHybrid && "grid grid-cols-2 gap-[8%]",
          )}
        >
          {(isColumn || isMeridian || isHybrid) && (
            <div
              className={cn(
                "space-y-[16%]",
                isMeridian && "rounded-[5px] bg-[#edf6f0] p-[10%]",
                isHybrid && "rounded-[5px] bg-black/[0.035] p-[8%]",
              )}
            >
              <MiniSection title="Skills" accent={template.accent} lines={5} />
              <MiniSection
                title="Education"
                accent={template.accent}
                lines={4}
              />
              <MiniSection
                title="Projects"
                accent={template.accent}
                lines={4}
              />
            </div>
          )}

          {!isFresher && (
          <div
            className={cn(
              "space-y-[9%]",
              (isColumn || isMeridian) && "",
              isHorizon && "",
            )}
          >
            {!isCompact && (
              <MiniSection title="Profile" accent={template.accent} lines={4} />
            )}
            <MiniSection
              title="Experience"
              accent={template.accent}
              lines={6}
            />
            <MiniSection
              title="Experience"
              accent={template.accent}
              lines={5}
            />
            <MiniSection
              title="Achievements"
              accent={template.accent}
              lines={4}
            />
            {!isMeridian && !isColumn && !isCompact && (
              <MiniSection
                title="Education"
                accent={template.accent}
                lines={3}
              />
            )}
          </div>
          )}

          {isFresher && (
            <div className="space-y-[10%]">
              <MiniSection
                title="Education"
                accent={template.accent}
                lines={5}
              />
              <MiniSection
                title="Projects"
                accent={template.accent}
                lines={6}
              />
              <MiniSection title="Skills" accent={template.accent} lines={5} />
              <MiniSection
                title="Coursework"
                accent={template.accent}
                lines={4}
              />
            </div>
          )}

          {isCompact && (
            <div className="space-y-[16%] border-l border-black/10 pl-[10%]">
              <MiniSection title="Skills" accent={template.accent} lines={5} />
              <MiniSection
                title="Education"
                accent={template.accent}
                lines={4}
              />
              <MiniSection
                title="Projects"
                accent={template.accent}
                lines={4}
              />
            </div>
          )}

          {isHorizon && (
            <div className="space-y-[15%] border-l border-black/10 pl-[10%]">
              <MiniSection
                title="Projects"
                accent={template.accent}
                lines={4}
              />
              <MiniSection title="Skills" accent={template.accent} lines={5} />
              <MiniSection
                title="Education"
                accent={template.accent}
                lines={3}
              />
            </div>
          )}
        </div>

        {showLabel && (
          <div className="absolute bottom-[3%] right-[4%] rounded-sm bg-white/85 px-1.5 py-1 text-[6px] font-bold uppercase tracking-[0.14em] text-black/45 backdrop-blur">
            {template.eyebrow}
          </div>
        )}
      </div>

      {isBlueprint && (
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[30%] opacity-[0.08] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:8px_8px]" />
      )}
    </div>
  );
}
