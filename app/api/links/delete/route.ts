import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/SupabaseClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received link deletion request:", body);
    
    const { link_id } = body;
    
    if (!link_id) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
    }
    
    // First, check if this is a product link
    const { data: linkData, error: linkFetchError } = await supabase
      .from('links')
      .select('type')
      .eq('id', link_id)
      .single();
    
    if (linkFetchError) {
      console.error("Error fetching link:", linkFetchError);
      return NextResponse.json({ error: "Failed to fetch link" }, { status: 500 });
    }
    
    // If this is a product link, delete the product record first
    if (linkData.type === 'product') {
      const { error: productDeleteError } = await supabase
        .from('products')
        .delete()
        .eq('link_id', link_id);
      
      if (productDeleteError) {
        console.error("Error deleting product:", productDeleteError);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
      }
    }
    
    // Now delete the link
    const { error: linkDeleteError } = await supabase
      .from('links')
      .delete()
      .eq('id', link_id);
    
    if (linkDeleteError) {
      console.error("Error deleting link:", linkDeleteError);
      return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Link deleted successfully"
    });
    
  } catch (error) {
    console.error("Error in link deletion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 