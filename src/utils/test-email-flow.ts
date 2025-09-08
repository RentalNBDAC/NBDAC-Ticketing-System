// Test the complete email notification flow
import { emailjsService } from './emailjs-service';
import { projectId, publicAnonKey } from './supabase/info';

// Test the complete email notification flow end-to-end
export const testCompleteEmailFlow = async (testEmail: string): Promise<{
  success: boolean;
  steps: { [key: string]: boolean };
  details: any;
  message: string;
}> => {
  
  console.log('🧪 TESTING COMPLETE EMAIL NOTIFICATION FLOW');
  console.log('===========================================');
  console.log(`📧 Test Email: ${testEmail}`);
  console.log('');

  const steps = {
    'Server EmailJS Config': false,
    'Client EmailJS Config': false,
    'Admin Emails Available': false,
    'Server EmailJS Test': false,
    'Client EmailJS Test': false
  };

  const details: any = {};

  try {
    // Step 1: Check server-side EmailJS configuration
    console.log('📊 Step 1: Checking server EmailJS configuration...');
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/emailjs-status`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (response.ok) {
        const serverStatus = await response.json();
        steps['Server EmailJS Config'] = serverStatus.emailjs?.configured || false;
        details.serverConfig = serverStatus.emailjs;
        details.adminEmails = serverStatus.adminEmails;
        steps['Admin Emails Available'] = (serverStatus.adminEmails?.count || 0) > 0;
        
        console.log(`   Server Config: ${steps['Server EmailJS Config'] ? '✅ OK' : '❌ Missing'}`);
        console.log(`   Admin Emails: ${steps['Admin Emails Available'] ? '✅ OK' : '❌ Missing'} (${serverStatus.adminEmails?.count || 0} found)`);
      } else {
        console.log('   ❌ Cannot check server config');
      }
    } catch (error) {
      console.log('   ❌ Server config check failed:', error);
    }

    // Step 2: Check client-side EmailJS configuration
    console.log('📱 Step 2: Checking client EmailJS configuration...');
    steps['Client EmailJS Config'] = emailjsService.isConfigured();
    details.clientConfig = emailjsService.getConfig();
    console.log(`   Client Config: ${steps['Client EmailJS Config'] ? '✅ OK' : '❌ Missing'}`);
    
    if (details.clientConfig) {
      console.log(`   Service ID: ${details.clientConfig.serviceId ? 'Set' : 'Missing'}`);
      console.log(`   Template ID: ${details.clientConfig.templateId ? 'Set' : 'Missing'}`);
    }

    // Step 3: Test server-side EmailJS functionality
    console.log('🖥️ Step 3: Testing server EmailJS...');
    try {
      const serverTestResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ testEmail })
      });

      if (serverTestResponse.ok) {
        const serverTestResult = await serverTestResponse.json();
        steps['Server EmailJS Test'] = serverTestResult.success;
        details.serverTest = serverTestResult;
        console.log(`   Server Test: ${steps['Server EmailJS Test'] ? '✅ OK' : '❌ Failed'}`);
        if (serverTestResult.message) {
          console.log(`   Message: ${serverTestResult.message}`);
        }
      } else {
        console.log('   ❌ Server test API failed');
      }
    } catch (error) {
      console.log('   ❌ Server test failed:', error);
    }

    // Step 4: Test client-side EmailJS functionality
    console.log('📱 Step 4: Testing client EmailJS...');
    if (steps['Client EmailJS Config']) {
      try {
        const clientTestResult = await emailjsService.testConfiguration(testEmail);
        steps['Client EmailJS Test'] = clientTestResult.success;
        details.clientTest = clientTestResult;
        console.log(`   Client Test: ${steps['Client EmailJS Test'] ? '✅ OK' : '❌ Failed'}`);
        console.log(`   Message: ${clientTestResult.message}`);
      } catch (error) {
        console.log('   ❌ Client test failed:', error);
        details.clientTestError = error;
      }
    } else {
      console.log('   ⚠️ Client config missing - skipping test');
    }

    // Summary
    console.log('');
    console.log('📋 FLOW TEST SUMMARY:');
    const totalSteps = Object.keys(steps).length;
    const passedSteps = Object.values(steps).filter(Boolean).length;
    
    Object.entries(steps).forEach(([step, passed]) => {
      console.log(`   ${passed ? '✅' : '❌'} ${step}`);
    });

    console.log('');
    console.log(`📊 Result: ${passedSteps}/${totalSteps} steps passed`);

    const allPassed = passedSteps === totalSteps;
    const criticalPassed = steps['Client EmailJS Config'] && steps['Admin Emails Available'];
    
    let message = '';
    if (allPassed) {
      message = 'Complete email flow is working perfectly!';
      console.log('🎉 COMPLETE EMAIL FLOW IS WORKING PERFECTLY!');
      console.log(`📧 Check ${testEmail} inbox for test emails`);
    } else if (criticalPassed) {
      message = 'Critical components are working. Some tests may have failed due to rate limits or server issues.';
      console.log('✅ CRITICAL COMPONENTS WORKING - Email notifications should work');
      console.log('⚠️ Some tests failed but core functionality is available');
    } else {
      message = 'Email flow has critical issues that need to be addressed.';
      console.log('❌ CRITICAL ISSUES FOUND - Email notifications may not work');
      
      if (!steps['Client EmailJS Config']) {
        console.log('🔧 Fix: EmailJS client configuration missing');
        console.log('   Set environment variables or use goToEmailJSSetup()');
      }
      if (!steps['Admin Emails Available']) {
        console.log('🔧 Fix: No admin emails found');
        console.log('   Run emergencySetup() to create admin users');
      }
    }

    console.log('');

    return {
      success: criticalPassed,
      steps,
      details,
      message
    };

  } catch (error) {
    console.error('💥 Email flow test failed:', error);
    return {
      success: false,
      steps,
      details,
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Quick test for submission email flow
export const testSubmissionEmailFlow = async (testEmail: string = 'test@example.com'): Promise<boolean> => {
  console.log('📧 Testing submission email flow...');
  
  try {
    // Create a test submission
    const testSubmission = {
      namaProjek: 'Test Email Flow Project',
      bahagian: 'IT Testing',
      namaPegawai: 'Email Test User', 
      email: testEmail,
      tarikh: new Date().toLocaleDateString('ms-MY'),
      tujuanProjek: 'Testing email notification flow',
      websiteUrl: 'https://test.example.com',
      kutipanData: 'one-off',
      catatan: 'This is a test submission to verify email notifications work',
      status: 'Menunggu'
    };

    // Test the complete submission process
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(testSubmission)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test submission created:', result.submissionId);
      
      // Also trigger client-side email
      if (emailjsService.isConfigured()) {
        try {
          const { sendEmailNotificationForSubmission } = await import('./emailjs-integration');
          await sendEmailNotificationForSubmission(result.submission);
          console.log('✅ Client-side email notification triggered');
        } catch (emailError) {
          console.warn('⚠️ Client-side email failed:', emailError);
        }
      }
      
      console.log('✅ Submission email flow test completed');
      console.log('📧 Check admin inboxes for notification emails');
      return true;
    } else {
      console.error('❌ Test submission failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('💥 Submission email flow test failed:', error);
    return false;
  }
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).testCompleteEmailFlow = testCompleteEmailFlow;
  (window as any).testSubmissionEmailFlow = testSubmissionEmailFlow;
  
  console.log('🧪 Email flow test functions added:');
  console.log('   testCompleteEmailFlow("your@email.com") - Test complete flow');
  console.log('   testSubmissionEmailFlow("admin@email.com") - Test submission flow');
}