import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/shared/lib/supabase/client";

export type AuthModalMode = "sign_in" | "sign_up" | "magic_link";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  authMessage: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  openAuthModal: (mode?: AuthModalMode, message?: string | null) => void;
  closeAuthModal: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthModalOpen: false,
  authModalMode: "sign_in",
  authMessage: null,

  setUser: (user) => set({ user, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),

  openAuthModal: (mode = "sign_in", message = null) =>
    set({
      isAuthModalOpen: true,
      authModalMode: mode,
      authMessage: message,
    }),

  closeAuthModal: () =>
    set({
      isAuthModalOpen: false,
      authMessage: null,
    }),

  signOut: async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      set({ user: null });
    } catch (err) {
      console.error("Sign out error:", err);
    }
  },
}));
