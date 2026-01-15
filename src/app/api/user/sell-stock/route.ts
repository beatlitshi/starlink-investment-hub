import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get auth token from request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    // Verify token and get user
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const { stockSymbol, shares, saleValue } = await request.json();

    if (!stockSymbol || !shares || !saleValue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user has this investment
    const existingInvestments = userProfile.investments || [];
    const investmentIndex = existingInvestments.findIndex((inv: any) => inv.symbol === stockSymbol);

    if (investmentIndex === -1) {
      return NextResponse.json({ error: 'Stock not found in portfolio' }, { status: 400 });
    }

    const investment = existingInvestments[investmentIndex];
    if (investment.shares < shares) {
      return NextResponse.json({ error: 'Insufficient shares' }, { status: 400 });
    }

    // Update investments - reduce shares or remove if selling all
    let updatedInvestments;
    if (investment.shares === shares) {
      // Selling all shares - remove from portfolio
      updatedInvestments = existingInvestments.filter((_: any, index: number) => index !== investmentIndex);
    } else {
      // Selling partial shares - update the investment
      const remainingShares = investment.shares - shares;
      const proportionalInvested = investment.invested * (remainingShares / investment.shares);
      
      updatedInvestments = [...existingInvestments];
      updatedInvestments[investmentIndex] = {
        ...investment,
        shares: remainingShares,
        invested: proportionalInvested,
      };
    }

    // Update balance - add sale value
    const newBalance = (userProfile.balance || 0) + saleValue;

    // Update database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        balance: newBalance,
        investments: updatedInvestments,
      })
      .eq('id', userProfile.id);

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 });
    }

    // Log transaction for history
    await supabase.from('transactions').insert({
      user_id: userProfile.id,
      user_name: `${userProfile.first_name} ${userProfile.last_name}`,
      type: 'stock_sale',
      amount: saleValue,
      status: 'completed',
      notes: `Sold ${shares.toFixed(4)} shares of ${stockSymbol}`,
      timestamp: new Date().toISOString(),
    });

    console.log(`✓ User sold ${shares} shares of ${stockSymbol} for €${saleValue}`);

    return NextResponse.json({
      success: true,
      newBalance,
      updatedInvestments,
      message: 'Stock sold successfully',
    });
  } catch (error: any) {
    console.error('Error in sell-stock:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
