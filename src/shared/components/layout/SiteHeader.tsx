"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FileCheck2, Menu } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { UserNav } from "@/modules/auth";

const navigation = [
  { href: "/builder", label: "Build" },
  { href: "/analyzer", label: "Analyze" },
  { href: "/cover-letter", label: "Letters" },
  { href: "/saved", label: "Saved" },
];

const mobileNavigation = [...navigation, { href: "/analyzer", label: "Check resume" }];

export function Brand() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 rounded-md leading-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--brand-lime)]/40"
      aria-label="Resulyra home"
    >
      <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white transition-transform duration-300 group-hover:-rotate-2">
        <Image
          src="/resulyra-mark.png"
          alt="Resulyra logo"
          width={28}
          height={28}
          priority
          className="size-[28px] object-contain"
        />
      </span>
      <span className="flex items-center text-[17px] font-bold leading-none tracking-[-0.035em] text-[var(--brand-ink)]">
        Resulyra
      </span>
    </Link>
  );
}

export function SiteHeader({ blendWithPage = false }: { blendWithPage?: boolean }) {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos < 20) {
        setIsVisible(true);
      } else if (currentScrollPos > prevScrollPos) {
        // Scrolling down -> show header
        setIsVisible(true);
      } else {
        // Scrolling up -> hide header
        setIsVisible(false);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <header className="sticky top-4 z-[100] w-full pointer-events-none px-4 transition-all duration-300">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex h-[58px] w-full max-w-5xl items-center justify-between gap-3 rounded-[22px] border border-black/[0.08] px-4 shadow-[0_12px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-300 sm:h-[64px] sm:px-5",
          blendWithPage ? "bg-white/95" : "bg-white/90",
          !isVisible && "-translate-y-20 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex shrink-0 items-center">
          <Brand />
        </div>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-2 md:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-[14px] font-semibold leading-none text-[var(--brand-muted)] transition-colors hover:bg-black/5 hover:text-[var(--brand-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <UserNav />

          <Link
            href="/analyzer"
            className="hidden h-10 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-[var(--brand-ink)] transition-colors hover:bg-black/5 lg:inline-flex"
          >
            <FileCheck2 className="size-4 text-[var(--brand-muted)]" />
            <span>Check resume</span>
          </Link>
          <Link
            href="/builder"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-[var(--brand-ink)] px-4 text-[13px] font-semibold text-white shadow-xs transition hover:bg-[#27332f] sm:px-5"
          >
            <span className="sm:inline">Start building</span>
            <span className="sm:hidden">Start</span>
            <ArrowUpRight className="size-4" />
          </Link>

          <details className="relative md:hidden">
            <summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-full border border-black/10 bg-white text-[var(--brand-ink)] transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--brand-lime)]/50 [&::-webkit-details-marker]:hidden">
              <Menu className="size-4" aria-hidden="true" />
              <span className="sr-only">Open navigation</span>
            </summary>
            <div className="absolute right-0 top-[calc(100%+0.6rem)] z-50 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border border-black/10 bg-[var(--brand-paper)] p-2.5 shadow-[0_18px_55px_rgba(22,32,28,0.18)]">
              <nav className="grid gap-1" aria-label="Mobile navigation">
                {mobileNavigation.map((item, index) => (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    className={cn(
                      "flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-[var(--brand-muted)] transition hover:bg-[var(--brand-canvas)] hover:text-[var(--brand-ink)]",
                      index === mobileNavigation.length - 1 &&
                        "mt-1 border-t border-black/[0.08] pt-3 text-[var(--brand-ink)]"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
