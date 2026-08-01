import Link from "next/link";
import { ArrowUpRight, FileCheck2, Layers3 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const navigation = [
  { href: "/builder", label: "Build" },
  { href: "/analyzer", label: "Analyze" },
  { href: "/cover-letter", label: "Letters" },
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

export function SiteHeader({ blendWithPage = false }: { blendWithPage?: boolean }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 backdrop-blur-xl",
        blendWithPage ? "bg-[var(--brand-canvas)]" : "bg-[var(--brand-canvas)]/88"
      )}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center px-3 sm:px-5 lg:px-8">
        <div
          className="flex h-[54px] w-full items-center gap-2 rounded-[20px] border border-black/[0.08] bg-white/72 px-2.5 backdrop-blur-xl sm:px-3"
        >
          <div className="shrink-0">
            <Brand />
          </div>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex lg:gap-1"
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-2.5 py-2 text-[12px] font-semibold text-[var(--brand-muted)] transition-colors hover:bg-white hover:text-[var(--brand-ink)] lg:px-3.5 lg:text-[13px]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:gap-2">
            <Button
              asChild
              variant="ghost"
              className="hidden h-10 px-3 text-[13px] font-semibold text-[var(--brand-ink)] lg:inline-flex xl:px-4"
            >
              <Link href="/analyzer">
                <FileCheck2 className="size-4" />
                Check resume
              </Link>
            </Button>
            <Button
              asChild
              className="h-10 rounded-full bg-[var(--brand-ink)] px-3.5 text-[12px] font-semibold text-white shadow-sm hover:bg-[#27332f] sm:px-4 sm:text-[13px]"
            >
              <Link href="/builder">
                Start building
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
