
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Type for session and user
export interface SessionState {
  isAuthenticated: boolean;
  isDoctor: boolean;
  isLoading: boolean;
  user: any | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<SessionState>({
    isAuthenticated: false,
    isDoctor: false,
    isLoading: true,
    user: null
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, supabaseSession) => {
        console.log("Auth state changed:", event);
        setSession({
          isAuthenticated: !!supabaseSession,
          isDoctor: supabaseSession?.user?.user_metadata?.role === 'doctor',
          isLoading: false,
          user: supabaseSession?.user || null
        });
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: supabaseSession } }) => {
      console.log("Existing session:", supabaseSession);
      setSession({
        isAuthenticated: !!supabaseSession,
        isDoctor: supabaseSession?.user?.user_metadata?.role === 'doctor',
        isLoading: false,
        user: supabaseSession?.user || null
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      {children}
    </div>
  );
};

export default AuthProvider;
