"use client";

import React from "react";
import { AlertCircle, Bot, Check, Clock, Loader2, Sparkles, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface CoverLetterAiDrawerProps {
  aiRole: string;
  setAiRole: (v: string) => void;
  aiCompany: string;
  setAiCompany: (v: string) => void;
  aiHeadline: string;
  setAiHeadline: (v: string) => void;
  aiKeyPoints: string;
  setAiKeyPoints: (v: string) => void;
  aiTone: string;
  setAiTone: (v: string) => void;
  isGeneratingAi: boolean;
  aiSuccessMessage: boolean;
  aiErrorMessage?: string | null;
  cooldownSeconds?: number;
  onClose: () => void;
  onGenerate: () => void;
}

export function CoverLetterAiDrawer({
  aiRole,
  setAiRole,
  aiCompany,
  setAiCompany,
  aiHeadline,
  setAiHeadline,
  aiKeyPoints,
  setAiKeyPoints,
  aiTone,
  setAiTone,
  isGeneratingAi,
  aiSuccessMessage,
  aiErrorMessage,
  cooldownSeconds = 0,
  onClose,
  onGenerate,
}: CoverLetterAiDrawerProps) {
  const isCooldownActive = cooldownSeconds > 0;
  const mins = Math.floor(cooldownSeconds / 60);
  const secs = cooldownSeconds % 60;
  const cooldownText = mins > 0 ? `${mins}m ${secs < 10 ? "0" : ""}${secs}s` : `${secs}s`;

  return (
    <div className="no-print fixed inset-0 z-[150] flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in">
      <div className="relative flex h-full w-full sm:w-[420px] flex-col border-l border-black/10 bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Bot className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--brand-ink)]">
                AI Writing Assistant
              </h3>
              <p className="text-[10px] text-[var(--brand-muted)]">
                Generate tailored cover letter paragraphs
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="builder-icon-button cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
              Target Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={aiRole}
              onChange={(e) => setAiRole(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              className="h-10 w-full rounded-xl border border-black/15 bg-black/5 px-3 text-xs font-semibold text-[var(--brand-ink)] outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
              Target Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={aiCompany}
              onChange={(e) => setAiCompany(e.target.value)}
              placeholder="e.g. Google"
              className="h-10 w-full rounded-xl border border-black/15 bg-black/5 px-3 text-xs font-semibold text-[var(--brand-ink)] outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
              Your Title / Specialty <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={aiHeadline}
              onChange={(e) => setAiHeadline(e.target.value)}
              placeholder="e.g. Full Stack Engineer with 5+ yrs experience"
              className="h-10 w-full rounded-xl border border-black/15 bg-black/5 px-3 text-xs font-semibold text-[var(--brand-ink)] outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
              Key Skills & Highlights <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={aiKeyPoints}
              onChange={(e) => setAiKeyPoints(e.target.value)}
              placeholder="e.g. React, Next.js, performance optimization, leading cross-functional teams"
              className="w-full rounded-xl border border-black/15 bg-black/5 p-3 text-xs font-semibold text-[var(--brand-ink)] outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
              Tone & Style
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {["Professional", "Enthusiastic", "Executive", "Concise"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAiTone(t)}
                  className={cn(
                    "rounded-xl border py-2 text-center text-xs font-bold transition cursor-pointer",
                    aiTone === t
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold"
                      : "border-black/10 bg-white text-[var(--brand-ink)] hover:bg-black/5"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {aiErrorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-950 animate-in fade-in">
              <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{aiErrorMessage}</span>
            </div>
          )}

          {aiSuccessMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 p-3 text-xs font-bold text-emerald-900 animate-in fade-in">
              <Check className="size-4 text-emerald-600 shrink-0" />
              <span>Cover letter successfully generated with AI!</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-black/10 mt-4">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGeneratingAi || isCooldownActive}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 text-xs font-bold text-white shadow-md transition hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGeneratingAi ? (
              <>
                <Loader2 className="size-4 animate-spin text-white" />
                <span>Writing with AI...</span>
              </>
            ) : isCooldownActive ? (
              <>
                <Clock className="size-4 text-emerald-200 animate-pulse" />
                <span>Wait {cooldownText}</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4 text-emerald-200" />
                <span>Generate with AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
