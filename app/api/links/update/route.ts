import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/SupabaseClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received link update request:", body);
    
    const { 
      link_id,
      name,
      description,
      amount,
      is_flexible_amount,
      currency,
      payment_limit,
      expires_at,
      redirect_url,
      enable_notifications,
      status
    } = body;
    
    if (!link_id) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
    }
    
    // Update the link
    const { data: updatedLink, error: updateError } = await supabase
      .from('links')
      .update({
        name,
        description,
        amount,
        is_flexible_amount,
        currency: currency || 'USDC',
        payment_limit,
        expires_at,
        redirect_url,
        enable_notifications: enable_notifications || false,
        status: status || 'active'
      })
      .eq('id', link_id)
      .select(`
        *,
        products (
          id,
          download_link,
          image_urls,
          created_at
        )
      `)
      .single();
    
    if (updateError) {
      console.error("Error updating link:", updateError);
      return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
    }
    
    // Transform the data to match the expected format
    const transformedData = {
      ...updatedLink,
      product: updatedLink.products?.[0] ? {
        ...updatedLink.products[0],
        image_urls: updatedLink.products[0].image_urls ? JSON.parse(updatedLink.products[0].image_urls) : []
      } : null
    }
    delete transformedData.products
    
    return NextResponse.json({ 
      success: true, 
      message: "Link updated successfully",
      data: transformedData
    });
    
  } catch (error) {
    console.error("Error in link update:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 