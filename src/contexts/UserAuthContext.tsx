'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

// Deploy trigger: Fix cold start timeout + auto-create user

interface User {
  id: string;
  authId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  balance: number;
  investments: any[]; // Adjust type as needed
  createdAt: string;
}

interface UserAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  updateBalance: (newBalance: number) => Promise<void>;
  updateInvestments: (investments: any[]) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const processingRef = useRef(false);
  const lastBalanceRefreshRef = useRef<number>(0);
  const refreshDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const sessionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to load user profile from database
  const loadUserProfile = async (authId: string, sessionUser: any): Promise<User | null> => {
    try {
      console.log('[Auth] loadUserProfile: Fetching user with auth_id:', authId);

      // Direct query - no timeout needed with Pro tier
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error) {
        console.error('[Auth] loadUserProfile: Query error -', error.message, error.code);
        
        // If profile not found (PGRST116), create it
        if (error.code === 'PGRST116') {
          console.log('[Auth] loadUserProfile: User not found, creating...');
          
          const { data: insertedProfile, error: insertError } = await supabase
            .from('users')
            .insert({
              auth_id: authId,
              email: sessionUser.email,
              first_name: sessionUser.user_metadata?.firstName || '',
              last_name: sessionUser.user_metadata?.lastName || '',
              phone_number: sessionUser.user_metadata?.phoneNumber || '',
              balance: 0,
              investments: [],
            })
            .select()
            .single();
          
          if (insertError) {
            console.error('[Auth] Failed to create user profile:', insertError);
            // Return temporary user
            return {
              id: authId,
              authId: authId,
              email: sessionUser.email || '',
              firstName: sessionUser.user_metadata?.firstName || '',
              lastName: sessionUser.user_metadata?.lastName || '',
              phoneNumber: sessionUser.user_metadata?.phoneNumber || '',
              balance: 0,
              investments: [],
              createdAt: new Date().toISOString(),
            };
          }
          
          if (insertedProfile) {
            console.log('[Auth] ✓ User profile created');
            return {
              id: insertedProfile.id,
              authId: authId,
              email: insertedProfile.email || '',
              firstName: insertedProfile.first_name || '',
              lastName: insertedProfile.last_name || '',
              phoneNumber: insertedProfile.phone_number || '',
              balance: insertedProfile.balance || 0,
              investments: insertedProfile.investments || [],
              createdAt: insertedProfile.created_at || new Date().toISOString(),
            };
          }
        }
        
        // For abort errors or other errors, return temporary user
        console.warn('[Auth] Returning temporary user due to error');
        return {
          id: authId,
          authId: authId,
          email: sessionUser.email || '',
          firstName: sessionUser.user_metadata?.firstName || '',
          lastName: sessionUser.user_metadata?.lastName || '',
          phoneNumber: sessionUser.user_metadata?.phoneNumber || '',
          balance: 0,
          investments: [],
          createdAt: new Date().toISOString(),
        };
      }

      if (profile) {
        console.log('[Auth] loadUserProfile: ✓ Profile found:', {
          id: profile.id,
          email: profile.email,
          balance: profile.balance,
        });
        return {
          id: profile.id,
          authId: authId,
          email: profile.email || '',
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          phoneNumber: profile.phone_number || '',
          balance: profile.balance || 0,
          investments: profile.investments || [],
          createdAt: profile.created_at || new Date().toISOString(),
        };
      }

      console.log('[Auth] loadUserProfile: ✗ No profile found');
      
      // Return temporary user instead of null
      console.warn('[Auth] Creating temporary user in memory');
      return {
        id: authId,
        authId: authId,
        email: sessionUser.email || '',
        firstName: sessionUser.user_metadata?.firstName || '',
        lastName: sessionUser.user_metadata?.lastName || '',
        phoneNumber: sessionUser.user_metadata?.phoneNumber || '',
        balance: 0,
        investments: [],
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[Auth] loadUserProfile: Exception -', error instanceof Error ? error.message : String(error));
      
      // Return temporary user on exception
      console.warn('[Auth] Returning temporary user due to exception');
      return {
        id: authId,
        authId: authId,
        email: sessionUser.email || '',
        firstName: sessionUser.user_metadata?.firstName || '',
        lastName: sessionUser.user_metadata?.lastName || '',
        phoneNumber: sessionUser.user_metadata?.phoneNumber || '',
        balance: 0,
        investments: [],
        createdAt: new Date().toISOString(),
      };
    }
  };

  useEffect(() => {
    // Initialize auth
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    let profileLoadTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('[Auth] Initializing session on app load...');
        console.log('[Auth] Checking localStorage for session...');
        
        let session = null;
        let sessionError = null;
        
        // Retry logic for AbortError
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const result = await supabase.auth.getSession();
            session = result.data.session;
            sessionError = result.error;
            break; // Success, exit retry loop
          } catch (err: any) {
            if (err.name === 'AbortError' && attempt < 2) {
              console.warn(`[Auth] AbortError on attempt ${attempt + 1}, retrying...`);
              await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
              continue;
            }
            sessionError = err;
            break;
          }
        }
        
        if (!isMounted) return;

        if (sessionError) {
          console.error('[Auth] Session error on init:', sessionError);
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('[Auth] ✓ Session found, user:', session.user.email);
          console.log('[Auth] Session expires at:', new Date(session.expires_at! * 1000).toISOString());
          
          // DON'T load profile here - let INITIAL_SESSION event handle it
          // This prevents duplicate requests that abort each other
          console.log('[Auth] Waiting for INITIAL_SESSION event...');
        } else {
          if (isMounted) {
            console.log('[Auth] No session found on init');
            setUser(null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('[Auth] Init error:', error);
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    // Start initialization
    initializeAuth();

    // Safety timeout: force loading false after 15 seconds
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log('[Auth] Safety timeout reached');
        setIsLoading(false);
      }
    }, 15000);

    // Periodically check session is still valid (every 2 minutes)
    sessionCheckIntervalRef.current = setInterval(async () => {
      if (!isMounted) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session && user) {
          console.log('[Auth] Session expired, logging out');
          setUser(null);
        } else if (session && !user) {
          console.log('[Auth] Session exists but user state lost, restoring...');
          const userData = await loadUserProfile(session.user.id, session.user);
          if (userData && isMounted) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('[Auth] Session check error:', error);
      }
    }, 120000); // 2 minutes

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      try {
        console.log('[Auth] State changed:', event, session ? `user=${session.user?.email}` : 'no-session');

        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          // Clear the profile load timeout since auth event fired
          if (profileLoadTimeout) {
            clearTimeout(profileLoadTimeout);
          }

          // Prevent duplicate processing
          if (processingRef.current) {
            console.log(`[Auth] ${event}: Skipping (already processing)`);
            return;
          }
          processingRef.current = true;

          if (session?.user) {
            console.log(`[Auth] ${event}: Loading profile for ${session.user.email}`);
            try {
              const userData = await loadUserProfile(session.user.id, session.user);
              if (isMounted) {
                if (userData) {
                  console.log(`[Auth] ${event}: ✓ User loaded -`, userData.email);
                  setUser(userData);
                  lastBalanceRefreshRef.current = Date.now();
              } else {
                console.log(`[Auth] ${event}: ✗ Profile not found`);
                // Try to create a default user profile if it doesn't exist
                const newUser: User = {
                  id: session.user.id,
                  authId: session.user.id,
                  email: session.user.email || '',
                  firstName: session.user.user_metadata?.firstName || '',
                  lastName: session.user.user_metadata?.lastName || '',
                  phoneNumber: session.user.user_metadata?.phoneNumber || '',
                  balance: 0,
                  investments: [],
                  createdAt: new Date().toISOString(),
                };
                
                // Insert user to database
                const { error: insertError } = await supabase
                  .from('users')
                  .insert({
                    auth_id: session.user.id,
                    email: session.user.email,
                    first_name: newUser.firstName,
                    last_name: newUser.lastName,
                    phone_number: newUser.phoneNumber,
                    balance: 0,
                    investments: [],
                  });
                
                if (insertError) {
                  console.error('[Auth] Failed to create user profile:', insertError);
                  setUser(null);
                } else {
                  console.log('[Auth] ✓ User profile created');
                  setUser(newUser);
                }
              }
              setIsLoading(false);
            }
            } catch (profileError) {
              console.error(`[Auth] ${event}: Profile load exception:`, profileError);
              if (isMounted) {
                setIsLoading(false);
              }
            }
          } else {
            console.log(`[Auth] ${event}: No user in session`);
            setUser(null);
            setIsLoading(false);
          }
          processingRef.current = false;
        } else if (event === 'SIGNED_OUT') {
          console.log('[Auth] SIGNED_OUT: Clearing user');
          processingRef.current = false;
          if (isMounted) {
            setUser(null);
            setIsLoading(false);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('[Auth] TOKEN_REFRESHED');
          if (session?.user && user) {
            console.log('[Auth] Refreshing user profile after token refresh');
            const userData = await loadUserProfile(session.user.id, session.user);
            if (isMounted && userData) {
              setUser(userData);
            }
          }
        }
      } catch (error) {
        console.error('[Auth] State change error:', error);
        processingRef.current = false;
        if (isMounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      clearTimeout(profileLoadTimeout);
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
      }
      subscription?.unsubscribe();
    };
  }, []);

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/personal-dashboard`,
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (authData.user) {
        // Insert user profile into database
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            auth_id: authData.user.id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            phone_number: data.phoneNumber,
            balance: 0,
            investments: [],
          });

        if (insertError) {
          console.error('Error inserting user profile:', insertError);
          // Still return success as auth worked
        }

        // User registered successfully
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('Login successful, user authenticated:', data.user.email);
        // Wait a moment for the auth state change listener to process
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login exception:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const updateBalance = async (newBalance: number) => {
    if (!user || !supabase) return;

    const { error } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating balance:', error);
    } else {
      setUser({ ...user, balance: newBalance });
    }
  };

  const updateInvestments = async (investments: any[]) => {
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .update({ investments })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating investments:', error);
    } else {
      setUser({ ...user, investments });
    }
  };

  const refreshBalance = useCallback(async () => {
    if (!user) return;
    
    // Debounce: only refresh if at least 3 seconds have passed since last refresh
    const now = Date.now();
    if (now - lastBalanceRefreshRef.current < 3000) {
      console.log('[Balance] Refresh debounced');
      return;
    }

    // Clear any pending refresh
    if (refreshDebounceRef.current) {
      clearTimeout(refreshDebounceRef.current);
    }

    // Schedule refresh after 500ms to batch multiple calls
    refreshDebounceRef.current = setTimeout(async () => {
      try {
        console.log('[Balance] Fetching fresh balance...');
        const { data: profile, error } = await supabase
          .from('users')
          .select('balance, investments')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('[Balance] Error:', error);
          return;
        }

        if (profile && profile.balance !== user.balance) {
          console.log('[Balance] Updated to:', profile.balance);
          setUser(prevUser => prevUser ? {
            ...prevUser,
            balance: profile.balance || 0,
            investments: profile.investments || [],
          } : null);
        }
        lastBalanceRefreshRef.current = Date.now();
      } catch (e) {
        console.error('[Balance] Exception:', e);
      }
    }, 500);
  }, [user]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
        updateBalance,
        updateInvestments,
        refreshBalance,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};