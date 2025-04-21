import { NextResponse } from 'next/server'
import supabase from '@/utils/SupabaseClient'

export async function POST(request: Request) {
  try {
    const { link } = await request.json()

    if (!link) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Fetch the link with product information using a join
    const { data: links, error: linksError } = await supabase
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
      .eq('link', link)
      .limit(1)

    if (linksError) {
      console.error('Error fetching link:', linksError)
      return NextResponse.json(
        { error: 'Failed to fetch link' },
        { status: 500 }
      )
    }

    if (!links || links.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    // Transform the data to match the expected format
    const transformedData = links.map(link => ({
      ...link,
      product: link.products?.[0] ? {
        ...link.products[0],
        image_urls: link.products[0].image_urls ? JSON.parse(link.products[0].image_urls) : []
      } : null
    })).map(({ products, ...rest }) => rest)

    return NextResponse.json({ data: transformedData })
  } catch (error) {
    console.error('Error in fetch-by-path:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 