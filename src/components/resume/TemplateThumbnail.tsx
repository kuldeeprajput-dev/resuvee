import Image from "next/image";
import type { ResumeTemplate } from "@/types/resume";
import { cn } from "@/lib/utils";

interface TemplateThumbnailProps {
  template: ResumeTemplate;
  className?: string;
  showLabel?: boolean;
}

export function TemplateThumbnail({
  template,
  className,
  showLabel = false,
}: TemplateThumbnailProps) {
  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-full overflow-hidden rounded-[3px] border border-black/10 bg-white shadow-[0_12px_35px_rgba(22,32,28,0.13)]",
        className,
      )}
      aria-label={`${template.name} template preview`}
    >
      <Image
        src={template.previewImage}
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
