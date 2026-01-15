import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Assign crypto wallet address to user
export async function POST(request: NextRequest) {
  try {
    const { userId, walletAddress, cryptoType } = await request.json();

    if (!userId || !walletAddress) {
      return NextResponse.json({ error: 'User ID and wallet address required' }, { status: 400 });
    }

    // Update user's crypto wallet
    const { error } = await supabase
      .from('users')
      .update({ 
        crypto_wallet: walletAddress,
        crypto_type: cryptoType || 'BTC'
      })
      .eq('id', userId);

    if (error) {
      console.error('Error assigning wallet:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✓ Assigned ${cryptoType || 'BTC'} wallet to user ${userId}`);

    return NextResponse.json({
      success: true,
      message: `Wallet address assigned to user`,
    });
  } catch (error: any) {
    console.error('Error in crypto wallet assignment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get user's crypto wallet
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('users')
      .select('crypto_wallet, crypto_type')
      .eq('id', userId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      wallet: data?.crypto_wallet || null,
      cryptoType: data?.crypto_type || 'BTC',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
