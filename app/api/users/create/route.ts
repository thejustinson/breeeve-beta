import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/SupabaseClient";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const privy_id = body.privy_id;
    const email = body.email || "";

    if (!privy_id) {
        return NextResponse.json({ error: 'privy_id is required' }, { status: 400 });
    }

    console.log(privy_id, email);
    
    const {error, data} = await supabase.from('users')
    .insert({
        privy_id: privy_id,
        email: email
    })
    .select()
    .single();
    if (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(data);


    return NextResponse.json({ message: 'created'}, { status: 200 });
}