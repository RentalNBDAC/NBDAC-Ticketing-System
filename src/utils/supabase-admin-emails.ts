// Supabase Admin Email Utilities - Shows admin recipients from Supabase auth
import { projectId, publicAnonKey } from './supabase/info';

// Display admin notification recipients (all users in Supabase auth)
export const showAdminNotificationRecipients = async (): Promise<void> => {
  console.log('👥 ADMIN NOTIFICATION RECIPIENTS');
  console.log('===============================');
  console.log('💡 Fetching all admin emails from Supabase authentication...');
  console.log('💡 Note: ALL authenticated users are admin users');
  console.log('');

  try {
    // Get admin emails from server (which fetches from Supabase auth)
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/get-admin-emails`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('❌ Failed to fetch admin emails');
      console.error(`Status: ${response.status} ${response.statusText}`);
      return;
    }

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Total admin recipients: ${result.recipients || result.emails.length}`);
      console.log(`📧 Source: ${result.source || 'server'}`);
      
      if (result.emails && result.emails.length > 0) {
        console.log('');
        console.log('📧 Admin notification recipients:');
        result.emails.forEach((email: string, index: number) => {
          console.log(`   ${index + 1}. ${email}`);
        });
        
        console.log('');
        console.log('✅ All project submission notifications will be sent to these emails');
        console.log('💡 When users submit project requests, all these admin users will receive email notifications');
      } else {
        console.log('');
        console.log('❌ No admin recipients found!');
        console.log('💡 No users exist in Supabase authentication');
        console.log('🔧 Fix: Run emergencySetup() to create admin users');
        console.log('🔧 Or create users manually in Supabase Dashboard → Authentication → Users');
      }
    } else {
      console.error('❌ API error:', result.error || 'Unknown error');
      if (result.message) {
        console.log(`💡 ${result.message}`);
      }
    }

  } catch (error) {
    console.error('💥 Error fetching admin recipients:', error);
    console.log('');
    console.log('🔧 TROUBLESHOOTING:');
    console.log('   1. Check server connectivity');
    console.log('   2. Verify Supabase configuration');
    console.log('   3. Try: emergencySetup() to create admin users');
  }
};

// Check email notification status
export const checkEmailNotificationStatus = async (): Promise<void> => {
  console.log('📧 EMAIL NOTIFICATION STATUS CHECK');
  console.log('=================================');
  console.log('');

  try {
    // Check EmailJS status
    const emailjsResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/emailjs-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (emailjsResponse.ok) {
      const emailjsStatus = await emailjsResponse.json();
      
      console.log('📧 EmailJS Configuration:');
      console.log(`   Status: ${emailjsStatus.emailjs?.configured ? '✅ Configured' : '❌ Not Configured'}`);
      if (emailjsStatus.emailjs?.serviceId) {
        console.log(`   Service ID: ${emailjsStatus.emailjs.serviceId}`);
      }
      if (emailjsStatus.emailjs?.templateId) {
        console.log(`   Template ID: ${emailjsStatus.emailjs.templateId}`);
      }
      
      console.log('');
      console.log('👥 Admin Recipients:');
      console.log(`   Count: ${emailjsStatus.adminEmails?.count || 0} recipient(s)`);
      console.log(`   Source: ${emailjsStatus.adminEmails?.source || 'unknown'}`);
      
      if (emailjsStatus.adminEmails?.emails && emailjsStatus.adminEmails.emails.length > 0) {
        console.log('   Emails:');
        emailjsStatus.adminEmails.emails.forEach((email: string, index: number) => {
          console.log(`     ${index + 1}. ${email}`);
        });
      }
      
      console.log('');
      console.log(`🚀 Overall Status: ${emailjsStatus.ready ? '✅ Ready for notifications' : '❌ Setup required'}`);
      
      if (!emailjsStatus.ready) {
        console.log('');
        console.log('🔧 SETUP REQUIRED:');
        if (!emailjsStatus.emailjs?.configured) {
          console.log('   • Configure EmailJS: goToEmailJSSetup()');
        }
        if (emailjsStatus.adminEmails?.count === 0) {
          console.log('   • Create admin users: emergencySetup()');
        }
      }
    } else {
      console.error('❌ Failed to check EmailJS status');
    }

  } catch (error) {
    console.error('💥 Error checking email notification status:', error);
  }
};

// Test admin email notification
export const testAdminEmailNotification = async (testEmail?: string): Promise<void> => {
  console.log('🧪 TESTING ADMIN EMAIL NOTIFICATION');
  console.log('==================================');
  console.log('');

  if (!testEmail) {
    // Get a test email from user
    if (typeof window !== 'undefined') {
      testEmail = prompt('Enter your email address to test admin notifications:') || undefined;
    }
    
    if (!testEmail) {
      console.log('❌ Test cancelled - no email provided');
      console.log('💡 Usage: testAdminEmailNotification("your@email.com")');
      return;
    }
  }

  try {
    console.log(`📧 Testing with email: ${testEmail}`);
    console.log('📤 Sending test notification...');

    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/test-email`, {
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
        console.log('✅ TEST SUCCESSFUL!');
        console.log(`📧 Method: ${result.method}`);
        console.log(`💬 Message: ${result.message}`);
        
        if (result.admin_emails && result.admin_emails.length > 0) {
          console.log('');
          console.log('👥 Notifications sent to admin emails:');
          result.admin_emails.forEach((email: string, index: number) => {
            console.log(`   ${index + 1}. ${email}`);
          });
        }
        
        console.log('');
        console.log('💡 Check your email inbox (including spam folder)');
      } else {
        console.log('❌ TEST FAILED');
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
    console.error('💥 Test error:', error);
  }
};

// Make functions available globally for console use
if (typeof window !== 'undefined') {
  (window as any).showAdminNotificationRecipients = showAdminNotificationRecipients;
  (window as any).checkEmailNotificationStatus = checkEmailNotificationStatus;
  (window as any).testAdminEmailNotification = testAdminEmailNotification;
  
  // Short aliases
  (window as any).listAdminRecipients = showAdminNotificationRecipients;
  (window as any).checkNotificationStatus = checkEmailNotificationStatus;
  (window as any).testNotification = testAdminEmailNotification;
}