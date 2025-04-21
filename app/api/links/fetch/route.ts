import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/utils/SupabaseClient'

export async function POST(request: NextRequest) {
  const { privy_id, link_id } = await request.json()

  // If link_id is provided, fetch a single link with its product info
  if (link_id) {
    const { data, error } = await supabase
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
      .eq('user_id', privy_id)
      .eq('id', link_id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the data to match the expected format
    const transformedData = {
      ...data,
      product: data.products?.[0] ? {
        ...data.products[0],
        image_urls: data.products[0].image_urls ? JSON.parse(data.products[0].image_urls) : []
      } : null
    }
    delete transformedData.products

    return NextResponse.json({ data: [transformedData] })
  }

  // Otherwise, fetch all links for the user with their product info
  const { data, error } = await supabase
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
    .eq('user_id', privy_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform the data to match the expected format
  const transformedData = data.map(link => ({
    ...link,
    product: link.products?.[0] ? {
      ...link.products[0],
      image_urls: link.products[0].image_urls ? JSON.parse(link.products[0].image_urls) : []
    } : null
  })).map(({ products, ...rest }) => rest)

  return NextResponse.json({ data: transformedData })
}

