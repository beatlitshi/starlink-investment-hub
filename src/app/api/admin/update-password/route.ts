import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { authId, newPassword } = body;

    if (!authId || !newPassword) {
      return NextResponse.json({ success: false, error: 'authId and newPassword are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(authId, { password: newPassword });
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
