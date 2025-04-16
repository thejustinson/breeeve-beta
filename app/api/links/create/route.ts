import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/SupabaseClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received link creation request:", body);
  
  
    
    // Start a transaction to create both link and product if needed
    const { data: linkData, error: linkError } = await supabase
      .from('links')
      .insert({
        user_id: body.user_id,
        name: body.name,
        description: body.description,
        link: body.link,
        amount: body.amount,
        is_flexible_amount: body.is_flexible_amount,
        currency: body.currency,
        payment_limit: body.payment_limit,
        expires_at: body.expires_at,
        redirect_url: body.redirect_url,
        enable_notifications: body.enable_notifications,
        type: body.product ? 'product' : 'plain'
      })
      .select()
      .single();
    
    if (linkError) {
      console.error("Error creating link:", linkError);
      return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
    }
    
    // If this is a product link, create the product record
    if (body.product) {
      const { error: productError } = await supabase
        .from('products')
        .insert({
          link_id: linkData.id,
          download_link: body.product.download_link,
          image_urls: body.product.image_urls
        });
      
      if (productError) {
        console.error("Error creating product:", productError);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Link created successfully",
      data: linkData
    });
    
  } catch (error) {
    console.error("Error in link creation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}