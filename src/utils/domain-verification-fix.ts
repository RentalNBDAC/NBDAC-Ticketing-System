// This file has been removed as the system now uses EmailJS exclusively
// Domain verification was a Resend-specific issue that doesn't apply to EmailJS

console.log('⚠️ Domain verification utilities have been removed.');
console.log('💡 The system now uses EmailJS which doesn\'t have domain verification issues.');
console.log('🚀 Run: goToEmailJSSetup() to configure EmailJS');

// Handle domain verification issues (now redirects to EmailJS)
export const fixDomainVerificationError = async () => {
  console.log('');
  console.log('📧 DOMAIN VERIFICATION IS NO LONGER NEEDED');
  console.log('=========================================');
  console.log('');
  console.log('✅ The system has been upgraded to use EmailJS');
  console.log('✅ EmailJS doesn\'t require domain verification');
  console.log('✅ No complex DNS setup needed');
  console.log('');
  console.log('🚀 SIMPLE EMAILJS SETUP:');
  console.log('1. Run: goToEmailJSSetup()');
  console.log('2. Configure your email service (Gmail, Outlook, etc.)');
  console.log('3. Test with: testEmailJS("your@email.com")');
  console.log('');
  console.log('💡 EmailJS Benefits:');
  console.log('   ✅ Works with any email provider');
  console.log('   ✅ No domain verification required');
  console.log('   ✅ Simple browser-based setup');
  console.log('   ✅ Malaysian language interface');
  console.log('');
};

// Setup with EmailJS (replaces working email setup)
export const setupWithWorkingEmail = async (
  adminEmail: string, 
  adminPassword: string, 
  fromEmail?: string
) => {
  console.log('');
  console.log('📧 RESEND SETUP HAS BEEN REMOVED - USE EMAILJS');
  console.log('=============================================');
  console.log('');
  console.log(`📧 Admin email: ${adminEmail}`);
  console.log('💡 EmailJS doesn\'t need a "from" email configuration like Resend did');
  console.log('');
  console.log('🚀 GET STARTED WITH EMAILJS:');
  console.log('1. Run: emergencySetup() to create admin user');
  console.log('2. Run: goToEmailJSSetup() to configure EmailJS');
  console.log('3. Test with: testEmailJS("your@email.com")');
  console.log('');
  console.log('✅ EmailJS is much simpler than Resend!');
  
  // Still create the admin user
  try {
    const { emergencySetup } = await import('./comprehensive-setup');
    console.log('');
    console.log('📝 Creating admin user...');
    return await emergencySetup();
  } catch (error) {
    console.log('❌ Error creating admin user:', error);
    return false;
  }
};

// Check if current error is domain verification related (no longer relevant)
export const isDomainVerificationError = (error: string): boolean => {
  console.log('💡 Domain verification errors are no longer relevant with EmailJS');
  return false;
};

// Get list of working email addresses (now EmailJS info)
export const getWorkingEmailAddresses = () => {
  console.log('');
  console.log('📧 EMAILJS WORKS WITH ALL EMAIL PROVIDERS');
  console.log('========================================');
  console.log('');
  console.log('✅ SUPPORTED EMAIL SERVICES:');
  console.log('   • Gmail (gmail.com)');
  console.log('   • Outlook/Hotmail (outlook.com, hotmail.com)');
  console.log('   • Yahoo (yahoo.com)');
  console.log('   • Custom SMTP servers');
  console.log('   • Corporate email systems');
  console.log('');
  console.log('✅ NO RESTRICTIONS:');
  console.log('   • No domain verification needed');
  console.log('   • No DNS configuration required');
  console.log('   • Works with personal and business emails');
  console.log('   • Use any email address you control');
  console.log('');
  console.log('🚀 GET STARTED:');
  console.log('   goToEmailJSSetup()  - Configure EmailJS');
  console.log('   testEmailJS("your@email.com")  - Test functionality');
  console.log('');
  
  return [
    'your-email@gmail.com',
    'your-email@outlook.com',
    'your-email@yahoo.com',
    'admin@nbdac.gov.my'
  ];
};

// Auto-fix domain verification error (now redirects to EmailJS)
export const autoFixDomainError = async () => {
  console.log('');
  console.log('📧 DOMAIN ERRORS ARE NO LONGER AN ISSUE');
  console.log('======================================');
  console.log('');
  console.log('✅ EmailJS eliminates domain verification problems');
  console.log('✅ No auto-fix needed - the system is already fixed!');
  console.log('');
  console.log('🚀 NEXT STEPS:');
  console.log('1. Run: goToEmailJSSetup() to configure EmailJS');
  console.log('2. Use any email provider you prefer');
  console.log('3. Test with: testEmailJS("your@email.com")');
  console.log('');
  console.log('💡 EmailJS is much more reliable than Resend was!');
  
  return true;
};

// Instructions for EmailJS setup (replaces verified sender instructions)
export const showVerifiedSenderInstructions = () => {
  console.log('');
  console.log('📧 EMAILJS SETUP (NO VERIFICATION NEEDED)');
  console.log('========================================');
  console.log('');
  console.log('EmailJS has replaced the old Resend system.');
  console.log('No email verification or domain setup is required!');
  console.log('');
  console.log('🚀 SIMPLE SETUP STEPS:');
  console.log('');
  console.log('1️⃣ Run: goToEmailJSSetup()');
  console.log('   • Opens the EmailJS configuration page');
  console.log('   • Configure your preferred email service');
  console.log('');
  console.log('2️⃣ Choose Your Email Provider:');
  console.log('   • Gmail - Most popular and reliable');
  console.log('   • Outlook - Good for business use');
  console.log('   • Yahoo - Alternative option');
  console.log('   • Custom SMTP - For advanced users');
  console.log('');
  console.log('3️⃣ Test Your Setup:');
  console.log('   • Run: testEmailJS("your@email.com")');
  console.log('   • Check your inbox for test email');
  console.log('');
  console.log('✅ BENEFITS OF EMAILJS:');
  console.log('   • No domain verification required');
  console.log('   • No DNS configuration needed');
  console.log('   • Works with any email provider');
  console.log('   • Simple browser-based setup');
  console.log('   • Malaysian language interface');
  console.log('');
  console.log('💡 Much easier than the old Resend system!');
};

// Make functions available globally for backward compatibility
if (typeof window !== 'undefined') {
  window.fixDomainVerificationError = fixDomainVerificationError;
  window.setupWithWorkingEmail = setupWithWorkingEmail;
  window.getWorkingEmailAddresses = getWorkingEmailAddresses;
  window.autoFixDomainError = autoFixDomainError;
  window.showVerifiedSenderInstructions = showVerifiedSenderInstructions;
}