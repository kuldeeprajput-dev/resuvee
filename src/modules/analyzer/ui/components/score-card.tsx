"use client";

import { AlertCircle, CheckCircle, Layers3 } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CircularProgress } from "@/shared/components/ui/circular-progress";
import type { ResumeAnalysis } from "../../types";

function getScoreTone(score: number) {
  if (score >= 80) {
    return {
      label: "Excellent",
      card: "border-[#9dcfc5] bg-[#eaf5f1]/90",
      progress: "text-[var(--premium-teal)]",
      text: "text-[#0f766e]",
      fill: "bg-[var(--premium-teal)]",
    };
  }

  if (score >= 60) {
    return {
      label: "Good",
      card: "border-[#d9c38b] bg-[#fbf5e6]/90",
      progress: "text-[var(--premium-gold)]",
      text: "text-[#6f5520]",
      fill: "bg-[var(--premium-gold)]",
    };
  }

  return {
    label: "Needs work",
    card: "border-red-200 bg-red-50/80",
    progress: "text-red-500",
    text: "text-red-700",
    fill: "bg-red-500",
  };
}

interface ScoreCardProps {
  analysis: ResumeAnalysis;
}

export function ScoreCard({ analysis }: ScoreCardProps) {
  const scoreTone = getScoreTone(analysis.score);
  const normalizedScore = Math.min(Math.max(analysis.score, 0), 100);
  const scoreBands = [
    { label: "Weak", width: "40%", className: "bg-red-400" },
    { label: "Good", width: "30%", className: "bg-[var(--premium-gold)]" },
    { label: "Strong", width: "30%", className: "bg-[var(--premium-teal)]" },
  ];
  const scoreSignals = [
    {
      label: "Strengths",
      value: analysis.strengths.length,
      icon: CheckCircle,
      className: "bg-white/70 text-[#0f5f59]",
    },
    {
      label: "Keyword gaps",
      value: analysis.missingKeywords.length,
      icon: AlertCircle,
      className: "bg-white/70 text-[#6f5520]",
    },
    {
      label: "Skills found",
      value: analysis.techStack.length,
      icon: Layers3,
      className: "bg-white/70 text-[var(--premium-ink)]",
    },
  ];
  const scoreSummary =
    analysis.score >= 80
      ? "Strong foundation. Keep the role keywords and measurable impact visible."
      : analysis.score >= 60
        ? "Good base. Add missing keywords and sharper metrics to move into the strong band."
        : "Needs focused edits. Start with keywords, structure, and quantified achievements.";

  return (
    <Card className={`${scoreTone.card} py-0 shadow-sm`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left xl:flex-col xl:items-start 2xl:flex-row 2xl:items-center">
          <CircularProgress
            value={analysis.score}
            size={148}
            strokeWidth={12}
            progressColor={scoreTone.progress}
            label={scoreTone.label}
            className="mx-auto sm:mx-0"
          />
          <div className="min-w-0 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">ATS score</p>
              <h2 className="mt-1 text-3xl font-semibold text-[var(--premium-ink)]">
                {analysis.score}/100
              </h2>
              <p className={`text-sm font-medium ${scoreTone.text}`}>{scoreTone.label}</p>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-white/80 ring-1 ring-black/10">
              {scoreBands.map((band) => (
                <div
                  key={band.label}
                  className={band.className}
                  style={{ width: band.width }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-black/10 pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--premium-ink)]">Score signals</p>
            <span className={`text-xs font-semibold ${scoreTone.text}`}>
              {scoreTone.label} band
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            {scoreSignals.map((signal) => (
              <div
                key={signal.label}
                className={`rounded-lg border border-black/10 p-3 ${signal.className}`}
              >
                <signal.icon className="mb-3 size-4" />
                <p className="text-2xl font-semibold leading-none">{signal.value}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{signal.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-lg border border-black/10 bg-white/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
              <span>Current position</span>
              <span>{normalizedScore}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/10">
              <div
                className={`h-full rounded-full ${scoreTone.fill}`}
                style={{ width: `${normalizedScore}%` }}
              />
            </div>
            <p className="mt-3 text-sm leading-5 text-[var(--premium-ink)]">{scoreSummary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
