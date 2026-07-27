import Image from "next/image";
import {
  BadgeCheck,
  Layers3,
  MousePointer2,
  Sparkles,
  Zap,
} from "lucide-react";

const resumeSheets = [
  {
    id: "ethan-back",
    src: "/assets/hero-resumes/ethan-brooks.webp",
    alt: "",
    className:
      "left-[1%] top-[17%] z-[1] w-[35%] -rotate-[11deg] opacity-35 group-hover:-translate-x-5 group-hover:-rotate-[15deg] group-hover:opacity-55 sm:left-[2%] sm:w-[32%]",
  },
  {
    id: "daniel-back",
    src: "/assets/hero-resumes/daniel-kim.webp",
    alt: "",
    className:
      "right-[1%] top-[12%] z-[2] w-[35%] rotate-[11deg] opacity-35 group-hover:translate-x-5 group-hover:rotate-[15deg] group-hover:opacity-55 sm:right-[2%] sm:w-[32%]",
  },
  {
    id: "noah-upper",
    src: "/assets/hero-resumes/noah-bennett.webp",
    alt: "",
    className:
      "left-1/2 top-[1%] z-[3] w-[36%] -translate-x-1/2 -rotate-2 opacity-55 group-hover:-translate-y-5 group-hover:rotate-0 group-hover:opacity-75 sm:w-[34%]",
  },
  {
    id: "daniel-kim",
    src: "/assets/hero-resumes/daniel-kim.webp",
    alt: "Daniel Kim engineering director resume template",
    className:
      "left-[8%] top-[16%] z-10 w-[42%] -rotate-[7deg] group-hover:-translate-x-6 group-hover:-rotate-[10deg] sm:left-[10%] sm:w-[39%]",
  },
  {
    id: "noah-bennett",
    src: "/assets/hero-resumes/noah-bennett.webp",
    alt: "Noah Bennett full-stack software engineer resume template",
    className:
      "right-[7%] top-[14%] z-20 w-[42%] rotate-[7deg] group-hover:translate-x-6 group-hover:rotate-[10deg] sm:right-[9%] sm:w-[39%]",
  },
  {
    id: "ethan-brooks",
    src: "/assets/hero-resumes/ethan-brooks.webp",
    alt: "Ethan Brooks product strategy lead resume template",
    className:
      "left-1/2 top-[10%] z-30 w-[46%] -translate-x-1/2 shadow-[0_30px_80px_rgba(22,32,28,0.24)] group-hover:-translate-y-3 group-hover:scale-[1.025] sm:w-[43%]",
    preload: true,
  },
] as const;

export function HeroResumeStack() {
  return (
    <div className="group relative mx-auto h-[530px] w-full max-w-[680px] cursor-default sm:h-[640px]">
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
          className={`pointer-events-none absolute aspect-[2/3] overflow-hidden rounded-[3px] border border-black/10 bg-white shadow-[0_18px_55px_rgba(22,32,28,0.16)] transition-all duration-500 ease-out ${sheet.className}`}
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

      <div className="absolute inset-x-[2%] bottom-[2%] z-[60] flex items-end justify-between gap-2 sm:inset-x-[4%] sm:bottom-[3%] sm:gap-5">
        <div className="w-[164px] shrink-0 rounded-2xl border border-black/10 bg-white/94 p-3 shadow-[0_18px_55px_rgba(22,32,28,0.18)] backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1 sm:w-[220px] sm:p-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-lime)] sm:size-11">
              <Zap className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--brand-muted)] sm:text-[10px]">
                ATS strength
              </p>
              <p className="whitespace-nowrap text-lg font-bold tracking-tight sm:text-xl">
                90%{" "}
                <span className="text-sm text-[var(--brand-muted)]">
                  ready
                </span>
              </p>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/[0.07]">
            <div className="h-full w-[90%] rounded-full bg-[var(--brand-lime)]" />
          </div>
        </div>

        <div className="w-[190px] shrink-0 rounded-2xl bg-[var(--brand-ink)] p-4 text-white shadow-[0_18px_55px_rgba(22,32,28,0.28)] transition-transform delay-75 duration-300 group-hover:-translate-y-1 sm:w-[230px] sm:p-5">
          <div className="flex items-center justify-between">
            <span className="flex size-8 items-center justify-center rounded-lg bg-white/10">
              <Layers3 className="size-4 text-[var(--brand-lime)]" />
            </span>
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/50">
              <BadgeCheck className="size-3 text-[var(--brand-lime)]" />
              Original
            </span>
          </div>
          <p className="mt-3 text-sm font-bold sm:mt-4">
            Six layouts, one story
          </p>
          <p className="mt-1 text-[11px] leading-[1.1rem] text-white/60 sm:text-xs sm:leading-5">
            Three career directions, ready to make your own.
          </p>
          <div className="mt-3 flex items-center gap-1.5 sm:mt-4" aria-hidden="true">
            <span className="h-1.5 w-8 rounded-full bg-[var(--brand-lime)]" />
            <span className="size-1.5 rounded-full bg-[#7ab6ae]" />
            <span className="size-1.5 rounded-full bg-[#d89568]" />
            <Sparkles className="ml-auto size-3.5 text-white/35" />
          </div>
        </div>
      </div>
    </div>
  );
}
