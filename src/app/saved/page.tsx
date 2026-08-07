"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Trash2,
  Copy,
  ArrowRight,
  Sparkles,
  Loader2,
  Clock,
  Briefcase,
  Building2,
  AlertCircle,
  LogIn,
  Search,
  Check,
  Code2,
} from "lucide-react";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { useAuthStore } from "@/modules/auth";
import { idbGet, idbSet, idbDel } from "@/modules/cover-letter/services/cover-letter-idb";
import { getAuthHeaders } from "@/shared/lib/api-headers";
import { useNotification } from "@/shared/lib/use-notification";
import { cn } from "@/shared/lib/utils";

interface SavedResumeItem {
  id: string;
  title: string;
  target_role: string;
  data: any;
  created_at: string;
  updated_at: string;
}

interface SavedCoverLetterItem {
  id: string;
  title: string;
  company: string;
  role: string;
  data: any;
  created_at: string;
  updated_at: string;
}

const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor:
create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Untitled Resume',
  target_role text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Untitled Cover Letter',
  company text,
  role text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table resumes enable row level security;
alter table cover_letters enable row level security;

create policy "Users manage own resumes" on resumes for all using (auth.uid() = user_id);
create policy "Users manage own cover letters" on cover_letters for all using (auth.uid() = user_id);`;

export default function SavedDocumentsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, openAuthModal } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"resumes" | "letters">("resumes");

  const [resumes, setResumes] = useState<SavedResumeItem[]>([]);
  const [letters, setLetters] = useState<SavedCoverLetterItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [resumesTableMissing, setResumesTableMissing] = useState(false);
  const [lettersTableMissing, setLettersTableMissing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAllSaved = async () => {
    setLoading(true);
    let apiResumes: SavedResumeItem[] = [];
    let apiLetters: SavedCoverLetterItem[] = [];

    try {
      const authHeaders = await getAuthHeaders();
      const [resumesRes, lettersRes] = await Promise.all([
        fetch("/api/resumes", { headers: authHeaders }),
        fetch("/api/cover-letters", { headers: authHeaders }),
      ]);

      const resumesJson = await resumesRes.json();
      const lettersJson = await lettersRes.json();

      if (resumesJson.tableMissing) setResumesTableMissing(true);
      if (resumesJson.success) apiResumes = resumesJson.data || [];

      if (lettersJson.tableMissing) setLettersTableMissing(true);
      if (lettersJson.success) apiLetters = lettersJson.data || [];
    } catch (err) {
      console.error("Fetch saved items error:", err);
    }

    // Merge with LocalStorage backups so saved items always appear
    if (typeof window !== "undefined") {
      try {
        const localResumesRaw = localStorage.getItem("local-saved-resumes");
        const localResumes: SavedResumeItem[] = localResumesRaw ? JSON.parse(localResumesRaw) : [];
        const mergedResumesMap = new Map<string, SavedResumeItem>();
        [...apiResumes, ...localResumes].forEach((item) => {
          if (!mergedResumesMap.has(item.id)) mergedResumesMap.set(item.id, item);
        });
        apiResumes = Array.from(mergedResumesMap.values());

        const localLetters: SavedCoverLetterItem[] =
          (await idbGet<SavedCoverLetterItem[]>("local-saved-cover-letters")) || [];
        const mergedLettersMap = new Map<string, SavedCoverLetterItem>();
        [...apiLetters, ...localLetters].forEach((item) => {
          if (!mergedLettersMap.has(item.id)) mergedLettersMap.set(item.id, item);
        });
        apiLetters = Array.from(mergedLettersMap.values());
      } catch (e) {
        console.error("Local merge error:", e);
      }
    }

    setResumes(apiResumes);
    setLetters(apiLetters);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllSaved();
  }, [user]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Resume Actions
  const handleOpenResumeInBuilder = (resume: SavedResumeItem) => {
    if (typeof window !== "undefined" && resume.data) {
      localStorage.setItem("active-resume-id", resume.id);
      localStorage.setItem(
        "resuvee-builder-v3",
        JSON.stringify({ state: { data: resume.data }, version: 3 })
      );
      window.location.href = "/builder";
    } else {
      router.push("/builder");
    }
  };

  const handleCreateNewResume = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("active-resume-id", "new");
      localStorage.removeItem("resuvee-builder-v3");
      localStorage.removeItem("resume-builder-data");
      window.location.href = "/builder";
    } else {
      router.push("/builder");
    }
  };

  const handleDuplicateResume = async (resume: SavedResumeItem) => {
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          title: `${resume.title} (Copy)`,
          targetRole: resume.target_role,
          data: resume.data,
        }),
      });
      const json = await res.json();
      fetchAllSaved();
      showToast("Resume duplicated", undefined, "success");
    } catch (err) {
      console.error("Duplicate resume error:", err);
    }
  };

  const { showConfirm, showToast } = useNotification();

  const handleDeleteResume = (id: string) => {
    showConfirm({
      title: "Delete Resume",
      message: "Are you sure you want to delete this resume? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        setDeletingId(id);
        try {
          const authHeaders = await getAuthHeaders();
          await fetch(`/api/resumes/${id}`, { method: "DELETE", headers: authHeaders }).catch(
            () => {}
          );
          setResumes((prev) => prev.filter((r) => r.id !== id));
          if (typeof window !== "undefined") {
            const localListRaw = localStorage.getItem("local-saved-resumes");
            if (localListRaw) {
              const localList: SavedResumeItem[] = JSON.parse(localListRaw);
              localStorage.setItem(
                "local-saved-resumes",
                JSON.stringify(localList.filter((r) => r.id !== id))
              );
            }
          }
          showToast("Resume deleted", undefined, "info");
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  // Cover Letter Actions
  const handleOpenLetterInStudio = async (letter: SavedCoverLetterItem) => {
    if (letter.data) {
      await idbSet("cover-letter-studio-data", { data: letter.data });
      await idbSet("active-cover-letter-id", letter.id);
      window.location.href = "/cover-letter";
    } else {
      router.push("/cover-letter");
    }
  };

  const handleCreateNewLetter = async () => {
    await idbSet("active-cover-letter-id", "new");
    await idbDel("cover-letter-studio-data");
    window.location.href = "/cover-letter";
  };

  const handleDuplicateLetter = async (letter: SavedCoverLetterItem) => {
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/cover-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          title: `${letter.title} (Copy)`,
          company: letter.company,
          role: letter.role,
          data: letter.data,
        }),
      });
      const json = await res.json();
      fetchAllSaved();
      showToast("Letter duplicated", undefined, "success");
    } catch (err) {
      console.error("Duplicate letter error:", err);
    }
  };

  const handleDeleteLetter = (id: string) => {
    showConfirm({
      title: "Delete Cover Letter",
      message: "Are you sure you want to delete this cover letter? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        setDeletingId(id);
        try {
          const authHeaders = await getAuthHeaders();
          await fetch(`/api/cover-letters/${id}`, { method: "DELETE", headers: authHeaders }).catch(
            () => {}
          );
          setLetters((prev) => prev.filter((l) => l.id !== id));
          const localList: SavedCoverLetterItem[] =
            (await idbGet<SavedCoverLetterItem[]>("local-saved-cover-letters")) || [];
          await idbSet(
            "local-saved-cover-letters",
            localList.filter((l) => l.id !== id)
          );
          showToast("Cover letter deleted", undefined, "info");
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const filteredResumes = resumes.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.target_role && r.target_role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredLetters = letters.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.role && l.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const showTableNotice = resumesTableMissing || lettersTableMissing;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f2] text-(--brand-ink)">
      <SiteHeader />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-(--brand-ink)">
              My Saved Documents
            </h1>
            <p className="text-sm text-(--brand-muted) mt-1">
              Access and manage all your stored resumes and cover letters.
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCreateNewResume}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-800 px-4 text-xs font-bold text-white shadow-md hover:bg-emerald-900 transition cursor-pointer"
              >
                <Plus className="size-4" />
                <span>New Resume</span>
              </button>
              <button
                type="button"
                onClick={handleCreateNewLetter}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-black/15 bg-white px-4 text-xs font-bold text-(--brand-ink) hover:bg-black/5 transition cursor-pointer"
              >
                <Plus className="size-4" />
                <span>New Letter</span>
              </button>
            </div>
          )}
        </div>

        {/* Auth Prompt if Logged Out */}
        {!authLoading && !user && (
          <div className="my-12 rounded-3xl border border-black/10 bg-white p-8 sm:p-12 text-center shadow-lg max-w-xl mx-auto">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 mb-4 border border-emerald-200">
              <LogIn className="size-7" />
            </div>
            <h2 className="text-xl font-bold text-(--brand-ink) mb-2">
              Sign in to view saved documents
            </h2>
            <p className="text-xs text-(--brand-muted) mb-6 max-w-md mx-auto leading-relaxed">
              Your saved resumes and cover letters are stored securely in your account.
            </p>
            <button
              type="button"
              onClick={() => openAuthModal("sign_in", "Sign in to access your saved items")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 text-xs font-bold text-white shadow-md hover:bg-emerald-900 transition cursor-pointer"
            >
              <span>Sign In / Create Account</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}

        {/* Logged In Content */}
        {user && (
          <>
            {/* Navigation Tabs */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
              <div className="flex rounded-2xl bg-black/5 p-1 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("resumes")}
                  className={cn(
                    "flex-1 sm:flex-initial rounded-xl py-2 px-4 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap",
                    activeTab === "resumes"
                      ? "bg-white text-(--brand-ink) shadow-xs"
                      : "text-(--brand-muted) hover:text-black"
                  )}
                >
                  <FileText className="size-4 shrink-0" />
                  <span>Resumes ({resumes.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("letters")}
                  className={cn(
                    "flex-1 sm:flex-initial rounded-xl py-2 px-4 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap",
                    activeTab === "letters"
                      ? "bg-white text-(--brand-ink) shadow-xs"
                      : "text-(--brand-muted) hover:text-black"
                  )}
                >
                  <FileText className="size-4 shrink-0" />
                  <span>Letters ({letters.length})</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-black/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeTab === "resumes" ? "resumes" : "letters"}...`}
                  className="h-10 w-full rounded-xl border border-black/15 bg-white pl-10 pr-4 text-xs font-semibold text-(--brand-ink) outline-none focus:border-emerald-600 transition-colors shadow-2xs"
                />
              </div>
            </div>

            {/* Loading Skeletons */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 rounded-2xl border border-black/10 bg-white p-5 animate-pulse flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="h-5 w-3/4 bg-black/10 rounded-lg" />
                      <div className="h-3 w-1/2 bg-black/5 rounded-lg" />
                    </div>
                    <div className="h-9 w-full bg-black/10 rounded-xl" />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 1: Saved Resumes */}
            {!loading && activeTab === "resumes" && (
              <>
                {filteredResumes.length === 0 ? (
                  <div className="my-10 rounded-3xl border border-black/10 bg-white p-8 sm:p-12 text-center shadow-xs max-w-md mx-auto">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-black/5 text-(--brand-muted) mb-4">
                      <FileText className="size-7" />
                    </div>
                    <h3 className="text-base font-bold text-(--brand-ink) mb-1">
                      No saved resumes yet
                    </h3>
                    <p className="text-xs text-(--brand-muted) mb-6">
                      Build your resume in our interactive editor and save it directly to your
                      account.
                    </p>
                    <Link
                      href="/builder"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 text-xs font-bold text-white shadow-sm hover:bg-emerald-900 transition"
                    >
                      <Plus className="size-4" />
                      <span>Start Building Resume</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredResumes.map((resume) => {
                      const updatedDate = new Date(resume.updated_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <div
                          key={resume.id}
                          className="group relative flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-5 shadow-xs transition hover:border-black/25 hover:shadow-md"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                                <FileText className="size-4" />
                              </div>
                              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateResume(resume)}
                                  title="Duplicate Resume"
                                  className="size-8 flex items-center justify-center rounded-lg hover:bg-black/5 text-black/60 hover:text-black transition cursor-pointer"
                                >
                                  <Copy className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteResume(resume.id)}
                                  disabled={deletingId === resume.id}
                                  title="Delete Resume"
                                  className="size-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-black/60 hover:text-red-600 transition cursor-pointer"
                                >
                                  {deletingId === resume.id ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="size-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <h3 className="text-sm font-bold text-(--brand-ink) group-hover:text-emerald-800 transition line-clamp-1">
                              {resume.title}
                            </h3>

                            {resume.target_role && (
                              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-(--brand-muted)">
                                <Briefcase className="size-3 shrink-0" />
                                <span className="truncate">{resume.target_role}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-1.5 mt-3 text-[10px] text-black/40 font-medium">
                              <Clock className="size-3 shrink-0" />
                              <span>Updated {updatedDate}</span>
                            </div>
                          </div>

                          <div className="mt-5 pt-3 border-t border-black/5">
                            <button
                              type="button"
                              onClick={() => handleOpenResumeInBuilder(resume)}
                              className="w-full flex h-9 items-center justify-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 text-xs font-bold text-(--brand-ink) hover:bg-black/5 hover:border-black/25 transition cursor-pointer"
                            >
                              <span>Open in Builder</span>
                              <ArrowRight className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* TAB 2: Saved Cover Letters */}
            {!loading && activeTab === "letters" && (
              <>
                {filteredLetters.length === 0 ? (
                  <div className="my-10 rounded-3xl border border-black/10 bg-white p-8 sm:p-12 text-center shadow-xs max-w-md mx-auto">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-black/5 text-(--brand-muted) mb-4">
                      <FileText className="size-7" />
                    </div>
                    <h3 className="text-base font-bold text-(--brand-ink) mb-1">
                      No saved cover letters yet
                    </h3>
                    <p className="text-xs text-(--brand-muted) mb-6">
                      Write cover letters tailored to target companies and save them to your
                      account.
                    </p>
                    <Link
                      href="/cover-letter"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 text-xs font-bold text-white shadow-sm hover:bg-emerald-900 transition"
                    >
                      <Plus className="size-4" />
                      <span>Write Cover Letter</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredLetters.map((letter) => {
                      const updatedDate = new Date(letter.updated_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <div
                          key={letter.id}
                          className="group relative flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-5 shadow-xs transition hover:border-black/25 hover:shadow-md"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                                <FileText className="size-4" />
                              </div>
                              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateLetter(letter)}
                                  title="Duplicate Cover Letter"
                                  className="size-8 flex items-center justify-center rounded-lg hover:bg-black/5 text-black/60 hover:text-black transition cursor-pointer"
                                >
                                  <Copy className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLetter(letter.id)}
                                  disabled={deletingId === letter.id}
                                  title="Delete Cover Letter"
                                  className="size-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-black/60 hover:text-red-600 transition cursor-pointer"
                                >
                                  {deletingId === letter.id ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="size-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <h3 className="text-sm font-bold text-(--brand-ink) group-hover:text-emerald-800 transition line-clamp-1">
                              {letter.title}
                            </h3>

                            <div className="space-y-1 mt-2">
                              {letter.company && (
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-(--brand-ink)">
                                  <Building2 className="size-3 shrink-0 text-emerald-600" />
                                  <span className="truncate">{letter.company}</span>
                                </div>
                              )}
                              {letter.role && (
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-(--brand-muted)">
                                  <Briefcase className="size-3 shrink-0" />
                                  <span className="truncate">{letter.role}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 mt-3 text-[10px] text-black/40 font-medium">
                              <Clock className="size-3 shrink-0" />
                              <span>Updated {updatedDate}</span>
                            </div>
                          </div>

                          <div className="mt-5 pt-3 border-t border-black/5">
                            <button
                              type="button"
                              onClick={() => handleOpenLetterInStudio(letter)}
                              className="w-full flex h-9 items-center justify-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 text-xs font-bold text-(--brand-ink) hover:bg-black/5 hover:border-black/25 transition cursor-pointer"
                            >
                              <span>Open in Studio</span>
                              <ArrowRight className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
