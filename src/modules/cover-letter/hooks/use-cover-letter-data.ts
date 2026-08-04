"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/modules/auth";
import { getAuthHeaders } from "@/shared/lib/api-headers";
import { useNotification } from "@/shared/lib/use-notification";
import type { CoverLetterData, CoverLetterTheme } from "../types/cover-letter";
import { STORAGE_KEY, emptyLetter, themes } from "../constants";
import { extractTextFromCoverLetterFile, parseExtractedLetterText } from "../utils/import-letter";

export function useCoverLetterData() {
  const user = useAuthStore((state) => state.user);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const showToast = useNotification((state) => state.showToast);

  const [data, setData] = useState<CoverLetterData>(emptyLetter);
  const [theme, setTheme] = useState<CoverLetterTheme>("linen");
  const [customAccent, setCustomAccent] = useState<string | null>(null);
  const [saveLabel, setSaveLabel] = useState("Saved locally");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [isImportingLetter, setIsImportingLetter] = useState(false);

  const [history, setHistory] = useState<CoverLetterData[]>([]);
  const [future, setFuture] = useState<CoverLetterData[]>([]);

  const hasLoaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage / cloud on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const activeId = typeof window !== "undefined"
          ? window.localStorage.getItem("active-cover-letter-id")
          : null;

        if (activeId === "new") {
          setData(emptyLetter);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: emptyLetter }));
          hasLoaded.current = true;
          return;
        }

        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.data) {
            setData(parsed.data);
            if (parsed.theme) setTheme(parsed.theme);
            if (parsed.customAccent) setCustomAccent(parsed.customAccent);
          } else if (parsed.fullName !== undefined || parsed.paragraphs !== undefined || parsed.role !== undefined) {
            setData(parsed);
          }
        } else if (activeId && activeId !== "undefined" && activeId !== "null") {
          if (user) {
            try {
              const authHeaders = await getAuthHeaders();
              const res = await fetch("/api/cover-letters", { headers: authHeaders });
              const json = await res.json();
              if (json.success && Array.isArray(json.data)) {
                const target = json.data.find((item: any) => item.id === activeId);
                if (target && target.data) {
                  setData(target.data);
                  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: target.data }));
                  hasLoaded.current = true;
                  return;
                }
              }
            } catch (cloudErr) {
              console.error("Cloud fetch target letter error:", cloudErr);
            }
          }
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        hasLoaded.current = true;
      }
    }
    loadInitialData();
  }, [user]);

  // Auto-save to localStorage on change
  useEffect(() => {
    if (!hasLoaded.current) return;
    setSaveLabel("Saving…");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, theme, customAccent }));
      setSaveLabel("Saved locally");
    }, 400);
  }, [data, theme, customAccent]);

  const update = (field: keyof CoverLetterData, value: string) => {
    setHistory((prev) => [...prev, data]);
    setFuture([]);
    setData((current) => ({ ...current, [field]: value }));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture((prev) => [data, ...prev]);
    setData(previous);
    setHistory((prev) => prev.slice(0, prev.length - 1));
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((prev) => [...prev, data]);
    setData(next);
    setFuture((prev) => prev.slice(1));
  };

  const handleConfirmStartFresh = () => {
    setHistory((prev) => [...prev, data]);
    setFuture([]);
    setData(emptyLetter);
    setCustomAccent("#000000");
    setTheme(themes[0].id);
    if (typeof window !== "undefined") {
      localStorage.setItem("active-cover-letter-id", "new");
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: emptyLetter }));
    }
  };

  const handleSaveToCloud = async () => {
    if (!user) {
      openAuthModal("sign_in", "Please sign in to save your cover letter to your account.");
      return;
    }
    setIsSaving(true);
    try {
      const storedId = typeof window !== "undefined" ? localStorage.getItem("active-cover-letter-id") : null;
      const activeId = storedId && storedId !== "undefined" && storedId !== "null" && storedId !== "new"
        ? storedId
        : undefined;

      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/cover-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          id: activeId,
          title: data.fullName
            ? `${data.fullName}'s Cover Letter`
            : data.company ? `${data.company} — Cover Letter` : "Cover Letter",
          company: data.company,
          role: data.role,
          data,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Could not save cover letter.");

      const letterId = json.data?.id || `local-${Date.now()}`;
      if (typeof window !== "undefined") {
        localStorage.setItem("active-cover-letter-id", letterId);
        try {
          const localListRaw = localStorage.getItem("local-saved-cover-letters");
          const localList: any[] = localListRaw ? JSON.parse(localListRaw) : [];
          const newItem = {
            id: letterId,
            title: data.fullName
              ? `${data.fullName}'s Cover Letter`
              : data.company ? `${data.company} — Cover Letter` : "Cover Letter",
            company: data.company || "",
            role: data.role || "",
            data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          const updatedList = [newItem, ...localList.filter((item) => item.id !== letterId)];
          localStorage.setItem("local-saved-cover-letters", JSON.stringify(updatedList));
        } catch (e) {
          console.error("Local backup error:", e);
        }
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: any) {
      console.error("Save cover letter error:", err);
      showToast("Save Error", err.message || "Failed to save cover letter.", "error");
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadLetter = async (file: File) => {
    setIsImportingLetter(true);
    try {
      const rawText = await extractTextFromCoverLetterFile(file);
      if (!rawText || !rawText.trim()) {
        throw new Error("Could not read text from this file. Please choose a readable PDF, DOCX, or TXT file.");
      }
      setHistory((prev) => [...prev, data]);
      setFuture([]);
      const updatedData = parseExtractedLetterText(rawText, data);
      setData(updatedData);
      showToast(
        "Cover Letter Uploaded",
        "Your letter was loaded into the studio. You can now edit all fields and layout.",
        "success"
      );
    } catch (err: any) {
      console.error("Upload cover letter error:", err);
      showToast("Upload Error", err.message || "Failed to read cover letter file.", "error");
    } finally {
      setIsImportingLetter(false);
    }
  };

  return {
    data, setData,
    theme, setTheme,
    customAccent, setCustomAccent,
    saveLabel,
    isSaving,
    saveStatus,
    isImportingLetter,
    history, setHistory,
    future, setFuture,
    update,
    handleUndo,
    handleRedo,
    handleConfirmStartFresh,
    handleSaveToCloud,
    handleUploadLetter,
  };
}
