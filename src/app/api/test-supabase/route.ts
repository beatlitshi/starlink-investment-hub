import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'undefined',
          keyValue: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'undefined'
        }
      }, { status: 500 });
    }

    // Test database connection by querying users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, created_at')
      .limit(5);

    if (usersError) {
      return NextResponse.json({
        success: false,
        error: 'Database query failed',
        details: {
          message: usersError.message,
          code: usersError.code,
          hint: usersError.hint
        }
      }, { status: 500 });
    }

    // Test auth functionality
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      data: {
        usersCount: users?.length || 0,
        sampleUsers: users?.map(u => ({
          id: u.id,
          email: u.email,
          name: `${u.first_name} ${u.last_name}`,
          registeredAt: u.created_at
        })),
        authWorking: !authError,
        currentSession: session ? 'Active session found' : 'No active session',
        environmentCheck: {
          supabaseUrl: supabaseUrl.substring(0, 30) + '...',
          supabaseKeyPresent: true,
          supabaseKeyLength: supabaseKey.length
        }
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
