import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/SupabaseClient";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const privy_id = body.privy_id;
        const email = body.email || "";

        if (!privy_id) {
            return NextResponse.json({ error: 'privy_id is required' }, { status: 400 });
        }

        console.log(privy_id, email);
        
        // First check if a user with this privy_id already exists
        const { data: existingUserByPrivyId, error: checkPrivyIdError } = await supabase
            .from('users')
            .select('id, privy_id, email')
            .eq('privy_id', privy_id)
            .single();
            
        if (checkPrivyIdError && checkPrivyIdError.code !== 'PGRST116') {
            console.error("Error checking for existing user by privy_id:", checkPrivyIdError);
            return NextResponse.json({ error: 'Database error occurred' }, { status: 500 });
        }
        
        // If user with this privy_id already exists, return success
        if (existingUserByPrivyId) {
            console.log("User with this privy_id already exists");
            return NextResponse.json({ message: 'created'}, { status: 200 });
        }
        
        // Then check if a user with this email already exists
        if (email) {
            const { data: existingUserByEmail, error: checkEmailError } = await supabase
                .from('users')
                .select('id, privy_id, email')
                .eq('email', email)
                .single();
                
            if (checkEmailError && checkEmailError.code !== 'PGRST116') {
                console.error("Error checking for existing user by email:", checkEmailError);
                return NextResponse.json({ error: 'Database error occurred' }, { status: 500 });
            }
            
            // If user with this email exists but has a different privy_id, return an error
            if (existingUserByEmail && existingUserByEmail.privy_id !== privy_id) {
                console.log("User with this email already exists with a different privy_id");
                return NextResponse.json({ 
                    error: 'Email already in use with a different account',
                    code: 'EMAIL_IN_USE'
                }, { status: 409 });
            }
        }
        
        // Create new user with a unique constraint on privy_id
        const {error, data} = await supabase.from('users')
            .insert({
                privy_id: privy_id,
                email: email
            })
            .select()
            .single();
            
        if (error) {
            // If we get a unique constraint violation, the user was created by another request
            if (error.code === '23505') {
                console.log("User was created by another concurrent request");
                return NextResponse.json({ message: 'created'}, { status: 200 });
            }
            
            console.error("Error creating user:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log("User created successfully:", data);
        return NextResponse.json({ message: 'created'}, { status: 200 });
    } catch (error) {
        console.error("Unexpected error in user creation:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}