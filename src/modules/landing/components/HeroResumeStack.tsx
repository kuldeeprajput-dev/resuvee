import Image from "next/image";
import { FileDown, Layers3, MousePointer2, Sparkles, Zap } from "lucide-react";

const resumeSheets = [
  {
    id: "ethan-back",
    src: "/assets/hero-resumes/ethan-brooks.webp",
    alt: "",
    className:
      "pointer-events-none left-[1%] top-[17%] z-[1] w-[35%] -rotate-[11deg] opacity-35 group-hover:-translate-x-5 group-hover:-rotate-[15deg] group-hover:opacity-55 sm:left-[2%] sm:w-[32%]",
  },
  {
    id: "daniel-back",
    src: "/assets/hero-resumes/daniel-kim.webp",
    alt: "",
    className:
      "pointer-events-none right-[1%] top-[12%] z-[2] w-[35%] rotate-[11deg] opacity-35 group-hover:translate-x-5 group-hover:rotate-[15deg] group-hover:opacity-55 sm:right-[2%] sm:w-[32%]",
  },
  {
    id: "noah-upper",
    src: "/assets/hero-resumes/noah-bennett.webp",
    alt: "",
    className:
      "pointer-events-none left-1/2 top-[1%] z-[3] w-[36%] -translate-x-1/2 -rotate-2 opacity-55 group-hover:-translate-y-5 group-hover:rotate-0 group-hover:opacity-75 sm:w-[34%]",
  },
  {
    id: "daniel-kim",
    src: "/assets/hero-resumes/daniel-kim.webp",
    alt: "Daniel Kim engineering director resume template",
    className:
      "pointer-events-auto left-[8%] top-[16%] z-10 w-[42%] -rotate-[7deg] cursor-default group-hover:-translate-x-6 group-hover:-rotate-[10deg] hover:z-50 hover:scale-[1.045] sm:left-[10%] sm:w-[36%]",
  },
  {
    id: "noah-bennett",
    src: "/assets/hero-resumes/noah-bennett.webp",
    alt: "Noah Bennett full-stack software engineer resume template",
    className:
      "pointer-events-auto right-[7%] top-[14%] z-20 w-[42%] rotate-[7deg] cursor-default group-hover:translate-x-6 group-hover:rotate-[10deg] hover:z-50 hover:scale-[1.045] sm:right-[9%] sm:w-[36%]",
  },
  {
    id: "ethan-brooks",
    src: "/assets/hero-resumes/ethan-brooks.webp",
    alt: "Ethan Brooks product strategy lead resume template",
    className:
      "pointer-events-auto left-1/2 top-[10%] z-30 w-[46%] -translate-x-1/2 cursor-default shadow-[0_30px_80px_rgba(22,32,28,0.24)] group-hover:-translate-y-3 hover:z-50 hover:scale-[1.055] sm:w-[39%]",
    preload: true,
  },
] as const;

export function HeroResumeStack() {
  return (
    <div className="group relative mx-auto min-w-0 w-full max-w-[740px] cursor-default">
      <div className="relative hidden h-[330px] sm:block sm:h-[440px] lg:h-[520px]">
        <div
          className="absolute inset-x-[8%] top-[9%] h-[72%] rounded-full bg-[var(--brand-lime)]/20 blur-[90px]"
          aria-hidden="true"
        />
        <div
          className="absolute right-[8%] top-[16%] size-40 rounded-full bg-[#e36c43]/15 blur-[70px]"
          aria-hidden="true"
        />

        <div className="absolute right-[4%] top-[2%] z-40 hidden items-center gap-2 rounded-full border border-black/10 bg-white/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--brand-muted)] shadow-sm backdrop-blur sm:flex">
          <MousePointer2 className="size-3.5 text-[#c65b38]" />
          Hover to explore
        </div>

        {resumeSheets.map((sheet) => (
          <div
            key={sheet.id}
            className={`absolute aspect-[2/3] overflow-hidden rounded-[3px] border border-black/10 bg-white shadow-[0_18px_55px_rgba(22,32,28,0.16)] transition-all duration-500 ease-out ${sheet.className}`}
          >
            <Image
              src={sheet.src}
              alt={sheet.alt}
              fill
              preload={"preload" in sheet ? sheet.preload : false}
              quality={90}
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 34vw, 42vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Left-Aligned Hero Feature List */}
      <div className="relative z-10 mt-0 grid grid-cols-1 gap-2.5 sm:mt-[-28px] sm:grid-cols-2 sm:px-2">
        <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/95 px-4 py-3 shadow-[0_8px_30px_rgba(22,32,28,0.08)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_36px_rgba(22,32,28,0.12)]">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-lime)] text-xs font-black text-[var(--brand-ink)] shadow-xs">
            90%
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-[var(--brand-ink)]">ATS Ready Structure</p>
            <p className="truncate text-[10px] font-medium text-[var(--brand-muted)]">Verified format checks</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/95 px-4 py-3 shadow-[0_8px_30px_rgba(22,32,28,0.08)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_36px_rgba(22,32,28,0.12)]">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#e8f3e2] text-[#4f7242]">
            <Layers3 className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-[var(--brand-ink)]">6 Original Layouts</p>
            <p className="truncate text-[10px] font-medium text-[var(--brand-muted)]">Switch designs anytime</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/95 px-4 py-3 shadow-[0_8px_30px_rgba(22,32,28,0.08)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_36px_rgba(22,32,28,0.12)]">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#fcece6] text-[#c65b38]">
            <Sparkles className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-[var(--brand-ink)]">AI Writing Polish</p>
            <p className="truncate text-[10px] font-medium text-[var(--brand-muted)]">Grammar & content check</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/95 px-4 py-3 shadow-[0_8px_30px_rgba(22,32,28,0.08)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_36px_rgba(22,32,28,0.12)]">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#e6f1f5] text-[#376878]">
            <FileDown className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-[var(--brand-ink)]">Clean PDF Export</p>
            <p className="truncate text-[10px] font-medium text-[var(--brand-muted)]">Vector quality PDF</p>
          </div>
        </div>
      </div>
    </div>
  );
}
