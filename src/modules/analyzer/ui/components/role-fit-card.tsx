"use client";

import { Gauge, Layers3, Target } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { ResumeAnalysis } from "../../types";

interface RoleFitCardProps {
  analysis: ResumeAnalysis;
}

export function RoleFitCard({ analysis }: RoleFitCardProps) {
  return (
    <Card className="border-black/10 bg-white/92 py-0 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-[#d9c38b] bg-[#fbf5e6] px-3 py-1 text-xs font-medium text-[#6f5520]">
              <Target className="size-3.5" />
              Role fit
            </div>
            <h2 className="text-2xl font-semibold leading-tight text-(--premium-ink)">
              {analysis.role}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{analysis.level}</p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-lg border border-black/10 bg-[linear-gradient(135deg,var(--premium-panel),var(--premium-aubergine))] px-3 py-2 text-sm font-medium text-white">
            <Gauge className="size-4 text-[#f1d58b]" />
            ATS ready
          </div>
        </div>

        <div className="mt-5 border-t border-black/10 pt-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-(--premium-ink)">
            <Layers3 className="size-4 text-(--premium-teal)" />
            Tech stack detected
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.techStack.length ? (
              analysis.techStack.map((tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="h-auto min-h-7 max-w-full whitespace-normal rounded-lg border border-black/10 bg-white px-3 text-left text-sm text-(--premium-ink)"
                >
                  {tech}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No tech stack detected.</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
