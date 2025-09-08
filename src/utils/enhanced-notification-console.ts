// Enhanced Admin Notification Console Utilities - Advanced testing and monitoring tools
import { projectId, publicAnonKey } from './supabase/info';

// Enhanced notification testing with detailed reporting
export const testEnhancedNotification = async (testEmail?: string): Promise<void> => {
  console.log('🚀 ENHANCED NOTIFICATION TEST');
  console.log('============================');
  console.log('');

  if (!testEmail) {
    if (typeof window !== 'undefined') {
      testEmail = prompt('Enter your email address to test enhanced notifications:') || undefined;
    }
    
    if (!testEmail) {
      console.log('❌ Test cancelled - no email provided');
      console.log('💡 Usage: testEnhancedNotification("your@email.com")');
      return;
    }
  }

  try {
    console.log(`📧 Testing enhanced notifications with: ${testEmail}`);
    console.log('📤 Sending enhanced test notification...');
    console.log('');

    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/test-enhanced-notification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ testEmail })
    });

    if (response.ok) {
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ ENHANCED TEST SUCCESSFUL!');
        console.log('');
        console.log('📊 NOTIFICATION RESULTS:');
        console.log(`   Method: ${result.notificationResult.method}`);
        console.log(`   Status: ${result.notificationResult.finalStatus}`);
        console.log(`   Sent: ${result.notificationResult.sent}/${result.notificationResult.total}`);
        if (result.notificationResult.failed > 0) {
          console.log(`   Failed: ${result.notificationResult.failed}`);
        }
        
        if (result.notificationResult.attempts && result.notificationResult.attempts.length > 0) {
          console.log('');
          console.log('📝 ATTEMPT DETAILS:');
          result.notificationResult.attempts.forEach((attempt: any, index: number) => {
            console.log(`   ${index + 1}. ${attempt.method.toUpperCase()}: ${attempt.success ? '✅ Success' : '❌ Failed'}`);
            if (attempt.error) {
              console.log(`      Error: ${attempt.error}`);
            }
            console.log(`      Recipients: ${attempt.recipients.length}`);
            console.log(`      Time: ${new Date(attempt.timestamp).toLocaleString()}`);
          });
        }
        
        if (result.adminEmails && result.adminEmails.length > 0) {
          console.log('');
          console.log('👥 ADMIN RECIPIENTS:');
          result.adminEmails.forEach((email: string, index: number) => {
            console.log(`   ${index + 1}. ${email}`);
          });
        }
        
        console.log('');
        if (result.notificationResult.method === 'emailjs') {
          console.log('💡 Check your email inbox (including spam folder)');
        } else {
          console.log('💡 Notification was logged to console (EmailJS not configured)');
        }
      } else {
        console.log('❌ ENHANCED TEST FAILED');
        console.log(`💬 Error: ${result.error || 'Unknown error'}`);
        if (result.fix) {
          console.log(`🔧 Fix: ${result.fix}`);
        }
      }
    } else {
      console.error('❌ Test request failed');
      console.error(`Status: ${response.status} ${response.statusText}`);
    }

  } catch (error) {
    console.error('💥 Enhanced test error:', error);
    console.log('');
    console.log('🔧 TROUBLESHOOTING:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify server connectivity');
    console.log('   3. Run: checkEnhancedNotificationStatus() for diagnostics');
  }
};

// Check enhanced notification system status
export const checkEnhancedNotificationStatus = async (): Promise<void> => {
  console.log('📊 ENHANCED NOTIFICATION STATUS');
  console.log('===============================');
  console.log('');

  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/enhanced-notification-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const status = await response.json();
      
      console.log('🔧 SYSTEM CONFIGURATION:');
      console.log(`   EmailJS: ${status.emailjs?.configured ? '✅ Configured' : '❌ Not Configured'}`);
      console.log(`   Admin Emails: ${status.adminEmails?.count || 0} recipient(s)`);
      console.log(`   Cache Status: ${status.cache?.active ? '✅ Active' : '❌ Inactive'}`);
      console.log('');
      
      if (status.emailjs?.configured && status.emailjs.config) {
        console.log('📧 EMAILJS DETAILS:');
        console.log(`   Service ID: ${status.emailjs.config.serviceId}`);
        console.log(`   Template ID: ${status.emailjs.config.templateId}`);
        console.log(`   From Name: ${status.emailjs.config.fromName}`);
        console.log(`   From Email: ${status.emailjs.config.fromEmail}`);
        console.log('');
      }
      
      if (status.adminEmails?.emails && status.adminEmails.emails.length > 0) {
        console.log('👥 ADMIN RECIPIENTS:');
        status.adminEmails.emails.forEach((email: string, index: number) => {
          console.log(`   ${index + 1}. ${email}`);
        });
        console.log('');
      }
      
      if (status.features) {
        console.log('🚀 ENHANCED FEATURES:');
        console.log(`   Retry Mechanism: ${status.features.retryMechanism ? '✅ Enabled' : '❌ Disabled'}`);
        console.log(`   Email Validation: ${status.features.emailValidation ? '✅ Enabled' : '❌ Disabled'}`);
        console.log(`   Audit Logging: ${status.features.auditLogging ? '✅ Enabled' : '❌ Disabled'}`);
        console.log(`   Graceful Fallback: ${status.features.gracefulFallback ? '✅ Enabled' : '❌ Disabled'}`);
        console.log(`   Real-time Monitoring: ${status.features.realtimeMonitoring ? '✅ Enabled' : '❌ Disabled'}`);
        console.log('');
      }
      
      console.log(`🚀 OVERALL STATUS: ${status.ready ? '✅ Ready for enhanced notifications' : '❌ Setup required'}`);
      
      if (!status.ready) {
        console.log('');
        console.log('🔧 SETUP REQUIRED:');
        if (!status.emailjs?.configured) {
          console.log('   • Configure EmailJS: goToEmailJSSetup()');
        }
        if (status.adminEmails?.count === 0) {
          console.log('   • Create admin users: emergencySetup()');
        }
      } else {
        console.log('');
        console.log('✨ READY TO USE:');
        console.log('   • testEnhancedNotification("your@email.com")');
        console.log('   • getNotificationStats()');
        console.log('   • monitorNotifications()');
      }
    } else {
      console.error('❌ Failed to check enhanced notification status');
      console.error(`Status: ${response.status} ${response.statusText}`);
    }

  } catch (error) {
    console.error('💥 Error checking enhanced notification status:', error);
  }
};

// Get notification statistics and performance metrics
export const getNotificationStats = async (submissionId?: string): Promise<void> => {
  console.log('📊 NOTIFICATION STATISTICS');
  console.log('=========================');
  console.log('');

  try {
    const url = submissionId 
      ? `https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/notification-stats?submissionId=${submissionId}`
      : `https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/notification-stats`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      
      if (result.success) {
        const stats = result.stats;
        
        if (submissionId) {
          console.log(`📋 STATISTICS FOR SUBMISSION: ${submissionId}`);
        } else {
          console.log('📊 OVERALL NOTIFICATION STATISTICS');
        }
        console.log('');
        
        console.log('📈 ATTEMPT SUMMARY:');
        console.log(`   Total Attempts: ${stats.totalAttempts}`);
        console.log(`   Successful: ${stats.successfulAttempts} (${stats.totalAttempts > 0 ? Math.round((stats.successfulAttempts / stats.totalAttempts) * 100) : 0}%)`);
        console.log(`   Failed: ${stats.failedAttempts} (${stats.totalAttempts > 0 ? Math.round((stats.failedAttempts / stats.totalAttempts) * 100) : 0}%)`);
        console.log('');
        
        console.log('📋 METHOD BREAKDOWN:');
        console.log(`   EmailJS: ${stats.methodBreakdown.emailjs} attempts`);
        console.log(`   Console: ${stats.methodBreakdown.console} attempts`);
        console.log(`   Errors: ${stats.methodBreakdown.error} attempts`);
        console.log('');
        
        if (stats.recentAttempts && stats.recentAttempts.length > 0) {
          console.log('🕒 RECENT ATTEMPTS (Last 10):');
          stats.recentAttempts.forEach((attempt: any, index: number) => {
            const time = new Date(attempt.timestamp).toLocaleString();
            console.log(`   ${index + 1}. ${attempt.method.toUpperCase()}: ${attempt.success ? '✅' : '❌'} - ${time}`);
            if (attempt.error) {
              console.log(`      Error: ${attempt.error}`);
            }
            console.log(`      Recipients: ${attempt.recipients.length}`);
          });
          console.log('');
        }
        
        if (stats.submissionIds && stats.submissionIds.length > 0) {
          console.log(`📋 TRACKED SUBMISSIONS: ${stats.submissionIds.length}`);
          if (!submissionId) {
            console.log('   Recent submissions:');
            stats.submissionIds.slice(0, 5).forEach((id: string, index: number) => {
              console.log(`   ${index + 1}. ${id}`);
            });
            if (stats.submissionIds.length > 5) {
              console.log(`   ... and ${stats.submissionIds.length - 5} more`);
            }
          }
          console.log('');
        }
        
        console.log('💡 COMMANDS:');
        console.log('   • getNotificationStats("submission_id") - Get stats for specific submission');
        console.log('   • cleanupNotificationLogs() - Clean old logs');
        console.log('   • monitorNotifications() - Start real-time monitoring');
      } else {
        console.log('❌ Failed to get notification statistics');
        console.log(`💬 Error: ${result.error}`);
      }
    } else {
      console.error('❌ Request failed');
      console.error(`Status: ${response.status} ${response.statusText}`);
    }

  } catch (error) {
    console.error('💥 Error getting notification statistics:', error);
  }
};

// Clean up old notification logs
export const cleanupNotificationLogs = async (olderThanDays = 30): Promise<void> => {
  console.log('🧹 CLEANING NOTIFICATION LOGS');
  console.log('=============================');
  console.log(`📅 Cleaning logs older than ${olderThanDays} days...`);
  console.log('');

  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/cleanup-notification-logs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ olderThanDays })
    });

    if (response.ok) {
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ CLEANUP SUCCESSFUL!');
        console.log('');
        console.log('📊 CLEANUP RESULTS:');
        console.log(`   Deleted: ${result.deleted} log entries`);
        console.log(`   Remaining: ${result.remaining} log entries`);
        console.log(`   Cutoff Date: ${new Date(result.cutoffDate).toLocaleString()}`);
        console.log('');
        console.log('💡 Storage space has been freed up');
      } else {
        console.log('❌ Cleanup failed');
        console.log(`💬 Error: ${result.error}`);
      }
    } else {
      console.error('❌ Cleanup request failed');
      console.error(`Status: ${response.status} ${response.statusText}`);
    }

  } catch (error) {
    console.error('💥 Error during cleanup:', error);
  }
};

// Monitor notifications in real-time (simplified simulation)
export const monitorNotifications = (): void => {
  console.log('📡 NOTIFICATION MONITORING');
  console.log('=========================');
  console.log('');
  console.log('🚀 Starting real-time notification monitoring...');
  console.log('💡 This will display a summary every 30 seconds');
  console.log('💡 Press Ctrl+C or refresh page to stop monitoring');
  console.log('');

  let monitoringInterval: number | undefined;

  const runMonitoring = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/notification-stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const stats = result.stats;
          const time = new Date().toLocaleString();
          
          console.log(`📊 [${time}] Notifications: ${stats.totalAttempts} total, ${stats.successfulAttempts} successful, ${stats.failedAttempts} failed`);
          
          // Show any recent failures
          const recentFailures = stats.recentAttempts?.filter((attempt: any) => !attempt.success) || [];
          if (recentFailures.length > 0) {
            console.log(`⚠️ [${time}] ${recentFailures.length} recent failure(s) detected`);
          }
        }
      }
    } catch (error) {
      console.log(`❌ [${new Date().toLocaleString()}] Monitoring error: ${error}`);
    }
  };

  // Run initial check
  runMonitoring();

  // Set up monitoring interval
  if (typeof window !== 'undefined') {
    monitoringInterval = window.setInterval(runMonitoring, 30000); // Every 30 seconds
    
    // Store interval ID for cleanup
    (window as any).notificationMonitoringInterval = monitoringInterval;
    
    console.log('✅ Monitoring started');
    console.log('💡 Use stopNotificationMonitoring() to stop');
  } else {
    console.log('⚠️ Monitoring not available in this environment');
  }
};

// Stop notification monitoring
export const stopNotificationMonitoring = (): void => {
  if (typeof window !== 'undefined') {
    const interval = (window as any).notificationMonitoringInterval;
    if (interval) {
      clearInterval(interval);
      delete (window as any).notificationMonitoringInterval;
      console.log('🛑 Notification monitoring stopped');
    } else {
      console.log('⚠️ No active monitoring to stop');
    }
  }
};

// Batch test multiple emails
export const batchTestNotifications = async (emails: string[]): Promise<void> => {
  console.log('📬 BATCH NOTIFICATION TEST');
  console.log('=========================');
  console.log(`📧 Testing ${emails.length} email addresses...`);
  console.log('');

  const results: any[] = [];

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    console.log(`📤 Testing ${i + 1}/${emails.length}: ${email}`);
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/test-enhanced-notification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ testEmail: email })
      });

      if (response.ok) {
        const result = await response.json();
        results.push({
          email,
          success: result.success,
          method: result.notificationResult?.method,
          status: result.notificationResult?.finalStatus,
          error: result.error
        });
        
        console.log(`   ${result.success ? '✅' : '❌'} ${result.notificationResult?.method || 'unknown'}`);
      } else {
        results.push({
          email,
          success: false,
          error: `HTTP ${response.status}`
        });
        console.log(`   ❌ HTTP ${response.status}`);
      }
    } catch (error) {
      results.push({
        email,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`   ❌ ${error}`);
    }

    // Small delay between requests to avoid overwhelming the server
    if (i < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('');
  console.log('📊 BATCH TEST SUMMARY:');
  console.log(`   Total: ${results.length}`);
  console.log(`   Successful: ${results.filter(r => r.success).length}`);
  console.log(`   Failed: ${results.filter(r => !r.success).length}`);
  console.log('');
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('❌ FAILED TESTS:');
    failed.forEach(result => {
      console.log(`   ${result.email}: ${result.error || 'Unknown error'}`);
    });
  }
};

// Enhanced notification help
export const enhancedNotificationHelp = (): void => {
  console.log('📖 ENHANCED NOTIFICATION COMMANDS');
  console.log('=================================');
  console.log('');
  
  console.log('🚀 TESTING COMMANDS:');
  console.log('   testEnhancedNotification("email@example.com")  - Test enhanced notifications');
  console.log('   batchTestNotifications(["email1", "email2"])   - Test multiple emails');
  console.log('   checkEnhancedNotificationStatus()              - Check system status');
  console.log('');
  
  console.log('📊 MONITORING COMMANDS:');
  console.log('   getNotificationStats()                         - Get overall statistics');
  console.log('   getNotificationStats("submission_id")          - Get stats for specific submission');
  console.log('   monitorNotifications()                         - Start real-time monitoring');
  console.log('   stopNotificationMonitoring()                   - Stop monitoring');
  console.log('');
  
  console.log('🧹 MAINTENANCE COMMANDS:');
  console.log('   cleanupNotificationLogs()                      - Clean logs older than 30 days');
  console.log('   cleanupNotificationLogs(7)                     - Clean logs older than 7 days');
  console.log('');
  
  console.log('💡 TYPICAL WORKFLOW:');
  console.log('   1. checkEnhancedNotificationStatus() - Check system health');
  console.log('   2. testEnhancedNotification("your@email.com") - Test functionality');
  console.log('   3. getNotificationStats() - Review performance');
  console.log('   4. monitorNotifications() - Start monitoring');
  console.log('');
  
  console.log('🔧 TROUBLESHOOTING:');
  console.log('   • Enhanced notifications include retry logic');
  console.log('   • Failed emails automatically fall back to console logging');
  console.log('   • All attempts are logged for audit purposes');
  console.log('   • Email validation prevents invalid addresses');
};

// Make functions available globally for console use
if (typeof window !== 'undefined') {
  (window as any).testEnhancedNotification = testEnhancedNotification;
  (window as any).checkEnhancedNotificationStatus = checkEnhancedNotificationStatus;
  (window as any).getNotificationStats = getNotificationStats;
  (window as any).cleanupNotificationLogs = cleanupNotificationLogs;
  (window as any).monitorNotifications = monitorNotifications;
  (window as any).stopNotificationMonitoring = stopNotificationMonitoring;
  (window as any).batchTestNotifications = batchTestNotifications;
  (window as any).enhancedNotificationHelp = enhancedNotificationHelp;
  
  // Short aliases
  (window as any).testNotificationEnhanced = testEnhancedNotification;
  (window as any).notificationStats = getNotificationStats;
  (window as any).cleanupLogs = cleanupNotificationLogs;
  (window as any).startMonitoring = monitorNotifications;
  (window as any).stopMonitoring = stopNotificationMonitoring;
}