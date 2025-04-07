import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/SupabaseClient";


export async function GET(request: NextRequest) {
    const {privy_id} = await request.json();

    const {data, error} = await supabase
    .from("transactions")
    .select("*")
    .eq("privy_id", privy_id)

    if (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }

    return NextResponse.json({data}, {status: 200})  
}
