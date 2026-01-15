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

    // If approving, deduct from user balance
    if (status === 'approved') {
      const { data: withdrawal } = await supabase
        .from('withdrawals')
        .select('amount, user_id')
        .eq('id', withdrawalId)
        .single();

      if (withdrawal) {
        const { data: user } = await supabase
          .from('users')
          .select('balance')
          .eq('id', withdrawal.user_id)
          .single();

        if (user) {
          const newBalance = (user.balance || 0) - withdrawal.amount;
          await supabase
            .from('users')
            .update({ balance: newBalance })
            .eq('id', withdrawal.user_id);
        }
      }
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
