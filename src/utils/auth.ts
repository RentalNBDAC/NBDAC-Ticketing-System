import { createClient } from './supabase/client';

// PRODUCTION AUTH UTILITIES
// Removed demo credentials - Supabase only for production

export interface AuthStatus {
  type: 'supabase' | 'none';
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
}

/**
 * Get current authentication status
 * PRODUCTION: Only checks Supabase authentication
 */
export function getAuthStatus(): AuthStatus {
  try {
    // Check for active Supabase session
    const supabase = createClient();
    
    // Note: This is synchronous check, for async use the hook
    const sessionData = localStorage.getItem('sb-' + supabase.supabaseUrl.split('//')[1].split('.')[0] + '-auth-token');
    
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        if (session?.user) {
          return {
            type: 'supabase',
            user: {
              id: session.user.id,
              email: session.user.email || 'admin@nbdac.gov.my',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Pentadbir'
            }
          };
        }
      } catch (parseError) {
        console.warn('Failed to parse session data:', parseError);
      }
    }

    return {
      type: 'none',
      user: null
    };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return {
      type: 'none',
      user: null
    };
  }
}

/**
 * Get display name for current admin
 * PRODUCTION: Only uses Supabase user data
 */
export function getAdminDisplayName(): string {
  const authStatus = getAuthStatus();
  
  if (authStatus.user) {
    return authStatus.user.name;
  }
  
  return 'Pentadbir';
}

/**
 * Production setup helper - validates Supabase configuration
 */
export function validateSupabaseConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const supabase = createClient();
    
    if (!supabase.supabaseUrl || supabase.supabaseUrl.includes('your-project-id')) {
      errors.push('Supabase URL tidak dikonfigurasi dengan betul');
    }
    
    if (!supabase.supabaseKey || supabase.supabaseKey.includes('your-anon-key')) {
      errors.push('Supabase Anon Key tidak dikonfigurasi dengan betul');
    }
    
  } catch (error) {
    errors.push('Ralat mencipta klien Supabase: ' + (error as Error).message);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * PRODUCTION CHECKLIST:
 * 
 * 1. Set up Supabase project at https://supabase.com
 * 2. Get your project URL and anon key
 * 3. Update /utils/supabase/info.tsx with your credentials
 * 4. Create admin users in Supabase Auth dashboard
 * 5. Configure authentication settings in Supabase
 * 6. Test login with real Supabase credentials
 * 7. Remove any demo/development authentication code
 */