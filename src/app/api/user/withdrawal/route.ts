import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Submit withdrawal request
export async function POST(request: NextRequest) {
  try {
    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, iban } = await request.json();

    if (!amount || !iban) {
      return NextResponse.json({ error: 'Amount and IBAN required' }, { status: 400 });
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from('users')
      .select('id, balance, email, first_name, last_name')
      .eq('auth_id', user.id)
      .single();

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    if (amount > userProfile.balance) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Create withdrawal request
    const { error } = await supabase
      .from('withdrawals')
      .insert({
        user_id: userProfile.id,
        amount,
        iban,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error creating withdrawal:', error);
      
      // Check if it's a missing table error
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Database table missing. Please run DATABASE_SETUP.sql in Supabase first!',
          details: 'Go to Supabase → SQL Editor → Run the SQL from DATABASE_SETUP.sql file'
        }, { status: 500 });
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✓ Withdrawal request created: €${amount} for user ${userProfile.email}`);

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully. Admin will process it soon.',
    });
  } catch (error: any) {
    console.error('Error in withdrawal:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get user's withdrawal history
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, withdrawals: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
