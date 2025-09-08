// Simple EmailJS Test - Minimal template parameters to identify issues
import emailjs from '@emailjs/browser';

// Test with the absolute minimum parameters
export const testMinimalEmailJS = async (
  serviceId: string, 
  templateId: string, 
  publicKey: string,
  recipientEmail: string
): Promise<{ success: boolean; error?: string; method: string }> => {
  
  console.log('🧪 TESTING MINIMAL EMAILJS CONFIGURATION');
  console.log('=======================================');
  console.log(`Service ID: ${serviceId}`);
  console.log(`Template ID: ${templateId}`);
  console.log(`Recipient: ${recipientEmail}`);
  console.log('');

  // Initialize EmailJS
  try {
    emailjs.init({ publicKey });
    console.log('✅ EmailJS initialized');
  } catch (error) {
    console.error('❌ EmailJS initialization failed:', error);
    return { success: false, error: 'EmailJS initialization failed', method: 'init' };
  }

  // Test different parameter variations
  const testVariations = [
    {
      name: 'Method 1: to_email only',
      params: {
        to_email: recipientEmail,
        subject: 'Test - Method 1',
        message: 'Testing with to_email field only'
      }
    },
    {
      name: 'Method 2: recipient_email only', 
      params: {
        recipient_email: recipientEmail,
        subject: 'Test - Method 2',
        message: 'Testing with recipient_email field only'
      }
    },
    {
      name: 'Method 3: user_email only',
      params: {
        user_email: recipientEmail,
        subject: 'Test - Method 3', 
        message: 'Testing with user_email field only'
      }
    },
    {
      name: 'Method 4: All recipient fields',
      params: {
        to_email: recipientEmail,
        recipient_email: recipientEmail,
        user_email: recipientEmail,
        email: recipientEmail,
        to_name: 'Test User',
        subject: 'Test - Method 4',
        message: 'Testing with all possible recipient fields'
      }
    },
    {
      name: 'Method 5: Standard Gmail template',
      params: {
        to_email: recipientEmail,
        to_name: 'Test User',
        from_name: 'Sistem NBDAC',
        subject: 'Test Email',
        html_content: '<p>This is a test email</p>',
        message: 'This is a test email from Sistem NBDAC'
      }
    }
  ];

  for (const variation of testVariations) {
    console.log(`\n🔍 Testing ${variation.name}...`);
    console.log('Parameters:', variation.params);
    
    try {
      const response = await emailjs.send(serviceId, templateId, variation.params);
      
      if (response.status === 200) {
        console.log(`✅ SUCCESS with ${variation.name}`);
        console.log(`📧 Email should be sent to: ${recipientEmail}`);
        return { 
          success: true, 
          method: variation.name 
        };
      } else {
        console.log(`❌ Failed with ${variation.name}:`, response);
      }
    } catch (error) {
      console.log(`💥 Error with ${variation.name}:`, error);
      
      // If this is the last variation, return the error
      if (variation === testVariations[testVariations.length - 1]) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          method: variation.name
        };
      }
    }
  }

  return { 
    success: false, 
    error: 'All test variations failed',
    method: 'all_methods'
  };
};

// Quick test with user's current EmailJS config
export const quickEmailJSTemplateTest = async (testEmail: string): Promise<void> => {
  try {
    console.log('⚡ QUICK EMAILJS TEMPLATE TEST');
    console.log('=============================');
    console.log('');

    // Get EmailJS configuration
    const { emailjsService } = await import('./emailjs-service');
    
    if (!emailjsService.isConfigured()) {
      console.log('❌ EmailJS not configured');
      console.log('💡 Configure first: goToEmailJSSetup()');
      return;
    }

    const config = emailjsService.getConfig();
    if (!config || !config.serviceId || !config.templateId) {
      console.log('❌ EmailJS configuration incomplete');
      return;
    }

    // Import the service info to get public key
    const { projectId, publicAnonKey } = await import('./supabase/info');
    
    // Get full config from server
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/get-full-emailjs-config`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log('❌ Could not get full EmailJS config from server');
      return;
    }

    const configResult = await response.json();
    
    if (!configResult.success || !configResult.config) {
      console.log('❌ Invalid EmailJS config response');
      return;
    }

    const fullConfig = configResult.config;
    
    console.log('📧 Testing with configuration:');
    console.log(`   Service ID: ${fullConfig.serviceId}`);
    console.log(`   Template ID: ${fullConfig.templateId}`);
    console.log(`   Recipient: ${testEmail}`);
    console.log('');

    // Run the minimal test
    const result = await testMinimalEmailJS(
      fullConfig.serviceId,
      fullConfig.templateId, 
      fullConfig.publicKey,
      testEmail
    );

    console.log('');
    console.log('🏁 FINAL RESULT:');
    console.log(`   Success: ${result.success ? '✅' : '❌'}`);
    console.log(`   Method: ${result.method}`);
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    
    if (result.success) {
      console.log('');
      console.log('🎉 EMAIL TEMPLATE IS WORKING!');
      console.log('💡 Check your email inbox for the test message');
    } else {
      console.log('');
      console.log('❌ EMAIL TEMPLATE NEEDS FIXING');
      console.log('');
      console.log('🔧 COMMON FIXES:');
      console.log('1. Check your EmailJS template has {{to_email}} field');
      console.log('2. Verify template ID is correct in EmailJS dashboard');
      console.log('3. Ensure email service (Gmail/Outlook) is connected');
      console.log('4. Try creating a new simple template with just {{to_email}}, {{subject}}, {{message}}');
    }

  } catch (error) {
    console.error('💥 Quick test error:', error);
  }
};