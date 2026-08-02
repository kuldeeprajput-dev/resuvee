import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { createClient as createBaseClient } from "@supabase/supabase-js";

export async function createClient() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_URL ||
    "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  // Check for Bearer token in Authorization header
  const authHeader = headerStore.get("authorization");
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "").trim()
    : null;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    global: token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, {
              ...options,
              path: "/",
              sameSite: "lax",
            })
          );
        } catch {
          // Ignored if called from Server Component
        }
      },
    },
  });
}

// Helper to get authenticated user across cookies & bearer tokens
export async function getAuthUser() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_URL ||
    "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();
    if (token) {
      const baseClient = createBaseClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await baseClient.auth.getUser(token);
      if (!error && data?.user) {
        return data.user;
      }
    }
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
