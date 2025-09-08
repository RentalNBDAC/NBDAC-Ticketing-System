// EmailJS Console Utilities - Enhanced testing and setup commands
import { emailjsService, testEmailConfiguration } from './emailjs-service';
import { checkEmailJSStatus, testEmailJSConfiguration } from './emailjs-integration';

// Quick EmailJS status check
export const quickEmailJSStatus = async (): Promise<void> => {
  console.log('⚡ QUICK EMAILJS STATUS');
  console.log('===================');
  console.log('');

  try {
    // Check if EmailJS service is configured
    const isConfigured = emailjsService.isConfigured();
    console.log(`🔧 EmailJS Service: ${isConfigured ? '✅ Configured' : '❌ Not Configured'}`);

    // Get current configuration (without sensitive data)
    const config = emailjsService.getConfig();
    if (config) {
      console.log('📋 Configuration:');
      console.log(`   Service ID: ${config.serviceId ? '✅ Set' : '❌ Missing'}`);
      console.log(`   Template ID: ${config.templateId ? '✅ Set' : '❌ Missing'}`);
      console.log(`   From Name: ${config.fromName || 'Default'}`);
      console.log(`   From Email: ${config.fromEmail || 'Default'}`);
    }

    // Check environment variables
    try {
      const { simpleEmailJSTest } = await import('./emailjs-test-simple');
      const envResult = simpleEmailJSTest();
      
      console.log('');
      console.log('🌍 Environment Variables:');
      console.log(`   Overall: ${envResult.configured ? '✅ Configured' : '❌ Incomplete'}`);
      console.log(`   Required Found: ${envResult.requiredFound}/3`);
    } catch (error) {
      console.log('⚠️ Could not check environment variables');
    }

    // Check server integration
    try {
      const serverStatus = await checkEmailJSStatus();
      console.log('');
      console.log('🖥️ Server Integration:');
      console.log(`   Ready: ${serverStatus.ready ? '✅ Yes' : '❌ No'}`);
      console.log(`   Admin Emails: ${serverStatus.adminEmails}`);
      console.log(`   Message: ${serverStatus.message}`);
    } catch (error) {
      console.log('⚠️ Could not check server status');
    }

    console.log('');
    if (isConfigured) {
      console.log('🚀 READY TO TEST');
      console.log('Commands:');
      console.log('   • testEmailJSNow("your-email@example.com") - Test with specific email');
      console.log('   • quickEmailJSTest() - Prompt for email and test');
      console.log('   • goToEmailJSSetup() - Open setup page');
    } else {
      console.log('🔧 SETUP NEEDED');
      console.log('Commands:');
      console.log('   • goToEmailJSSetup() - Open setup page');
      console.log('   • simpleEmailJSTest() - Check environment variables');
    }

  } catch (error) {
    console.error('💥 Error checking EmailJS status:', error);
  }
};

// Test EmailJS with prompt
export const quickEmailJSTest = async (): Promise<void> => {
  const email = prompt('Enter email address to test EmailJS:');
  if (!email) {
    console.log('❌ Test cancelled - no email provided');
    return;
  }
  
  await testEmailJSNow(email);
};

// Test EmailJS with specific email
export const testEmailJSNow = async (testEmail: string): Promise<void> => {
  console.log(`🧪 TESTING EMAILJS: ${testEmail}`);
  console.log('==========================');
  console.log('');

  if (!emailjsService.isConfigured()) {
    console.log('❌ EmailJS not configured');
    console.log('💡 Run: goToEmailJSSetup() to configure');
    return;
  }

  try {
    console.log('📤 Sending test email...');
    const result = await testEmailConfiguration(testEmail);

    if (result.success) {
      console.log('✅ TEST SUCCESSFUL!');
      console.log(`📧 Test email sent to: ${testEmail}`);
      console.log('💡 Check your email inbox (including spam folder)');
    } else {
      console.log('❌ TEST FAILED');
      console.log(`💬 Error: ${result.message}`);
      console.log('');
      console.log('🔧 TROUBLESHOOTING:');
      console.log('   1. Check your EmailJS template configuration');
      console.log('   2. Ensure template has these fields:');
      console.log('      • to_email or recipient_email (for recipient)');
      console.log('      • subject (for email subject)');
      console.log('      • message (for email content)');
      console.log('      • from_name (for sender name)');
      console.log('   3. Verify your email service is connected in EmailJS');
      console.log('   4. Run: showEmailJSTemplateGuide() for template help');
      console.log('   5. Run: goToEmailJSSetup() to review settings');
    }

  } catch (error) {
    console.log('💥 TEST ERROR');
    console.error('Error:', error);
    console.log('');
    console.log('🔧 TROUBLESHOOTING:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify EmailJS service is running');
    console.log('   3. Check if template exists in EmailJS dashboard');
    console.log('   4. Run: quickEmailJSStatus() to check configuration');
  }
};

// Complete EmailJS diagnostic
export const diagEmailJS = async (): Promise<void> => {
  console.log('🔍 EMAILJS DIAGNOSTIC');
  console.log('==================');
  console.log('');

  // 1. Check service configuration
  console.log('1️⃣ Service Configuration:');
  const isConfigured = emailjsService.isConfigured();
  console.log(`   Configured: ${isConfigured ? '✅ Yes' : '❌ No'}`);

  if (isConfigured) {
    const config = emailjsService.getConfig();
    console.log('   Details:');
    console.log(`     Service ID: ${config?.serviceId ? '✅' : '❌'} ${config?.serviceId || 'Missing'}`);
    console.log(`     Template ID: ${config?.templateId ? '✅' : '❌'} ${config?.templateId || 'Missing'}`);
    console.log(`     From Name: ${config?.fromName || 'Default'}`);
    console.log(`     From Email: ${config?.fromEmail || 'Default'}`);
  }

  console.log('');

  // 2. Check environment variables
  console.log('2️⃣ Environment Variables:');
  try {
    const { simpleEmailJSTest } = await import('./emailjs-test-simple');
    const envResult = simpleEmailJSTest();
    
    console.log(`   Overall Status: ${envResult.configured ? '✅ Complete' : '❌ Incomplete'}`);
    console.log(`   Required Variables: ${envResult.requiredFound}/3 found`);
    console.log('   Individual Status:');
    console.log(`     EMAILJS_SERVICE_ID: ${envResult.variables.serviceId ? '✅' : '❌'}`);
    console.log(`     EMAILJS_TEMPLATE_ID: ${envResult.variables.templateId ? '✅' : '❌'}`);
    console.log(`     EMAILJS_PUBLIC_KEY: ${envResult.variables.publicKey ? '✅' : '❌'}`);
    console.log(`     EMAILJS_PRIVATE_KEY: ${envResult.variables.privateKey ? '✅' : '⚠️'} (Optional)`);
    console.log(`     EMAILJS_FROM_NAME: ${envResult.variables.fromName ? '✅' : '⚠️'} (Optional)`);
    console.log(`     EMAILJS_FROM_EMAIL: ${envResult.variables.fromEmail ? '✅' : '⚠️'} (Optional)`);
  } catch (error) {
    console.log('   ❌ Error checking environment variables');
    console.log(`   Error: ${error}`);
  }

  console.log('');

  // 3. Check server integration
  console.log('3️⃣ Server Integration:');
  try {
    const serverStatus = await checkEmailJSStatus();
    console.log(`   Status: ${serverStatus.ready ? '✅ Ready' : '❌ Not Ready'}`);
    console.log(`   Configuration: ${serverStatus.configured ? '✅ Yes' : '❌ No'}`);
    console.log(`   Admin Emails: ${serverStatus.adminEmails} configured`);
    console.log(`   Message: ${serverStatus.message}`);
  } catch (error) {
    console.log('   ❌ Error checking server status');
    console.log(`   Error: ${error}`);
  }

  console.log('');

  // 4. Recommendations
  console.log('💡 RECOMMENDATIONS:');
  
  if (!isConfigured) {
    console.log('   🔧 Configure EmailJS: goToEmailJSSetup()');
  } else {
    console.log('   🧪 Test configuration: testEmailJSNow("your-email@example.com")');
  }
  
  console.log('   📊 Quick status: quickEmailJSStatus()');
  console.log('   🌍 Check env vars: simpleEmailJSTest()');
  console.log('   🖥️ Check server: checkEmailJSStatus()');
};

// Setup EmailJS from environment variables
export const autoSetupEmailJS = async (): Promise<void> => {
  console.log('🤖 AUTO SETUP EMAILJS');
  console.log('===================');
  console.log('');

  try {
    // Check if already configured
    if (emailjsService.isConfigured()) {
      console.log('✅ EmailJS is already configured');
      console.log('💡 Use clearEmailJSConfig() to reset and reconfigure');
      return;
    }

    // Try to load from environment variables
    console.log('🔍 Checking environment variables...');
    
    const { getAllEmailJSEnvVars } = await import('./emailjs-env-safe');
    const envResult = getAllEmailJSEnvVars();

    if (!envResult.configured) {
      console.log('❌ Environment variables not configured');
      console.log('');
      console.log('Missing variables:');
      if (!envResult.variables.serviceId.found) console.log('   • EMAILJS_SERVICE_ID');
      if (!envResult.variables.templateId.found) console.log('   • EMAILJS_TEMPLATE_ID');
      if (!envResult.variables.publicKey.found) console.log('   • EMAILJS_PUBLIC_KEY');
      console.log('');
      console.log('💡 Set these environment variables or use: goToEmailJSSetup()');
      return;
    }

    // Auto-configure from environment
    console.log('✅ Environment variables found, configuring...');
    
    const config = {
      serviceId: envResult.variables.serviceId.value!,
      templateId: envResult.variables.templateId.value!,
      publicKey: envResult.variables.publicKey.value!,
      privateKey: envResult.variables.privateKey.value,
      fromName: envResult.variables.fromName.value || 'Sistem NBDAC',
      fromEmail: envResult.variables.fromEmail.value || 'noreply@nbdac.gov.my'
    };

    const success = emailjsService.updateConfig(config);

    if (success) {
      console.log('🎉 AUTO SETUP SUCCESSFUL!');
      console.log('✅ EmailJS configured from environment variables');
      console.log('');
      console.log('📋 Configuration:');
      console.log(`   Service ID: ${config.serviceId}`);
      console.log(`   Template ID: ${config.templateId}`);
      console.log(`   From Name: ${config.fromName}`);
      console.log(`   From Email: ${config.fromEmail}`);
      console.log('');
      console.log('🧪 Test now: testEmailJSNow("your-email@example.com")');
    } else {
      console.log('❌ Auto setup failed');
      console.log('💡 Try manual setup: goToEmailJSSetup()');
    }

  } catch (error) {
    console.error('💥 Auto setup error:', error);
    console.log('💡 Try manual setup: goToEmailJSSetup()');
  }
};

// Clear EmailJS configuration
export const clearEmailJSConfig = (): void => {
  console.log('🗑️ CLEARING EMAILJS CONFIG');
  console.log('========================');
  console.log('');

  try {
    emailjsService.clearConfig();
    console.log('✅ EmailJS configuration cleared');
    console.log('💡 Use autoSetupEmailJS() or goToEmailJSSetup() to reconfigure');
  } catch (error) {
    console.error('💥 Error clearing configuration:', error);
  }
};

// Show EmailJS help
export const emailJSHelp = (): void => {
  console.log('📖 EMAILJS COMMANDS HELP');
  console.log('======================');
  console.log('');
  
  console.log('🚀 QUICK COMMANDS:');
  console.log('   quickEmailJSStatus()                    - Show quick status');
  console.log('   testEmailJSNow("email@example.com")     - Test with specific email');
  console.log('   quickEmailJSTest()                      - Test with prompt');
  console.log('   goToEmailJSSetup()                      - Open setup page');
  console.log('');
  
  console.log('🔧 SETUP COMMANDS:');
  console.log('   autoSetupEmailJS()                      - Auto setup from env vars');
  console.log('   clearEmailJSConfig()                    - Clear configuration');
  console.log('   simpleEmailJSTest()                     - Check environment variables');
  console.log('');
  
  console.log('🔍 DIAGNOSTIC COMMANDS:');
  console.log('   diagEmailJS()                           - Full diagnostic');
  console.log('   checkEmailJSStatus()                    - Check server integration');
  console.log('   testEmailJSEnvironment()                - Test environment setup');
  console.log('   showEmailJSTemplateGuide()              - Template configuration help');
  console.log('');
  
  console.log('📊 STATUS COMMANDS:');
  console.log('   quickEmailJSStatus()                    - Quick overview');
  console.log('   showEmailJSStatus()                     - Detailed status');
  console.log('   emailJSHelp()                           - Show this help');
  console.log('');
  
  console.log('💡 TYPICAL WORKFLOW:');
  console.log('   1. quickEmailJSStatus() - Check current status');
  console.log('   2. goToEmailJSSetup() - Configure if needed');
  console.log('   3. showEmailJSTemplateGuide() - Setup template correctly');
  console.log('   4. testEmailJSNow("your@email.com") - Test configuration');
  console.log('   5. diagEmailJS() - Troubleshoot if issues');
};

// Show EmailJS template configuration guide
export const showEmailJSTemplateGuide = (): void => {
  console.log('📧 EMAILJS TEMPLATE CONFIGURATION GUIDE');
  console.log('====================================');
  console.log('');
  
  console.log('🎯 REQUIRED TEMPLATE FIELDS:');
  console.log('Your EmailJS template must include these variables:');
  console.log('');
  console.log('📍 RECIPIENT FIELDS (choose one):');
  console.log('   {{to_email}}        - Primary recipient field');
  console.log('   {{recipient_email}} - Alternative recipient field');
  console.log('');
  console.log('📝 CONTENT FIELDS:');
  console.log('   {{subject}}         - Email subject line');
  console.log('   {{message}}         - Main email content (pre-formatted)');
  console.log('   {{from_name}}       - Sender name');
  console.log('   {{from_email}}      - Sender email address');
  console.log('');
  console.log('📋 SUBMISSION FIELDS (optional, for custom templates):');
  console.log('   {{nama_projek}}     - Project name');
  console.log('   {{bahagian}}        - Department');
  console.log('   {{nama_pegawai}}    - Staff name');
  console.log('   {{pemohon_email}}   - Applicant email');
  console.log('   {{tarikh}}          - Date');
  console.log('   {{tujuan_projek}}   - Project purpose');
  console.log('   {{website_url}}     - Website URL');
  console.log('   {{kutipan_data}}    - Data collection type');
  console.log('   {{catatan}}         - Notes');
  console.log('   {{status}}          - Status');
  console.log('');
  console.log('💡 EXAMPLE TEMPLATE:');
  console.log('Subject: {{subject}}');
  console.log('');
  console.log('Dear Admin,');
  console.log('');
  console.log('{{message}}');
  console.log('');
  console.log('Best regards,');
  console.log('{{from_name}}');
  console.log('');
  console.log('🔧 TROUBLESHOOTING:');
  console.log('If you get "recipients address is empty":');
  console.log('   1. Ensure your template uses {{to_email}} or {{recipient_email}}');
  console.log('   2. Check the template ID is correct');
  console.log('   3. Verify the email service is connected in EmailJS');
  console.log('   4. Test with a simple template first');
  console.log('');
  console.log('📱 QUICK COMMANDS:');
  console.log('   testEmailJSNow("your@email.com") - Test with your email');
  console.log('   emailJSHelp() - Show all commands');
};

// Export all utilities
export const emailJSConsoleUtils = {
  quickEmailJSStatus,
  quickEmailJSTest,
  testEmailJSNow,
  diagEmailJS,
  autoSetupEmailJS,
  clearEmailJSConfig,
  emailJSHelp,
  showEmailJSTemplateGuide
};