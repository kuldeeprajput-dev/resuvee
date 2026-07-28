import type { ResumeTemplate } from "@/types/resume";
import { getTemplateStarterData } from "@/lib/resume-presets";
import { cn } from "@/lib/utils";
import { ResumePreview } from "./ResumePreview";

interface TemplateThumbnailProps {
  template: ResumeTemplate;
  className?: string;
  showLabel?: boolean;
  size?: "showcase" | "picker";
}

export function TemplateThumbnail({
  template,
  className,
  showLabel = false,
  size = "showcase",
}: TemplateThumbnailProps) {
  const scale = size === "picker" ? 0.23 : 0.39;
  const width = Math.round(595 * scale);
  const height = Math.round(842 * scale);
  const starterData = getTemplateStarterData(template.id);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-[3px] border border-black/10 bg-white shadow-[0_12px_35px_rgba(22,32,28,0.13)]",
        className,
      )}
      style={{ width, height }}
      aria-label={`${template.name} template preview`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 origin-top-left select-none"
        style={{ transform: `scale(${scale})` }}
      >
        <ResumePreview
          data={starterData}
          template={template}
          showPhoto={template.supportsPhoto}
          className="min-h-0 shadow-none transition-none"
        />
      </div>

      {showLabel && (
        <span className="absolute bottom-2 right-2 rounded-full border border-black/[0.06] bg-white/88 px-2 py-1 text-[6px] font-bold uppercase tracking-[0.14em] text-black/45 shadow-sm backdrop-blur">
          {template.eyebrow}
        </span>
      )}
    </div>
  );
}
