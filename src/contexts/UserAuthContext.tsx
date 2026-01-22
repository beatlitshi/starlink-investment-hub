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
    const loadTimeout = setTimeout(() => {
      if (mounted) {
        setIsLoading(false);
      }
    }, 4000);

    const initAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          const profile = await loadUserProfile(session.user.id, session.user.email!);
          if (profile && mounted) {
            setUser(profile);
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await loadUserProfile(session.user.id, session.user.email!);
        if (profile && mounted) {
          setUser(profile);
        }
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      } else if (event === 'INITIAL_SESSION' && session?.user) {
        const profile = await loadUserProfile(session.user.id, session.user.email!);
        if (profile && mounted) {
          setUser(profile);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });

    initAuth();

    return () => {
      mounted = false;
      clearTimeout(loadTimeout);
      subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await loadUserProfile(data.user.id, data.user.email!);
        if (profile) {
          setUser(profile);
          return { success: true };
        }
      }

      return { success: false, error: 'Failed to load profile' };
    } catch (err) {
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
        setUser(prev => prev ? { ...prev, balance: newBalance } : null);
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
        setUser(prev => prev ? { ...prev, investments } : null);
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
        setUser(prev => prev ? { ...prev, balance: data.balance, investments: data.investments || [] } : null);
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
