import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const { userId, amount } = await request.json();

    if (!userId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or amount' },
        { status: 400 }
      );
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Get current user balance
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', userId)
      .single();

    if (getUserError || !user) {
      console.error('Error fetching user:', getUserError);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const currentBalance = user.balance || 0;
    const newBalance = currentBalance + numAmount;

    console.log(`Adding €${numAmount} to user ${userId}. Current: €${currentBalance}, New: €${newBalance}`);

    // Update balance in database
    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating balance:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update balance: ' + updateError.message },
        { status: 500 }
      );
    }

    console.log(`Successfully added €${numAmount} to user ${userId}. New balance: €${newBalance}`);

    return NextResponse.json({
      success: true,
      newBalance: newBalance,
      message: `Added €${numAmount}. New balance: €${newBalance}`
    });

  } catch (error) {
    console.error('Error in add-money API:', error);
    return NextResponse.json(
      { success: false, error: 'Server error: ' + (error as any).message },
      { status: 500 }
    );
  }
}
