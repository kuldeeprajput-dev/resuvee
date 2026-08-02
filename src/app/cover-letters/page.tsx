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
  Building2,
  Briefcase,
  AlertCircle,
  LogIn,
  Search,
} from "lucide-react";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { useAuthStore } from "@/modules/auth";
import { getAuthHeaders } from "@/shared/lib/api-headers";
import { useNotification } from "@/shared/lib/use-notification";

interface SavedCoverLetterItem {
  id: string;
  title: string;
  company: string;
  role: string;
  data: any;
  created_at: string;
  updated_at: string;
}

export default function SavedCoverLettersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, openAuthModal } = useAuthStore();

  const [letters, setLetters] = useState<SavedCoverLetterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLetters = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cover-letters");
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Could not fetch saved cover letters.");
      }
      setLetters(json.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load saved cover letters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLetters();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleOpenInStudio = (letter: SavedCoverLetterItem) => {
    try {
      if (typeof window !== "undefined" && letter.data) {
        localStorage.setItem("cover-letter-studio-data", JSON.stringify(letter.data));
        localStorage.setItem("active-cover-letter-id", letter.id);
      }
      router.push("/cover-letter");
    } catch (err) {
      console.error("Failed to load cover letter into studio:", err);
    }
  };

  const handleDuplicate = async (letter: SavedCoverLetterItem) => {
    try {
      const copyTitle = `${letter.title} (Copy)`;
      const res = await fetch("/api/cover-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: copyTitle,
          company: letter.company,
          role: letter.role,
          data: letter.data,
        }),
      });
      const json = await res.json();
      if (json.success) {
        fetchLetters();
      }
    } catch (err) {
      console.error("Duplicate error:", err);
    }
  };

  const { showConfirm, showToast } = useNotification();

  const handleDelete = (id: string) => {
    showConfirm({
      title: "Delete Cover Letter",
      message: "Are you sure you want to delete this saved cover letter?",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        setDeletingId(id);
        try {
          const authHeaders = await getAuthHeaders();
          const res = await fetch(`/api/cover-letters/${id}`, { method: "DELETE", headers: authHeaders });
          const json = await res.json();
          if (json.success) {
            setLetters((prev) => prev.filter((l) => l.id !== id));
            showToast("Cover letter deleted", undefined, "info");
          }
        } catch (err) {
          console.error("Delete error:", err);
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const filteredLetters = letters.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.role && l.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f2] text-[var(--brand-ink)]">
      <SiteHeader />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 mb-2">
              <Sparkles className="size-3.5 text-emerald-600" />
              <span>Supabase Cloud Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--brand-ink)]">
              My Saved Cover Letters
            </h1>
            <p className="text-sm text-[var(--brand-muted)] mt-1">
              Manage, edit, and duplicate your stored cover letters in the cloud.
            </p>
          </div>

          {user && (
            <Link
              href="/cover-letter"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 text-xs font-bold text-white shadow-md hover:bg-emerald-900 transition cursor-pointer shrink-0"
            >
              <Plus className="size-4" />
              <span>Write New Cover Letter</span>
            </Link>
          )}
        </div>

        {/* Auth Prompt if Logged Out */}
        {!authLoading && !user && (
          <div className="my-12 rounded-3xl border border-black/10 bg-white p-8 sm:p-12 text-center shadow-lg max-w-xl mx-auto">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 mb-4 border border-emerald-200">
              <LogIn className="size-7" />
            </div>
            <h2 className="text-xl font-bold text-[var(--brand-ink)] mb-2">
              Sign in to view saved cover letters
            </h2>
            <p className="text-xs text-[var(--brand-muted)] mb-6 max-w-md mx-auto leading-relaxed">
              Your saved cover letters are stored securely in your account so you can access them anywhere.
            </p>
            <button
              type="button"
              onClick={() => openAuthModal("sign_in", "Sign in to access your saved cover letters")}
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
            {/* Search Bar */}
            {letters.length > 0 && (
              <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-black/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, company, or role..."
                  className="h-10 w-full rounded-xl border border-black/15 bg-white pl-10 pr-4 text-xs font-semibold text-[var(--brand-ink)] outline-none focus:border-emerald-600 transition-colors shadow-2xs"
                />
              </div>
            )}

            {/* Loading State */}
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

            {/* Error Banner */}
            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-bold text-red-800">
                <AlertCircle className="size-5 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Empty State */}
            {!loading && letters.length === 0 && (
              <div className="my-12 rounded-3xl border border-black/10 bg-white p-8 sm:p-12 text-center shadow-xs max-w-md mx-auto">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-black/5 text-[var(--brand-muted)] mb-4">
                  <FileText className="size-7" />
                </div>
                <h3 className="text-base font-bold text-[var(--brand-ink)] mb-1">
                  No saved cover letters yet
                </h3>
                <p className="text-xs text-[var(--brand-muted)] mb-6">
                  Write cover letters tailored to target companies and save them to your account.
                </p>
                <Link
                  href="/cover-letter"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 text-xs font-bold text-white shadow-sm hover:bg-emerald-900 transition"
                >
                  <Plus className="size-4" />
                  <span>Write Cover Letter</span>
                </Link>
              </div>
            )}

            {/* Letters Grid */}
            {!loading && filteredLetters.length > 0 && (
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
                              onClick={() => handleDuplicate(letter)}
                              title="Duplicate Cover Letter"
                              className="size-8 flex items-center justify-center rounded-lg hover:bg-black/5 text-black/60 hover:text-black transition cursor-pointer"
                            >
                              <Copy className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(letter.id)}
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

                        <h3 className="text-sm font-bold text-[var(--brand-ink)] group-hover:text-emerald-800 transition line-clamp-1">
                          {letter.title}
                        </h3>

                        <div className="space-y-1 mt-2">
                          {letter.company && (
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--brand-ink)]">
                              <Building2 className="size-3 shrink-0 text-emerald-600" />
                              <span className="truncate">{letter.company}</span>
                            </div>
                          )}
                          {letter.role && (
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--brand-muted)]">
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
                          onClick={() => handleOpenInStudio(letter)}
                          className="w-full flex h-9 items-center justify-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 text-xs font-bold text-[var(--brand-ink)] hover:bg-black/5 hover:border-black/25 transition cursor-pointer"
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
      </main>

      <SiteFooter />
    </div>
  );
}
