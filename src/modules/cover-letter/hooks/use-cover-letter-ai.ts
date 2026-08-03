"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/modules/auth";
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

  // Sync drawer fields with current letter data when opened
  useEffect(() => {
    if (showAiDrawer) {
      setAiRole(data.role || "");
      setAiCompany(data.company || "");
      setAiHeadline(data.headline || "");
    }
  }, [showAiDrawer, data.role, data.company, data.headline]);

  const handleGenerateAiCoverLetter = async () => {
    if (!user) {
      openAuthModal("sign_in", "Please sign in to generate cover letters with AI.");
      return;
    }

    setIsGeneratingAi(true);
    setAiSuccessMessage(false);
    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: aiRole || data.role,
          company: aiCompany || data.company,
          headline: aiHeadline || data.headline,
          keyPoints: aiKeyPoints,
          tone: aiTone,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setHistory((prev) => [...prev, data]);
        setFuture([]);
        setData((cur) => ({
          ...cur,
          role: aiRole || cur.role,
          company: aiCompany || cur.company,
          headline: aiHeadline || cur.headline,
          greeting: json.data.greeting || cur.greeting,
          opening: json.data.opening || cur.opening,
          evidence: json.data.evidence || cur.evidence,
          closing: json.data.closing || cur.closing,
          signoff: json.data.signoff || cur.signoff,
        }));
        setAiSuccessMessage(true);
        setTimeout(() => setAiSuccessMessage(false), 4000);
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return {
    aiRole, setAiRole,
    aiCompany, setAiCompany,
    aiHeadline, setAiHeadline,
    aiKeyPoints, setAiKeyPoints,
    aiTone, setAiTone,
    isGeneratingAi,
    aiSuccessMessage,
    handleGenerateAiCoverLetter,
  };
}
