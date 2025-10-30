'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

// Define the shape of your context's value
type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
});

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for changes in authentication state (login, logout, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook to easily use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};