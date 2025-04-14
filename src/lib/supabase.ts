
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Re-export the client from the integrations directory
export const supabase = supabaseClient;
