import Image from "next/image";
import { BadgeCheck, FileDown, Layers3, MousePointer2, Sparkles, Zap } from "lucide-react";

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
      <div className="relative h-[330px] sm:h-[440px] lg:h-[520px]">
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

      <div className="relative z-10 mt-4 grid gap-3 px-0 sm:mt-[-46px] sm:grid-cols-[0.76fr_1.24fr] sm:px-[4%]">
        <div className="rounded-2xl border border-black/10 bg-white/94 p-3 shadow-[0_16px_42px_rgba(22,32,28,0.14)] backdrop-blur-md">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-lime)]">
              <Zap className="size-4.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--brand-muted)] sm:text-[10px]">
                ATS strength
              </p>
              <p className="whitespace-nowrap text-lg font-bold tracking-tight">
                90% <span className="text-xs text-[var(--brand-muted)]">ready</span>
              </p>
            </div>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-black/[0.07]">
            <div className="h-full w-[90%] rounded-full bg-[var(--brand-lime)]" />
          </div>
          <p className="mt-2 text-[10px] font-medium text-[var(--brand-muted)]">
            Strong ATS-ready structure
          </p>
        </div>

        <div className="rounded-2xl border border-[#aebcab]/60 bg-[#e4ece3]/95 p-3 text-[var(--brand-ink)] shadow-[0_16px_42px_rgba(22,32,28,0.12)]">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--brand-ink)] text-[var(--brand-lime)]">
              <BadgeCheck className="size-3.5" />
            </span>
            <p className="min-w-0 flex-1 text-sm font-bold">Ready to finish</p>
            <span className="rounded-full border border-black/10 bg-white/60 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--brand-muted)]">
              Built into Resulyra
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 divide-x divide-black/10 rounded-xl border border-black/[0.07] bg-white/55">
            <div className="p-2">
              <Layers3 className="size-3.5 text-[#4f7242]" />
              <p className="mt-1 text-[11px] font-bold leading-4">6 layouts</p>
              <p className="text-[9px] text-[var(--brand-muted)]">Original</p>
            </div>
            <div className="p-2">
              <Sparkles className="size-3.5 text-[#c65b38]" />
              <p className="mt-1 text-[11px] font-bold leading-4">AI polish</p>
              <p className="text-[9px] text-[var(--brand-muted)]">Writing</p>
            </div>
            <div className="p-2">
              <FileDown className="size-3.5 text-[#376878]" />
              <p className="mt-1 text-[11px] font-bold leading-4">Clean PDF</p>
              <p className="text-[9px] text-[var(--brand-muted)]">Ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
