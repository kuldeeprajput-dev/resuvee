"use client";

import { AlertTriangle, FileWarning, Home, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onReset: () => void;
}

export function ErrorState({ error, onRetry, onReset }: ErrorStateProps) {
  return (
    <section className="mx-auto w-full max-w-xl" aria-live="assertive">
      <div className="rounded-[24px] border border-red-200/80 bg-white p-6 shadow-[0_24px_70px_rgba(92,31,31,0.10)] sm:p-8">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <AlertTriangle className="size-5" />
        </span>

        <div className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-red-700">
          <FileWarning className="size-4" />
          Analysis stopped
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-[-0.035em] text-(--brand-ink)">
          We could not read this resume.
        </h2>
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
          {error}
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button
            onClick={onRetry}
            variant="outline"
            className="h-11 justify-center gap-2 rounded-xl border-black/10 bg-white text-(--brand-ink) hover:bg-[#f5f6f2]"
          >
            <RefreshCw className="size-4" />
            Try again
          </Button>
          <Button
            onClick={onReset}
            className="h-11 justify-center gap-2 rounded-xl bg-(--brand-ink) text-white hover:bg-[#27332f]"
          >
            <Home className="size-4" />
            Choose another file
          </Button>
        </div>

        <p className="mt-6 border-t border-black/10 pt-4 text-xs leading-5 text-(--brand-muted)">
          Use a PDF or DOCX under 10MB and make sure the document contains selectable text.
        </p>
      </div>
    </section>
  );
}
