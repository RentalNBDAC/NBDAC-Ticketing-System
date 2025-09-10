/**
 * Email Testing Utility
 * 
 * This utility helps test email notifications independently.
 * Can be used to verify Resend API configuration.
 */

interface EmailTestConfig {
  apiKey: string;
  testEmail: string;
  projectId?: string;
}

export const testEmailSetup = async (config: EmailTestConfig): Promise<boolean> => {
  try {
    console.log('🧪 Testing email configuration...');
    
    // Test email data
    const emailData = {
      from: 'NBDAC Test <notifications@resend.dev>',
      to: [config.testEmail],
      subject: '🧪 NBDAC Email Test - Setup Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #0369a1; margin: 0 0 10px 0;">✅ Email Setup Test Successful!</h2>
            <p style="color: #075985; margin: 0;">Your NBDAC email notification system is working correctly.</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Test Details:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
              <li><strong>API Status:</strong> Connected</li>
              <li><strong>Delivery:</strong> Successful</li>
              ${config.projectId ? `<li><strong>Project ID:</strong> ${config.projectId}</li>` : ''}
            </ul>
          </div>
          
          <div style="background-color: #dcfce7; border: 1px solid #16a34a; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #15803d; margin-top: 0;">🎉 What This Means:</h4>
            <p style="color: #166534; margin: 5px 0;">
              • Your Resend API key is configured correctly<br>
              • Email delivery is working<br>
              • Admin notifications will be sent for new submissions<br>
              • The system is ready for production use
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0; padding: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              <strong>Sistem Permohonan Projek Web Scraping NBDAC</strong><br>
              Email Notification Test - ${new Date().toLocaleDateString('ms-MY')}
            </p>
          </div>
        </div>
      `,
    };

    console.log('📧 Sending test email to:', config.testEmail);

    // Send test email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Email test failed:', response.status, errorData);
      return false;
    }

    const result = await response.json();
    console.log('✅ Test email sent successfully!');
    console.log('📧 Email ID:', result.id);
    console.log('🔗 Check your inbox for the test email');
    
    return true;
  } catch (error) {
    console.error('💥 Email test error:', error);
    return false;
  }
};

// Helper function to validate API key format
export const validateApiKey = (apiKey: string): boolean => {
  if (!apiKey) {
    console.error('❌ API key is required');
    return false;
  }
  
  if (!apiKey.startsWith('re_')) {
    console.error('❌ Invalid API key format. Resend keys should start with "re_"');
    return false;
  }
  
  if (apiKey.length < 20) {
    console.error('❌ API key appears to be too short');
    return false;
  }
  
  console.log('✅ API key format looks valid');
  return true;
};

// Helper function to validate email address
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    console.error('❌ Invalid email address format');
    return false;
  }
  
  console.log('✅ Email address format is valid');
  return true;
};

// Complete test workflow
export const runEmailTest = async (apiKey: string, testEmail: string, projectId?: string): Promise<void> => {
  console.log('🚀 Starting NBDAC Email Test...\n');
  
  // Validate inputs
  if (!validateApiKey(apiKey)) return;
  if (!validateEmail(testEmail)) return;
  
  // Run test
  const success = await testEmailSetup({ apiKey, testEmail, projectId });
  
  if (success) {
    console.log('\n🎉 Email test completed successfully!');
    console.log('📧 Check your email inbox for the test message');
    console.log('✅ Your NBDAC email notification system is ready!');
  } else {
    console.log('\n❌ Email test failed');
    console.log('🔍 Please check:');
    console.log('   • API key is correct and active');
    console.log('   • Email address is valid');
    console.log('   • Internet connection is working');
    console.log('   • Resend service is operational');
  }
};

// Usage example (for testing in browser console):
/*
// Basic test
await runEmailTest('re_your_api_key_here', 'your-email@example.com');

// With project ID
await runEmailTest('re_your_api_key_here', 'admin@company.com', 'your-supabase-project-id');
*/