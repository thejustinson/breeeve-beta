import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/utils/SupabaseClient'

export async function POST(request: NextRequest) {
  const { public_key, privy_id } = await request.json()

  const { data, error } = await supabase
    .from('users')
    .update({ public_key: public_key })
    .eq('privy_id', privy_id)
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}