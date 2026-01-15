'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

// Deploy trigger: Session persistence fixes for INITIAL_SESSION event handling

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

  // Helper function to load user profile from database without aggressive fallbacks
  const loadUserProfile = async (authId: string, sessionUser: any): Promise<User | null> => {
    try {
      console.log('loadUserProfile: Fetching user with auth_id:', authId);

      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error) {
        console.error('loadUserProfile: Query error -', error.message);
        // Return null on error so UI shows login screen instead of fallback user
        return null;
      }

      if (profile) {
        console.log('loadUserProfile: Profile found:', {
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

      console.log('loadUserProfile: No profile found - user may not exist yet');
      return null;
    } catch (error) {
      console.error('loadUserProfile: Exception -', error instanceof Error ? error.message : String(error));
      return null;
    }
  };

  useEffect(() => {
    // Initialize auth with timeout to prevent hanging
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (sessionError) {
          console.error('Session error:', sessionError);
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Session found for:', session.user.email);
          const userData = await loadUserProfile(session.user.id, session.user);
          if (isMounted) {
            if (userData) {
              console.log('✓ User profile loaded:', userData.email);
              setUser(userData);
            } else {
              console.log('✗ User profile not found in database, keeping user null');
              setUser(null);
            }
            setIsLoading(false);
          }
        } else {
          if (isMounted) {
            console.log('No active session');
            setUser(null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    // Start initialization
    initializeAuth();

    // Safety timeout: force loading to false after 8 seconds (avoid premature zero balances)
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log('Auth initialization timeout - setting isLoading to false');
        setIsLoading(false);
      }
    }, 8000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      try {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          // Prevent duplicate processing
          if (processingRef.current) {
            console.log(`${event}: Already processing, skipping`);
            return;
          }
          processingRef.current = true;

          if (session?.user) {
            console.log(`${event}: Loading user profile for ${session.user.email}`);
            const userData = await loadUserProfile(session.user.id, session.user);
            if (isMounted) {
              if (userData) {
                console.log(`✓ ${event}: User loaded -`, userData.email);
                setUser(userData);
              } else {
                console.log(`✗ ${event}: User profile not found, keeping null`);
                setUser(null);
              }
              setIsLoading(false);
            }
          } else {
            console.log(`${event}: No user in session`);
            setUser(null);
            setIsLoading(false);
          }
          processingRef.current = false;
        } else if (event === 'SIGNED_OUT') {
          console.log('SIGNED_OUT: Clearing user');
          processingRef.current = false;
          if (isMounted) {
            setUser(null);
            setIsLoading(false);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('TOKEN_REFRESHED: Refreshing user profile');
          if (session?.user) {
            const userData = await loadUserProfile(session.user.id, session.user);
            if (isMounted) {
              if (userData) {
                setUser(userData);
              } else {
                setUser(null);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        processingRef.current = false;
        if (isMounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
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
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.authId)
        .single();
      
      if (error) {
        console.error('Error refreshing balance:', error);
      } else if (profile) {
        setUser({
          ...user,
          balance: profile.balance || 0,
          investments: profile.investments || [],
        });
      }
    } catch (e) {
      console.error('Error refreshing balance:', e);
    }
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