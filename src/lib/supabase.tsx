import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vkmbltekdbpnapwhtlzy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbWJsdGVrZGJwbmFwd2h0bHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTI5MTcsImV4cCI6MjA4Mzg2ODkxN30.0aIujS7wg_nzhmMPCjb2b8qOQrH4mDTGNYTrt9OwaqI';

// Global singleton instance
let supabaseInstance: SupabaseClient | null = null;

// Global initialization lock to prevent race conditions
let isInitializing = false;
let initComplete = false;
const initPromises: Array<() => void> = [];

// Request queue to prevent overwhelming Supabase
let requestQueue: Promise<any> = Promise.resolve();
let queuedRequests = 0;

function getSupabaseClient(): SupabaseClient {
  // If already created, return it immediately
  if (supabaseInstance && initComplete) {
    return supabaseInstance;
  }

  // If currently initializing, wait for it
  if (isInitializing) {
    return new Promise<SupabaseClient>((resolve) => {
      initPromises.push(() => resolve(supabaseInstance!));
    }) as any;
  }

  // Create the client
  isInitializing = true;
  
  try {
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

    console.log('[Supabase] Client initialized');

    // Resolve all waiting promises
    initPromises.forEach(resolve => resolve());
    initPromises.length = 0;
    
    initComplete = true;
    isInitializing = false;

    return supabaseInstance;
  } catch (error) {
    console.error('[Supabase] Failed to initialize:', error);
    isInitializing = false;
    throw error;
  }
}

// Helper to queue Supabase requests to prevent AbortError
export function queueSupabaseRequest<T>(fn: () => Promise<T>): Promise<T> {
  queuedRequests++;
  
  if (queuedRequests > 50) {
    console.warn('[Supabase] Queue backing up:', queuedRequests, 'requests');
  }
  
  const promise = requestQueue
    .then(() => fn())
    .finally(() => {
      queuedRequests--;
    });
  
  requestQueue = promise.catch(() => {}); // Don't let errors block queue
  
  return promise;
}

export const supabase = getSupabaseClient();
