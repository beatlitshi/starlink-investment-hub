import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { authId } = body;

    if (!authId) {
      return NextResponse.json({ success: false, error: 'authId is required' }, { status: 400 });
    }

    // Manually confirm the user's email via Admin API
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(authId, {
      email_confirmed_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
