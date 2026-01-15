import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Get all pending withdrawals
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('withdrawals')
      .select(`
        *,
        users (
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching withdrawals:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, withdrawals: data || [] });
  } catch (error: any) {
    console.error('Error in withdrawals GET:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Approve or reject withdrawal
export async function POST(request: NextRequest) {
  try {
    const { withdrawalId, status, userId } = await request.json();

    if (!withdrawalId || !status) {
      return NextResponse.json({ error: 'Withdrawal ID and status required' }, { status: 400 });
    }

    // First, get the withdrawal details
    const { data: withdrawal, error: fetchError } = await supabase
      .from('withdrawals')
      .select('amount, user_id')
      .eq('id', withdrawalId)
      .single();

    if (fetchError || !withdrawal) {
      console.error('Error fetching withdrawal:', fetchError);
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    // If approving, deduct from user balance
    if (status === 'approved') {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('balance, id, first_name, last_name')
        .eq('id', withdrawal.user_id)
        .single();

      if (userError || !user) {
        console.error('Error fetching user:', userError);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const currentBalance = user.balance || 0;
      if (currentBalance < withdrawal.amount) {
        return NextResponse.json({ error: 'Insufficient user balance' }, { status: 400 });
      }

      const newBalance = currentBalance - withdrawal.amount;

      // Deduct balance
      const { error: balanceError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', withdrawal.user_id);

      if (balanceError) {
        console.error('Error updating balance:', balanceError);
        return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
      }

      // Log transaction for history
      await supabase.from('transactions').insert({
        user_id: user.id,
        user_name: `${user.first_name} ${user.last_name}`,
        type: 'withdrawal',
        amount: -withdrawal.amount, // Negative for withdrawals
        status: 'completed',
        notes: `Withdrawal approved by admin`,
        timestamp: new Date().toISOString(),
      });

      console.log(`✓ Withdrawal approved: €${withdrawal.amount} deducted from user ${user.id}. New balance: €${newBalance}`);
    }

    // Update withdrawal status
    const { error } = await supabase
      .from('withdrawals')
      .update({ status, processed_at: new Date().toISOString() })
      .eq('id', withdrawalId);

    if (error) {
      console.error('Error updating withdrawal:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Withdrawal ${status} successfully`,
    });
  } catch (error: any) {
    console.error('Error in withdrawal approval:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
