import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/SupabaseClient";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { privy_id } = body

    const {data, error} = await supabase
    .from('users')
    .select('*')
    .eq('privy_id', privy_id)
    .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const {username, name, email, image, public_key, link, onboarded, balance} = data

    return NextResponse.json({ username, name, email, image, public_key, link, onboarded, balance })
}
