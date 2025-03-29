import { createClient } from '@supabase/supabase-js';
import { User, PatientProfile, DoctorProfile } from '../types/user';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authService = {
  async signUp(email: string, password: string, userData: Partial<User>) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (authError) throw authError;

      // Create profile based on user role
      if (userData.role === 'patient') {
        const { error: profileError } = await supabase
          .from('patient_profiles')
          .insert([{ user_id: authData.user?.id }]);

        if (profileError) throw profileError;
      } else if (userData.role === 'doctor') {
        const { error: profileError } = await supabase
          .from('doctor_profiles')
          .insert([{ user_id: authData.user?.id }]);

        if (profileError) throw profileError;
      }

      return authData;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);

      return data;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (!user) return null;

      // Get user profile based on role
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      return profile;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      throw error;
    }
  },

  async updateProfile(userId: string, updates: Partial<User | PatientProfile | DoctorProfile>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  },
}; 