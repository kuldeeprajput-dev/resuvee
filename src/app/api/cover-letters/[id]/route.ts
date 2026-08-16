import { NextRequest, NextResponse } from "next/server";
import { createClient, getAuthUser } from "@/shared/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/cover-letters/[id] - Fetch a single cover letter by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supabase = await createClient();
    const { data: letter, error } = await supabase
      .from("cover_letters")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;

    if (!letter) {
      return NextResponse.json(
        { success: false, error: "Cover letter not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: letter });
  } catch (error: any) {
    console.error("GET /api/cover-letters/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch cover letter." },
      { status: 500 }
    );
  }
}

// DELETE /api/cover-letters/[id] - Delete a saved cover letter by ID
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase
      .from("cover_letters")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Cover letter deleted." });
  } catch (error: any) {
    console.error("DELETE /api/cover-letters/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete cover letter." },
      { status: 500 }
    );
  }
}
