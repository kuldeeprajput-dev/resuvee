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

  const [data, setDataInternal] = useState<CoverLetterData>(emptyLetter);
  const [theme, setTheme] = useState<CoverLetterTheme>("linen");
  const [customAccent, setCustomAccent] = useState<string | null>(null);
  const [saveLabel, setSaveLabel] = useState("Saved locally");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [isImportingLetter, setIsImportingLetter] = useState(false);

  // history = stack of snapshots BEFORE changes. future = redo stack.
  const [history, setHistory] = useState<CoverLetterData[]>([]);
  const [future, setFuture] = useState<CoverLetterData[]>([]);

  // We keep refs for history/future so handleUndo/handleRedo read current values
  // without needing them in their dependency arrays.
  const historyRef = useRef<CoverLetterData[]>([]);
  const futureRef = useRef<CoverLetterData[]>([]);
  const dataRef = useRef<CoverLetterData>(emptyLetter);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // snapshot captured at the START of a typing session (before the first keystroke)
  const typingStartSnapshot = useRef<CoverLetterData | null>(null);

  const hasLoaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { futureRef.current = future; }, [future]);

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
            setDataInternal(loadedData);
            dataRef.current = loadedData;
            if (stored.theme) setTheme(stored.theme);
            if (stored.customAccent) setCustomAccent(stored.customAccent);
            setHistory([]);
            setFuture([]);
            historyRef.current = [];
            futureRef.current = [];
            typingStartSnapshot.current = null;
            hasLoaded.current = true;
            return;
          }
        }

        const activeId = await idbGet<string>("active-cover-letter-id");
        if (activeId === "new") {
          setDataInternal(emptyLetter);
          dataRef.current = emptyLetter;
          await idbSet(STORAGE_KEY, { data: emptyLetter });
          setHistory([]);
          setFuture([]);
          historyRef.current = [];
          futureRef.current = [];
          typingStartSnapshot.current = null;
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
                  setDataInternal(target.data);
                  dataRef.current = target.data;
                  await idbSet(STORAGE_KEY, { data: target.data });
                  setHistory([]);
                  setFuture([]);
                  historyRef.current = [];
                  futureRef.current = [];
                  typingStartSnapshot.current = null;
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

  // Single-field typing update — debounced snapshot push so Undo pops ONE entry per typing session
  const update = useCallback((field: keyof CoverLetterData, value: string) => {
    const current = dataRef.current;

    // Capture the state at the START of this typing session (before any keystroke this session)
    if (!typingStartSnapshot.current) {
      typingStartSnapshot.current = JSON.parse(JSON.stringify(current));
    }

    // Each keystroke resets the debounce timer. When user pauses for 600ms, commit snapshot to history.
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (typingStartSnapshot.current) {
        const snap = typingStartSnapshot.current;
        typingStartSnapshot.current = null;
        const snapStr = JSON.stringify(snap);
        const nowStr = JSON.stringify(dataRef.current);
        if (snapStr !== nowStr) {
          const newHistory = [...historyRef.current.slice(-29), snap];
          historyRef.current = newHistory;
          setHistory(newHistory);
          futureRef.current = [];
          setFuture([]);
        }
      }
      debounceTimer.current = null;
    }, 600);

    // Clear redo stack immediately on any edit
    futureRef.current = [];
    setFuture([]);

    // Update data immediately
    setDataInternal((prev) => {
      const next = { ...prev, [field]: value };
      dataRef.current = next;
      return next;
    });
  }, []);

  // Batch setData (used for bulk operations like "Create editable starter", AI generation, etc.)
  // Always pushes the pre-change state to history immediately.
  const setData = useCallback((updater: React.SetStateAction<CoverLetterData>) => {
    // Flush any in-progress typing session first
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    const snapBefore = typingStartSnapshot.current || dataRef.current;
    typingStartSnapshot.current = null;
    const cloned = JSON.parse(JSON.stringify(snapBefore));

    const newHistory = [...historyRef.current.slice(-29), cloned];
    historyRef.current = newHistory;
    setHistory(newHistory);
    futureRef.current = [];
    setFuture([]);

    setDataInternal((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      dataRef.current = next;
      return next;
    });
  }, []);

  // Undo — always ONE click. Pops the last history entry.
  const handleUndo = useCallback(() => {
    // If user is mid-typing, flush the typing session snapshot first, then undo it
    if (typingStartSnapshot.current) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
      const snapshot = typingStartSnapshot.current;
      typingStartSnapshot.current = null;
      const currentCopy = JSON.parse(JSON.stringify(dataRef.current));
      const newFuture = [currentCopy, ...futureRef.current].slice(0, 30);
      futureRef.current = newFuture;
      setFuture(newFuture);
      setDataInternal(snapshot);
      dataRef.current = snapshot;
      setSaveLabel("Undo applied");
      return;
    }

    const hist = historyRef.current;
    if (hist.length === 0) return;
    const previous = hist[hist.length - 1];
    const currentCopy = JSON.parse(JSON.stringify(dataRef.current));
    const newHistory = hist.slice(0, -1);
    const newFuture = [currentCopy, ...futureRef.current].slice(0, 30);
    historyRef.current = newHistory;
    futureRef.current = newFuture;
    setHistory(newHistory);
    setFuture(newFuture);
    setDataInternal(previous);
    dataRef.current = previous;
    setSaveLabel("Undo applied");
  }, []);

  // Redo — always ONE click.
  const handleRedo = useCallback(() => {
    // Flush any in-progress typing before redo
    if (typingStartSnapshot.current) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
      const snap = typingStartSnapshot.current;
      typingStartSnapshot.current = null;
      const nowStr = JSON.stringify(dataRef.current);
      const snapStr = JSON.stringify(snap);
      if (snapStr !== nowStr) {
        const newHistory = [...historyRef.current.slice(-29), snap];
        historyRef.current = newHistory;
        setHistory(newHistory);
      }
    }

    const fut = futureRef.current;
    if (fut.length === 0) return;
    const next = fut[0];
    const currentCopy = JSON.parse(JSON.stringify(dataRef.current));
    const newHistory = [...historyRef.current.slice(-29), currentCopy];
    const newFuture = fut.slice(1);
    historyRef.current = newHistory;
    futureRef.current = newFuture;
    setHistory(newHistory);
    setFuture(newFuture);
    setDataInternal(next);
    dataRef.current = next;
    setSaveLabel("Redo applied");
  }, []);

  const handleConfirmStartFresh = async () => {
    if (debounceTimer.current) { clearTimeout(debounceTimer.current); debounceTimer.current = null; }
    const snap = typingStartSnapshot.current || dataRef.current;
    typingStartSnapshot.current = null;
    const newHistory = [...historyRef.current.slice(-29), JSON.parse(JSON.stringify(snap))];
    historyRef.current = newHistory;
    futureRef.current = [];
    setHistory(newHistory);
    setFuture([]);
    setDataInternal(emptyLetter);
    dataRef.current = emptyLetter;
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
      const activeId =
        storedId && storedId !== "undefined" && storedId !== "null" && storedId !== "new"
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
            : data.company
              ? `${data.company} — Cover Letter`
              : "Cover Letter",
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
            : data.company
              ? `${data.company} — Cover Letter`
              : "Cover Letter",
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
        throw new Error(
          "Could not read text from this file. Please choose a readable PDF, DOCX, or TXT file."
        );
      }
      if (debounceTimer.current) { clearTimeout(debounceTimer.current); debounceTimer.current = null; }
      const snapBefore = typingStartSnapshot.current || dataRef.current;
      typingStartSnapshot.current = null;
      const newHistory = [...historyRef.current.slice(-29), JSON.parse(JSON.stringify(snapBefore))];
      historyRef.current = newHistory;
      futureRef.current = [];
      setHistory(newHistory);
      setFuture([]);
      const updatedData = parseExtractedLetterText(rawText, data);
      setDataInternal(updatedData);
      dataRef.current = updatedData;
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
    data,
    setData,
    theme,
    setTheme,
    customAccent,
    setCustomAccent,
    saveLabel,
    isSaving,
    saveStatus,
    isImportingLetter,
    history,
    future,
    update,
    handleUndo,
    handleRedo,
    handleConfirmStartFresh,
    handleSaveToCloud,
    handleUploadLetter,
  };
}
