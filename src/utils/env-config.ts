// Browser-Safe Environment Configuration
// Use this to set environment-specific configurations in the browser

export interface EnvironmentConfig {
  allowAdminSetup?: boolean;
  setupKey?: string;
  masterSetupKey?: string;
  allowedAdminDomains?: string[];
}

/**
 * Initialize environment configuration in the browser
 * Call this early in your app initialization
 */
export function initializeEnvironmentConfig(config: EnvironmentConfig = {}) {
  if (typeof window === 'undefined') return;

  // Set environment flags on window object for browser-safe access
  if (config.allowAdminSetup !== undefined) {
    (window as any).__ALLOW_ADMIN_SETUP = config.allowAdminSetup;
  }
  
  if (config.setupKey) {
    (window as any).__SETUP_KEY = config.setupKey;
  }
  
  if (config.masterSetupKey) {
    (window as any).__MASTER_SETUP_KEY = config.masterSetupKey;
  }
  
  if (config.allowedAdminDomains) {
    (window as any).__ALLOWED_ADMIN_DOMAINS = config.allowedAdminDomains;
  }

  console.log('🔧 Environment configuration initialized:', {
    allowAdminSetup: config.allowAdminSetup,
    hasSetupKey: !!config.setupKey,
    hasMasterKey: !!config.masterSetupKey,
    allowedDomains: config.allowedAdminDomains?.length || 0
  });
}

/**
 * Get current environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  if (typeof window === 'undefined') return {};

  return {
    allowAdminSetup: (window as any).__ALLOW_ADMIN_SETUP,
    setupKey: (window as any).__SETUP_KEY,
    masterSetupKey: (window as any).__MASTER_SETUP_KEY,
    allowedAdminDomains: (window as any).__ALLOWED_ADMIN_DOMAINS,
  };
}

/**
 * Detect if we're in development environment
 */
export function isDevelopmentEnvironment(): boolean {
  if (typeof window === 'undefined') return true; // Default to development for SSR
  
  const hostname = window.location.hostname;
  return hostname === 'localhost' || 
         hostname === '127.0.0.1' || 
         hostname.includes('dev');
}

/**
 * Detect if we're in production environment
 */
export function isProductionEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  return hostname !== 'localhost' && 
         hostname !== '127.0.0.1' &&
         !hostname.includes('dev') &&
         !hostname.includes('staging') &&
         !hostname.includes('preview');
}

/**
 * Auto-configure based on environment
 */
export function autoConfigureEnvironment() {
  const isDev = isDevelopmentEnvironment();
  const isProd = isProductionEnvironment();
  
  if (isDev) {
    // Development: Allow admin setup by default
    initializeEnvironmentConfig({
      allowAdminSetup: true,
      setupKey: `nbdac-admin-setup-${new Date().getFullYear()}`,
      // Don't set domain restrictions in development
    });
  } else if (isProd) {
    // Production: Secure by default
    initializeEnvironmentConfig({
      allowAdminSetup: false, // Disabled by default in production
      // Don't set keys in production - force manual configuration
    });
  } else {
    // Staging/Preview: Balanced approach
    initializeEnvironmentConfig({
      allowAdminSetup: false, // Disabled but can be overridden
      setupKey: `nbdac-staging-setup-${new Date().getFullYear()}`,
    });
  }
}