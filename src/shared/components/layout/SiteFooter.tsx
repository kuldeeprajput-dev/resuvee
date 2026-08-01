import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Brand } from "./SiteHeader";
import { cn } from "@/shared/lib/utils";

const footerGroups = [
  {
    title: "Create",
    links: [
      { href: "/builder", label: "Resume builder" },
      { href: "/cover-letter", label: "Letter studio" },
      { href: "/examples", label: "Resume examples" },
    ],
  },
  {
    title: "Improve",
    links: [
      { href: "/analyzer", label: "ATS analyzer" },
      { href: "/builder", label: "Role match" },
      { href: "/#templates", label: "Templates" },
    ],
  },
  {
    title: "Organize",
    links: [
      { href: "/builder", label: "Local workspace" },
      { href: "/#how-it-works", label: "How it works" },
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
      <div className="mx-auto grid w-full max-w-[1440px] gap-9 px-5 py-8 sm:px-8 md:grid-cols-[0.85fr_1.15fr] md:gap-14 lg:px-12">
        <div className="max-w-md">
          <Brand />
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--brand-muted)]">
            Build a clearer career story, understand how it performs, and move every application
            forward with confidence.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/builder"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--brand-ink)] px-4 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#27332f]"
            >
              Build a resume
              <ArrowRight className="size-3.5" />
            </Link>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#52634f]">
              <span className="flex size-5 items-center justify-center rounded-full bg-[var(--brand-lime)]">
                <Check className="size-3" strokeWidth={2.5} />
              </span>
              Saved locally
            </span>
          </div>
        </div>

        <nav
          className="grid grid-cols-2 gap-7 sm:grid-cols-3 sm:gap-8"
          aria-label="Footer navigation"
        >
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-black/40">
                {group.title}
              </p>
              <div className="flex flex-col gap-3 text-sm">
                {group.links.map((link) => (
                  <Link
                    key={`${group.title}-${link.href}`}
                    className="footer-link w-fit"
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
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-5 py-4 text-[11px] text-[var(--brand-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© 2026 Resulyra. Built for better applications.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <p>Original, copyright-safe template designs.</p>
            <p>Local-first workspace.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
