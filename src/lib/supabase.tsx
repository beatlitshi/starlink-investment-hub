import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vkmbltekdbpnapwhtlzy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbWJsdGVrZGJwbmFwd2h0bHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTI5MTcsImV4cCI6MjA4Mzg2ODkxN30.0aIujS7wg_nzhmMPCjb2b8qOQrH4mDTGNYTrt9OwaqI';

// Global singleton instance
let supabaseInstance: SupabaseClient | null = null;

// Global initialization lock to prevent race conditions
let isInitializing = false;
const initPromises: Array<(client: SupabaseClient) => void> = [];

function getSupabaseClient(): SupabaseClient {
  // If already created, return it immediately
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // If currently initializing, wait for it
  if (isInitializing) {
    return new Promise<SupabaseClient>((resolve) => {
      initPromises.push(resolve);
    }) as any;
  }

  // Create the client
  isInitializing = true;
  
  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'starlink-auth-token',
      flowType: 'pkce',
    },
    global: {
      headers: {
        'X-Client-Info': 'starlink-investment-hub',
      },
    },
    db: {
      schema: 'public',
    },
  });

  // Resolve all waiting promises
  initPromises.forEach(resolve => resolve(supabaseInstance!));
  initPromises.length = 0;
  isInitializing = false;

  console.log('[Supabase] Client initialized');

  return supabaseInstance;
}

export const supabase = getSupabaseClient();
