import { NextRequest, NextResponse } from 'next/server'
import supabase from "@/utils/SupabaseClient"


export async function POST(request: NextRequest) {
    const body = await request.json()
    console.log(body)
    const { privy_id, email, username, name, image, public_key, link } = body

    const {error} = await supabase
    .from('users')
    .update({
        username: username,
        email: email,
        image: image,
        public_key: public_key,
        link: link,
        onboarded: true,
        name: name
    })
    .eq('privy_id', privy_id)
    .select()
    .single()

    if (error) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'User onboarded successfully' }, { status: 200 })
}

