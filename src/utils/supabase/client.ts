import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Singleton pattern to prevent multiple client instances
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export const createClient = () => {
  // Return existing client if already created
  if (supabaseClient) {
    return supabaseClient;
  }

  // Create new client only if one doesn't exist
  if (!projectId || !publicAnonKey) {
    console.error('Missing Supabase configuration');
    throw new Error('Supabase configuration is not properly set up');
  }

  supabaseClient = createSupabaseClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'nbdac-supabase-auth',
      },
    }
  );

  console.log('✅ Supabase client created successfully');
  return supabaseClient;
};

// Function to get existing client without creating a new one
export const getClient = () => {
  if (!supabaseClient) {
    return createClient();
  }
  return supabaseClient;
};

// Function to reset client (useful for testing or when switching projects)
export const resetClient = () => {
  supabaseClient = null;
};