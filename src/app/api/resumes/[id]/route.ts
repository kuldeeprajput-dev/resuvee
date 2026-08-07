import { NextRequest, NextResponse } from "next/server";
import { createClient, getAuthUser } from "@/shared/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/resumes/[id] - Fetch a single resume by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const { data: resume, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;
    if (!resume) {
      return NextResponse.json({ success: false, error: "Resume not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: resume });
  } catch (error: any) {
    console.error("GET /api/resumes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch resume." },
      { status: 500 }
    );
  }
}

// DELETE /api/resumes/[id] - Delete a saved resume by ID
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const { error } = await supabase.from("resumes").delete().eq("id", id).eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Resume deleted." });
  } catch (error: any) {
    console.error("DELETE /api/resumes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete resume." },
      { status: 500 }
    );
  }
}

