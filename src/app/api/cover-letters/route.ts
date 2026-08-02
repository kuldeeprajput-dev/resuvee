import { NextRequest, NextResponse } from "next/server";
import { createClient, getAuthUser } from "@/shared/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/cover-letters - Fetch all saved cover letters for logged-in user
export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const { data: letters, error } = await supabase
      .from("cover_letters")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      const isMissingTable =
        error.code === "42P01" ||
        error.code === "PGRST204" ||
        error.message?.includes("schema cache") ||
        error.message?.includes("does not exist");

      if (isMissingTable) {
        return NextResponse.json({ success: true, data: [], tableMissing: true });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data: letters || [] });
  } catch (error: any) {
    console.error("GET /api/cover-letters error:", error);
    const isMissingTable =
      error.code === "42P01" ||
      error.code === "PGRST204" ||
      error.message?.includes("schema cache") ||
      error.message?.includes("does not exist");

    if (isMissingTable) {
      return NextResponse.json({ success: true, data: [], tableMissing: true });
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch saved cover letters." },
      { status: 500 }
    );
  }
}

// POST /api/cover-letters - Create or update a saved cover letter
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required to save cover letter." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, company, role, data } = body as {
      id?: string;
      title?: string;
      company?: string;
      role?: string;
      data: any;
    };

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Cover letter data is required." },
        { status: 400 }
      );
    }

    const letterTitle =
      title?.trim() ||
      (data.fullName
        ? `${data.fullName}'s Cover Letter`
        : data.company
          ? `${data.company} — Cover Letter`
          : "Cover Letter");

    const payload = {
      user_id: user.id,
      title: letterTitle,
      company: company || data.company || "",
      role: role || data.role || "",
      data,
      updated_at: new Date().toISOString(),
    };

    const cleanId =
      id && id !== "undefined" && id !== "null" && id.trim().length > 10
        ? id.trim()
        : undefined;

    const supabase = await createClient();

    if (cleanId) {
      const { data: updated, error } = await supabase
        .from("cover_letters")
        .update(payload)
        .eq("id", cleanId)
        .eq("user_id", user.id)
        .select()
        .maybeSingle();

      if (!error && updated) {
        return NextResponse.json({ success: true, data: updated });
      }
    }

    // Insert new record if no existing id found
    const { data: created, error } = await supabase
      .from("cover_letters")
      .insert([{ ...payload, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("POST /api/cover-letters error:", error);
    const isMissingTable =
      error.code === "42P01" ||
      error.code === "PGRST204" ||
      error.message?.includes("schema cache") ||
      error.message?.includes("does not exist");

    if (isMissingTable) {
      return NextResponse.json({ success: true, tableMissing: true, data: null });
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to save cover letter." },
      { status: 500 }
    );
  }
}
