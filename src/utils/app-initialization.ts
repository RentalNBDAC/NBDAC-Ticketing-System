// Enhanced app initialization with deployment environment support

import { autoConfigureEnvironment, initializeEmailHelpers } from './all-utilities';
import { performSystemHealthCheck } from './app-health-check';
import { setupWindowFunctions } from './window-functions';
import { logConsoleInstructions } from './console-instructions';
import { safeEmailJSInitialization } from './emailjs-fallback-init';
import { 
  initializeForDeployment, 
  checkNetlifyCompatibility, 
  performPlatformHealthCheck,
  getDeploymentEnvironment 
} from './deployment-helpers';
// Import admin email utilities for global access
import './supabase-admin-emails';
// Import enhanced notification console utilities
import './enhanced-notification-console';

/**
 * Enhanced app initialization with deployment environment detection
 */
export const initializeApp = async () => {
  console.log('🚀 Initializing NBDAC Project Request System...');
  
  try {
    // 1. Detect and initialize for deployment environment
    const deploymentEnv = await initializeForDeployment();
    console.log(`   Deployment: ${deploymentEnv.platform} (${deploymentEnv.isProduction ? 'production' : 'development'})`);
    
    // 2. Initialize environment configuration early
    autoConfigureEnvironment();
    try {
      initializeEmailHelpers();
    } catch (error) {
      console.warn('Email helpers initialization failed:', error);
    }
    
    // 3. Initialize EmailJS service safely with debugging
    setTimeout(async () => {
      try {
        // Debug EmailJS configuration first
        const { debugEmailJSConfiguration } = await import('./debug-emailjs');
        await debugEmailJSConfiguration();
        
        // Quick readiness check
        setTimeout(async () => {
          try {
            const { quickEmailJSReadinessCheck } = await import('./test-emailjs-direct');
            const readinessCheck = quickEmailJSReadinessCheck();
            
            if (readinessCheck.ready) {
              console.log('');
              console.log('🎉 EMAILJS READY FOR EMAIL NOTIFICATIONS!');
              console.log('📧 Test now: testEmailJSDirectConfiguration()');
            } else {
              console.log('');
              console.log('⚠️ EMAILJS NEEDS CONFIGURATION');
              console.log('🔧 Quick start: goToEmailJSSetup()');
            }
            console.log('');
          } catch (readinessError) {
            console.warn('EmailJS readiness check error:', readinessError);
          }
        }, 1000);
        
        const emailjsStatus = safeEmailJSInitialization();
        console.log(`📧 EmailJS Status: ${emailjsStatus.status}`);
        if (emailjsStatus.setupCommand) {
          console.log(`🔧 Setup: ${emailjsStatus.setupCommand}`);
        }
      } catch (error) {
        console.log('📧 EmailJS: Available for manual setup via goToEmailJSSetup()');
        console.warn('EmailJS debug error:', error);
      }
    }, 2000); // Show after other initialization messages
    
    // 4. Platform-specific compatibility checks
    if (deploymentEnv.platform === 'netlify') {
      const netlifyCheck = checkNetlifyCompatibility();
      if (!netlifyCheck.compatible) {
        console.warn('⚠️ Netlify compatibility issues:', netlifyCheck.issues);
        
        // Show user-friendly message for Netlify issues
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            console.log('');
            console.log('🌐 NETLIFY DEPLOYMENT DETECTED');
            console.log('   If system setup is not displaying correctly:');
            console.log('   1. Check that environment variables are set in Netlify dashboard');
            console.log('   2. Ensure Supabase Edge Functions are properly deployed');
            console.log('   3. Verify DNS and SSL configuration');
            console.log('   4. Run: checkDeploymentHealth()');
            console.log('');
          }
        }, 3000);
      }
    }
    
    // 5. Perform comprehensive health checks with shorter delay for better responsiveness
    const healthCheckDelay = deploymentEnv.isProduction ? 1500 : 1000;
    
    // Don't await health checks - run them in background
    setTimeout(async () => {
      try {
        // System health check with timeout protection
        await performSystemHealthCheck();
        
        // Platform-specific health check
        await performPlatformHealthCheck();
      } catch (error) {
        console.warn('Background health check failed:', error instanceof Error ? error.message : 'Unknown error');
      }
    }, healthCheckDelay);
    
    // 6. Make setup utilities available globally for console use
    setupWindowFunctions();
    
    // 7. Add deployment-specific window functions
    if (typeof window !== 'undefined') {
      // Add deployment helper functions to window
      (window as any).checkDeploymentHealth = performPlatformHealthCheck;
      (window as any).getDeploymentInfo = getDeploymentEnvironment;
      (window as any).checkNetlifyStatus = checkNetlifyCompatibility;
    }
    
    // 8. Log setup instructions with deployment context
    setTimeout(() => {
      logConsoleInstructions();
      
      // Additional deployment-specific instructions
      if (deploymentEnv.platform === 'netlify') {
        console.log('');
        console.log('🌐 NETLIFY DEPLOYMENT COMMANDS:');
        console.log('   checkDeploymentHealth()                   - Check platform health');
        console.log('   getDeploymentInfo()                       - Get deployment details');
        console.log('   checkNetlifyStatus()                      - Check Netlify compatibility');
        console.log('');
      }
    }, 1000);
    
    console.log('✅ App initialization completed successfully');
    
  } catch (error) {
    console.error('💥 App initialization failed:', error);
    
    // Fallback initialization
    try {
      autoConfigureEnvironment();
      setupWindowFunctions();
      console.log('⚠️ Fallback initialization completed');
    } catch (fallbackError) {
      console.error('💥 Fallback initialization also failed:', fallbackError);
    }
  }
};

/**
 * Quick diagnostic function for deployment issues
 */
export const diagnosePlatformIssues = async () => {
  console.log('🔍 Running platform diagnostics...');
  
  const env = getDeploymentEnvironment();
  const issues = [];
  
  // Check environment variables
  try {
    const { projectId, publicAnonKey } = await import('./supabase/info');
    if (!projectId || projectId === 'undefined') {
      issues.push('Supabase project ID not configured');
    }
    if (!publicAnonKey || publicAnonKey === 'undefined') {
      issues.push('Supabase anon key not configured');
    }
  } catch (error) {
    issues.push('Cannot import Supabase configuration');
  }
  
  // Check API connectivity
  try {
    const { projectId, publicAnonKey } = await import('./supabase/info');
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      signal: AbortSignal.timeout(10000) // Longer timeout for deployment environments
    });
    
    if (!response.ok) {
      issues.push(`API health check failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    issues.push(`API connectivity failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  // Check localStorage
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
  } catch (error) {
    issues.push('LocalStorage not available');
  }
  
  // Platform-specific checks
  if (env.platform === 'netlify') {
    // Check for common Netlify issues
    const netlifyEnvVars = ['CONTEXT', 'DEPLOY_ID', 'DEPLOY_URL'];
    netlifyEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        issues.push(`Netlify environment variable ${envVar} not available`);
      }
    });
  }
  
  // Report results
  if (issues.length === 0) {
    console.log('✅ Platform diagnostics passed - no issues detected');
  } else {
    console.log('⚠️ Platform diagnostics found issues:');
    issues.forEach(issue => console.log(`   ❌ ${issue}`));
    
    console.log('');
    console.log('💡 RECOMMENDED FIXES:');
    console.log('   1. Check environment variables in deployment dashboard');
    console.log('   2. Verify Supabase Edge Functions deployment');
    console.log('   3. Test API connectivity: await fetch(supabaseUrl)');
    console.log('   4. Check browser console for additional errors');
  }
  
  return {
    platform: env.platform,
    environment: env.isProduction ? 'production' : 'development',
    issuesFound: issues.length,
    issues,
    recommendations: issues.length > 0 ? [
      'Check environment variables configuration',
      'Verify Supabase Edge Functions deployment',
      'Test API connectivity',
      'Review browser console for errors'
    ] : []
  };
};

/**
 * Manual server status check with timeout handling
 */
export const checkServerStatus = async (timeoutMs: number = 10000, detailed: boolean = true) => {
  console.log('🔍 Checking server status...');
  
  try {
    const { projectId, publicAnonKey } = await import('./supabase/info');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    // Try simple ping first for basic connectivity
    console.log('📡 Testing basic connectivity...');
    let startTime = Date.now();
    let pingResponse;
    
    try {
      pingResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/ping`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        signal: controller.signal
      });
      
      const pingTime = Date.now() - startTime;
      
      if (pingResponse.ok) {
        console.log(`✅ Basic connectivity: OK (${pingTime}ms)`);
        
        if (!detailed) {
          clearTimeout(timeoutId);
          return { status: 'ok', responseTime: pingTime, type: 'ping' };
        }
      }
    } catch (pingError) {
      console.log('❌ Basic connectivity failed, trying detailed health check...');
    }
    
    // Try detailed health check if requested or if ping failed
    console.log('📊 Running detailed health check...');
    startTime = Date.now();
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Server status: OK (${responseTime}ms)`);
      console.log('📊 System status:', {
        database: data.database?.submissions_table_exists ? 'Ready' : 'KV Fallback',
        admin_users: data.admin?.admin_users_found || 0,
        email_service: data.email?.resend_configured ? 'Configured' : 'Console Only',
        response_time_ms: responseTime,
        cached: data.cached || false
      });
      return { status: 'ok', responseTime, data, type: 'health' };
    } else {
      console.log(`❌ Server status: ${response.status} ${response.statusText} (${responseTime}ms)`);
      return { status: 'error', responseTime, statusCode: response.status, type: 'health' };
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log(`⏱️ Server status: Timeout after ${timeoutMs}ms`);
      return { status: 'timeout', timeoutMs };
    } else {
      console.log(`❌ Server status: Connection failed`);
      console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { status: 'connection_failed', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};

/**
 * Quick connectivity test (ping only)
 */
export const pingServer = async () => {
  return checkServerStatus(5000, false); // 5 second timeout, ping only
};

// Make diagnostic function available globally
if (typeof window !== 'undefined') {
  (window as any).diagnosePlatformIssues = diagnosePlatformIssues;
  (window as any).checkServerStatus = checkServerStatus;
  
  // Add quick EmailJS environment check function
  (window as any).checkEmailJSEnvVars = async () => {
    try {
      const { projectId, publicAnonKey } = await import('./supabase/info');
      console.log('🔍 CHECKING EMAILJS ENVIRONMENT VARIABLES STATUS');
      console.log('===============================================');
      console.log('');

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/emailjs-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          console.log('📧 EMAILJS CONFIGURATION:');
          console.log(`   Status: ${result.emailjs.configured ? '✅ CONFIGURED' : '❌ NOT CONFIGURED'}`);
          if (result.emailjs.configured) {
            console.log(`   Service ID: ${result.emailjs.serviceId}`);
            console.log(`   Template ID: ${result.emailjs.templateId}`);
            console.log(`   From Name: ${result.emailjs.fromName}`);
            console.log(`   From Email: ${result.emailjs.fromEmail}`);
            console.log(`   Source: ${result.emailjs.source}`);
            console.log(`   Last Updated: ${result.emailjs.lastUpdated}`);
          }
          console.log('');
          console.log('👥 ADMIN EMAILS:');
          console.log(`   Count: ${result.adminEmails.count}`);
          console.log(`   Emails: ${result.adminEmails.emails.join(', ')}`);
          console.log(`   Source: ${result.adminEmails.source}`);
          console.log('');
          
          if (result.ready) {
            console.log('🎉 SYSTEM STATUS: READY FOR EMAIL NOTIFICATIONS');
            console.log('💡 Try: testEmailJSConfiguration("your@email.com")');
          } else {
            console.log('⚠️ SYSTEM STATUS: SETUP REQUIRED');
            if (!result.emailjs.configured) {
              console.log('🔧 Fix EmailJS: goToEmailJSSetup() or set environment variables');
            }
            if (result.adminEmails.count === 0) {
              console.log('🔧 Fix Admin Users: emergencySetup()');
            }
          }
        } else {
          console.log('❌ Failed to check EmailJS status:', result.error);
        }
      } else {
        console.log('❌ API request failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.log('❌ Error checking EmailJS environment variables:', error);
    }
  };
}