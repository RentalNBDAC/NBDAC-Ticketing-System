// Application Event Handlers and Form Logic with Enhanced Toast Management
import { toast } from './toast';
import { getAuthStatus } from './auth';
import { APP_CONSTANTS, PageType } from './constants';

// Toast debouncing to prevent duplicates
let toastTimeouts: Record<string, NodeJS.Timeout> = {};

/**
 * Enhanced toast function that prevents duplicates
 */
const safeToast = {
  success: (title: string, description?: string) => {
    const key = `success_${title}`;
    if (toastTimeouts[key]) {
      clearTimeout(toastTimeouts[key]);
    }
    toastTimeouts[key] = setTimeout(() => {
      delete toastTimeouts[key];
    }, 1000);
    
    if (!toastTimeouts[key + '_active']) {
      toastTimeouts[key + '_active'] = setTimeout(() => {
        delete toastTimeouts[key + '_active'];
      }, 100);
      toast.success(title, description);
    }
  },
  
  error: (title: string, description?: string) => {
    const key = `error_${title}`;
    if (toastTimeouts[key]) {
      clearTimeout(toastTimeouts[key]);
    }
    toastTimeouts[key] = setTimeout(() => {
      delete toastTimeouts[key];
    }, 1000);
    
    if (!toastTimeouts[key + '_active']) {
      toastTimeouts[key + '_active'] = setTimeout(() => {
        delete toastTimeouts[key + '_active'];
      }, 100);
      toast.error(title, description);
    }
  },
  
  info: (title: string, description?: string) => {
    const key = `info_${title}`;
    if (toastTimeouts[key]) {
      clearTimeout(toastTimeouts[key]);
    }
    toastTimeouts[key] = setTimeout(() => {
      delete toastTimeouts[key];
    }, 1000);
    
    if (!toastTimeouts[key + '_active']) {
      toastTimeouts[key + '_active'] = setTimeout(() => {
        delete toastTimeouts[key + '_active'];
      }, 100);
      toast.info(title, description);
    }
  }
};

/**
 * Enhanced navigation function with authentication checks
 */
export function createNavigationHandler(
  isAuthenticated: boolean,
  setCurrentPage: (page: string) => void
) {
  return (page: string) => {
    // Check if trying to access internal portal without auth
    if (page === APP_CONSTANTS.PAGES.INTERNAL && !isAuthenticated) {
      setCurrentPage(APP_CONSTANTS.PAGES.ADMIN_LOGIN);
      safeToast.info(APP_CONSTANTS.MESSAGES.AUTH_REQUIRED, APP_CONSTANTS.MESSAGES.AUTH_REQUIRED_DESC);
      return;
    }
    
    setCurrentPage(page);
  };
}

/**
 * Handle admin login with proper toast messaging - SINGLE TOAST ONLY
 */
export function createAdminLoginHandler(
  login: (email: string, password: string) => Promise<any>,
  setCurrentPage: (page: string) => void
) {
  return async (email: string, password: string) => {
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Clear any existing timeouts to prevent duplicate toasts
        Object.keys(toastTimeouts).forEach(key => {
          if (key.includes('login') || key.includes('masuk')) {
            clearTimeout(toastTimeouts[key]);
            delete toastTimeouts[key];
          }
        });
        
        // Show SINGLE consolidated authentication success message
        const authStatus = getAuthStatus();
        const authTypeText = authStatus.type === 'supabase' ? 'Supabase' : 'Demo';
        
        safeToast.success(
          'Log Masuk Berjaya', 
          `Pengesahan ${authTypeText} berjaya. Selamat datang ke Portal Dalaman!`
        );
        
        // Redirect to internal portal after successful login
        setCurrentPage(APP_CONSTANTS.PAGES.INTERNAL);
      }
      
      return result;
    } catch (error) {
      console.error('Login error in App:', error);
      safeToast.error(APP_CONSTANTS.MESSAGES.LOGIN_ERROR, APP_CONSTANTS.MESSAGES.LOGIN_ERROR_DESC);
      return { success: false, error: 'Ralat tidak dijangka' };
    }
  };
}

/**
 * Handle admin logout with proper toast messaging - SINGLE TOAST ONLY
 */
export function createAdminLogoutHandler(
  logout: () => Promise<void>,
  setCurrentPage: (page: string) => void
) {
  return async () => {
    try {
      // Clear any existing logout-related timeouts
      Object.keys(toastTimeouts).forEach(key => {
        if (key.includes('logout') || key.includes('keluar')) {
          clearTimeout(toastTimeouts[key]);
          delete toastTimeouts[key];
        }
      });
      
      await logout();
      
      // Show SINGLE consolidated logout success message
      safeToast.success(
        'Log Keluar Berjaya', 
        'Anda telah berjaya log keluar dari sistem. Terima kasih!'
      );
      
      // Redirect to home page after logout
      setCurrentPage(APP_CONSTANTS.PAGES.HOME);
    } catch (error) {
      console.error('Logout error:', error);
      safeToast.error(APP_CONSTANTS.MESSAGES.LOGOUT_ERROR, APP_CONSTANTS.MESSAGES.LOGOUT_ERROR_DESC);
    }
  };
}

/**
 * Handle submission with simplified toast logic
 */
export function createSubmissionHandler(addSubmission: (data: any) => Promise<boolean>) {
  return async (data: any) => {
    console.log('🚀 App: Starting submission process...');
    
    try {
      const success = await addSubmission(data);
      console.log('📊 App: Submission result:', { success });
      return success; // Let the useSubmissions hook handle the toasts
    } catch (error) {
      console.error('💥 App: Error in submission handler:', error);
      return false; // Let the useSubmissions hook handle the error toasts
    }
  };
}

/**
 * Handle status updates with clean toast messaging and admin note support
 */
export function createStatusUpdateHandler(updateSubmissionStatus: (id: string, status: string, adminNote?: string) => Promise<void>) {
  return async (id: string, status: string, adminNote?: string) => {
    try {
      await updateSubmissionStatus(id, status, adminNote);
      // Toast is handled by the useSubmissions hook for better control
    } catch (error) {
      console.error('Error updating status:', error);
      // Error toast is handled by the useSubmissions hook
    }
  };
}

/**
 * Create cleanup function for development/debugging
 */
export function createCleanupHandler() {
  return async () => {
    try {
      const { projectId, publicAnonKey } = await import('./supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/cleanup-email-index`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      console.log('🧹 Cleanup result:', result);
      
      if (result.success) {
        safeToast.success(
          APP_CONSTANTS.MESSAGES.CLEANUP_SUCCESS, 
          `${result.stats.cleaned} entries cleaned, ${result.stats.errors} errors.`
        );
      } else {
        safeToast.error(APP_CONSTANTS.MESSAGES.CLEANUP_ERROR, result.error);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
      safeToast.error(APP_CONSTANTS.MESSAGES.CLEANUP_ERROR, 'Error running cleanup');
    }
  };
}