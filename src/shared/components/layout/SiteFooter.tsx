import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "./SiteHeader";
import { cn } from "@/shared/lib/utils";

const footerGroups = [
  {
    title: "Create",
    links: [
      { href: "/builder", label: "Resume builder" },
      { href: "/cover-letter", label: "Letter studio" },
      { href: "/#templates", label: "Resume templates" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/analyzer", label: "ATS analyzer" },
      { href: "/saved", label: "Saved workspace" },
      { href: "/builder", label: "Guided editor" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/resumes", label: "All resumes" },
      { href: "/cover-letters", label: "All cover letters" },
      { href: "/#toolkit", label: "Product toolkit" },
    ],
  },
];

export function SiteFooter({ blendWithPage = false }: { blendWithPage?: boolean }) {
  return (
    <footer
      className={cn(
        "border-t border-black/[0.08]",
        blendWithPage ? "bg-[var(--brand-canvas)]" : "bg-[#e9e7df]"
      )}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:gap-14 md:py-12 lg:px-12">
        <div className="min-w-0 max-w-md">
          <Brand />
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--brand-muted)]">
            Build a clearer career story, understand how it performs, and move every application
            forward with confidence.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/builder"
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-[var(--brand-ink)] px-4 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#1a2521]"
            >
              Build a resume
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-[11px] font-bold text-[#455c42] shadow-2xs backdrop-blur-xs">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#5fa446] opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[#4f8a3a]" />
              </span>
              Cloud & Local Sync
            </span>
          </div>
        </div>

        <nav
          className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 sm:gap-8"
          aria-label="Footer navigation"
        >
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black/45">
                {group.title}
              </p>
              <div className="flex flex-col gap-2.5 text-sm">
                {group.links.map((link) => (
                  <Link
                    key={`${group.title}-${link.href}`}
                    className="w-fit text-[13px] text-[var(--brand-muted)] transition-colors duration-200 hover:text-[var(--brand-ink)] hover:underline hover:underline-offset-4"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-black/[0.07]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-4 text-[11px] font-medium text-[var(--brand-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© 2026 Resulyra. Built for better applications.</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Original, copyright-safe template designs</span>
            <span className="hidden text-black/20 sm:inline">•</span>
            <span>Cloud & Local Workspace</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
