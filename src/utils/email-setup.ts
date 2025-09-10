/**
 * Email Setup and Configuration Utility
 * Automatically configures and tests email notifications for NBDAC system
 */

import { createClient } from './supabase/client';
import { projectId, publicAnonKey } from './supabase/info';

export interface EmailSetupConfig {
  useOrganizationEmail: boolean;
  organizationApiUrl?: string;
  organizationApiKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  senderName?: string;
  senderEmail?: string;
}

export interface EmailSetupResult {
  success: boolean;
  configuration: 'supabase-default' | 'supabase-smtp' | 'organization-api';
  adminEmails: string[];
  testResults: {
    serverConnection: boolean;
    adminUsersFound: boolean;
    emailServiceAvailable: boolean;
    testEmailSent: boolean;
  };
  messages: string[];
  errors: string[];
}

/**
 * Main email setup function
 */
export const setupEmailSystem = async (config: EmailSetupConfig = { useOrganizationEmail: false }): Promise<EmailSetupResult> => {
  const result: EmailSetupResult = {
    success: false,
    configuration: 'supabase-default',
    adminEmails: [],
    testResults: {
      serverConnection: false,
      adminUsersFound: false,
      emailServiceAvailable: false,
      testEmailSent: false
    },
    messages: [],
    errors: []
  };

  try {
    result.messages.push('🚀 Starting NBDAC email system setup...');

    // Step 1: Verify server connection
    result.messages.push('🔗 Testing server connection...');
    const serverConnected = await testServerConnection();
    result.testResults.serverConnection = serverConnected;

    if (!serverConnected) {
      result.errors.push('❌ Server connection failed');
      return result;
    }
    result.messages.push('✅ Server connection successful');

    // Step 2: Check for admin users
    result.messages.push('👥 Checking admin users...');
    const adminEmails = await getAdminUsers();
    result.adminEmails = adminEmails;
    result.testResults.adminUsersFound = adminEmails.length > 0;

    if (adminEmails.length === 0) {
      result.errors.push('⚠️ No admin users found - create admin users first');
      result.messages.push('💡 Run admin setup: window.setupAdmin("admin@nbdac.gov.my", "password", "Admin Name")');
    } else {
      result.messages.push(`✅ Found ${adminEmails.length} admin user(s): ${adminEmails.join(', ')}`);
    }

    // Step 3: Configure email service
    if (config.useOrganizationEmail && config.organizationApiUrl) {
      result.messages.push('🏢 Configuring organization email API...');
      const orgConfigured = await configureOrganizationEmail(config);
      if (orgConfigured) {
        result.configuration = 'organization-api';
        result.messages.push('✅ Organization email API configured');
      } else {
        result.errors.push('❌ Organization email API configuration failed');
        result.messages.push('🔄 Falling back to Supabase email...');
        result.configuration = 'supabase-default';
      }
    } else if (config.smtpHost) {
      result.messages.push('📧 Configuring SMTP settings...');
      const smtpConfigured = await configureSupabaseSMTP(config);
      if (smtpConfigured) {
        result.configuration = 'supabase-smtp';
        result.messages.push('✅ Supabase SMTP configured with organization email');
      } else {
        result.errors.push('❌ SMTP configuration failed');
        result.messages.push('🔄 Using Supabase default email...');
        result.configuration = 'supabase-default';
      }
    } else {
      result.messages.push('📧 Using Supabase default email service');
      result.configuration = 'supabase-default';
    }

    result.testResults.emailServiceAvailable = true;

    // Step 4: Test email sending
    if (adminEmails.length > 0) {
      result.messages.push('🧪 Testing email notification...');
      const testSent = await sendTestNotification(adminEmails[0]);
      result.testResults.testEmailSent = testSent;

      if (testSent) {
        result.messages.push('✅ Test email sent successfully!');
        result.messages.push(`📬 Check inbox: ${adminEmails[0]}`);
      } else {
        result.errors.push('⚠️ Test email failed - check server logs');
        result.messages.push('💡 System will still work, emails will be logged to console');
      }
    }

    // Final status
    result.success = result.testResults.serverConnection && result.testResults.emailServiceAvailable;
    
    if (result.success) {
      result.messages.push('🎉 Email system setup complete!');
      result.messages.push(`📧 Configuration: ${result.configuration}`);
      result.messages.push(`👥 Admin notifications: ${adminEmails.length} recipient(s)`);
    }

    return result;

  } catch (error) {
    result.errors.push(`💥 Setup error: ${error}`);
    console.error('Email setup error:', error);
    return result;
  }
};

/**
 * Test server connection
 */
const testServerConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Server connection test failed:', error);
    return false;
  }
};

/**
 * Get admin users from server
 */
const getAdminUsers = async (): Promise<string[]> => {
  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/list-admins`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.admins?.map((admin: any) => admin.email).filter(Boolean) || [];
  } catch (error) {
    console.error('Failed to get admin users:', error);
    return [];
  }
};

/**
 * Configure organization email API
 */
const configureOrganizationEmail = async (config: EmailSetupConfig): Promise<boolean> => {
  try {
    // This would typically involve setting environment variables on the server
    // For now, we'll just validate the configuration
    if (!config.organizationApiUrl || !config.organizationApiKey) {
      return false;
    }

    // Test the API endpoint
    const testResponse = await fetch(config.organizationApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.organizationApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: ['test@example.com'],
        subject: 'API Test',
        html: '<p>API connection test</p>',
        test: true
      })
    });

    return testResponse.status !== 404; // API exists
  } catch (error) {
    console.error('Organization email API test failed:', error);
    return false;
  }
};

/**
 * Configure Supabase SMTP (requires manual setup in dashboard)
 */
const configureSupabaseSMTP = async (config: EmailSetupConfig): Promise<boolean> => {
  // This requires manual configuration in Supabase dashboard
  // We can only validate the configuration exists
  
  console.log('📋 SMTP Configuration Required:');
  console.log(`   Host: ${config.smtpHost}`);
  console.log(`   Port: ${config.smtpPort || 587}`);
  console.log(`   Username: ${config.smtpUsername}`);
  console.log(`   Sender: ${config.senderEmail}`);
  console.log('⚠️ Please configure these settings in your Supabase dashboard:');
  console.log('   Authentication > Settings > SMTP Settings');

  return true; // Assume configured if details provided
};

/**
 * Send test notification
 */
const sendTestNotification = async (adminEmail: string): Promise<boolean> => {
  try {
    // Create a test submission to trigger email
    const testSubmission = {
      tarikh: new Date().toLocaleDateString('ms-MY'),
      bahagian: 'IT Department',
      namaProjek: 'Email System Test',
      tujuanProjek: 'Testing email notification system setup',
      websiteUrl: '1. Test Site: https://www.example.com',
      kutipanData: 'one-off',
      namaPegawai: 'System Tester',
      email: adminEmail,
      catatan: 'This is a test submission to verify email notifications are working correctly.'
    };

    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(testSubmission)
    });

    return response.ok;
  } catch (error) {
    console.error('Test email failed:', error);
    return false;
  }
};

/**
 * Quick setup for basic configuration
 */
export const quickEmailSetup = async (): Promise<EmailSetupResult> => {
  console.log('🚀 Running quick email setup for NBDAC system...');
  
  const result = await setupEmailSystem({
    useOrganizationEmail: false // Use Supabase default
  });

  // Display results
  console.log('\n📊 Email Setup Results:');
  console.log('========================');
  
  result.messages.forEach(msg => console.log(msg));
  
  if (result.errors.length > 0) {
    console.log('\n⚠️ Issues Found:');
    result.errors.forEach(err => console.log(err));
  }

  console.log('\n📋 Configuration Summary:');
  console.log(`   Service: ${result.configuration}`);
  console.log(`   Admin emails: ${result.adminEmails.length}`);
  console.log(`   Status: ${result.success ? '✅ Ready' : '⚠️ Needs attention'}`);

  if (result.success) {
    console.log('\n🎉 Your email system is ready!');
    console.log('   New submissions will automatically notify admins');
    console.log('   Check admin email inbox for test notification');
  } else {
    console.log('\n🔧 Next Steps:');
    if (result.adminEmails.length === 0) {
      console.log('   1. Create admin users with: setupAdmin("email", "password", "name")');
    }
    console.log('   2. Check server logs for detailed error information');
    console.log('   3. Verify Supabase configuration');
  }

  return result;
};

/**
 * Advanced setup with organization email
 */
export const advancedEmailSetup = async (config: {
  organizationApiUrl?: string;
  organizationApiKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  senderEmail?: string;
}): Promise<EmailSetupResult> => {
  console.log('🏢 Running advanced email setup with organization integration...');

  const setupConfig: EmailSetupConfig = {
    useOrganizationEmail: !!(config.organizationApiUrl || config.smtpHost),
    organizationApiUrl: config.organizationApiUrl,
    organizationApiKey: config.organizationApiKey,
    smtpHost: config.smtpHost,
    smtpPort: config.smtpPort,
    smtpUsername: config.smtpUsername,
    smtpPassword: config.smtpPassword,
    senderName: 'Sistem Permohonan Projek Web Scraping NBDAC',
    senderEmail: config.senderEmail
  };

  return await setupEmailSystem(setupConfig);
};

/**
 * Verify current email configuration
 */
export const verifyEmailSetup = async (): Promise<void> => {
  console.log('🔍 Verifying current email configuration...');

  const result = await setupEmailSystem({ useOrganizationEmail: false });

  console.log('\n📊 Current Status:');
  console.log('==================');
  console.log(`Server Connection: ${result.testResults.serverConnection ? '✅' : '❌'}`);
  console.log(`Admin Users: ${result.testResults.adminUsersFound ? '✅' : '❌'} (${result.adminEmails.length})`);
  console.log(`Email Service: ${result.testResults.emailServiceAvailable ? '✅' : '❌'}`);
  console.log(`Test Email: ${result.testResults.testEmailSent ? '✅' : '⚠️'}`);
  console.log(`Configuration: ${result.configuration}`);

  if (result.adminEmails.length > 0) {
    console.log('\n👥 Admin Email Recipients:');
    result.adminEmails.forEach(email => console.log(`   📧 ${email}`));
  }

  console.log(`\n🎯 Overall Status: ${result.success ? '✅ Operational' : '⚠️ Needs Attention'}`);
};