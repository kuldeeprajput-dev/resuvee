import Link from "next/link";
import { ArrowUpRight, FileCheck2, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { href: "/builder", label: "Build" },
  { href: "/analyzer", label: "Analyze" },
  { href: "/cover-letter", label: "Letters" },
  { href: "/job-tracker", label: "Tracker" },
  { href: "/examples", label: "Examples" },
];

export function Brand() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--brand-lime)]/40"
      aria-label="Resulyra home"
    >
      <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-[var(--brand-ink)] text-white shadow-[0_7px_18px_rgba(20,28,25,0.16)]">
        <Layers3 className="size-[18px] transition-transform duration-300 group-hover:-rotate-6" />
        <span className="absolute -bottom-3 -right-3 size-6 rounded-full bg-[var(--brand-lime)]" />
      </span>
      <span className="text-[17px] font-bold tracking-[-0.035em] text-[var(--brand-ink)]">
        Resulyra
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/90 shadow-[0_8px_28px_rgba(22,32,28,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Brand />

        <nav
          className="hidden items-center gap-1 rounded-full border border-black/[0.07] bg-white/70 p-1 shadow-sm md:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-[12px] font-semibold text-[var(--brand-muted)] transition-colors hover:bg-white hover:text-[var(--brand-ink)] lg:px-4 lg:text-[13px]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className="hidden h-10 px-4 text-[13px] font-semibold text-[var(--brand-ink)] sm:inline-flex"
          >
            <Link href="/analyzer">
              <FileCheck2 className="size-4" />
              Check resume
            </Link>
          </Button>
          <Button
            asChild
            className="h-10 rounded-full bg-[var(--brand-ink)] px-4 text-[13px] font-semibold text-white shadow-sm hover:bg-[#27332f]"
          >
            <Link href="/builder">
              Start building
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
