
import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Type for session and user
export interface SessionState {
  isAuthenticated: boolean;
  isDoctor: boolean;
  isLoading: boolean;
  user: any | null;
}

interface AuthContextType {
  session: SessionState;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<SessionState>({
    isAuthenticated: false,
    isDoctor: false,
    isLoading: true,
    user: null
  });

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
  };

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
    <AuthContext.Provider value={{ session, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
