// Global window interface extensions for development utilities
declare global {
  interface Window {
    // Simplified setup utilities (all users are admin)
    setupAdmin: (email: string, password: string, name?: string) => Promise<any>;
    emergencySetup: () => Promise<any>;
    fixNBDACSystem: (email: string, password: string, name?: string) => Promise<any>;
    runComprehensiveSetup: (config: any) => Promise<any>;
    setupWithResend: (email: string, password: string, apiKey: string, name?: string) => Promise<any>;
    setupNBDAC: (email: string, password: string, name?: string) => Promise<any>;
    runQuickSetup: (email: string, password: string, name?: string) => Promise<any>;
    
    // Email diagnostic utilities
    runEmailDiagnostic: () => Promise<any>;
    testEmailNotifications: () => Promise<boolean>;
    listAdminEmails: () => Promise<any[]>;
    setupEmailNotifications: (apiKey: string, fromEmail?: string) => Promise<boolean>;
    
    // Comprehensive email fix utilities
    fixAllEmailIssues: () => Promise<boolean>;
    fixEmailNotifications: () => Promise<void>;
    quickEmailTest: () => Promise<boolean>;
    checkEmailStatus: () => Promise<any>;
    
    // API key validation and fix utilities
    getResendApiKeyStatus: () => Promise<any>;
    showResendSetupInstructions: () => void;
    setupWithValidKey: (email: string, password: string, apiKey: string) => Promise<boolean>;
    fixInvalidApiKey: () => Promise<void>;
    testResendApiKeyLive: (apiKey: string) => Promise<{ valid: boolean; error?: string }>;
    
    // Domain verification fix utilities
    fixDomainVerificationError: () => Promise<void>;
    setupWithWorkingEmail: (email: string, password: string, fromEmail?: string) => Promise<boolean>;
    getWorkingEmailAddresses: () => string[];
    autoFixDomainError: () => Promise<boolean>;
    showVerifiedSenderInstructions: () => void;
    
    // Gmail-specific setup utilities
    setupWithRentalNBDACGmail: (email: string, password: string) => Promise<boolean>;
    showGmailVerificationSteps: () => void;
    testWithRentalGmail: () => Promise<boolean>;
    
    // Legacy diagnostic utilities
    testAdminEmails: () => Promise<void>;
    
    // EmailJS utilities - Enhanced
    goToEmailJSSetup: () => void;
    
    // Quick EmailJS utilities
    quickEmailJSStatus: () => Promise<void>;
    testEmailJSNow: (testEmail: string) => Promise<void>;
    quickEmailJSTest: () => Promise<void>;
    diagEmailJS: () => Promise<void>;
    autoSetupEmailJS: () => Promise<void>;
    clearEmailJSConfig: () => Promise<void>;
    emailJSHelp: () => Promise<void>;
    showEmailJSTemplateGuide: () => Promise<void>;
    debugEmailJSTemplate: (testEmail?: string) => Promise<any>;
    quickEmailJSTemplateTest: (testEmail?: string) => Promise<any>;
    
    // Legacy EmailJS utilities (maintained for compatibility)
    checkEmailJSStatus: () => Promise<any>;
    testEmailJS: (testEmail?: string) => Promise<any>;
    testEmailJSEnvironment: () => Promise<any>;
    showEmailJSStatus: () => Promise<any>;
    simpleEmailJSTest: () => Promise<any>;
    checkSupabaseEmailJSVars: () => Promise<void>;
    
    // Development utilities
    navigateToPage: (page: string) => void;
    runCleanup: () => void;
  }
}

export {};