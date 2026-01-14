// Simple Supabase client for testing
const supabaseUrl = 'https://vkmbltekdbpnapwhtlzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbWJsdGVrZGJwbmFwd2h0bHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTI5MTcsImV4cCI6MjA4Mzg2ODkxN30.0aIujS7wg_nzhmMPCjb2b8qOQrH4mDTGNYTrt9OwaqI';

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    signUp: () => Promise.resolve({ data: {}, error: null }),
    signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
    signOut: () => Promise.resolve(),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    insert: () => Promise.resolve({ error: null }),
    update: () => ({
      eq: () => Promise.resolve({ error: null })
    })
  })
};
