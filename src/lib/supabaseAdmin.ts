import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Server-only Supabase client for admin operations. Avoid throwing at import time when envs are missing (e.g., Vercel preview).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: SupabaseClient | null = null;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('Supabase admin client missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
} else {
  supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export { supabaseAdmin };
