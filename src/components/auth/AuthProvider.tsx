
import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Type for session and user
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  email: string;
  language?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SessionState {
  isAuthenticated: boolean;
  isDoctor: boolean;
  isLoading: boolean;
  user: any | null;
  profile: UserProfile | null;
}

interface AuthContextType {
  session: SessionState;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
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
    user: null,
    profile: null,
  });

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      // Add email from auth user to profile
      if (data) {
        const userEmail = session.user?.email;
        const profile: UserProfile = {
          ...data,
          email: userEmail || '',
          phone: session.user?.phone || session.user?.user_metadata?.phone || null,
          date_of_birth: session.user?.user_metadata?.date_of_birth || null,
          gender: session.user?.user_metadata?.gender || null,
        };
        return profile;
      }
      
      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    toast("Logged out successfully");
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!session.user?.id) {
        return { success: false, error: 'User not authenticated' };
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);
      
      if (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
      }
      
      // Refresh the profile after update
      await refreshProfile();
      return { success: true };
    } catch (error: any) {
      console.error('Error in updateProfile:', error);
      return { success: false, error: error.message };
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (session.user?.id) {
      const profile = await fetchUserProfile(session.user.id);
      if (profile) {
        setSession(prev => ({ ...prev, profile }));
      }
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, authSession) => {
        console.log("Auth state changed:", event);
        
        const newSessionState = {
          isAuthenticated: !!authSession,
          isDoctor: authSession?.user?.user_metadata?.role === 'doctor',
          isLoading: false,
          user: authSession?.user || null,
          profile: null,
        };
        
        // If user is authenticated, fetch their profile
        if (authSession?.user) {
          setSession(newSessionState); // Set initial state without profile
          
          setTimeout(async () => {
            const profile = await fetchUserProfile(authSession.user.id);
            if (profile) {
              setSession(prev => ({ ...prev, profile }));
            }
          }, 0);
        } else {
          setSession(newSessionState);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: authSession } }) => {
      console.log("Existing session:", authSession);
      
      const newSessionState = {
        isAuthenticated: !!authSession,
        isDoctor: authSession?.user?.user_metadata?.role === 'doctor',
        isLoading: false,
        user: authSession?.user || null,
        profile: null,
      };
      
      // If user is authenticated, fetch their profile
      if (authSession?.user) {
        setSession(newSessionState); // Set initial state without profile
        
        const profile = await fetchUserProfile(authSession.user.id);
        if (profile) {
          setSession(prev => ({ ...prev, profile }));
        }
      } else {
        setSession(newSessionState);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, signOut, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
