"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/modules/auth";
import { getAuthHeaders } from "@/shared/lib/api-headers";
import { useNotification } from "@/shared/lib/use-notification";
import type { CoverLetterData, CoverLetterTheme } from "../types/cover-letter";
import { STORAGE_KEY, emptyLetter, themes } from "../constants";
import { extractTextFromCoverLetterFile, parseExtractedLetterText } from "../utils/import-letter";
import { idbGet, idbSet, idbDel } from "../services/cover-letter-idb";

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

  // Load from IndexedDB / cloud on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const stored = await idbGet<any>(STORAGE_KEY);
        if (stored && (stored.data || stored.fullName !== undefined)) {
          const loadedData = stored.data || stored;
          const isNonEmpty = Boolean(
            loadedData.fullName ||
            loadedData.role ||
            loadedData.company ||
            (loadedData.paragraphs && loadedData.paragraphs.some((p: string) => p && p.trim()))
          );
          if (isNonEmpty) {
            setData(loadedData);
            if (stored.theme) setTheme(stored.theme);
            if (stored.customAccent) setCustomAccent(stored.customAccent);
            hasLoaded.current = true;
            return;
          }
        }

        const activeId = await idbGet<string>("active-cover-letter-id");
        if (activeId === "new") {
          setData(emptyLetter);
          await idbSet(STORAGE_KEY, { data: emptyLetter });
          hasLoaded.current = true;
          return;
        }

        if (activeId && activeId !== "undefined" && activeId !== "null") {
          if (user) {
            try {
              const authHeaders = await getAuthHeaders();
              const res = await fetch("/api/cover-letters", { headers: authHeaders });
              const json = await res.json();
              if (json.success && Array.isArray(json.data)) {
                const target = json.data.find((item: any) => item.id === activeId);
                if (target && target.data) {
                  setData(target.data);
                  await idbSet(STORAGE_KEY, { data: target.data });
                  hasLoaded.current = true;
                  return;
                }
              }
            } catch (cloudErr) {
              console.error("Cloud fetch target letter error:", cloudErr);
            }
          }
        }
      } catch (err) {
        console.error("IDB load error:", err);
        await idbDel(STORAGE_KEY);
      } finally {
        hasLoaded.current = true;
      }
    }
    loadInitialData();
  }, [user]);

  // Auto-save to IndexedDB on change
  useEffect(() => {
    if (!hasLoaded.current) return;
    setSaveLabel("Saving…");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await idbSet(STORAGE_KEY, { data, theme, customAccent });
      setSaveLabel("Saved locally");
    }, 400);
  }, [data, theme, customAccent]);

  const historyDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSnapshotRef = useRef<CoverLetterData>(data);

  useEffect(() => {
    lastSnapshotRef.current = data;
  }, [data]);

  const update = useCallback((field: keyof CoverLetterData, value: string) => {
    setData((current) => {
      const next = { ...current, [field]: value };
      if (historyDebounceTimer.current) clearTimeout(historyDebounceTimer.current);
      historyDebounceTimer.current = setTimeout(() => {
        setHistory((prev) => {
          if (prev.length >= 30) return [...prev.slice(1), lastSnapshotRef.current];
          return [...prev, lastSnapshotRef.current];
        });
      }, 500);
      return next;
    });
    setFuture([]);
  }, []);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture((prev) => [data, ...prev]);
    setData(previous);
    setHistory((prev) => prev.slice(0, prev.length - 1));
  }, [history, data]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((prev) => [...prev, data]);
    setData(next);
    setFuture((prev) => prev.slice(1));
  }, [future, data]);

  const handleConfirmStartFresh = async () => {
    setHistory((prev) => [...prev, data]);
    setFuture([]);
    setData(emptyLetter);
    setCustomAccent("#000000");
    setTheme(themes[0].id);
    await idbSet("active-cover-letter-id", "new");
    await idbSet(STORAGE_KEY, { data: emptyLetter });
  };

  const handleSaveToCloud = async () => {
    if (!user) {
      openAuthModal("sign_in", "Please sign in to save your cover letter to your account.");
      return;
    }
    setIsSaving(true);
    try {
      const storedId = await idbGet<string>("active-cover-letter-id");
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
      await idbSet("active-cover-letter-id", letterId);
      try {
        const localList: any[] = (await idbGet<any[]>("local-saved-cover-letters")) || [];
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
        await idbSet("local-saved-cover-letters", updatedList);
      } catch (e) {
        console.error("Local backup error:", e);
      }

      setSaveStatus("saved");
      showToast(
        "Cover Letter Saved",
        "Your cover letter was saved successfully to your account.",
        "success"
      );
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
      await idbSet(STORAGE_KEY, { data: updatedData, theme, customAccent });
      await idbSet("active-cover-letter-id", "draft");
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
