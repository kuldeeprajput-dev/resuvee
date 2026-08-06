"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/modules/auth";
import { useNotification } from "@/shared/lib/use-notification";
import { idbGet, idbSet } from "../services/cover-letter-idb";
import { STORAGE_KEY } from "../constants";
import type { CoverLetterData } from "../types/cover-letter";

interface UseAiOptions {
  data: CoverLetterData;
  showAiDrawer: boolean;
  setHistory: React.Dispatch<React.SetStateAction<CoverLetterData[]>>;
  setFuture: React.Dispatch<React.SetStateAction<CoverLetterData[]>>;
  setData: React.Dispatch<React.SetStateAction<CoverLetterData>>;
}

export function useCoverLetterAi({
  data,
  showAiDrawer,
  setHistory,
  setFuture,
  setData,
}: UseAiOptions) {
  const { user, openAuthModal } = useAuthStore();

  const [aiRole, setAiRole] = useState("");
  const [aiCompany, setAiCompany] = useState("");
  const [aiHeadline, setAiHeadline] = useState("");
  const [aiKeyPoints, setAiKeyPoints] = useState("");
  const [aiTone, setAiTone] = useState("Professional");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);

  // Sync drawer fields and cooldown timestamp when opened / mounted
  useEffect(() => {
    async function initCooldown() {
      const stored = await idbGet<string>("cover-letter-ai-cooldown-timestamp");
      if (stored) {
        const lastTime = parseInt(stored, 10);
        if (!isNaN(lastTime)) {
          const elapsedSec = Math.floor((Date.now() - lastTime) / 1000);
          const remaining = 120 - elapsedSec;
          if (remaining > 0) {
            setCooldownSeconds(remaining);
          }
        }
      }
    }
    initCooldown();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Sync and restore drawer fields from IndexedDB when opened
  useEffect(() => {
    async function loadAiState() {
      if (showAiDrawer) {
        const saved = await idbGet<any>("cover-letter-ai-drawer-state");
        if (saved) {
          if (saved.aiRole !== undefined) setAiRole(saved.aiRole);
          if (saved.aiCompany !== undefined) setAiCompany(saved.aiCompany);
          if (saved.aiHeadline !== undefined) setAiHeadline(saved.aiHeadline);
          if (saved.aiKeyPoints !== undefined) setAiKeyPoints(saved.aiKeyPoints);
          if (saved.aiTone !== undefined) setAiTone(saved.aiTone);
        } else {
          setAiRole(data.role || "");
          setAiCompany(data.company || "");
          setAiHeadline(data.headline || "");
        }
        setAiErrorMessage(null);
        setAiSuccessMessage(false);
      }
    }
    loadAiState();
  }, [showAiDrawer, data.role, data.company, data.headline]);

  // Auto-persist AI drawer form inputs to IndexedDB
  useEffect(() => {
    if (aiRole || aiCompany || aiHeadline || aiKeyPoints || aiTone) {
      idbSet("cover-letter-ai-drawer-state", {
        aiRole,
        aiCompany,
        aiHeadline,
        aiKeyPoints,
        aiTone,
      });
    }
  }, [aiRole, aiCompany, aiHeadline, aiKeyPoints, aiTone]);

  const handleSetRole = (val: string) => {
    setAiRole(val);
    if (aiErrorMessage) setAiErrorMessage(null);
  };
  const handleSetCompany = (val: string) => {
    setAiCompany(val);
    if (aiErrorMessage) setAiErrorMessage(null);
  };
  const handleSetHeadline = (val: string) => {
    setAiHeadline(val);
    if (aiErrorMessage) setAiErrorMessage(null);
  };
  const handleSetKeyPoints = (val: string) => {
    setAiKeyPoints(val);
    if (aiErrorMessage) setAiErrorMessage(null);
  };

  const handleGenerateAiCoverLetter = async () => {
    if (!user) {
      openAuthModal("sign_in", "Please sign in to generate cover letters with AI.");
      return;
    }

    if (cooldownSeconds > 0) {
      const mins = Math.floor(cooldownSeconds / 60);
      const secs = cooldownSeconds % 60;
      const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
      setAiErrorMessage(`Please wait ${timeStr} before generating another cover letter with AI.`);
      return;
    }

    const trimmedRole = (aiRole || data.role || "").trim();
    const trimmedCompany = (aiCompany || data.company || "").trim();
    const trimmedHeadline = (aiHeadline || data.headline || "").trim();
    const trimmedKeyPoints = (aiKeyPoints || "").trim();

    if (!trimmedRole || !trimmedCompany || !trimmedHeadline || !trimmedKeyPoints) {
      setAiErrorMessage("Please fill in all required fields (Target Role, Target Company, Title/Specialty, and Key Skills) before generating with AI.");
      setAiSuccessMessage(false);
      return;
    }

    setIsGeneratingAi(true);
    setAiSuccessMessage(false);
    setAiErrorMessage(null);
    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: trimmedRole,
          company: trimmedCompany,
          headline: trimmedHeadline,
          keyPoints: trimmedKeyPoints,
          tone: aiTone,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        if (json.remainingSeconds) {
          setCooldownSeconds(json.remainingSeconds);
          const timestamp = Date.now() - (120 - json.remainingSeconds) * 1000;
          await idbSet("cover-letter-ai-cooldown-timestamp", timestamp.toString());
        }
        throw new Error(json.error || "Failed to generate cover letter with AI.");
      }

      // Successful generation: start 2-minute (120s) cooldown
      const now = Date.now();
      setCooldownSeconds(120);
      await idbSet("cover-letter-ai-cooldown-timestamp", now.toString());

      const updatedLetter: CoverLetterData = {
        ...data,
        role: trimmedRole,
        company: trimmedCompany,
        headline: trimmedHeadline,
        greeting: json.data.greeting || data.greeting,
        opening: json.data.opening || data.opening,
        evidence: json.data.evidence || data.evidence,
        closing: json.data.closing || data.closing,
        signoff: json.data.signoff || data.signoff,
      };

      setHistory((prev) => [...prev, data]);
      setFuture([]);
      setData(updatedLetter);

      await idbSet(STORAGE_KEY, { data: updatedLetter });
      await idbSet("active-cover-letter-id", "draft");

      setAiSuccessMessage(true);
      setTimeout(() => setAiSuccessMessage(false), 4000);
    } catch (err: any) {
      console.error("AI Generation failed:", err);
      setAiErrorMessage(err.message || "Failed to generate cover letter with AI.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return {
    aiRole, setAiRole: handleSetRole,
    aiCompany, setAiCompany: handleSetCompany,
    aiHeadline, setAiHeadline: handleSetHeadline,
    aiKeyPoints, setAiKeyPoints: handleSetKeyPoints,
    aiTone, setAiTone,
    isGeneratingAi,
    aiSuccessMessage,
    aiErrorMessage,
    cooldownSeconds,
    handleGenerateAiCoverLetter,
  };
}
