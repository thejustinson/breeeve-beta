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
        type: body.product ? 'product' : 'plain',
        name: body.name,
        description: body.description,
        link: body.link,
        status: 'active',
        amount: body.amount,
        is_flexible_amount: body.is_flexible_amount,
        currency: body.currency || 'USDC',
        payment_limit: body.payment_limit,
        clicks: 0,
        expires_at: body.expires_at,
        redirect_url: body.redirect_url,
        enable_notifications: body.enable_notifications || false,
        sales: 0,
        amount_sold: null
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
          image_urls: JSON.stringify(body.product.image_urls || [])
        });
      
      if (productError) {
        console.error("Error creating product:", productError);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
      }
    }
    
    // Fetch the complete link data with product info
    const { data: completeLinkData, error: fetchError } = await supabase
      .from('links')
      .select(`
        *,
        products (
          id,
          download_link,
          image_urls,
          created_at
        )
      `)
      .eq('id', linkData.id)
      .single();
    
    if (fetchError) {
      console.error("Error fetching complete link data:", fetchError);
      return NextResponse.json({ error: "Failed to fetch complete link data" }, { status: 500 });
    }
    
    // Transform the data to match the expected format
    const transformedData = {
      ...completeLinkData,
      product: completeLinkData.products?.[0] ? {
        ...completeLinkData.products[0],
        image_urls: completeLinkData.products[0].image_urls ? JSON.parse(completeLinkData.products[0].image_urls) : []
      } : null
    }
    delete transformedData.products
    
    return NextResponse.json({ 
      success: true, 
      message: "Link created successfully",
      data: transformedData
    });
    
  } catch (error) {
    console.error("Error in link creation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}