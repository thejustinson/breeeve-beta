import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/SupabaseClient";


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    const { data, error } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .single()

    if (error && error.code !== 'PGRST116') {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ available: data ? false : true }, { status: 200 })
}
