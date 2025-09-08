// Setup global window functions for console access
// EmailJS-focused system with no Resend dependencies

export const setupWindowFunctions = () => {
  if (typeof window === 'undefined') return;

  // Core system utilities (EmailJS-only)
  window.masterSystemFix = async () => {
    try {
      const { masterSystemFix } = await import('./comprehensive-setup');
      return await masterSystemFix();
    } catch (error) {
      console.log('❌ Error with master system fix:', error);
    }
  };

  window.emergencySetup = async () => {
    try {
      const { emergencySetup } = await import('./comprehensive-setup');
      return await emergencySetup();
    } catch (error) {
      console.log('❌ Error with emergency setup:', error);
    }
  };
  
  // Admin email utilities  
  window.listAdminEmails = async () => {
    try {
      const { listAdminEmails } = await import('./email-diagnostic');
      return await listAdminEmails();
    } catch (error) {
      console.log('❌ Error listing admin emails:', error);
    }
  };
  
  // Add server diagnostics (import dynamically to avoid circular dependencies)
  if (window.checkServerStatus === undefined) {
    import('./app-initialization').then(({ checkServerStatus, diagnosePlatformIssues, pingServer }) => {
      window.checkServerStatus = checkServerStatus;
      window.diagnosePlatformIssues = diagnosePlatformIssues;
      window.pingServer = pingServer;
    }).catch(() => {
      // Fallback if import fails
      window.checkServerStatus = () => console.log('Server status check not available');
      window.pingServer = () => console.log('Server ping not available');
    });
  }
  
  // Add EmailJS functions - Enhanced with new console utilities
  window.goToEmailJSSetup = () => {
    console.log('🚀 Navigating to EmailJS setup page...');
    if (typeof window !== 'undefined') {
      // Try to get the navigation function from the app
      const event = new CustomEvent('navigate-to-page', { 
        detail: { page: 'emailjs-setup' } 
      });
      window.dispatchEvent(event);
      console.log('📧 EmailJS setup page opened');
      console.log('💡 Configure your EmailJS service ID, template ID, and API keys');
    }
  };

  // Enhanced EmailJS console utilities
  window.quickEmailJSStatus = async () => {
    try {
      const { quickEmailJSStatus } = await import('./emailjs-console');
      return await quickEmailJSStatus();
    } catch (error) {
      console.log('❌ Error checking EmailJS status:', error);
    }
  };

  window.testEmailJSNow = async (testEmail: string) => {
    try {
      const { testEmailJSNow } = await import('./emailjs-console');
      return await testEmailJSNow(testEmail);
    } catch (error) {
      console.log('❌ Error testing EmailJS:', error);
    }
  };

  window.quickEmailJSTest = async () => {
    try {
      const { quickEmailJSTest } = await import('./emailjs-console');
      return await quickEmailJSTest();
    } catch (error) {
      console.log('❌ Error with quick test:', error);
    }
  };

  window.diagEmailJS = async () => {
    try {
      const { diagEmailJS } = await import('./emailjs-console');
      return await diagEmailJS();
    } catch (error) {
      console.log('❌ Error running EmailJS diagnostic:', error);
    }
  };

  window.autoSetupEmailJS = async () => {
    try {
      const { autoSetupEmailJS } = await import('./emailjs-console');
      return await autoSetupEmailJS();
    } catch (error) {
      console.log('❌ Error with auto setup:', error);
    }
  };

  window.clearEmailJSConfig = async () => {
    try {
      const { clearEmailJSConfig } = await import('./emailjs-console');
      return clearEmailJSConfig();
    } catch (error) {
      console.log('❌ Error clearing config:', error);
    }
  };

  window.emailJSHelp = async () => {
    try {
      const { emailJSHelp } = await import('./emailjs-console');
      return emailJSHelp();
    } catch (error) {
      console.log('❌ Error showing help:', error);
    }
  };

  window.showEmailJSTemplateGuide = async () => {
    try {
      const { showEmailJSTemplateGuide } = await import('./email-helpers');
      return showEmailJSTemplateGuide();
    } catch (error) {
      console.log('❌ Error showing professional template guide:', error);
      console.log('💡 Try: showProfessionalTemplateGuide()');
    }
  };

  window.showProfessionalTemplateGuide = async () => {
    try {
      const { showEmailJSTemplateGuide } = await import('./email-helpers');
      return showEmailJSTemplateGuide();
    } catch (error) {
      console.log('❌ Error showing professional template guide:', error);
    }
  };

  window.debugEmailJSTemplate = async (testEmail?: string) => {
    try {
      if (!testEmail) {
        testEmail = prompt('Enter email address to debug EmailJS template:');
        if (!testEmail) {
          console.log('❌ Debug cancelled - no email provided');
          return;
        }
      }
      
      console.log('🔍 DEBUGGING EMAILJS TEMPLATE PARAMETERS');
      console.log('======================================');
      console.log('');
      
      const { generateDebugTemplateParams, debugEmailJSTemplate } = await import('./emailjs-template-validator');
      const debugParams = generateDebugTemplateParams(testEmail);
      
      console.log('📋 Generated Debug Parameters:');
      debugEmailJSTemplate(debugParams);
      
      console.log('');
      console.log('🧪 Testing with debug parameters...');
      
      // Try to send test email with debug parameters
      const { emailjsService } = await import('./emailjs-service');
      
      if (!emailjsService.isConfigured()) {
        console.log('❌ EmailJS not configured');
        console.log('💡 Configure first: goToEmailJSSetup()');
        return;
      }
      
      const result = await emailjsService.testConfiguration(testEmail);
      
      console.log('');
      console.log('📧 DEBUG TEST RESULT:');
      console.log(`   Success: ${result.success ? '✅' : '❌'}`);
      console.log(`   Message: ${result.message}`);
      
      if (!result.success) {
        console.log('');
        console.log('🔧 TEMPLATE TROUBLESHOOTING:');
        console.log('1. Check if your EmailJS template uses {{to_email}} or {{recipient_email}}');
        console.log('2. Verify template ID matches your EmailJS dashboard');
        console.log('3. Ensure email service is connected in EmailJS');
        console.log('4. Try creating a simple template with just {{to_email}}, {{subject}}, {{message}}');
      }
      
      return result;
      
    } catch (error) {
      console.log('❌ Debug error:', error);
    }
  };

  window.quickEmailJSTemplateTest = async (testEmail?: string) => {
    try {
      if (!testEmail) {
        testEmail = prompt('Enter email address for quick EmailJS template test:');
        if (!testEmail) {
          console.log('❌ Test cancelled - no email provided');
          return;
        }
      }
      
      const { quickEmailJSTemplateTest } = await import('./emailjs-simple-test');
      return await quickEmailJSTemplateTest(testEmail);
      
    } catch (error) {
      console.log('❌ Quick template test error:', error);
    }
  };
  
  // Legacy EmailJS functions (maintained for backward compatibility)
  window.checkEmailJSStatus = async () => {
    try {
      const { checkEmailJSStatus } = await import('./emailjs-integration');
      const status = await checkEmailJSStatus();
      
      console.log('📧 EMAILJS STATUS CHECK');
      console.log('======================');
      console.log('');
      console.log(`✅ Configured: ${status.configured}`);
      console.log(`👥 Admin Emails: ${status.adminEmails}`);
      console.log(`🚀 Ready: ${status.ready}`);
      console.log(`💬 Status: ${status.message}`);
      console.log('');
      
      if (!status.ready) {
        console.log('🔧 TO FIX:');
        if (!status.configured) {
          console.log('   • Run: goToEmailJSSetup() to configure EmailJS');
        }
        if (status.adminEmails === 0) {
          console.log('   • Set admin emails for notifications');
        }
      } else {
        console.log('🎉 EmailJS is ready for notifications!');
      }
      
      return status;
    } catch (error) {
      console.log('❌ Error checking EmailJS status:', error);
    }
  };
  
  window.testEmailJSEnvironment = async () => {
    try {
      const { displaySafeEmailJSStatus } = await import('./emailjs-env-safe');
      return displaySafeEmailJSStatus();
    } catch (error) {
      console.log('❌ Error with advanced test, trying simple test...');
      try {
        const { simpleEmailJSTest } = await import('./emailjs-test-simple');
        return simpleEmailJSTest();
      } catch (simpleError) {
        console.log('❌ Error testing EmailJS environment:', error);
        console.log('💡 This might be an environment variable access issue');
        console.log('💡 Try: goToEmailJSSetup() for manual configuration');
      }
    }
  };
  
  window.showEmailJSStatus = async () => {
    try {
      const { showEmailJSStatusSummary } = await import('./emailjs-auto-init');
      return await showEmailJSStatusSummary();
    } catch (error) {
      console.log('❌ Error showing EmailJS status:', error);
    }
  };
  
  window.simpleEmailJSTest = async () => {
    try {
      const { simpleEmailJSTest } = await import('./emailjs-test-simple');
      return simpleEmailJSTest();
    } catch (error) {
      console.log('❌ Error running simple EmailJS test:', error);
    }
  };

  // Add function to check Supabase environment variables
  window.checkSupabaseEmailJSVars = async () => {
    console.log('🔍 CHECKING SUPABASE EMAILJS ENVIRONMENT VARIABLES');
    console.log('================================================');
    console.log('');
    
    console.log('Looking for these variables in your Supabase project:');
    console.log('• EMAILJS_SERVICE_ID');
    console.log('• EMAILJS_TEMPLATE_ID');
    console.log('• EMAILJS_PUBLIC_KEY');
    console.log('• EMAILJS_PRIVATE_KEY (optional)');
    console.log('• EMAILJS_FROM_NAME (optional)');
    console.log('• EMAILJS_FROM_EMAIL (optional)');
    console.log('');
    
    // Test via the server endpoint
    try {
      const { projectId, publicAnonKey } = await import('./supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/emailjs-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.emailjs.configured) {
          console.log('🎉 SUCCESS! EmailJS environment variables found and loaded.');
          console.log(`📧 Service ID: ${result.emailjs.serviceId}`);
          console.log(`📧 Template ID: ${result.emailjs.templateId}`);
          console.log(`📧 From Name: ${result.emailjs.fromName}`);
          console.log(`📧 From Email: ${result.emailjs.fromEmail}`);
          console.log(`📧 Source: ${result.emailjs.source}`);
          console.log('💡 EmailJS is configured and ready to use!');
        } else {
          console.log('⚠️ EmailJS environment variables not found or incomplete.');
          console.log('');
          console.log('🔧 TO FIX IN SUPABASE:');
          console.log('1. Go to your Supabase Dashboard');
          console.log('2. Navigate to Settings > Environment Variables');
          console.log('3. Add the missing EmailJS variables');
          console.log('4. Redeploy your project');
        }
      } else {
        console.log('❌ Failed to check server status');
      }
    } catch (error) {
      console.log('❌ Error checking environment variables:', error);
    }
  };
  
  window.testEmailJS = async (testEmail?: string) => {
    try {
      if (!testEmail) {
        testEmail = prompt('Enter email address to test EmailJS:');
        if (!testEmail) {
          console.log('❌ Test cancelled - no email provided');
          return;
        }
      }
      
      console.log(`🧪 Testing EmailJS configuration with email: ${testEmail}`);
      
      // Test via server endpoint
      const response = await fetch(`${window.location.origin}/functions/v1/make-server-764b8bb4/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env?.get?.('SUPABASE_ANON_KEY') || process.env.REACT_APP_SUPABASE_ANON_KEY || ''}`
        },
        body: JSON.stringify({ testEmail })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ EmailJS test successful!');
        console.log(`📧 Method: ${result.method}`);
        console.log('💡 Check your email inbox for the test message');
      } else {
        console.log('❌ EmailJS test failed:', result.message);
        console.log('🔧 Try: goToEmailJSSetup() to configure EmailJS');
      }
      
      return result;
    } catch (error) {
      console.log('❌ Error testing EmailJS:', error);
      console.log('💡 Try: goToEmailJSSetup() to configure manually');
    }
  };

  // Add server-side EmailJS test function
  window.testEmailJSConfiguration = async (testEmail?: string) => {
    try {
      if (!testEmail) {
        testEmail = prompt('Enter email address to test EmailJS server configuration:');
        if (!testEmail) {
          console.log('❌ Test cancelled - no email provided');
          return;
        }
      }
      
      console.log(`🧪 Testing server-side EmailJS configuration with: ${testEmail}`);
      
      // Test via server endpoint
      const response = await fetch(`${window.location.origin}/functions/v1/make-server-764b8bb4/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window?.Deno?.env?.get?.('SUPABASE_ANON_KEY') || 'your-anon-key'}`
        },
        body: JSON.stringify({ testEmail })
      });
      
      const result = await response.json();
      
      console.log('📧 TEST RESULT:');
      console.log(`   Success: ${result.success}`);
      console.log(`   Method: ${result.method}`);
      console.log(`   Message: ${result.message}`);
      
      if (result.success && result.method === 'emailjs') {
        console.log('✅ EmailJS is working! Check your inbox.');
      } else if (result.method === 'console') {
        console.log('⚠️ EmailJS not configured - using console fallback');
        console.log('🔧 Fix: goToEmailJSSetup()');
      } else {
        console.log('❌ Test failed - check your EmailJS configuration');
      }
      
      return result;
    } catch (error) {
      console.log('❌ Error testing EmailJS server configuration:', error);
      console.log('💡 Try: goToEmailJSSetup() to configure EmailJS');
    }
  };

  // Add final cleanup utilities
  window.performFinalCleanup = async () => {
    try {
      const { performFinalCleanup } = await import('./final-cleanup');
      return performFinalCleanup();
    } catch (error) {
      console.log('❌ Error running final cleanup:', error);
    }
  };

  window.showEmailJSMigrationSummary = async () => {
    try {
      const { showEmailJSMigrationSummary } = await import('./final-cleanup');
      return showEmailJSMigrationSummary();
    } catch (error) {
      console.log('❌ Error showing migration summary:', error);
    }
  };

  // Add function to setup EmailJS from Supabase environment
  window.setupEmailJSFromSupabase = () => {
    console.log('📧 SETUP EMAILJS FROM SUPABASE ENVIRONMENT');
    console.log('=========================================');
    console.log('');
    console.log('✅ This system automatically loads EmailJS config from Supabase environment variables:');
    console.log('   • EMAILJS_SERVICE_ID');
    console.log('   • EMAILJS_TEMPLATE_ID');
    console.log('   • EMAILJS_PUBLIC_KEY');
    console.log('   • EMAILJS_PRIVATE_KEY (optional)');
    console.log('   • EMAILJS_FROM_NAME (optional)');
    console.log('   • EMAILJS_FROM_EMAIL (optional)');
    console.log('');
    console.log('🔧 TO SET UP:');
    console.log('1. Go to Supabase Dashboard → Settings → Environment Variables');
    console.log('2. Add the EmailJS variables listed above');
    console.log('3. Redeploy your project');
    console.log('4. The system will automatically detect and use them');
    console.log('');
    console.log('🧪 TO TEST:');
    console.log('• Run: testEmailJSConfiguration("your@email.com")');
    console.log('• Or: goToEmailJSSetup() for manual configuration');
    console.log('');
    console.log('💡 The system will fall back to console logging if EmailJS is not configured');
  };

  // Add the fix email notifications function
  window.fixEmailNotifications = async () => {
    console.log('📧 EMAILJS SYSTEM CHECK AND FIX...');
    console.log('===================================');
    console.log('💡 This will check and configure EmailJS for email notifications');
    console.log('');
    
    // Check EmailJS configuration
    console.log('🔍 Checking EmailJS configuration...');
    
    try {
      // Test EmailJS status
      const status = await window.checkEmailJSStatus?.();
      
      if (status?.ready) {
        console.log('✅ EMAILJS SYSTEM IS WORKING!');
        console.log('📧 EmailJS is properly configured');
        console.log('💡 Try: testEmailJS("your@email.com") to send a test');
        return;
      }
      
      if (!status?.configured) {
        console.log('');
        console.log('❌ EMAILJS NOT CONFIGURED');
        console.log('🔧 Setting up EmailJS...');
        console.log('');
        console.log('🚀 IMMEDIATE SOLUTION:');
        console.log('Run this command to configure EmailJS:');
        console.log('goToEmailJSSetup()');
        console.log('');
        console.log('💡 Or setup from Supabase environment variables:');
        console.log('setupEmailJSFromSupabase()');
        return;
      }
      
    } catch (error) {
      console.log('🔍 Error checking EmailJS, trying basic setup...');
    }
    
    // If basic check failed, guide user to setup
    console.log('');
    console.log('🚀 EMAILJS SETUP REQUIRED:');
    console.log('1. Run: goToEmailJSSetup() - Configure EmailJS manually');
    console.log('2. Or: autoSetupEmailJS() - Auto-setup from environment');
    console.log('3. Then: testEmailJS("your@email.com") - Test configuration');
    console.log('');
    console.log('💡 EmailJS Benefits:');
    console.log('   ✅ No complex API keys needed');
    console.log('   ✅ Works with Gmail, Outlook, Yahoo');
    console.log('   ✅ Simple browser-based setup');
    console.log('   ✅ Malaysian language interface');
  };

  // Add test email submission function
  window.testEmailSubmission = async (testEmail?: string) => {
    try {
      if (!testEmail) {
        testEmail = prompt('Enter email to test submission notification (leave blank to use admin emails):') || undefined;
      }
      
      console.log('📧 TESTING EMAIL SUBMISSION NOTIFICATION');
      console.log('=======================================');
      console.log('');
      console.log('🎯 WHAT THIS TEST DOES:');
      console.log('   ✅ Creates a realistic Malaysian project submission');
      console.log('   💾 Saves the submission to database (will appear in Internal Portal)');
      console.log('   📧 Sends email notifications to ALL admin users');
      console.log('   📊 Shows detailed delivery results and statistics');
      console.log('');
      
      const { projectId, publicAnonKey } = await import('./supabase/info');
      
      console.log('📧 Sending test submission email notification...');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/send-test-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ testEmail: testEmail || '' })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          console.log('✅ TEST EMAIL SUBMISSION SUCCESSFUL!');
          console.log('');
          console.log('📋 SUBMISSION DETAILS:');
          console.log(`   Project: ${result.submissionData.namaProjek}`);
          console.log(`   Department: ${result.submissionData.bahagian}`);
          console.log(`   Officer: ${result.submissionData.namaPegawai}`);
          console.log(`   Email: ${result.submissionData.email}`);
          console.log('');
          console.log('📧 NOTIFICATION RESULT:');
          console.log(`   Method: ${result.notificationResult.method}`);
          console.log(`   Status: ${result.notificationResult.finalStatus}`);
          console.log(`   Recipients: ${result.notificationResult.sent}/${result.notificationResult.total}`);
          
          if (result.notificationResult.attempts && result.notificationResult.attempts.length > 0) {
            console.log('');
            console.log('📝 DELIVERY ATTEMPTS:');
            result.notificationResult.attempts.forEach((attempt: any, index: number) => {
              console.log(`   ${index + 1}. ${attempt.method.toUpperCase()}: ${attempt.success ? '✅ Success' : '❌ Failed'}`);
              console.log(`      Recipients: ${attempt.recipients.join(', ')}`);
              console.log(`      Time: ${new Date(attempt.timestamp).toLocaleString()}`);
              if (attempt.error) {
                console.log(`      Error: ${attempt.error}`);
              }
            });
          }
          
          console.log('');
          if (result.notificationResult.method === 'enhanced-console') {
            console.log('💡 EmailJS configuration detected but using enhanced console logging');
            console.log('💡 Check server logs above for the formatted email content');
          } else {
            console.log('💡 Check your email inbox for the test submission notification');
          }
        } else {
          console.log('❌ TEST EMAIL FAILED');
          console.log(`💬 Error: ${result.error}`);
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Request failed:', response.status, response.statusText);
        console.log('Error details:', errorText);
      }
      
    } catch (error) {
      console.log('❌ Error testing email submission:', error);
      console.log('');
      console.log('🔧 TROUBLESHOOTING:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify server is running: checkServerStatus()');
      console.log('   3. Check EmailJS status: checkEmailJSEnvVars()');
    }
  };

  // Add enhanced notification test
  window.testEnhancedSubmission = async (testEmail?: string) => {
    try {
      if (!testEmail) {
        testEmail = prompt('Enter email for enhanced submission test:') || undefined;
      }
      
      if (!testEmail) {
        console.log('❌ Test cancelled - no email provided');
        return;
      }
      
      console.log('🚀 TESTING ENHANCED SUBMISSION NOTIFICATION');
      console.log('==========================================');
      console.log('');
      console.log('🎯 WHAT THIS ENHANCED TEST DOES:');
      console.log('   ✅ Creates a realistic Malaysian project submission');
      console.log('   💾 Saves to database (appears in Internal Portal)');
      console.log('   📧 Sends notification to your specific test email');
      console.log('   🔄 Uses retry mechanism and detailed audit logging');
      console.log('   📊 Demonstrates enhanced notification features');
      console.log('');
      
      const { projectId, publicAnonKey } = await import('./supabase/info');
      
      console.log(`📧 Sending enhanced notification to: ${testEmail}`);
      
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
          console.log('🚀 ENHANCED FEATURES DEMONSTRATED:');
          console.log(`   Method: ${result.notificationResult.method}`);
          console.log(`   Final Status: ${result.notificationResult.finalStatus}`);
          console.log(`   Success Rate: ${result.notificationResult.sent}/${result.notificationResult.total}`);
          console.log(`   Failed: ${result.notificationResult.failed || 0}`);
          
          if (result.notificationResult.attempts) {
            console.log('');
            console.log('📊 RETRY ATTEMPTS:');
            result.notificationResult.attempts.forEach((attempt: any, index: number) => {
              console.log(`   ${index + 1}. ${attempt.timestamp}: ${attempt.success ? '✅' : '❌'} via ${attempt.method}`);
            });
          }
          
          console.log('');
          console.log('✨ ENHANCED FEATURES ACTIVE:');
          console.log('   ✅ Automatic retry mechanism');
          console.log('   ✅ Email validation');
          console.log('   ✅ Comprehensive audit logging');
          console.log('   ✅ Graceful fallback to console');
          console.log('   ✅ Real-time status tracking');
          
        } else {
          console.log('❌ Enhanced test failed:', result.error);
        }
      } else {
        console.log('❌ Enhanced test request failed:', response.status);
      }
      
    } catch (error) {
      console.log('❌ Enhanced test error:', error);
    }
  };

  // Complete email flow testing
  window.testEmailFlow = async (testEmail?: string) => {
    try {
      if (!testEmail) {
        testEmail = prompt('Enter email address to test complete email flow:');
        if (!testEmail) {
          console.log('❌ Test cancelled - no email provided');
          return;
        }
      }
      
      const { testCompleteEmailFlow } = await import('./test-email-flow');
      return await testCompleteEmailFlow(testEmail);
    } catch (error) {
      console.error('Email flow test failed:', error);
      return { success: false, error };
    }
  };

  // Submission email flow testing  
  window.testSubmissionEmails = async (testEmail?: string) => {
    try {
      const { testSubmissionEmailFlow } = await import('./test-email-flow');
      return await testSubmissionEmailFlow(testEmail);
    } catch (error) {
      console.error('Submission email test failed:', error);
      return { success: false, error };
    }
  };

  // Direct EmailJS configuration testing
  window.testEmailJSDirectConfiguration = async () => {
    try {
      const { testEmailJSDirectConfiguration } = await import('./test-emailjs-direct');
      return await testEmailJSDirectConfiguration();
    } catch (error) {
      console.error('Direct EmailJS test failed:', error);
      return { success: false, error };
    }
  };

  // Quick EmailJS readiness check
  window.quickEmailJSReadinessCheck = async () => {
    try {
      const { quickEmailJSReadinessCheck } = await import('./test-emailjs-direct');
      return quickEmailJSReadinessCheck();
    } catch (error) {
      console.error('EmailJS readiness check failed:', error);
      return { ready: false, message: 'Check failed', actions: [] };
    }
  };

  // Quick function to check who will receive notifications
  window.checkNotificationRecipients = async () => {
    try {
      console.log('👥 CHECKING EMAIL NOTIFICATION RECIPIENTS');
      console.log('=========================================');
      console.log('');
      
      const { projectId, publicAnonKey } = await import('./supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/get-admin-emails`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.emails.length > 0) {
          console.log('✅ EMAIL NOTIFICATIONS ENABLED');
          console.log('');
          console.log(`📧 ADMIN RECIPIENTS (${result.recipients} total):`);
          result.emails.forEach((email: string, index: number) => {
            console.log(`   ${index + 1}. ${email}`);
          });
          console.log('');
          console.log('💡 WHEN YOU SUBMIT OR TEST:');
          console.log('   • All the above admins will receive email notifications');
          console.log('   • Submissions will be saved to the database');
          console.log('   • Notifications include project details in Malaysian');
          console.log('   • Enhanced retry mechanism ensures delivery');
          
        } else {
          console.log('❌ NO EMAIL NOTIFICATIONS');
          console.log('');
          console.log('⚠️  No admin users found for email notifications');
          console.log('');
          console.log('🔧 TO FIX:');
          console.log('   1. Run: emergencySetup()');
          console.log('   2. Or create admin users manually');
          console.log('');
          console.log('💡 CURRENT BEHAVIOR:');
          console.log('   • Submissions will still be saved to database');
          console.log('   • No email notifications will be sent');
          console.log('   • Enhanced console logging will be used instead');
        }
        
      } else {
        console.log('❌ Failed to check admin recipients:', response.status);
      }
      
    } catch (error) {
      console.log('❌ Error checking notification recipients:', error);
    }
  };
};