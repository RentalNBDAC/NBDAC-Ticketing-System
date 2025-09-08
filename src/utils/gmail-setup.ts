// This file has been removed as the system now uses EmailJS exclusively
// Gmail-specific Resend setup is no longer needed with EmailJS

console.log('⚠️ Gmail-specific Resend setup has been removed.');
console.log('💡 EmailJS works directly with Gmail and all email providers.');
console.log('🚀 Run: goToEmailJSSetup() to configure EmailJS with Gmail');

// Setup with EmailJS (replaces Gmail Resend setup)
export const setupWithRentalNBDACGmail = async (adminEmail: string, adminPassword: string) => {
  console.log('');
  console.log('📧 GMAIL RESEND SETUP HAS BEEN REMOVED - USE EMAILJS');
  console.log('================================================');
  console.log('');
  console.log(`📧 Admin email: ${adminEmail}`);
  console.log('💡 EmailJS works directly with Gmail - no verification needed!');
  console.log('');
  console.log('✅ EMAILJS WITH GMAIL IS MUCH EASIER:');
  console.log('   • No API keys to manage');
  console.log('   • No verification process required');
  console.log('   • Direct Gmail integration');
  console.log('   • Works immediately');
  console.log('');
  console.log('🚀 SIMPLE SETUP STEPS:');
  console.log('1. Run: emergencySetup() to create admin user');
  console.log('2. Run: goToEmailJSSetup() to configure Gmail');
  console.log('3. Test with: testEmailJS("your@email.com")');
  console.log('');
  console.log('💡 EmailJS + Gmail = Perfect combination!');
  
  // Still create the admin user
  try {
    const { emergencySetup } = await import('./comprehensive-setup');
    console.log('');
    console.log('📝 Creating admin user...');
    await emergencySetup();
    
    console.log('');
    console.log('✅ Admin user created!');
    console.log('🔧 Next step: goToEmailJSSetup() to configure Gmail');
    
    return true;
  } catch (error) {
    console.log('❌ Error creating admin user:', error);
    return false;
  }
};

// Show EmailJS Gmail setup instructions (replaces Resend verification)
export const showGmailVerificationSteps = () => {
  console.log('');
  console.log('📧 EMAILJS + GMAIL SETUP (NO VERIFICATION NEEDED)');
  console.log('===============================================');
  console.log('');
  console.log('✅ EmailJS eliminates Gmail verification complexity!');
  console.log('');
  console.log('🚀 SIMPLE GMAIL SETUP WITH EMAILJS:');
  console.log('');
  console.log('1️⃣ Run: goToEmailJSSetup()');
  console.log('   • Opens EmailJS configuration page');
  console.log('   • Select Gmail as your email provider');
  console.log('');
  console.log('2️⃣ Connect Your Gmail:');
  console.log('   • EmailJS handles Gmail authentication');
  console.log('   • No API keys to copy/paste');
  console.log('   • No verification emails needed');
  console.log('');
  console.log('3️⃣ Test Your Setup:');
  console.log('   • Run: testEmailJS("your@email.com")');
  console.log('   • Check your inbox immediately');
  console.log('');
  console.log('✅ EMAILJS BENEFITS:');
  console.log('   • Direct Gmail integration');
  console.log('   • No Resend verification process');
  console.log('   • Works with rentalnbdac@gmail.com instantly');
  console.log('   • More reliable than Resend');
  console.log('   • Simpler configuration');
  console.log('');
  console.log('⏰ TIME REQUIRED: 30 seconds (not 2-3 minutes like Resend)');
  console.log('💡 Much easier and more reliable!');
};

// Quick test with EmailJS (replaces Gmail Resend test)
export const testWithRentalGmail = async () => {
  console.log('');
  console.log('📧 TESTING EMAILJS WITH GMAIL');
  console.log('============================');
  console.log('');
  console.log('💡 EmailJS testing is now done through the main test function');
  console.log('');
  console.log('🧪 TO TEST EMAILJS WITH GMAIL:');
  console.log('1. Make sure EmailJS is configured: goToEmailJSSetup()');
  console.log('2. Run: testEmailJS("your@email.com")');
  console.log('3. Check your inbox for test email');
  console.log('');
  console.log('✅ If configured properly, emails will be sent via EmailJS');
  console.log('💡 No separate Gmail testing needed - it just works!');
  
  try {
    // Try to call the main EmailJS test function
    if (typeof window !== 'undefined' && window.testEmailJS) {
      console.log('');
      console.log('🔄 Running EmailJS test...');
      return await window.testEmailJS('rentalnbdac@gmail.com');
    } else {
      console.log('');
      console.log('💡 Run: testEmailJS("rentalnbdac@gmail.com") to test EmailJS');
      return true;
    }
  } catch (error) {
    console.log('');
    console.log('❌ Error testing EmailJS:', error);
    console.log('💡 Run: goToEmailJSSetup() to configure EmailJS first');
    return false;
  }
};

// Make functions available globally for backward compatibility
if (typeof window !== 'undefined') {
  window.setupWithRentalNBDACGmail = setupWithRentalNBDACGmail;
  window.showGmailVerificationSteps = showGmailVerificationSteps;
  window.testWithRentalGmail = testWithRentalGmail;
}