import { createServerClient, serialize } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: any) {
            cookieStore.delete(name);
          },
        },
      }
    );

    // Get user session
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    const { stockSymbol, shares, cost, stockData } = await request.json();

    if (!stockSymbol || !shares || !cost) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check balance
    const currentBalance = userProfile.balance || 0;
    if (cost > currentBalance) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Update investments
    const existingInvestments = userProfile.investments || [];
    const existingIndex = existingInvestments.findIndex((inv: any) => inv.symbol === stockSymbol);

    let updatedInvestments;
    if (existingIndex >= 0) {
      const existing = existingInvestments[existingIndex];
      const totalShares = existing.shares + shares;
      const totalInvested = existing.invested + cost;
      updatedInvestments = [...existingInvestments];
      updatedInvestments[existingIndex] = {
        ...existing,
        shares: totalShares,
        invested: totalInvested,
        currentValue: stockData.price,
        returnAmount: stockData.price * totalShares - totalInvested,
        returnPercentage: ((stockData.price * totalShares) / totalInvested - 1) * 100,
      };
    } else {
      updatedInvestments = [
        ...existingInvestments,
        {
          id: Date.now().toString(),
          name: stockData.name,
          symbol: stockSymbol,
          image: '/assets/images/stock-icon.png',
          alt: stockData.name,
          currentValue: stockData.price,
          invested: cost,
          shares: shares,
          returnAmount: 0,
          returnPercentage: 0,
          dayChange: 0,
          dayChangePercentage: 0,
          purchasePrice: stockData.price,
        },
      ];
    }

    // Update database with new balance and investments
    const { error: updateError } = await supabase
      .from('users')
      .update({
        balance: currentBalance - cost,
        investments: updatedInvestments,
      })
      .eq('auth_id', user.id);

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json({ error: 'Failed to process purchase' }, { status: 500 });
    }

    // Insert transaction record
    await supabase.from('transactions').insert({
      user_id: userProfile.id,
      user_name: `${userProfile.first_name} ${userProfile.last_name}`,
      type: 'stock_purchase',
      amount: cost,
      status: 'completed',
      notes: `Purchased ${shares.toFixed(4)} shares of ${stockSymbol}`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      newBalance: currentBalance - cost,
      investments: updatedInvestments,
    });
  } catch (error) {
    console.error('Error in buy-stock route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
