import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/utils/SupabaseClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const privy_id = body.privy_id;

    if (!privy_id) {
      return NextResponse.json(
        { error: 'privy_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('privy_id', privy_id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is the "not found" error code
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }

    if (data) {
      return NextResponse.json(
        { message: 'exists' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'new' },
      { status: 200 }
    );
  } catch (error) {
    console.error('User confirmation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}