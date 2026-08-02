"use client";

import { useEffect } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import { useAuthStore } from "../../store/use-auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    const supabase = createClient();

    // Fetch initial user session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    }).catch(() => {
      setIsLoading(false);
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setIsLoading]);

  return <>{children}</>;
}
