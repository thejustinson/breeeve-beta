import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const { link_id, amount, buyer_email, buyer_name } = await request.json()

    if (!link_id || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Start a transaction to update both the link and create a sale record
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('id', link_id)
      .single()

    if (linkError) {
      console.error('Error fetching link:', linkError)
      return NextResponse.json(
        { error: 'Failed to fetch link' },
        { status: 500 }
      )
    }

    // Update the link's sales count and amount sold
    const { error: updateError } = await supabase
      .from('links')
      .update({
        sales: (link.sales || 0) + 1,
        amount_sold: (link.amount_sold || 0) + amount,
        clicks: (link.clicks || 0) + 1
      })
      .eq('id', link_id)

    if (updateError) {
      console.error('Error updating link:', updateError)
      return NextResponse.json(
        { error: 'Failed to update link' },
        { status: 500 }
      )
    }

    // Create a sale record
    const { error: saleError } = await supabase
      .from('sales')
      .insert({
        link_id,
        amount,
        buyer_email,
        buyer_name,
        status: 'completed'
      })

    if (saleError) {
      console.error('Error creating sale record:', saleError)
      return NextResponse.json(
        { error: 'Failed to create sale record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in record-sale:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 