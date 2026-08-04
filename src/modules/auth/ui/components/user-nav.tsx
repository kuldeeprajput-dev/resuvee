"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogIn, LogOut, ChevronDown, FileText } from "lucide-react";
import { useAuthStore } from "../../store/use-auth-store";

export function UserNav() {
  const { user, openAuthModal, signOut } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openAuthModal("sign_in")}
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold text-[var(--brand-ink)] transition-colors hover:bg-black/5 cursor-pointer"
      >
        <LogIn className="size-4 text-[var(--brand-muted)]" />
        <span>Sign In</span>
      </button>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  const rawName = user.user_metadata?.full_name || user.user_metadata?.name;
  const displayName = rawName || user.email?.split("@")[0] || "User";
  const userInitial = (displayName[0] || "U").toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold text-[var(--brand-ink)] transition-colors hover:bg-black/5 cursor-pointer"
      >
        {avatarUrl && !imageError ? (
          <img
            src={avatarUrl}
            alt={displayName}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="size-5 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="flex size-5 items-center justify-center rounded-full bg-[var(--brand-ink)] text-[10px] font-extrabold text-white shrink-0">
            {userInitial}
          </div>
        )}
        <span className="max-w-[120px] truncate capitalize">{displayName}</span>
        <ChevronDown className="size-3.5 text-[var(--brand-muted)]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-black/10 bg-white/95 p-2 shadow-[0_10px_35px_rgba(0,0,0,0.09)] backdrop-blur-xl animate-in fade-in zoom-in-95">
          <div className="border-b border-black/10 px-3 py-2">
            <p className="truncate text-xs font-bold text-[var(--brand-ink)] capitalize">{displayName}</p>
            <p className="truncate text-[10px] text-[var(--brand-muted)]">{user.email}</p>
          </div>

          <div className="p-1 space-y-0.5">
            <Link
              href="/saved"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-[var(--brand-ink)] hover:bg-black/5 transition"
            >
              <FileText className="size-3.5 text-[var(--brand-muted)]" />
              <span>My Saved Documents</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
