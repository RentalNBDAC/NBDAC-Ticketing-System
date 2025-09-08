// Health check and system diagnostics for App initialization

export const performSystemHealthCheck = async () => {
  try {
    const { projectId, publicAnonKey } = await import('./supabase/info');
    
    // Create an abort controller for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for server startup
    
    console.log('🔍 Performing system health check...');
    
    // Try ping endpoint first (lighter and faster than full health check)
    let healthResponse;
    try {
      healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/ping`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        signal: controller.signal
      });
      
      // If ping succeeds, try the full health check
      if (healthResponse.ok) {
        console.log('✅ Server connectivity confirmed, getting detailed health...');
        clearTimeout(timeoutId);
        
        const healthController = new AbortController();
        const healthTimeoutId = setTimeout(() => healthController.abort(), 2000); // Shorter timeout for health check
        
        healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
          signal: healthController.signal
        });
        
        clearTimeout(healthTimeoutId);
      }
    } catch (pingError) {
      // If ping fails, still try health check as fallback
      healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        signal: controller.signal
      });
    }
    
    clearTimeout(timeoutId);
    
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log('✅ Health check response received');
      
      // Check for the specific issues mentioned
      const hasAdminUsers = health.admin?.admin_users_found > 0;
      const hasDatabaseTable = health.database?.submissions_table_exists;
      const hasEmailJS = health.email?.emailjs_configured;
      
      if (!hasAdminUsers || !hasDatabaseTable || !hasEmailJS) {
        logSystemIssues(hasAdminUsers, hasDatabaseTable, hasEmailJS);
      } else {
        logSystemHealthy(hasAdminUsers, hasEmailJS);
      }
    } else {
      console.warn(`Health check failed with status: ${healthResponse.status} ${healthResponse.statusText}`);
      logHealthCheckFailed(healthResponse.status);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('⚠️ Health check timed out (5s) - server may be starting up');
      logHealthCheckTimeout();
    } else {
      console.warn('Could not perform automatic health check:', error instanceof Error ? error.message : 'Unknown error');
      logHealthCheckError(error);
    }
  }
};

const logHealthCheckTimeout = () => {
  console.log('');
  console.log('⏱️ HEALTH CHECK TIMEOUT:');
  console.log('   The server health check timed out after 5 seconds');
  console.log('   This is normal during initial server startup or cold starts');
  console.log('');
  console.log('💡 WHAT TO DO:');
  console.log('   • Wait 30-60 seconds for server warmup');
  console.log('   • Refresh the page to retry');
  console.log('   • Use: checkServerStatus() to test manually');
  console.log('   • Use: diagnosePlatformIssues() for detailed diagnostics');
  console.log('   • System will work with console-only notifications');
  console.log('');
};

const logHealthCheckFailed = (status: number) => {
  console.log('');
  console.log(`❌ HEALTH CHECK FAILED (${status}):`);
  console.log('   Server responded but with an error status');
  console.log('');
  console.log('💡 WHAT TO DO:');
  console.log('   • Check server logs for errors');
  console.log('   • Verify Supabase Edge Functions deployment');
  console.log('   • Use: checkServerStatus() to test manually');
  console.log('   • Use: diagnosePlatformIssues() for detailed diagnostics');
  console.log('');
};

const logHealthCheckError = (error: unknown) => {
  console.log('');
  console.log('❌ HEALTH CHECK ERROR:');
  console.log('   Could not connect to server health endpoint');
  console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  console.log('');
  console.log('💡 POSSIBLE CAUSES:');
  console.log('   • Network connectivity issues');
  console.log('   • Supabase Edge Functions not deployed');
  console.log('   • Incorrect environment variables');
  console.log('   • CORS or authentication issues');
  console.log('');
  console.log('💡 WHAT TO DO:');
  console.log('   • Use: diagnosePlatformIssues() for detailed diagnostics');
  console.log('   • Check browser network tab for failed requests');
  console.log('   • Verify Supabase project configuration');
  console.log('');
};

const logSystemIssues = (hasAdminUsers: boolean, hasDatabaseTable: boolean, hasEmailJS: boolean) => {
  console.log('');
  console.log('🚨 ISSUES DETECTED:');
  if (!hasAdminUsers) {
    console.log('   ❌ No users found - email notifications disabled');
    console.log('   💡 Create users in Supabase Auth (all users are admin)');
  }
  if (!hasDatabaseTable) {
    console.log('   ❌ Database table missing - using KV store fallback');
  }
  if (!hasEmailJS) {
    console.log('   ❌ EmailJS not configured');
    console.log('   💡 Email notifications will use enhanced console logging');
  }
  console.log('');
  console.log('💡 INSTANT FIX (RECOMMENDED):');
  console.log('   fixInvalidApiKey()                        - Fix API key issues specifically');
  console.log('   fixAllEmailIssues()                       - Fix ALL problems automatically');
  console.log('');
  console.log('💡 INDIVIDUAL FIXES:');
  console.log('   emergencySetup()                          - Create default admin user');
  console.log('   setupAdmin("your@email.com", "password")  - Create specific admin user');
  console.log('   getResendApiKeyStatus()                   - Check API key status');
  console.log('   showResendSetupInstructions()             - Get new API key');
  console.log('');
  console.log('   🎯 For API key errors: fixInvalidApiKey()');
  console.log('   🎯 For all issues: fixAllEmailIssues()');
  console.log('   💡 Note: All authenticated users have admin access');
};

const logSystemHealthy = (hasAdminUsers: boolean, hasEmailJS: boolean) => {
  console.log('✅ System health check passed - all critical components ready');
  console.log('💡 All authenticated users have admin access');
  
  // If everything looks good but user says they don't receive emails, run diagnostic
  if (hasAdminUsers && hasEmailJS) {
    console.log('');
    console.log('📧 ENHANCED EMAIL SYSTEM COMMANDS:');
    console.log('   testEnhancedNotification(\"your@email.com\") - Test enhanced notifications');
    console.log('   testEmailJSNow(\"your@email.com\")          - Test EmailJS system');
    console.log('   checkEnhancedNotificationStatus()         - Check system status');
    console.log('   getNotificationStats()                    - View notification stats');
  }
};