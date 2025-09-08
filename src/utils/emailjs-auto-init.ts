// EmailJS Auto-Initialization and Testing
import { emailjsService } from './emailjs-service';

// Auto-initialize and test EmailJS on app startup
export const initializeEmailJSOnStartup = async () => {
  try {
    console.log('📧 Initializing EmailJS on app startup...');
    
    // Test environment variables first with safe error handling
    let envTest;
    try {
      const { getAllEmailJSEnvVars } = await import('./emailjs-env-safe');
      envTest = getAllEmailJSEnvVars();
    } catch (envError) {
      console.log('⚠️ Error testing EmailJS environment:', envError);
      return { 
        initialized: false, 
        reason: 'Environment variable access failed',
        error: envError instanceof Error ? envError.message : 'Unknown error',
        suggestion: 'Use goToEmailJSSetup() for manual configuration'
      };
    }
    
    if (!envTest || !envTest.configured) {
      console.log('⚠️ EmailJS not configured - skipping initialization');
      console.log('💡 Set environment variables or use goToEmailJSSetup()');
      console.log('');
      console.log('🔧 REQUIRED ENVIRONMENT VARIABLES:');
      console.log('   • EMAILJS_SERVICE_ID');
      console.log('   • EMAILJS_TEMPLATE_ID');
      console.log('   • EMAILJS_PUBLIC_KEY');
      console.log('   • EMAILJS_PRIVATE_KEY (optional)');
      console.log('   • EMAILJS_FROM_NAME (optional)');
      console.log('   • EMAILJS_FROM_EMAIL (optional)');
      
      return { 
        initialized: false, 
        reason: 'Environment variables not configured',
        missing: envTest ? {
          serviceId: !envTest.variables.serviceId.found,
          templateId: !envTest.variables.templateId.found,
          publicKey: !envTest.variables.publicKey.found
        } : { serviceId: true, templateId: true, publicKey: true }
      };
    }
    
    // Check if service is configured
    if (emailjsService.isConfigured()) {
      console.log('✅ EmailJS service is configured and ready');
      
      // Optional: Test with a silent check (no actual email sent)
      console.log('💡 EmailJS ready for notifications when submissions are created');
      console.log('🧪 To test email sending: testEmailJS("your-email@example.com")');
      
      return { 
        initialized: true, 
        configured: true,
        config: emailjsService.getConfig(),
        testCommand: 'testEmailJS("your-email@example.com")'
      };
    } else {
      console.log('❌ EmailJS service not initialized despite environment variables');
      console.log('🔧 This might indicate an initialization issue');
      console.log('💡 Try running: testEmailJSEnvironment() to debug');
      
      return { 
        initialized: false, 
        reason: 'Service initialization failed',
        suggestion: 'Try testEmailJSEnvironment() then goToEmailJSSetup()'
      };
    }
    
  } catch (error) {
    console.error('💥 Error during EmailJS initialization:', error);
    console.log('🔧 This is likely an environment variable access issue');
    console.log('💡 Try: goToEmailJSSetup() for manual configuration');
    
    return { 
      initialized: false, 
      reason: 'Initialization error',
      error: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Use goToEmailJSSetup() for manual configuration'
    };
  }
};

// Quick EmailJS status summary for console
export const showEmailJSStatusSummary = async () => {
  console.log('📧 EMAILJS STATUS SUMMARY');
  console.log('========================');
  
  const status = await initializeEmailJSOnStartup();
  
  if (status.initialized) {
    console.log('✅ Status: Ready');
    console.log('📤 Will send notifications on new submissions');
    console.log(`🧪 Test command: ${status.testCommand}`);
  } else {
    console.log('❌ Status: Not Ready');
    console.log(`   Reason: ${status.reason}`);
    if (status.suggestion) {
      console.log(`   Solution: ${status.suggestion}`);
    }
    if (status.error) {
      console.log(`   Error: ${status.error}`);
    }
  }
  
  return status;
};