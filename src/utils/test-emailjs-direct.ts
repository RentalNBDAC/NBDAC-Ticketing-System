// Direct EmailJS configuration test
import { emailjsService } from './emailjs-service';

// Test EmailJS configuration directly without complex flows
export const testEmailJSDirectConfiguration = async (): Promise<{
  success: boolean;
  message: string;
  details: any;
}> => {
  
  console.log('🧪 TESTING EMAILJS DIRECT CONFIGURATION');
  console.log('======================================');
  console.log('');

  try {
    // Step 1: Check if service is configured
    console.log('📊 Step 1: Checking EmailJS service configuration...');
    const isConfigured = emailjsService.isConfigured();
    console.log(`   EmailJS Configured: ${isConfigured ? '✅ YES' : '❌ NO'}`);

    if (!isConfigured) {
      console.log('');
      console.log('❌ EMAILJS NOT CONFIGURED');
      console.log('');
      console.log('🔧 IMMEDIATE FIXES:');
      console.log('   1. Check server configuration: checkEmailJSEnvVars()');
      console.log('   2. Manual setup: goToEmailJSSetup()');
      console.log('   3. Environment check: testEmailJSEnvironment()');
      console.log('');

      return {
        success: false,
        message: 'EmailJS service is not configured',
        details: {
          configured: false,
          config: emailjsService.getConfig()
        }
      };
    }

    // Step 2: Get current configuration details
    console.log('📋 Step 2: Getting configuration details...');
    const config = emailjsService.getConfig();
    console.log(`   Service ID: ${config?.serviceId || 'Missing'}`);
    console.log(`   Template ID: ${config?.templateId || 'Missing'}`);
    console.log(`   From Name: ${config?.fromName || 'Default'}`);
    console.log(`   From Email: ${config?.fromEmail || 'Default'}`);
    console.log('');

    // Step 3: Test with a safe test email
    console.log('📧 Step 3: Testing with safe test email...');
    const testEmail = 'test@example.com'; // Safe test email
    
    try {
      const testResult = await emailjsService.testConfiguration(testEmail);
      console.log(`   Test Result: ${testResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
      console.log(`   Message: ${testResult.message}`);
      
      if (testResult.success) {
        console.log('');
        console.log('🎉 EMAILJS CONFIGURATION IS WORKING!');
        console.log('💡 The service is ready to send email notifications');
        console.log('📧 Try with your real email: testEmailFlow("your@email.com")');
        console.log('');

        return {
          success: true,
          message: 'EmailJS configuration is working perfectly!',
          details: {
            configured: true,
            config: config,
            testResult: testResult
          }
        };
      } else {
        console.log('');
        console.log('⚠️ EMAILJS CONFIGURED BUT TEST FAILED');
        console.log(`💬 Error: ${testResult.message}`);
        console.log('');
        console.log('🔧 POSSIBLE FIXES:');
        console.log('   1. Check EmailJS template configuration');
        console.log('   2. Verify service ID and template ID are correct');
        console.log('   3. Check EmailJS dashboard for any errors');
        console.log('');

        return {
          success: false,
          message: `Configuration exists but test failed: ${testResult.message}`,
          details: {
            configured: true,
            config: config,
            testResult: testResult
          }
        };
      }
    } catch (testError) {
      console.log('   ❌ Test failed with error:', testError);
      
      return {
        success: false,
        message: `Test failed: ${testError instanceof Error ? testError.message : 'Unknown error'}`,
        details: {
          configured: true,
          config: config,
          error: testError
        }
      };
    }

  } catch (error) {
    console.error('💥 Direct configuration test failed:', error);
    
    return {
      success: false,
      message: `Configuration test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: {
        error: error
      }
    };
  }
};

// Quick check for EmailJS readiness
export const quickEmailJSReadinessCheck = (): {
  ready: boolean;
  message: string;
  actions: string[];
} => {
  
  console.log('⚡ QUICK EMAILJS READINESS CHECK');
  console.log('===============================');
  console.log('');

  const isConfigured = emailjsService.isConfigured();
  const config = emailjsService.getConfig();

  console.log(`📊 Configured: ${isConfigured ? '✅ YES' : '❌ NO'}`);
  
  if (isConfigured && config) {
    console.log(`📋 Service ID: ${config.serviceId}`);
    console.log(`📋 Template ID: ${config.templateId}`);
    console.log(`📧 From Name: ${config.fromName}`);
    console.log('');
    console.log('✅ EMAILJS IS READY!');
    console.log('🧪 Test now: testEmailJSDirectConfiguration()');
    console.log('📧 Send test: testEmailFlow("your@email.com")');
    console.log('');

    return {
      ready: true,
      message: 'EmailJS is configured and ready to send emails',
      actions: [
        'testEmailJSDirectConfiguration() - Test configuration',
        'testEmailFlow("your@email.com") - Send test email',
        'testSubmissionEmails() - Test submission notifications'
      ]
    };
  } else {
    console.log('❌ EMAILJS NOT READY');
    console.log('');
    console.log('🔧 QUICK FIXES:');
    console.log('   1. Run: goToEmailJSSetup()');
    console.log('   2. Check: checkEmailJSEnvVars()');
    console.log('   3. Status: testEmailJSEnvironment()');
    console.log('');

    return {
      ready: false,
      message: 'EmailJS is not configured',
      actions: [
        'goToEmailJSSetup() - Configure EmailJS manually',
        'checkEmailJSEnvVars() - Check server environment variables',
        'testEmailJSEnvironment() - Check client environment',
        'masterSystemFix() - Complete system setup'
      ]
    };
  }
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).testEmailJSDirectConfiguration = testEmailJSDirectConfiguration;
  (window as any).quickEmailJSReadinessCheck = quickEmailJSReadinessCheck;
  
  console.log('🧪 Direct EmailJS test functions added:');
  console.log('   testEmailJSDirectConfiguration() - Test configuration');
  console.log('   quickEmailJSReadinessCheck() - Check readiness');
}