import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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

    const { amount, duration } = await request.json();

    if (!amount || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (amount < 100) {
      return NextResponse.json({ error: 'Minimum deposit: 100 €' }, { status: 400 });
    }

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentBalance = userProfile.balance || 0;
    if (amount > currentBalance) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Calculate returns
    const bonuses: { [key: number]: number } = { 6: 0, 12: 0, 24: 1, 36: 2 };
    const baseAPY = 8;
    const effectiveAPY = baseAPY + (bonuses[duration] || 0);
    const yearlyReturn = amount * (effectiveAPY / 100);
    const expectedReturn = yearlyReturn * (duration / 12);
    const currentValue = amount + expectedReturn;

    const startDate = new Date();
    const maturityDate = new Date(startDate);
    maturityDate.setMonth(maturityDate.getMonth() + duration);

    // Create deposit with service role to bypass RLS
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { data: deposit, error: depositError } = await supabaseAdmin
      .from('fixed_deposits')
      .insert({
        user_id: userProfile.id,
        user_auth_id: user.id,
        amount: amount,
        apy: effectiveAPY,
        duration: duration,
        start_date: startDate.toISOString(),
        maturity_date: maturityDate.toISOString(),
        expected_return: expectedReturn,
        current_value: currentValue,
        status: 'active',
      })
      .select()
      .single();

    if (depositError) {
      console.error('Error creating deposit:', depositError);
      return NextResponse.json({ error: `Failed to create deposit: ${depositError.message}` }, { status: 500 });
    }

    // Deduct from user balance
    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: currentBalance - amount })
      .eq('auth_id', user.id);

    if (updateError) {
      console.error('Error updating balance:', updateError);
      return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
    }

    // Create transaction record
    await supabase.from('transactions').insert({
      user_id: userProfile.id,
      user_name: `${userProfile.first_name} ${userProfile.last_name}`,
      type: 'fixed_deposit',
      amount: -amount,
      status: 'completed',
      notes: `Fixed deposit created: ${duration} months at ${effectiveAPY}% APY`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      deposit: {
        id: deposit.id,
        amount: deposit.amount,
        apy: deposit.apy,
        duration: deposit.duration,
        expectedReturn: deposit.expected_return,
        maturityDate: deposit.maturity_date,
      },
    });
  } catch (error) {
    console.error('Error in create-fixed-deposit route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
