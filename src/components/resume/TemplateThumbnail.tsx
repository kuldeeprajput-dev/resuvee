import Image from "next/image";
import type { ResumeTemplate } from "@/types/resume";
import { cn } from "@/lib/utils";

interface TemplateThumbnailProps {
  template: ResumeTemplate;
  className?: string;
  showLabel?: boolean;
}

const templatePreviewImages: Record<string, string> = {
  nova: "/assets/template-previews/meridian.webp",
  classic: "/assets/template-previews/editorial.webp",
  executive: "/assets/template-previews/summit.webp",
  minimal: "/assets/template-previews/column.webp",
  studio: "/assets/template-previews/horizon.webp",
  terminal: "/assets/template-previews/blueprint.webp",
  standard: "/assets/template-previews/standard.webp",
  compact: "/assets/template-previews/compact.webp",
  hybrid: "/assets/template-previews/bridge.webp",
  consulting: "/assets/template-previews/casebook.webp",
  finance: "/assets/template-previews/ledger.webp",
  sales: "/assets/template-previews/momentum.webp",
  healthcare: "/assets/template-previews/careline.webp",
  educator: "/assets/template-previews/chalkline.webp",
  research: "/assets/template-previews/citation.webp",
  fresher: "/assets/template-previews/launchpad.webp",
  internship: "/assets/template-previews/first-step.webp",
  "career-change": "/assets/template-previews/pivot.webp",
};

export function TemplateThumbnail({
  template,
  className,
  showLabel = false,
}: TemplateThumbnailProps) {
  const previewSrc =
    templatePreviewImages[template.id] ??
    "/assets/template-previews/standard.webp";

  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-full overflow-hidden rounded-[3px] border border-black/10 bg-white shadow-[0_12px_35px_rgba(22,32,28,0.13)]",
        className,
      )}
      aria-label={`${template.name} template preview`}
    >
      <Image
        src={previewSrc}
        alt={`${template.name} original resume template preview`}
        fill
        quality={90}
        sizes="(min-width: 1024px) 235px, (min-width: 640px) 32vw, 78vw"
        draggable={false}
        className="object-cover"
      />

      {showLabel && (
        <span className="absolute bottom-2 right-2 rounded-full border border-black/[0.06] bg-white/88 px-2 py-1 text-[6px] font-bold uppercase tracking-[0.14em] text-black/45 shadow-sm backdrop-blur">
          {template.eyebrow}
        </span>
      )}
    </div>
  );
}
