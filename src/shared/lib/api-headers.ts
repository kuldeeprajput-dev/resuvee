import { createClient } from "@/shared/lib/supabase/client";

export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return {
        Authorization: `Bearer ${session.access_token}`,
      };
    }
  } catch (e) {
    console.error("Error getting auth headers:", e);
  }
  return {};
}
