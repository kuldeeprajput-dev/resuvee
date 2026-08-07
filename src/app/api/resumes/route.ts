import { NextRequest, NextResponse } from "next/server";
import { createClient, getAuthUser } from "@/shared/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/resumes - Fetch all saved resumes for logged-in user
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
    const { data: resumes, error } = await supabase
      .from("resumes")
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

    return NextResponse.json({ success: true, data: resumes || [] });
  } catch (error: any) {
    console.error("GET /api/resumes error:", error);
    const isMissingTable =
      error.code === "42P01" ||
      error.code === "PGRST204" ||
      error.message?.includes("schema cache") ||
      error.message?.includes("does not exist");

    if (isMissingTable) {
      return NextResponse.json({ success: true, data: [], tableMissing: true });
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch saved resumes." },
      { status: 500 }
    );
  }
}

// POST /api/resumes - Create or update a saved resume
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required to save resume." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, targetRole, data } = body as {
      id?: string;
      title?: string;
      targetRole?: string;
      data: any;
    };

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Resume data is required." },
        { status: 400 }
      );
    }

    const resumeTitle =
      title?.trim() ||
      (data.basics?.fullName ? `${data.basics.fullName}'s Resume` : "Untitled Resume");

    const payload = {
      user_id: user.id,
      title: resumeTitle,
      target_role: targetRole || data.targetRole || data.basics?.headline || "",
      data,
      updated_at: new Date().toISOString(),
    };

    const cleanId =
      id && id !== "undefined" && id !== "null" && id.trim().length > 10 ? id.trim() : undefined;

    const supabase = await createClient();

    if (cleanId) {
      const { data: updated, error } = await supabase
        .from("resumes")
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
      .from("resumes")
      .insert([{ ...payload, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("POST /api/resumes error:", error);
    const isMissingTable =
      error.code === "42P01" ||
      error.code === "PGRST204" ||
      error.message?.includes("schema cache") ||
      error.message?.includes("does not exist");

    if (isMissingTable) {
      return NextResponse.json({ success: true, tableMissing: true, data: null });
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to save resume." },
      { status: 500 }
    );
  }
}
