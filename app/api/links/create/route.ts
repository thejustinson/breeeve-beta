import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/SupabaseClient";


export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);

  

}