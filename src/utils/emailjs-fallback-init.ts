// EmailJS Fallback Initialization - Safe startup without environment variable dependencies

export const safeEmailJSInitialization = () => {
  console.log('📧 Safe EmailJS initialization...');
  
  try {
    // Just log that EmailJS is available for manual setup
    console.log('💡 EmailJS service available for configuration');
    console.log('🔧 Use goToEmailJSSetup() to configure email notifications');
    console.log('🧪 Use testEmailJSEnvironment() to check environment variables');
    
    return {
      status: 'available',
      message: 'EmailJS ready for manual configuration',
      setupCommand: 'goToEmailJSSetup()',
      testCommand: 'testEmailJSEnvironment()'
    };
  } catch (error) {
    console.warn('EmailJS fallback initialization error:', error);
    return {
      status: 'error',
      message: 'EmailJS initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Minimal EmailJS status check that doesn't access environment variables
export const getEmailJSBasicStatus = () => {
  try {
    // Import the service safely
    import('./emailjs-service').then(({ emailjsService }) => {
      if (emailjsService.isConfigured()) {
        console.log('✅ EmailJS: Configured and ready');
      } else {
        console.log('⚠️ EmailJS: Not configured');
        console.log('💡 Use: goToEmailJSSetup()');
      }
    }).catch(() => {
      console.log('⚠️ EmailJS: Service not available');
    });
  } catch (error) {
    console.log('⚠️ EmailJS: Status check failed');
  }
};