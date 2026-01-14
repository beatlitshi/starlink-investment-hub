import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://vkmbltekdbpnapwhtlzy.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

    console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
    console.log('Supabase Key:', supabaseKey ? 'Found' : 'Missing');

    if (supabaseUrl && supabaseKey) {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
      console.log('Supabase client initialized successfully');
    } else {
      console.error('Supabase client not initialized - missing URL or key');
    }
  }
  return supabaseClient;
};

export const supabase = getSupabaseClient();
