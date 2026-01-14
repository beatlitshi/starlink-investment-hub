import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
    }
  }
  return supabaseClient;
};

export const supabase = getSupabaseClient();
