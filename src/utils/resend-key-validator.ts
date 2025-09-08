// This file has been removed as the system now uses EmailJS exclusively
// All Resend functionality has been replaced with EmailJS integration

console.log('⚠️ Resend utilities have been removed. Use EmailJS instead.');
console.log('💡 Run: goToEmailJSSetup() to configure EmailJS');

// Placeholder functions to prevent import errors during transition
export const validateResendApiKey = () => ({
  valid: false,
  issues: ['Resend service has been removed. Use EmailJS instead.']
});

export const testResendApiKeyLive = async () => ({
  valid: false,
  error: 'Resend service has been removed. Use EmailJS instead.'
});

export const getResendApiKeyStatus = async () => {
  console.log('⚠️ Resend service has been removed from this system');
  console.log('💡 The system now uses EmailJS for all email functionality');
  console.log('🚀 Run: goToEmailJSSetup() to configure EmailJS');
  return null;
};

export const showResendSetupInstructions = () => {
  console.log('');
  console.log('📧 RESEND SERVICE REMOVED - USE EMAILJS INSTEAD');
  console.log('===============================================');
  console.log('');
  console.log('The system has been upgraded to use EmailJS exclusively.');
  console.log('EmailJS provides better reliability and simpler setup.');
  console.log('');
  console.log('🚀 GET STARTED WITH EMAILJS:');
  console.log('1. Run: goToEmailJSSetup()');
  console.log('2. Configure your EmailJS service');
  console.log('3. Test with: testEmailJS("your@email.com")');
  console.log('');
  console.log('💡 EmailJS Benefits:');
  console.log('  ✅ No complex API keys needed');
  console.log('  ✅ Works with Gmail, Outlook, Yahoo');
  console.log('  ✅ Simple browser-based setup');
  console.log('  ✅ Malaysian language interface');
  console.log('');
};

export const setupWithValidKey = async () => {
  console.log('⚠️ Resend setup has been removed.');
  console.log('💡 Use EmailJS instead: goToEmailJSSetup()');
  return false;
};

export const fixInvalidApiKey = async () => {
  console.log('⚠️ Resend API key fixes are no longer needed.');
  console.log('💡 The system now uses EmailJS exclusively.');
  console.log('🚀 Run: goToEmailJSSetup() to configure EmailJS');
  console.log('🧪 Test: testEmailJS("your@email.com")');
};

// Make functions available globally for backward compatibility
if (typeof window !== 'undefined') {
  window.getResendApiKeyStatus = getResendApiKeyStatus;
  window.showResendSetupInstructions = showResendSetupInstructions;
  window.setupWithValidKey = setupWithValidKey;
  window.fixInvalidApiKey = fixInvalidApiKey;
  window.testResendApiKeyLive = testResendApiKeyLive;
}