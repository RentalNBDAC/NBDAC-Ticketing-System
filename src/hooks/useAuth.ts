import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';

// PRODUCTION SETUP: Remove demo credentials completely
// Only use Supabase authentication in production

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  loading: boolean;
}

interface LoginResult {
  success: boolean;
  error?: string;
  admin?: Admin;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    admin: null,
    loading: true,
  });

  const supabase = createClient();

  // Check authentication status on mount and session changes
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // Get current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (mounted) {
            setAuthState({ isAuthenticated: false, admin: null, loading: false });
          }
          return;
        }

        if (session?.user) {
          // Extract admin info from Supabase user
          const admin: Admin = {
            id: session.user.id,
            email: session.user.email || 'admin@nbdac.gov.my',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Administrator'
          };

          console.log('✅ Supabase authentication active:', admin);
          
          if (mounted) {
            setAuthState({ 
              isAuthenticated: true, 
              admin, 
              loading: false 
            });
          }
        } else {
          if (mounted) {
            setAuthState({ isAuthenticated: false, admin: null, loading: false });
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setAuthState({ isAuthenticated: false, admin: null, loading: false });
        }
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        const admin: Admin = {
          id: session.user.id,
          email: session.user.email || 'admin@nbdac.gov.my',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Administrator'
        };

        if (mounted) {
          setAuthState({ 
            isAuthenticated: true, 
            admin, 
            loading: false 
          });
        }
      } else {
        if (mounted) {
          setAuthState({ isAuthenticated: false, admin: null, loading: false });
        }
      }
    });

    // Initial auth check
    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      console.log('🔐 Attempting Supabase login for:', email);
      
      // PRODUCTION: Only use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('❌ Supabase login failed:', error.message);
        
        // Return user-friendly error messages in Malay
        let errorMessage = 'Ralat log masuk tidak dijangka';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email atau kata laluan tidak sah';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email belum disahkan';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Terlalu banyak percubaan. Sila cuba lagi kemudian';
        }
        
        return { 
          success: false, 
          error: errorMessage 
        };
      }

      if (data.user && data.session) {
        const admin: Admin = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Administrator'
        };

        console.log('✅ Supabase login successful:', admin);
        
        // State will be updated by the onAuthStateChange listener
        return { 
          success: true, 
          admin 
        };
      }

      return { 
        success: false, 
        error: 'Tiada data pengguna diterima' 
      };

    } catch (error) {
      console.error('💥 Login error:', error);
      return { 
        success: false, 
        error: 'Ralat sambungan. Sila semak sambungan internet anda.' 
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 Logging out...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Logout error:', error);
        throw new Error('Gagal log keluar');
      }
      
      console.log('✅ Logout successful');
      // State will be updated by the onAuthStateChange listener
      
    } catch (error) {
      console.error('💥 Logout error:', error);
      throw error;
    }
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    admin: authState.admin,
    loading: authState.loading,
    login,
    logout,
  };
}