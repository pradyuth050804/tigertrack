import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// These will be set via environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client with fallback to prevent errors
// If not configured, we'll use mock data instead
let supabase: ReturnType<typeof createClient> | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
} catch (error) {
  console.warn('Supabase client initialization failed, using mock data:', error);
  supabase = null;
}

// Export a safe supabase client getter
export const getSupabaseClient = () => {
  return supabase;
};

// For backward compatibility
export { supabase };

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabase);
};

