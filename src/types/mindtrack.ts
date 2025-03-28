
import type { Database } from '@/integrations/supabase/types';

// Re-export the database types
export type { Database };

// Define profile type based on the database schema
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Define mood entry type
export type MoodEntry = Database['public']['Tables']['mood_entries']['Row'];

// Define journal entry type
export type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];

// Define gratitude entry type
export type GratitudeEntry = Database['public']['Tables']['gratitude_entries']['Row'];

// Define goal type
export type Goal = Database['public']['Tables']['goals']['Row'];

// Define CBT exercise type
export type CBTExercise = Database['public']['Tables']['cbt_exercises']['Row'];

// Define user settings type
export type UserSettings = Database['public']['Tables']['user_settings']['Row'];

// Define message type
export type Message = Database['public']['Tables']['messages']['Row'];

// Insert types (for creating new records)
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type MoodEntryInsert = Database['public']['Tables']['mood_entries']['Insert'];
export type JournalEntryInsert = Database['public']['Tables']['journal_entries']['Insert'];
export type GratitudeEntryInsert = Database['public']['Tables']['gratitude_entries']['Insert'];
export type GoalInsert = Database['public']['Tables']['goals']['Insert'];
export type CBTExerciseInsert = Database['public']['Tables']['cbt_exercises']['Insert'];
export type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];

// Update types (for updating existing records)
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type MoodEntryUpdate = Database['public']['Tables']['mood_entries']['Update'];
export type JournalEntryUpdate = Database['public']['Tables']['journal_entries']['Update'];
export type GratitudeEntryUpdate = Database['public']['Tables']['gratitude_entries']['Update'];
export type GoalUpdate = Database['public']['Tables']['goals']['Update'];
export type CBTExerciseUpdate = Database['public']['Tables']['cbt_exercises']['Update'];
export type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];
