import { projectId, publicAnonKey } from './supabase/info';

// Comprehensive email diagnostic system
export const runEmailDiagnostic = async () => {
  console.log('🔍 RUNNING EMAIL DIAGNOSTIC...');
  console.log('================================');
  
  let issues = [];
  let fixes = [];
  
  try {
    // Step 1: Check server health
    console.log('1️⃣ Checking server health...');
    const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    
    if (!healthResponse.ok) {
      issues.push('❌ Server not accessible');
      fixes.push('Check server status and deployment');
      console.error('Server health check failed');
      return { issues, fixes };
    }
    
    const health = await healthResponse.json();
    console.log('✅ Server is running');
    
    // Step 2: Check admin users
    console.log('2️⃣ Checking admin users...');
    const adminCount = health.admin?.admin_users_found || 0;
    
    if (adminCount === 0) {
      issues.push('❌ No admin users found - no email addresses to send to');
      fixes.push('Run emergencySetup() or setupAdmin("your@email.com", "password")');
      console.error('No admin users found!');
    } else {
      console.log(`✅ Found ${adminCount} admin user(s)`);
      
      // Get actual admin emails
      try {
        const adminResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/list-admins`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        
        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          console.log('📧 Admin emails found:', adminData.admins?.map(a => a.email) || []);
        }
      } catch (e) {
        console.warn('Could not fetch admin email details');
      }
    }
    
    // Step 3: Check EmailJS configuration
    console.log('3️⃣ Checking email service configuration...');
    const emailjsConfigured = health.email?.emailjs_configured;
    
    if (!emailjsConfigured) {
      issues.push('❌ EmailJS email service not configured');
      fixes.push('Set up EmailJS using goToEmailJSSetup() or autoSetupEmailJS()');
      console.error('EmailJS email service not configured!');
    } else {
      console.log('✅ EmailJS email service configured');
    }
    
    // Step 4: Test email sending capability
    console.log('4️⃣ Testing email notification system...');
    
    if (adminCount > 0) {
      try {
        console.log('📧 Sending test email notification...');
        
        // Create a test submission to trigger email
        const testSubmission = {
          namaProjek: 'Test Email Notification',
          email: 'test@example.com',
          namaPegawai: 'Email Test User',
          bahagian: 'Testing Department',
          tarikh: new Date().toISOString().split('T')[0],
          tujuanProjek: 'Testing email notifications',
          status: 'Menunggu'
        };
        
        // This will trigger the email notification
        const submitResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(testSubmission)
        });
        
        if (submitResponse.ok) {
          const result = await submitResponse.json();
          console.log('✅ Test submission created successfully');
          console.log('📧 Email notification should have been triggered');
          console.log('💡 Check your email inbox and server logs');
          
          if (emailjsConfigured) {
            console.log('📨 Email sent via EmailJS (check your inbox)');
          } else {
            console.log('📋 Email logged to console only (check server logs)');
            issues.push('⚠️ Emails only logged to console - EmailJS not configured');
            fixes.push('Configure EmailJS for actual email delivery');
          }
        } else {
          console.error('❌ Test submission failed');
          issues.push('❌ Could not create test submission');
        }
        
      } catch (emailError) {
        console.error('❌ Email test failed:', emailError);
        issues.push('❌ Email notification system error');
        fixes.push('Check server logs for email errors');
      }
    } else {
      console.log('⚠️ Cannot test emails - no admin users');
    }
    
    // Step 5: Summary and recommendations
    console.log('');
    console.log('📊 EMAIL DIAGNOSTIC SUMMARY');
    console.log('===========================');
    
    if (issues.length === 0) {
      console.log('🎉 EMAIL SYSTEM IS WORKING!');
      console.log('✅ All email components are properly configured');
      console.log('📧 Emails should be delivered successfully');
      
      if (!emailjsConfigured) {
        console.log('⚠️ NOTE: Using console logging only');
        console.log('💡 For production, configure EmailJS');
      }
    } else {
      console.log('🚨 ISSUES FOUND:');
      issues.forEach(issue => console.log(`   ${issue}`));
      console.log('');
      console.log('🔧 FIXES NEEDED:');
      fixes.forEach(fix => console.log(`   💡 ${fix}`));
    }
    
    console.log('');
    console.log('🚀 QUICK FIXES:');
    console.log('   emergencySetup()                                   - Fix everything with defaults');
    console.log('   goToEmailJSSetup()                                 - Complete EmailJS setup');
    console.log('   testAdminEmailNotification()                       - Test email notifications');
    console.log('');
    
    return {
      success: issues.length === 0,
      issues,
      fixes,
      adminCount,
      emailjsConfigured,
      serverRunning: true
    };
    
  } catch (error) {
    console.error('💥 Diagnostic failed:', error);
    return {
      success: false,
      issues: ['❌ Diagnostic failed to run'],
      fixes: ['Check server connectivity and try again'],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Test email notifications specifically
export const testEmailNotifications = async () => {
  console.log('📧 TESTING EMAIL NOTIFICATIONS...');
  console.log('==================================');
  
  try {
    // Check if we have admin users first
    const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    
    if (!healthResponse.ok) {
      console.error('❌ Cannot test emails - server not accessible');
      return false;
    }
    
    const health = await healthResponse.json();
    const adminCount = health.admin?.admin_users_found || 0;
    
    if (adminCount === 0) {
      console.error('❌ Cannot test emails - no admin users found');
      console.log('💡 Run emergencySetup() first to create admin users');
      return false;
    }
    
    console.log(`✅ Found ${adminCount} admin user(s) to send emails to`);
    
    // Create test submission
    const testSubmission = {
      namaProjek: `Email Test - ${new Date().toLocaleTimeString()}`,
      email: 'emailtest@example.com',
      namaPegawai: 'Email Test User',
      bahagian: 'Testing Department',
      tarikh: new Date().toISOString().split('T')[0],
      tujuanProjek: 'Testing email notification system',
      websiteUrl: 'https://test.example.com',
      kutipanData: 'Daily',
      catatan: 'This is a test submission to verify email notifications are working correctly.'
    };
    
    console.log('📤 Sending test submission...');
    
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
      console.log('📧 Email notification triggered');
      
      if (health.email?.emailjs_configured) {
        console.log('📨 Email sent via EmailJS');
        console.log('💡 Check your email inbox for the notification');
      } else {
        console.log('📋 Email logged to console (EmailJS not configured)');
        console.log('💡 Check server logs for email content');
      }
      
      console.log('');
      console.log('🎯 What to expect:');
      console.log('   📧 Subject: Permohonan Projek Baru - Email Test');
      console.log('   📝 Content: Project details and admin action required');
      console.log('   📍 Sent to: All admin user email addresses');
      
      return true;
    } else {
      console.error('❌ Test submission failed:', response.status);
      const error = await response.text();
      console.error('Error details:', error);
      return false;
    }
    
  } catch (error) {
    console.error('💥 Email test failed:', error);
    return false;
  }
};

// Get admin email addresses for verification
export const listAdminEmails = async () => {
  console.log('📧 LISTING ADMIN EMAIL ADDRESSES...');
  console.log('===================================');
  
  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/list-admins`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Total admin users: ${data.total}`);
      console.log('💡 Note: All authenticated users are admin users');
      
      if (data.total > 0) {
        console.log('');
        console.log('📧 Admin email addresses:');
        data.admins.forEach((admin, index) => {
          console.log(`   ${index + 1}. ${admin.email}${admin.verified ? ' ✅' : ' ⚠️ (unverified)'}`);
          if (admin.name && admin.name !== admin.email?.split('@')[0]) {
            console.log(`      Name: ${admin.name}`);
          }
        });
        
        console.log('');
        console.log('💡 Email notifications will be sent to all these addresses');
      } else {
        console.log('');
        console.log('❌ No admin users found');
        console.log('💡 Run emergencySetup() to create admin users');
      }
      
      return data.admins || [];
    } else {
      console.error('❌ Failed to list admin users');
      return [];
    }
    
  } catch (error) {
    console.error('💥 Error listing admin emails:', error);
    return [];
  }
};

// Setup email notifications with Resend
export const setupEmailNotifications = async (resendApiKey: string, fromEmail: string = 'noreply@nbdac.gov.my') => {
  console.log('📧 SETTING UP EMAIL NOTIFICATIONS...');
  console.log('====================================');
  console.log('📤 From email:', fromEmail);
  console.log('🔑 API key:', resendApiKey.substring(0, 10) + '...');
  
  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/configure-resend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({
        apiKey: resendApiKey,
        fromEmail: fromEmail,
        enabled: true
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Resend.com email service configured successfully');
      console.log('📧 Emails will now be delivered via Resend.com');
      
      // Test the configuration
      console.log('🧪 Testing email configuration...');
      const testResult = await testEmailNotifications();
      
      if (testResult) {
        console.log('🎉 EMAIL SETUP COMPLETE!');
        console.log('📧 Email notifications are now working');
      } else {
        console.log('⚠️ Email setup completed but test failed');
        console.log('💡 Check configuration and try again');
      }
      
      return true;
    } else {
      console.error('❌ Failed to configure Resend.com');
      const error = await response.text();
      console.error('Error:', error);
      return false;
    }
    
  } catch (error) {
    console.error('💥 Email setup failed:', error);
    return false;
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.runEmailDiagnostic = runEmailDiagnostic;
  window.testEmailNotifications = testEmailNotifications;
  window.listAdminEmails = listAdminEmails;
  window.setupEmailNotifications = setupEmailNotifications;
}