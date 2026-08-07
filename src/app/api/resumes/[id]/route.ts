import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export const dynamic = "force-dynamic";

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
