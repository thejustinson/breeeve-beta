import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/SupabaseClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received increment clicks request:", body);
    
    const { link_id } = body;
    
    if (!link_id) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
    }
    
    // First, fetch the current link to get the clicks count
    const { data: link, error: fetchError } = await supabase
      .from('links')
      .select('clicks')
      .eq('id', link_id)
      .single();
    
    if (fetchError) {
      console.error("Error fetching link:", fetchError);
      return NextResponse.json({ error: "Failed to fetch link" }, { status: 500 });
    }
    
    // Increment the clicks count
    const { data: updatedLink, error: updateError } = await supabase
      .from('links')
      .update({
        clicks: (link.clicks || 0) + 1
      })
      .eq('id', link_id)
      .select()
      .single();
    
    if (updateError) {
      console.error("Error incrementing clicks:", updateError);
      return NextResponse.json({ error: "Failed to increment clicks" }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Clicks incremented successfully",
      data: updatedLink
    });
    
  } catch (error) {
    console.error("Error in increment clicks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 