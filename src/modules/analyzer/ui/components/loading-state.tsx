"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock3, FileText, SearchCheck, Sparkles, Target } from "lucide-react";

interface LoadingStateProps {
  phase?: "extracting" | "analyzing";
}

export function LoadingState({ phase = "analyzing" }: LoadingStateProps) {
  const [progress, setProgress] = useState(6);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
      setProgress((prev) => Math.min(prev + 2.5, 95));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const steps = [
    { icon: FileText, text: "Text extraction" },
    { icon: SearchCheck, text: "ATS structure scan" },
    { icon: Target, text: "Keyword and role fit" },
    { icon: Sparkles, text: "Recommendations" },
  ];

  const extractingOffset = phase === "extracting" ? 0 : 1;
  const currentStep = Math.min(Math.floor(elapsedTime / 3) + extractingOffset, steps.length - 1);

  return (
    <section className="mx-auto w-full max-w-2xl" aria-live="polite">
      <div className="rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_24px_70px_rgba(22,32,28,0.10)] sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#4f6659]">
              <Sparkles className="size-4" />
              {phase === "extracting" ? "Reading resume" : "Creating report"}
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-[-0.035em] text-[var(--brand-ink)] sm:text-3xl">
              {phase === "extracting" ? "Extracting your resume" : "Reviewing your resume"}
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--brand-muted)]">
              We are checking structure, keywords, strengths, and the edits that will have the most
              impact.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-bold tracking-[-0.04em] text-[var(--brand-ink)]">
              {Math.round(progress)}%
            </p>
            <p className="mt-1 flex items-center justify-end gap-1.5 text-xs text-[var(--brand-muted)]">
              <Clock3 className="size-3.5" />
              {formatTime(elapsedTime)}
            </p>
          </div>
        </div>

        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-[#e8ebe6]">
          <div
            className="h-full rounded-full bg-[#527360] transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-7 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {steps.map((step, index) => {
            const isDone = index < currentStep;
            const isActive = index === currentStep;

            return (
              <div
                key={step.text}
                className="flex items-center gap-3 border-b border-black/8 py-3"
              >
                <span
                  className={[
                    "flex size-8 shrink-0 items-center justify-center rounded-full",
                    isDone
                      ? "bg-[#dce9d1] text-[#35533f]"
                      : isActive
                        ? "bg-[var(--brand-ink)] text-white"
                        : "bg-[#f0f1ed] text-black/35",
                  ].join(" ")}
                >
                  {isDone ? <CheckCircle className="size-4" /> : <step.icon className="size-4" />}
                </span>
                <span
                  className={[
                    "text-sm",
                    isActive || isDone
                      ? "font-bold text-[var(--brand-ink)]"
                      : "text-[var(--brand-muted)]",
                  ].join(" ")}
                >
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
