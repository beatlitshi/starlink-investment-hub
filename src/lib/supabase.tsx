import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vkmbltekdbpnapwhtlzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbWJsdGVrZGJwbmFwd2h0bHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTI5MTcsImV4cCI6MjA4Mzg2ODkxN30.0aIujS7wg_nzhmMPCjb2b8qOQrH4mDTGNYTrt9OwaqI';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'sb-auth-token',
  },
});
