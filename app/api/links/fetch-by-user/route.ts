import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/utils/SupabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const privyId = searchParams.get('privyId')

    if (!privyId) {
      return NextResponse.json({ error: 'Privy ID is required' }, { status: 400 })
    }

    const { data: links, error } = await supabase
      .from('links')
      .select(`
        id,
        type,
        name,
        description,
        link,
        status,
        amount,
        is_flexible_amount,
        currency,
        payment_limit,
        clicks,
        created_at,
        expires_at,
        redirect_url,
        enable_notifications,
        sales,
        amount_sold,
        products (
          id,
          download_link,
          image_urls,
          created_at
        )
      `)
      .eq('user_id', privyId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching links:', error)
      return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
    }

    return NextResponse.json(links || [])
  } catch (error) {
    console.error('Error in fetch-by-user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 