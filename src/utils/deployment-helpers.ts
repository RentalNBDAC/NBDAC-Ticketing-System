// Deployment and Environment Detection Utilities

/**
 * Detect the current deployment environment
 */
export const getDeploymentEnvironment = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : '';
  
  // Netlify detection
  if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
    return {
      platform: 'netlify',
      isProduction: true,
      isDevelopment: false,
      isPreview: hostname.includes('deploy-preview') || hostname.includes('branch-'),
      url: typeof window !== 'undefined' ? window.location.origin : ''
    };
  }
  
  // Vercel detection
  if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
    return {
      platform: 'vercel',
      isProduction: true,
      isDevelopment: false,
      isPreview: hostname.includes('git-') || hostname.includes('pr-'),
      url: typeof window !== 'undefined' ? window.location.origin : ''
    };
  }
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168.')) {
    return {
      platform: 'development',
      isProduction: false,
      isDevelopment: true,
      isPreview: false,
      url: typeof window !== 'undefined' ? window.location.origin : ''
    };
  }
  
  // Custom domain or other
  return {
    platform: 'custom',
    isProduction: protocol === 'https:',
    isDevelopment: protocol === 'http:',
    isPreview: false,
    url: typeof window !== 'undefined' ? window.location.origin : ''
  };
};

/**
 * Check if running on Netlify and handle specific issues
 */
export const checkNetlifyCompatibility = () => {
  const env = getDeploymentEnvironment();
  
  if (env.platform === 'netlify') {
    console.log('🌐 Running on Netlify deployment');
    
    // Check for common Netlify issues
    const issues = [];
    
    // Check if environment variables are available
    try {
      // These should be available in production
      const hasSupabaseUrl = process.env.SUPABASE_URL || 
        (typeof window !== 'undefined' && (window as any).SUPABASE_URL);
      const hasSupabaseKey = process.env.SUPABASE_ANON_KEY || 
        (typeof window !== 'undefined' && (window as any).SUPABASE_ANON_KEY);
      
      if (!hasSupabaseUrl) {
        issues.push('SUPABASE_URL environment variable not detected');
      }
      if (!hasSupabaseKey) {
        issues.push('SUPABASE_ANON_KEY environment variable not detected');
      }
    } catch (error) {
      issues.push('Error checking environment variables');
    }
    
    // Check for function availability
    const checkFunctions = async () => {
      try {
        const { projectId, publicAnonKey } = await import('./supabase/info');
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (!response.ok) {
          issues.push('Supabase Edge Functions not responding');
        }
      } catch (error) {
        issues.push('Cannot connect to Supabase Edge Functions');
      }
    };
    
    // Run function check after a delay
    setTimeout(checkFunctions, 2000);
    
    if (issues.length > 0) {
      console.warn('⚠️ Netlify deployment issues detected:', issues);
      return { compatible: false, issues };
    }
    
    console.log('✅ Netlify deployment appears compatible');
    return { compatible: true, issues: [] };
  }
  
  return { compatible: true, issues: [] };
};

/**
 * Handle deployment-specific initialization
 */
export const initializeForDeployment = async () => {
  const env = getDeploymentEnvironment();
  
  console.log(`🚀 Initializing for ${env.platform} environment`);
  
  // Platform-specific initialization
  switch (env.platform) {
    case 'netlify':
      // Netlify-specific setup
      await initializeNetlify();
      break;
      
    case 'vercel':
      // Vercel-specific setup
      await initializeVercel();
      break;
      
    case 'development':
      // Development-specific setup
      await initializeDevelopment();
      break;
      
    default:
      // Generic production setup
      await initializeProduction();
      break;
  }
  
  return env;
};

/**
 * Netlify-specific initialization
 */
const initializeNetlify = async () => {
  console.log('🌐 Initializing Netlify-specific features...');
  
  // Check for Netlify environment variables
  const netlifyContext = process.env.CONTEXT || 'unknown';
  const deployId = process.env.DEPLOY_ID || 'unknown';
  const deployUrl = process.env.DEPLOY_URL || window.location.origin;
  
  console.log(`   Context: ${netlifyContext}`);
  console.log(`   Deploy ID: ${deployId}`);
  console.log(`   Deploy URL: ${deployUrl}`);
  
  // Set up Netlify-optimized error handling
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Netlify: Unhandled promise rejection:', event.reason);
    // Don't prevent default to maintain Netlify's error reporting
  });
  
  // Check for Netlify Functions (not Supabase Edge Functions)
  try {
    // This would be for Netlify Functions if we were using them
    // const functionsResponse = await fetch('/.netlify/functions/health');
    // console.log('Netlify Functions available:', functionsResponse.ok);
  } catch (error) {
    console.log('Netlify Functions not configured (using Supabase Edge Functions instead)');
  }
  
  // Netlify-specific performance optimizations
  if ('serviceWorker' in navigator && env.platform === 'netlify') {
    // Register service worker for better caching on Netlify
    try {
      // This would register a service worker if we had one
      console.log('Service worker registration not configured');
    } catch (error) {
      console.log('Service worker not available');
    }
  }
};

/**
 * Vercel-specific initialization
 */
const initializeVercel = async () => {
  console.log('▲ Initializing Vercel-specific features...');
  
  // Vercel environment detection
  const vercelEnv = process.env.VERCEL_ENV || 'unknown';
  const vercelUrl = process.env.VERCEL_URL || window.location.hostname;
  
  console.log(`   Environment: ${vercelEnv}`);
  console.log(`   URL: ${vercelUrl}`);
};

/**
 * Development-specific initialization
 */
const initializeDevelopment = async () => {
  console.log('🛠️ Initializing development environment...');
  
  // Development-specific logging
  if (typeof window !== 'undefined') {
    (window as any).DEBUG_MODE = true;
    console.log('   Debug mode enabled');
  }
  
  // Enable React DevTools messages in development
  if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('   React DevTools detected');
  }
};

/**
 * Generic production initialization
 */
const initializeProduction = async () => {
  console.log('🏭 Initializing production environment...');
  
  // Production-specific optimizations
  if (typeof window !== 'undefined') {
    // Disable console logs in production (optional)
    // console.log = () => {};
    
    // Set up production error tracking
    window.addEventListener('error', (event) => {
      console.error('Production error:', event.error);
    });
  }
};

/**
 * Get platform-specific configuration
 */
export const getPlatformConfig = () => {
  const env = getDeploymentEnvironment();
  
  return {
    // API timeouts based on platform
    apiTimeout: env.platform === 'netlify' ? 10000 : 5000,
    
    // Retry configuration
    maxRetries: env.platform === 'development' ? 1 : 3,
    
    // Logging level
    logLevel: env.isDevelopment ? 'debug' : 'info',
    
    // Enable specific features based on platform
    features: {
      advancedErrorReporting: env.isProduction,
      detailedLogging: env.isDevelopment,
      performanceMonitoring: env.isProduction && env.platform !== 'development'
    }
  };
};

/**
 * Handle platform-specific error reporting
 */
export const reportError = (error: Error, context: string = 'unknown') => {
  const env = getDeploymentEnvironment();
  const config = getPlatformConfig();
  
  console.error(`[${env.platform}] ${context}:`, error);
  
  if (config.features.advancedErrorReporting && env.isProduction) {
    // In production, could send to error tracking service
    // For now, just enhanced logging
    console.error('Production error details:', {
      platform: env.platform,
      context,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: env.url
    });
  }
};

/**
 * Platform-specific health check
 */
export const performPlatformHealthCheck = async () => {
  const env = getDeploymentEnvironment();
  
  console.log(`🔍 Performing ${env.platform} health check...`);
  
  const healthData = {
    platform: env.platform,
    environment: env.isProduction ? 'production' : 'development',
    timestamp: new Date().toISOString(),
    checks: {
      javascript: true,
      localStorage: false,
      supabase: false,
      functions: false
    }
  };
  
  // Check localStorage
  try {
    localStorage.setItem('health_check', 'test');
    localStorage.removeItem('health_check');
    healthData.checks.localStorage = true;
  } catch (error) {
    console.warn('localStorage not available');
  }
  
  // Check Supabase connection
  try {
    const { projectId, publicAnonKey } = await import('./supabase/info');
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      signal: AbortSignal.timeout(5000)
    });
    healthData.checks.supabase = response.ok;
    healthData.checks.functions = response.ok;
  } catch (error) {
    console.warn('Supabase health check failed:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  console.log('Platform health check results:', healthData);
  return healthData;
};