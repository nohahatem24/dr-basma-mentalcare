
import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  refreshSession: () => Promise<void>;
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<SessionState>({
    isAuthenticated: false,
    isDoctor: false,
    isLoading: true,
    user: null
  });

  // Function to refresh the session state
  const refreshSession = async () => {
    try {
      const { data: { session: supabaseSession } } = await supabase.auth.getSession();
      
      if (supabaseSession) {
        setSession({
          isAuthenticated: true,
          isDoctor: supabaseSession?.user?.user_metadata?.role === 'doctor',
          isLoading: false,
          user: supabaseSession?.user || null
        });
      } else {
        setSession({
          isAuthenticated: false,
          isDoctor: false,
          isLoading: false,
          user: null
        });
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setSession(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession({
        isAuthenticated: false,
        isDoctor: false,
        isLoading: false,
        user: null
      });
      navigate('/');
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Sign Out Error',
        description: 'There was a problem signing you out.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    // Function to update session state
    const updateSession = (supabaseSession: any) => {
      if (!mounted) return;
      
      setSession({
        isAuthenticated: !!supabaseSession,
        isDoctor: supabaseSession?.user?.user_metadata?.role === 'doctor',
        isLoading: false,
        user: supabaseSession?.user || null
      });
    };

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        updateSession(initialSession);

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, supabaseSession) => {
            updateSession(supabaseSession);
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setSession(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    const cleanup = initializeAuth();

    return () => {
      mounted = false;
      cleanup.then(unsubscribe => unsubscribe?.());
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
