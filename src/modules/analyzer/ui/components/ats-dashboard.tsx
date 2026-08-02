"use client";

import { CheckCircle, XCircle } from "lucide-react";
import type { ResumeAnalysis } from "../../types";
import { ScoreCard } from "./score-card";
import { RoleFitCard } from "./role-fit-card";
import { InsightListCard } from "./insight-list-card";
import { MissingKeywordsCard } from "./missing-keywords-card";
import { EditPlanCard } from "./edit-plan-card";
import { CareerAdviceCard } from "./career-advice-card";

interface ATSDashboardProps {
  analysis: ResumeAnalysis;
}

export function ATSDashboard({ analysis }: ATSDashboardProps) {
  return (
    <div className="w-full space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.1fr)]">
        <ScoreCard analysis={analysis} />
        <RoleFitCard analysis={analysis} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <InsightListCard
          title="Strengths"
          icon={CheckCircle}
          items={analysis.strengths}
          tone={{
            card: "border-[#9dcfc5] bg-[#eaf5f1]/90",
            title: "text-[#0f5f59]",
            marker: "bg-[var(--premium-teal)]",
            text: "text-[#123c38]",
          }}
        />
        <InsightListCard
          title="Areas for improvement"
          icon={XCircle}
          items={analysis.weaknesses}
          tone={{
            card: "border-red-200 bg-red-50/80",
            title: "text-red-800",
            marker: "bg-red-500",
            text: "text-red-950",
          }}
        />
      </div>

      <MissingKeywordsCard missingKeywords={analysis.missingKeywords} />
      <EditPlanCard suggestions={analysis.suggestions} />
      <CareerAdviceCard advice={analysis.advice} />
    </div>
  );
}
