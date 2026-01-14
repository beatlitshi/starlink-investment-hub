'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
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

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user profile from database
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              firstName: profile.first_name,
              lastName: profile.last_name,
              phoneNumber: profile.phone_number,
              balance: profile.balance || 0,
              investments: profile.investments || [],
              createdAt: profile.created_at,
            });
          } else {
            // Fallback to session metadata if profile not found
            const { firstName, lastName, phoneNumber } = session.user.user_metadata || {};
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              firstName: firstName || '',
              lastName: lastName || '',
              phoneNumber: phoneNumber || '',
              balance: 0,
              investments: [],
              createdAt: session.user.created_at,
            });
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking user session:', error);
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Get user profile from database
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            firstName: profile.first_name,
            lastName: profile.last_name,
            phoneNumber: profile.phone_number,
            balance: profile.balance || 0,
            investments: profile.investments || [],
            createdAt: profile.created_at,
          });
        } else {
          const { firstName, lastName, phoneNumber } = session.user.user_metadata || {};
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            firstName: firstName || '',
            lastName: lastName || '',
            phoneNumber: phoneNumber || '',
            balance: 0,
            investments: [],
            createdAt: session.user.created_at,
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
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
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
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