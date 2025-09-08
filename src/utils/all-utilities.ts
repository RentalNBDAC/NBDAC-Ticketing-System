// Central hub for all utility functions - EmailJS-only system
// All Resend references have been removed

// Core system setup utilities
export { 
  emergencySetup, 
  runComprehensiveSetup,
  setupAdmin
} from './comprehensive-setup';

// Email diagnostic utilities (EmailJS-only)
export {
  runEmailDiagnostic,
  testEmailNotifications,
  listAdminEmails,
  setupEmailNotifications
} from './email-diagnostic';

// EmailJS integration utilities
export {
  checkEmailJSStatus,
  // displaySafeEmailJSStatus,
  // simpleEmailJSTest
} from './emailjs-integration';

// Environment and configuration utilities
export { autoConfigureEnvironment } from './env-config';
export { initializeEmailHelpers, initializeEmailHelpers2 } from './email-helpers';