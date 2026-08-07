"use client";

import { BadgeCheck, Lightbulb, Zap } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

interface CareerAdviceCardProps {
  advice?: string;
}

export function CareerAdviceCard({ advice }: CareerAdviceCardProps) {
  return (
    <Card className="border-black/10 bg-white/92 py-0 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--premium-panel),var(--premium-aubergine))] text-white">
            <Lightbulb className="size-5" />
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-(--premium-ink)">
              <BadgeCheck className="size-4 text-(--premium-teal)" />
              Career advice
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{advice}</p>
          </div>
          <div className="ml-auto hidden rounded-lg border border-black/10 bg-[#fbf5e6] px-3 py-2 text-xs font-medium text-(--premium-ink) md:flex md:items-center md:gap-2">
            <Zap className="size-3.5 text-(--premium-gold)" />
            Actionable
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
