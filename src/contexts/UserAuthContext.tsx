'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: string;
}

interface UserAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
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
      if (!supabase) {
        // Fallback to localStorage if Supabase not available
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error('Error loading user from localStorage:', error);
        }
        setIsLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Get user metadata
        const { firstName, lastName, phoneNumber } = session.user.user_metadata || {};
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          firstName: firstName || '',
          lastName: lastName || '',
          phoneNumber: phoneNumber || '',
          createdAt: session.user.created_at,
        });
      }
      setIsLoading(false);
    };

    checkUser();

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { firstName, lastName, phoneNumber } = session.user.user_metadata || {};
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            firstName: firstName || '',
            lastName: lastName || '',
            phoneNumber: phoneNumber || '',
            createdAt: session.user.created_at,
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      // Fallback to localStorage
      try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return { success: false, error: 'Invalid email format' };
        }

        // Validate password strength
        if (data.password.length < 8) {
          return { success: false, error: 'Password must be at least 8 characters' };
        }

        // Validate phone number
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(data.phoneNumber)) {
          return { success: false, error: 'Invalid phone number format' };
        }

        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = existingUsers.some((u: User) => u.email === data.email);
        
        if (userExists) {
          return { success: false, error: 'Email already registered' };
        }

        // Create new user
        const newUser: User = {
          id: `user_${Date.now()}`,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          createdAt: new Date().toISOString(),
        };

        // Store user credentials
        const users = [...existingUsers, newUser];
        localStorage.setItem('users', JSON.stringify(users));
        
        // Store password separately (in production, this should be hashed and stored securely)
        const credentials = JSON.parse(localStorage.getItem('credentials') || '{}');
        credentials[data.email] = data.password;
        localStorage.setItem('credentials', JSON.stringify(credentials));

        // Auto-login after registration
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));

        return { success: true };
      } catch (error) {
        return { success: false, error: 'Registration failed. Please try again.' };
      }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
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

      if (data.user) {
        // User registered successfully
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      // Fallback to localStorage
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const credentials = JSON.parse(localStorage.getItem('credentials') || '{}');

        const foundUser = users.find((u: User) => u.email === email);
        
        if (!foundUser) {
          return { success: false, error: 'Invalid email or password' };
        }

        if (credentials[email] !== password) {
          return { success: false, error: 'Invalid email or password' };
        }

        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));

        return { success: true };
      } catch (error) {
        return { success: false, error: 'Login failed. Please try again.' };
      }
    }

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

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      setUser(null);
      localStorage.removeItem('user');
    }
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