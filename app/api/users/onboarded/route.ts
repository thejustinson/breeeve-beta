import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/SupabaseClient";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { privy_id } = body

    const {data} = await supabase
    .from('users')
    .select('onboarded')
    .eq('privy_id', privy_id)
    .single()

    console.log(data)

    return NextResponse.json({ onboarded: data?.onboarded })
}