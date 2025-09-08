// EmailJS Integration - Handle email notifications for submissions
import { emailjsService } from './emailjs-service';
import { emailjsAPI } from './api';

// Enhanced submission handler with EmailJS integration
export const handleSubmissionWithEmailJS = async (submissionData: any): Promise<boolean> => {
  try {
    console.log('📤 Processing submission with EmailJS integration...');
    
    // First, create the submission via API
    const { api } = await import('./api');
    const result = await api.createSubmission(submissionData);
    
    if (!result.success) {
      console.error('❌ Submission creation failed:', result.error);
      return false;
    }
    
    console.log('✅ Submission created successfully:', result.submission?.id);
    
    // Now handle email notifications
    await sendEmailNotificationForSubmission(result.submission);
    
    return true;
  } catch (error) {
    console.error('💥 Error in submission with EmailJS:', error);
    return false;
  }
};

// Send email notification for new submission
export const sendEmailNotificationForSubmission = async (submission: any): Promise<void> => {
  try {
    console.log('📧 Attempting to send email notification...');
    
    // Check if EmailJS is configured
    if (!emailjsService.isConfigured()) {
      console.log('⚠️ EmailJS not configured, attempting to load from server...');
      
      // Try to get configuration from server
      try {
        const configResponse = await emailjsAPI.getConfig();
        if (configResponse.success && configResponse.configured) {
          console.log('✅ EmailJS configuration loaded from server');
          // Configuration should be automatically loaded by emailjsService
        } else {
          console.log('📧 EmailJS not configured - skipping email notification');
          console.log('💡 Configure EmailJS in admin panel to enable notifications');
          return;
        }
      } catch (configError) {
        console.log('⚠️ Could not load EmailJS config from server:', configError);
        return;
      }
    }
    
    // Get admin emails for notification
    try {
      const adminEmailsResponse = await emailjsAPI.getAdminEmails();
      
      if (!adminEmailsResponse.success || !adminEmailsResponse.emails || adminEmailsResponse.emails.length === 0) {
        console.log('⚠️ No admin emails found - skipping notification');
        return;
      }
      
      const adminEmails = adminEmailsResponse.emails;
      console.log(`📧 Sending notification to ${adminEmails.length} admin(s):`, adminEmails);
      
      // Send notification via EmailJS
      const emailSuccess = await emailjsService.sendAdminNotification(submission, adminEmails);
      
      if (emailSuccess) {
        console.log('✅ Email notification sent successfully via EmailJS');
      } else {
        console.log('❌ Email notification failed via EmailJS');
      }
      
    } catch (emailError) {
      console.error('💥 Error getting admin emails or sending notification:', emailError);
    }
    
  } catch (error) {
    console.error('💥 Error in email notification process:', error);
    // Don't throw - email failure shouldn't break submission
  }
};

// Initialize EmailJS from server configuration
export const initializeEmailJSFromServer = async (): Promise<boolean> => {
  try {
    console.log('🔄 Initializing EmailJS from server configuration...');
    
    const configResponse = await emailjsAPI.getConfig();
    
    if (!configResponse.success || !configResponse.configured) {
      console.log('📧 EmailJS not configured on server');
      return false;
    }
    
    // The emailjsService should automatically initialize from environment variables
    // or we can manually initialize if needed
    if (!emailjsService.isConfigured()) {
      console.log('⚠️ EmailJS service not initialized despite server configuration');
      return false;
    }
    
    console.log('✅ EmailJS initialized successfully from server');
    return true;
    
  } catch (error) {
    console.error('💥 Error initializing EmailJS from server:', error);
    return false;
  }
};

// Check EmailJS status and provide troubleshooting info
export const checkEmailJSStatus = async (): Promise<{
  configured: boolean;
  adminEmails: number;
  ready: boolean;
  message: string;
}> => {
  try {
    // Check EmailJS configuration
    const configCheck = emailjsService.isConfigured();
    
    // Check server status
    const statusResponse = await emailjsAPI.getStatus();
    
    if (!statusResponse.success) {
      return {
        configured: false,
        adminEmails: 0,
        ready: false,
        message: 'Cannot connect to server to check EmailJS status'
      };
    }
    
    const { emailjs, adminEmails, ready } = statusResponse;
    
    return {
      configured: emailjs.configured && configCheck,
      adminEmails: adminEmails.count,
      ready: ready && configCheck,
      message: ready && configCheck 
        ? 'EmailJS ready for notifications'
        : 'EmailJS needs configuration or admin emails'
    };
    
  } catch (error) {
    console.error('💥 Error checking EmailJS status:', error);
    return {
      configured: false,
      adminEmails: 0,
      ready: false,
      message: 'Error checking EmailJS status'
    };
  }
};

// Test EmailJS configuration with a real email
export const testEmailJSConfiguration = async (testEmail: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    console.log('🧪 Testing EmailJS configuration...');
    
    if (!emailjsService.isConfigured()) {
      return {
        success: false,
        message: 'EmailJS is not configured. Please configure it first.'
      };
    }
    
    // Use the emailjsService test function
    const result = await emailjsService.testConfiguration(testEmail);
    
    return result;
    
  } catch (error) {
    console.error('💥 Error testing EmailJS:', error);
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};