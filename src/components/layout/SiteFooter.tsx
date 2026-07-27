import Link from "next/link";
import { Brand } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/[0.08] bg-[#e9e7df]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto] lg:px-12">
        <div>
          <Brand />
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--brand-muted)]">
            Build a clear resume, understand how it performs, and apply with
            more confidence.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
          <Link className="footer-link" href="/builder">
            Resume builder
          </Link>
          <Link className="footer-link" href="/analyzer">
            ATS analyzer
          </Link>
          <Link className="footer-link" href="/#templates">
            Templates
          </Link>
          <Link className="footer-link" href="/#how-it-works">
            How it works
          </Link>
        </div>
      </div>
      <div className="border-t border-black/[0.07]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-5 py-5 text-xs text-[var(--brand-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© 2026 Resulyra. Built for better applications.</p>
          <p>Original, copyright-safe template designs.</p>
        </div>
      </div>
    </footer>
  );
}
