// This file has been removed as the system now uses EmailJS exclusively
// All Resend functionality has been replaced with EmailJS integration

export const RESEND_REMOVED_MESSAGE = 'Resend service has been removed. Use EmailJS instead.';

// Placeholder functions to prevent import errors
export const configureResend = () => {
  console.log('⚠️ Resend service has been removed. Use EmailJS instead.');
  console.log('💡 Run: goToEmailJSSetup() to configure EmailJS');
};

export const sendEmailViaResend = async () => {
  console.log('⚠️ Resend service has been removed. Use EmailJS instead.');
  return { success: false, error: 'Resend service removed' };
};

export const isResendConfigured = () => false;

export const getResendConfig = () => ({
  fromEmail: '',
  enabled: false,
  apiKeySet: false,
  autoConfigured: false,
  requiresDomainVerification: false
});

export const sendEmailsWithFallback = async () => ({
  sent: 0,
  total: 0,
  method: 'removed',
  errors: ['Resend service has been removed']
});

export const testResendService = async () => {
  console.log('⚠️ Resend service has been removed. Use EmailJS instead.');
  return false;
};