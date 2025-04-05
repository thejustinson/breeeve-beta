import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/utils/SupabaseClient'

export async function POST(request: NextRequest) {
  const { privy_id } = await request.json()

  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', privy_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log(data)

  return NextResponse.json({ data })
}

