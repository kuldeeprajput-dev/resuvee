"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/client";
import { useAuthStore } from "../../store/use-auth-store";
import { cn } from "@/shared/lib/utils";

export function AuthModal() {
  const { isAuthModalOpen, authModalMode, authMessage, closeAuthModal } = useAuthStore();
  const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_in");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync mode with store when opened
  React.useEffect(() => {
    if (authModalMode === "sign_up") {
      setMode("sign_up");
    } else {
      setMode("sign_in");
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const supabase = createClient();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const currentPath = typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "/";
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(currentPath)}`;

    try {
      if (mode === "sign_in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        closeAuthModal();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim() || undefined,
            },
            emailRedirectTo: callbackUrl,
          },
        });
        if (error) throw error;
        setSuccessMessage("Account created! Check your email to confirm registration.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMessage(null);
    const currentPath = typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "/";
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(currentPath)}`;

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err.message || "Could not sign in with Google.");
      setLoading(false);
    }
  };

  return (
    <div className="no-print fixed inset-0 z-[500] flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-black/15 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[var(--brand-ink)]">
              {mode === "sign_in" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-xs text-[var(--brand-muted)]">
              Access AI writing checks & role matching
            </p>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="builder-icon-button cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Custom Auth Prompt Message */}
        {authMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-300/80 p-3 text-xs font-bold text-emerald-900 animate-in fade-in">
            <span>{authMessage}</span>
          </div>
        )}

        {/* Mode Tabs */}
        <div className="mb-5 flex rounded-xl bg-black/5 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("sign_in");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={cn(
              "flex-1 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer text-center",
              mode === "sign_in"
                ? "bg-white text-[var(--brand-ink)] shadow-xs"
                : "text-[var(--brand-muted)] hover:text-black"
            )}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("sign_up");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={cn(
              "flex-1 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer text-center",
              mode === "sign_up"
                ? "bg-white text-[var(--brand-ink)] shadow-xs"
                : "text-[var(--brand-muted)] hover:text-black"
            )}
          >
            Sign Up
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-800 animate-in fade-in">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-300 p-3 text-xs font-bold text-emerald-900 animate-in fade-in">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Full-width Google OAuth Login */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-4 text-xs font-bold text-[var(--brand-ink)] hover:bg-black/5 transition cursor-pointer shadow-2xs"
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-black/10" />
          </div>
          <span className="relative bg-white px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
            Or with email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {mode === "sign_up" && (
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-black/40" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="h-11 w-full rounded-xl border border-black/15 bg-black/5 pl-10 pr-3 text-xs font-semibold text-[var(--brand-ink)] outline-none focus:border-[var(--brand-ink)] focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-black/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-black/15 bg-black/5 pl-10 pr-3 text-xs font-semibold text-[var(--brand-ink)] outline-none focus:border-[var(--brand-ink)] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-black/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-black/15 bg-black/5 pl-10 pr-3 text-xs font-semibold text-[var(--brand-ink)] outline-none focus:border-[var(--brand-ink)] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-(--brand-ink) text-xs font-bold text-white shadow-md transition hover:bg-[#27332f] disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin text-white" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {mode === "sign_in" ? "Sign In to Resuvee" : "Create Free Account"}
                </span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
