import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Set daily stock price target - gradual change instead of random jumps
export async function POST(request: NextRequest) {
  try {
    const { symbol, targetChangePercent, duration } = await request.json();

    if (!symbol || targetChangePercent === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Store the stock control settings
    const { data, error } = await supabase
      .from('stock_controls')
      .upsert({
        symbol,
        target_change_percent: targetChangePercent,
        duration_minutes: duration || 60, // Default 1 hour
        start_time: new Date().toISOString(),
        is_active: true,
      }, { onConflict: 'symbol' });

    if (error) {
      console.error('Error setting stock control:', error);
      
      // Check if it's a missing table error
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Database table missing. Please run DATABASE_SETUP.sql in Supabase first!',
          details: 'Go to Supabase → SQL Editor → Run the SQL from DATABASE_SETUP.sql file'
        }, { status: 500 });
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Stock ${symbol} will ${targetChangePercent > 0 ? 'gain' : 'lose'} ${Math.abs(targetChangePercent)}% over ${duration || 60} minutes`,
    });
  } catch (error: any) {
    console.error('Error in stock control:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get current stock controls
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('stock_controls')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching stock controls:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, controls: data || [] });
  } catch (error: any) {
    console.error('Error in stock control GET:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
