"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FileCheck2, LogIn, LogOut, Menu } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { UserNav, useAuthStore } from "@/modules/auth";

const navigation = [
  { href: "/builder", label: "Build" },
  { href: "/analyzer", label: "Analyze" },
  { href: "/cover-letter", label: "Letters" },
  { href: "/saved", label: "Saved" },
];

const mobileNavigation = [
  { href: "/builder", label: "Start building resume" },
  { href: "/analyzer", label: "ATS Analyzer" },
  { href: "/cover-letter", label: "Cover letter studio" },
  { href: "/saved", label: "Saved workspace" },
];

export function Brand() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2 rounded-md leading-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand-lime)/40 sm:gap-2.5"
      aria-label="Resuvee home"
    >
      <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white transition-transform duration-300 group-hover:-rotate-2 sm:size-9">
        <Image
          src="/resulyra-mark.png"
          alt="Resuvee logo"
          width={28}
          height={28}
          priority
          className="size-[24px] object-contain sm:size-[28px]"
        />
      </span>
      <span className="flex items-center text-[16px] font-bold leading-none tracking-[-0.035em] text-(--brand-ink) sm:text-[17px]">
        Resuvee
      </span>
    </Link>
  );
}

export function SiteHeader({ blendWithPage = false }: { blendWithPage?: boolean }) {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [imageError, setImageError] = useState(false);
  const { user, openAuthModal, signOut } = useAuthStore();

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const rawName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  const displayName = rawName || user?.email?.split("@")[0] || "User";
  const userInitial = (displayName[0] || "U").toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos < 20) {
        setIsVisible(true);
      } else if (currentScrollPos > prevScrollPos) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <header className="sticky top-3 z-100 w-full pointer-events-none px-3 sm:top-4 sm:px-4 transition-all duration-300">
      <div
        className={cn(
          "pointer-events-auto relative mx-auto flex h-[54px] w-full max-w-5xl items-center justify-between gap-2 rounded-[20px] border border-black/8 px-3 shadow-[0_12px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-300 sm:h-[64px] sm:rounded-[22px] sm:px-5",
          blendWithPage ? "bg-white/95" : "bg-white/90",
          !isVisible && "-translate-y-20 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex shrink-0 items-center">
          <Brand />
        </div>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 md:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-[14px] font-semibold leading-none text-(--brand-muted) transition-colors hover:bg-black/5 hover:text-(--brand-ink)"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
          {/* Desktop User Nav */}
          <div className="hidden md:block">
            <UserNav />
          </div>

          <Link
            href="/analyzer"
            className="hidden h-10 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-(--brand-ink) transition-colors hover:bg-black/5 xl:inline-flex"
          >
            <FileCheck2 className="size-4 text-(--brand-muted)" />
            <span>Check resume</span>
          </Link>

          <Link
            href="/builder"
            className="hidden h-10 items-center justify-center gap-1.5 rounded-full bg-(--brand-ink) px-4 text-[13px] font-semibold text-white shadow-xs transition hover:bg-[#27332f] sm:inline-flex sm:px-5"
          >
            <span>Start building</span>
            <ArrowUpRight className="size-4" />
          </Link>

          {/* Mobile Hamburger Navigation with Auth inside */}
          <details className="md:hidden">
            <summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-full border border-black/10 bg-white text-(--brand-ink) transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand-lime)/50 [&::-webkit-details-marker]:hidden">
              <Menu className="size-4" aria-hidden="true" />
              <span className="sr-only">Open navigation</span>
            </summary>
            <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-50 w-full rounded-2xl border border-black/10 bg-white p-3 shadow-[0_18px_55px_rgba(22,32,28,0.2)]">
              {/* Mobile Auth Header */}
              <div className="mb-2.5 border-b border-black/8 pb-2.5">
                {user ? (
                  <div className="flex items-center justify-between gap-3 px-1 py-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {avatarUrl && !imageError ? (
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          referrerPolicy="no-referrer"
                          onError={() => setImageError(true)}
                          className="size-8 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-(--brand-ink) text-xs font-extrabold text-white shrink-0">
                          {userInitial}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-(--brand-ink) capitalize">
                          {displayName}
                        </p>
                        <p className="truncate text-[10px] text-(--brand-muted)">{user.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 shrink-0 cursor-pointer"
                    >
                      <LogOut className="size-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAuthModal("sign_in")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--brand-ink) py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#27332f] cursor-pointer"
                  >
                    <LogIn className="size-4" />
                    <span>Sign In / Account</span>
                  </button>
                )}
              </div>

              {/* Mobile Navigation Links */}
              <nav className="grid gap-1" aria-label="Mobile navigation">
                {mobileNavigation.map((item) => (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    className="flex min-h-10 items-center justify-between rounded-xl px-3 text-sm font-semibold text-(--brand-ink) transition hover:bg-black/5"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="size-3.5 text-(--brand-muted)" />
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
