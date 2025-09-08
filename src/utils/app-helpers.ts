// Application Helper Functions
import { APP_CONSTANTS } from './constants';
import { getAuthStatus } from './auth';

/**
 * Initialize current page from localStorage with error handling
 */
export function initializeCurrentPage(): string {
  try {
    return localStorage.getItem(APP_CONSTANTS.CURRENT_PAGE_KEY) || APP_CONSTANTS.DEFAULT_PAGE;
  } catch (error) {
    console.warn('Failed to load current page from localStorage:', error);
    return APP_CONSTANTS.DEFAULT_PAGE;
  }
}

/**
 * Save current page to localStorage with error handling
 */
export function saveCurrentPage(currentPage: string): void {
  try {
    localStorage.setItem(APP_CONSTANTS.CURRENT_PAGE_KEY, currentPage);
  } catch (error) {
    console.warn('Failed to save current page to localStorage:', error);
  }
}

/**
 * Setup development console helpers with security checks
 */
export function setupDevelopmentHelpers(
  runCleanup: () => Promise<void>,
  navigateToPage: (page: string) => void
): void {
  if (typeof window !== 'undefined') {
    (window as any).runCleanup = runCleanup;
    
    // Only expose admin setup in development for security (browser-safe)
    const hostname = window.location.hostname;
    const isDevelopment = hostname === 'localhost' || 
                         hostname === '127.0.0.1' || 
                         hostname.includes('dev');
    
    if (isDevelopment) {
      (window as any).goToAdminSetup = () => navigateToPage(APP_CONSTANTS.PAGES.ADMIN_SETUP);
      console.log('🔧 Development mode: Admin setup available via window.goToAdminSetup()');
    }
  }
}

/**
 * Log authentication status for debugging
 */
export function logAuthenticationStatus(authLoading: boolean): void {
  if (!authLoading) {
    const authStatus = getAuthStatus();
    if (authStatus.type !== 'none') {
      console.log(`🔐 Authentication active: ${authStatus.type}`, authStatus.user);
    }
  }
}

/**
 * Create toast configuration object with modern styling
 */
export function createToastConfig() {
  return {
    position: "top-right" as const,
    closeButton: true,
    richColors: false,
    expand: false,
    visibleToasts: APP_CONSTANTS.TOAST_VISIBLE_COUNT,
    toastOptions: {
      className: 'border-0 shadow-2xl font-medium backdrop-blur-sm transition-all duration-300 ease-out',
      style: {
        padding: '16px 20px',
        fontSize: '14px',
        minHeight: '64px',
        borderRadius: '12px',
        maxWidth: '400px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)', // Safari support
        transform: 'translateZ(0)', // Force hardware acceleration
      },
      duration: APP_CONSTANTS.TOAST_DURATION,
      unstyled: false,
    },
    gap: 8,
    offset: 16,
  };
}