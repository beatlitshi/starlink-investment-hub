import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

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

    // Get user's fixed deposits
    const { data: deposits, error } = await supabase
      .from('fixed_deposits')
      .select('*')
      .eq('user_auth_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching deposits:', error);
      return NextResponse.json({ error: 'Failed to fetch deposits' }, { status: 500 });
    }

    // Ensure dates are properly formatted
    const formattedDeposits = (deposits || []).map((deposit: any) => ({
      ...deposit,
      startDate: deposit.start_date ? new Date(deposit.start_date).toISOString() : new Date().toISOString(),
      maturityDate: deposit.maturity_date ? new Date(deposit.maturity_date).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, deposits: formattedDeposits });
  } catch (error) {
    console.error('Error in fixed-deposits route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
