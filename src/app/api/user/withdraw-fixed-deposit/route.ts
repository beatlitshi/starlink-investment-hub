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

    const { depositId } = await request.json();

    if (!depositId) {
      return NextResponse.json({ error: 'Missing deposit ID' }, { status: 400 });
    }

    // Get deposit
    const { data: deposit, error: depositError } = await supabase
      .from('fixed_deposits')
      .select('*')
      .eq('id', depositId)
      .eq('user_auth_id', user.id)
      .single();

    if (depositError || !deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
    }

    if (deposit.status !== 'active') {
      return NextResponse.json({ error: 'Deposit already withdrawn' }, { status: 400 });
    }

    const now = new Date();
    const maturityDate = new Date(deposit.maturity_date);
    const isMatured = now >= maturityDate;

    // Calculate payout amount
    let paidAmount = deposit.amount;
    if (isMatured) {
      paidAmount = deposit.current_value; // Principal + interest
    }
    // Early withdrawal gets only principal, no interest

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update deposit status
    const { error: updateDepositError } = await supabase
      .from('fixed_deposits')
      .update({
        status: isMatured ? 'matured' : 'withdrawn',
        withdrawn_at: now.toISOString(),
        actual_return: isMatured ? deposit.expected_return : 0,
      })
      .eq('id', depositId);

    if (updateDepositError) {
      console.error('Error updating deposit:', updateDepositError);
      return NextResponse.json({ error: 'Failed to update deposit' }, { status: 500 });
    }

    // Add to user balance
    const newBalance = (userProfile.balance || 0) + paidAmount;
    const { error: balanceError } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('auth_id', user.id);

    if (balanceError) {
      console.error('Error updating balance:', balanceError);
      return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
    }

    // Create transaction record
    await supabase.from('transactions').insert({
      user_id: userProfile.id,
      user_name: `${userProfile.first_name} ${userProfile.last_name}`,
      type: isMatured ? 'fixed_deposit_matured' : 'fixed_deposit_early_withdrawal',
      amount: paidAmount,
      status: 'completed',
      notes: isMatured
        ? `Fixed deposit matured: ${deposit.duration} months at ${deposit.apy}% APY`
        : `Early withdrawal (no interest): ${deposit.duration} months deposit`,
      timestamp: now.toISOString(),
    });

    return NextResponse.json({
      success: true,
      paidAmount,
      newBalance,
      isMatured,
    });
  } catch (error) {
    console.error('Error in withdraw-fixed-deposit route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
