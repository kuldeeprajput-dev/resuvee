import type { ResumeTemplate } from "../../types/resume";
import { getTemplateStarterData } from "../../constants/resume-presets";
import { cn } from "@/shared/lib/utils";
import { ResumePreview } from "./resume-preview";

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
  const desktopScale = size === "picker" ? 0.23 : 0.39;
  const mobileScale = size === "picker" ? 0.22 : 0.28;

  const desktopW = Math.round(595 * desktopScale);
  const desktopH = Math.round(842 * desktopScale);

  const starterData = getTemplateStarterData(template.id);

  if (size === "picker") {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-[3px] border border-black/10 bg-white shadow-[0_12px_35px_rgba(22,32,28,0.13)]",
          className
        )}
        style={{ width: desktopW, height: desktopH }}
        aria-label={`${template.name} template preview`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 origin-top-left select-none"
          style={{ transform: `scale(${desktopScale})` }}
        >
          <ResumePreview
            data={starterData}
            template={template}
            showPhoto={template.supportsPhoto}
            className="min-h-0 shadow-none transition-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-[3px] border border-black/10 bg-white shadow-[0_12px_35px_rgba(22,32,28,0.13)] transition-all duration-300",
        "w-[167px] h-[236px] sm:w-[232px] sm:h-[328px]",
        className
      )}
      aria-label={`${template.name} template preview`}
    >
      {/* Mobile viewport (scale 0.28) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 origin-top-left select-none sm:hidden"
        style={{ transform: `scale(${mobileScale})` }}
      >
        <ResumePreview
          data={starterData}
          template={template}
          showPhoto={template.supportsPhoto}
          className="min-h-0 shadow-none transition-none"
        />
      </div>

      {/* Desktop viewport (scale 0.39) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 origin-top-left select-none hidden sm:block"
        style={{ transform: `scale(${desktopScale})` }}
      >
        <ResumePreview
          data={starterData}
          template={template}
          showPhoto={template.supportsPhoto}
          className="min-h-0 shadow-none transition-none"
        />
      </div>

      {showLabel && (
        <span className="absolute bottom-1.5 right-1.5 rounded-full border border-black/6 bg-white/88 px-1.5 py-0.5 text-[5.5px] font-bold uppercase tracking-[0.14em] text-black/45 shadow-sm backdrop-blur sm:bottom-2 sm:right-2 sm:px-2 sm:py-1 sm:text-[6px]">
          {template.eyebrow}
        </span>
      )}
    </div>
  );
}
