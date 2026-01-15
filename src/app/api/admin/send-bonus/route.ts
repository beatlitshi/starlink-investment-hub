import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Enable CORS for this route
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Send 8% bonus to user
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get current user balance and info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('balance, first_name, last_name')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentBalance = user.balance || 0;
    const bonusAmount = currentBalance * 0.08; // 8% bonus
    const newBalance = currentBalance + bonusAmount;

    // Update balance
    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating balance:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Log transaction for history
    await supabase.from('transactions').insert({
      user_id: userId,
      user_name: `${user.first_name} ${user.last_name}`,
      type: 'crypto_bonus',
      amount: bonusAmount,
      status: 'completed',
      notes: '8% TAX-FREE bonus by admin',
      timestamp: new Date().toISOString(),
    });

    console.log(`✓ Sent 8% bonus (€${bonusAmount.toFixed(2)}) to user ${userId}`);

    return NextResponse.json({
      success: true,
      bonusAmount,
      newBalance,
      message: `8% bonus of €${bonusAmount.toFixed(2)} added successfully`,
    });
  } catch (error: any) {
    console.error('Error sending bonus:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
