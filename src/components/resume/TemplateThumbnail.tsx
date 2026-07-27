import type { ResumeTemplate } from "@/types/resume";
import { cn } from "@/lib/utils";

interface TemplateThumbnailProps {
  template: ResumeTemplate;
  className?: string;
  showLabel?: boolean;
}

const roles = ["Product Designer", "Experience", "Education"];

export function TemplateThumbnail({
  template,
  className,
  showLabel = false,
}: TemplateThumbnailProps) {
  const isSidebar = template.layout === "sidebar";
  const isTerminal = template.id === "terminal";
  const isClassic = template.id === "classic";
  const isStudio = template.id === "studio";
  const isMinimal = template.id === "minimal";

  return (
    <div
      className={cn(
        "relative aspect-[0.76] w-full overflow-hidden rounded-[3px] border border-black/10 bg-white shadow-[0_12px_35px_rgba(22,32,28,0.13)]",
        className,
      )}
      style={{ backgroundColor: template.background }}
      aria-label={`${template.name} template preview`}
    >
      <div
        className={cn(
          "absolute inset-0 p-[8%]",
          isClassic && "text-center",
          isTerminal && "font-mono",
        )}
      >
        {isSidebar && (
          <div
            className={cn(
              "absolute bottom-0 left-0 top-0 w-[31%]",
              isStudio ? "rounded-br-[32%]" : "",
            )}
            style={{ backgroundColor: template.accent }}
          />
        )}

        <div
          className={cn(
            "relative",
            isSidebar ? "ml-[28%] pl-[8%]" : "",
            isClassic && "border-b pb-[5%]",
          )}
          style={isClassic ? { borderColor: template.accent } : undefined}
        >
          <div
            className={cn(
              "h-[5px] rounded-full",
              isClassic ? "mx-auto w-[58%]" : "w-[52%]",
              isMinimal && "w-[42%]",
              isTerminal && "rounded-none",
            )}
            style={{ backgroundColor: template.accent }}
          />
          <div
            className={cn(
              "mt-[4%] h-[2px] w-[34%] rounded-full bg-black/30",
              isClassic && "mx-auto",
            )}
          />
          <div
            className={cn(
              "mt-[2%] h-[1.5px] w-[60%] rounded-full bg-black/15",
              isClassic && "mx-auto",
            )}
          />
        </div>

        {isSidebar && (
          <div className="absolute left-[5%] top-[10%] z-10 w-[21%] space-y-[8px]">
            <div className="mx-auto size-[18px] rounded-full border-2 border-white/80" />
            {[45, 76, 62, 84, 58].map((width, index) => (
              <div key={index} className="space-y-[3px]">
                {index === 0 && (
                  <div className="h-[2px] w-[70%] bg-white/90" />
                )}
                <div
                  className="h-px bg-white/45"
                  style={{ width: `${width}%` }}
                />
                <div className="h-px w-full bg-white/25" />
              </div>
            ))}
          </div>
        )}

        <div
          className={cn(
            "relative mt-[9%] space-y-[8%]",
            isSidebar ? "ml-[28%] pl-[8%]" : "",
          )}
        >
          {roles.map((role, index) => (
            <div key={role}>
              <div className="mb-[3%] flex items-center gap-[4%]">
                <div
                  className={cn(
                    "h-[2.5px] rounded-full",
                    index === 0 ? "w-[31%]" : "w-[24%]",
                    isTerminal && "rounded-none",
                  )}
                  style={{ backgroundColor: template.accent }}
                />
                {!isClassic && (
                  <div className="h-px flex-1 bg-black/10" />
                )}
              </div>
              <div className="space-y-[3px]">
                <div className="h-[1.5px] w-[72%] rounded-full bg-black/35" />
                <div className="h-px w-full rounded-full bg-black/15" />
                <div className="h-px w-[92%] rounded-full bg-black/15" />
                {index === 0 && (
                  <div className="h-px w-[81%] rounded-full bg-black/15" />
                )}
              </div>
            </div>
          ))}
        </div>

        {showLabel && (
          <div className="absolute bottom-[4%] right-[5%] rounded-sm bg-white/80 px-1.5 py-1 text-[7px] font-bold uppercase tracking-[0.16em] text-black/50 backdrop-blur">
            {template.eyebrow}
          </div>
        )}
      </div>
    </div>
  );
}
