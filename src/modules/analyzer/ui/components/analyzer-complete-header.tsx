"use client";

import Link from "next/link";
import { BadgeCheck, PenLine, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface AnalyzerCompleteHeaderProps {
  fileName?: string;
  onReset: () => void;
}

export function AnalyzerCompleteHeader({ fileName, onReset }: AnalyzerCompleteHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-black/10 bg-white/90 p-4 shadow-[0_16px_50px_rgba(23,26,23,0.10)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-lg bg-[#f6ecd0] text-[var(--premium-panel)]">
          <BadgeCheck className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[var(--premium-ink)]">Analysis complete</h1>
          <p className="max-w-full truncate text-sm text-muted-foreground">
            {fileName || "Your resume"}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <Button
          asChild
          className="h-10 justify-center gap-2 bg-[var(--brand-ink)] px-4 text-white hover:bg-[#293630]"
        >
          <Link href="/builder">
            <PenLine className="size-4" />
            Build improved resume
          </Link>
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="h-10 justify-center gap-2 border-black/10 bg-white/75 text-[var(--premium-ink)] hover:bg-white"
        >
          <RotateCcw className="size-4" />
          Analyze another
        </Button>
      </div>
    </div>
  );
}
