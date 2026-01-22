'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  authId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  balance: number;
  investments: any[];
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
  const isInitialized = useRef(false);

  // Load user profile from database
  const loadUserProfile = useCallback(async (authId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return {
          id: data.id,
          authId: authId,
          email: data.email,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          phoneNumber: data.phone_number || '',
          balance: data.balance || 0,
          investments: data.investments || [],
          createdAt: data.created_at,
        };
      }

      // Create user if doesn't exist
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          auth_id: authId,
          email: email,
          balance: 0,
          investments: [],
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return {
        id: newUser.id,
        authId: authId,
        email: newUser.email,
        firstName: '',
        lastName: '',
        phoneNumber: '',
        balance: 0,
        investments: [],
        createdAt: newUser.created_at,
      };
    } catch (err) {
      console.error('Profile load error:', err);
      return null;
    }
  }, []);

  // Initialize auth - only once
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    let mounted = true;

    const initAuth = async () => {
      try {
        // Get current session immediately
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session?.user) {
          // Set loading state for UI
          setIsLoading(true);
          
          // Load profile with timeout - if it takes too long, use fallback
          const profileTimeout = new Promise<User | null>((resolve) => {
            setTimeout(() => {
              resolve(null); // Timeout returns null, will trigger fallback
            }, 5000); // 5 second timeout for profile load only
          });

          const profilePromise = loadUserProfile(session.user.id, session.user.email!);
          
          const profile = await Promise.race([profilePromise, profileTimeout]);

          if (mounted) {
            if (profile) {
              setUser(profile);
            } else {
              // Use fallback - user is still authenticated
              setUser({
                id: '',
                authId: session.user.id,
                email: session.user.email || '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                balance: 0,
                investments: [],
                createdAt: new Date().toISOString(),
              });
            }
            setIsLoading(false);
          }
        } else {
          // No session - clear loading
          if (mounted) {
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // FIRST: Set up auth state listener BEFORE calling initAuth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (!mounted) return;

      console.log('🔐 Auth event:', event, '- Email:', session?.user?.email);

      if (event === 'SIGNED_OUT') {
        console.log('✓ User signed out');
        setUser(null);
        setIsLoading(false);
        return;
      }

      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        console.log('✓ Session active for:', session.user.email);
        setIsLoading(true);

        // Quick profile load with timeout
        const profileTimeout = new Promise<User | null>((resolve) => {
          setTimeout(() => {
            console.warn('⚠️  Profile load timeout - using fallback');
            resolve(null);
          }, 5000);
        });

        const profilePromise = loadUserProfile(session.user.id, session.user.email!);
        const profile = await Promise.race([profilePromise, profileTimeout]);

        if (mounted) {
          if (profile) {
            console.log('✓ Profile loaded successfully');
            setUser(profile);
          } else {
            console.log('✓ Using fallback user object');
            setUser({
              id: '',
              authId: session.user.id,
              email: session.user.email || '',
              firstName: '',
              lastName: '',
              phoneNumber: '',
              balance: 0,
              investments: [],
              createdAt: new Date().toISOString(),
            });
          }
          setIsLoading(false);
        }
      }
    });

    // SECOND: Call initAuth to restore session if it exists
    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔑 Login attempt:', email);
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error.message);
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        console.error('❌ No user returned from login');
        setIsLoading(false);
        return { success: false, error: 'Login failed' };
      }

      console.log('✓ Sign in successful, loading profile');

      // Load profile with timeout
      const profileTimeout = new Promise<User | null>((resolve) => {
        setTimeout(() => {
          console.warn('⚠️  Profile load timeout during login - using fallback');
          resolve(null);
        }, 5000);
      });

      const profilePromise = loadUserProfile(data.user.id, data.user.email!);
      const profile = await Promise.race([profilePromise, profileTimeout]);

      if (profile) {
        console.log('✓ Profile loaded in login');
        setUser(profile);
      } else {
        console.log('✓ Using fallback user object for login');
        setUser({
          id: '',
          authId: data.user.id,
          email: data.user.email || '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          balance: 0,
          investments: [],
          createdAt: new Date().toISOString(),
        });
      }

      setIsLoading(false);
      return { success: true };
    } catch (err) {
      console.error('❌ Login exception:', err);
      setIsLoading(false);
      return { success: false, error: String(err) };
    }
  }, [loadUserProfile]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (authData.user) {
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
          console.error('User profile creation error:', insertError);
        }

        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const updateBalance = useCallback(async (newBalance: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('auth_id', user.authId);

      if (!error) {
        setUser((prev: User | null) => prev ? { ...prev, balance: newBalance } : null);
      }
    } catch (err) {
      console.error('Balance update error:', err);
    }
  }, [user]);

  const updateInvestments = useCallback(async (investments: any[]) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ investments })
        .eq('auth_id', user.authId);

      if (!error) {
        setUser((prev: User | null) => prev ? { ...prev, investments } : null);
      }
    } catch (err) {
      console.error('Investments update error:', err);
    }
  }, [user]);

  const refreshBalance = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('balance, investments')
        .eq('auth_id', user.authId)
        .single();

      if (!error && data) {
        setUser((prev: User | null) => prev ? { ...prev, balance: data.balance, investments: data.investments || [] } : null);
      }
    } catch (err) {
      console.error('Balance refresh error:', err);
    }
  }, [user]);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isLoading,
    updateBalance,
    updateInvestments,
    refreshBalance,
  };

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
