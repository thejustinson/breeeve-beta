import { NextResponse } from "next/server";
import supabase from "@/utils/SupabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    const slug = searchParams.get("slug");
    const username = searchParams.get("username");

    if (!user_id || !slug) {
      return NextResponse.json(
        { error: "Username and slug are required" },
        { status: 400 }
      );
    }

    // Check if a link with this username and slug already exists
    const linkPath = `/${username}/${slug}`;
    const existingLink = await supabase.from('links').select('id').eq('user_id', user_id).eq('link', linkPath);

    return NextResponse.json({
      available: existingLink.data?.length === 0
    });
  } catch (error) {
    console.error("Error checking link availability:", error);
    return NextResponse.json(
      { error: "Failed to check link availability" },
      { status: 500 }
    );
  }
} 