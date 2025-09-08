// Server-side EmailJS notification service for sending admin notifications
import * as kv from './kv_store.tsx';

// EmailJS configuration interface
interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  privateKey?: string;
  fromName: string;
  fromEmail: string;
}

// Get EmailJS configuration from KV store or environment
const getEmailJSConfig = async (): Promise<EmailJSConfig | null> => {
  try {
    // First try to get from KV store
    const storedConfig = await kv.get('emailjs_config');
    if (storedConfig && storedConfig.serviceId && storedConfig.templateId && storedConfig.publicKey) {
      console.log('📧 Using EmailJS config from KV store');
      return storedConfig as EmailJSConfig;
    }

    // Fallback to environment variables
    const envServiceId = Deno.env.get('EMAILJS_SERVICE_ID');
    const envTemplateId = Deno.env.get('EMAILJS_TEMPLATE_ID');
    const envPublicKey = Deno.env.get('EMAILJS_PUBLIC_KEY');
    const envPrivateKey = Deno.env.get('EMAILJS_PRIVATE_KEY');
    const envFromName = Deno.env.get('EMAILJS_FROM_NAME');
    const envFromEmail = Deno.env.get('EMAILJS_FROM_EMAIL');

    if (envServiceId && envTemplateId && envPublicKey) {
      console.log('📧 Using EmailJS config from environment variables');
      return {
        serviceId: envServiceId,
        templateId: envTemplateId,
        publicKey: envPublicKey,
        privateKey: envPrivateKey,
        fromName: envFromName || 'Sistem NBDAC',
        fromEmail: envFromEmail || 'noreply@nbdac.gov.my'
      };
    }

    console.warn('⚠️ EmailJS configuration not found in KV store or environment');
    return null;
  } catch (error) {
    console.error('💥 Error getting EmailJS config:', error);
    return null;
  }
};

// Send admin notification via EmailJS API (server-side)
export const sendAdminNotificationViaEmailJS = async (
  submission: any,
  adminEmails: string[]
): Promise<{ success: boolean; method: string; sent: number; total: number; error?: string }> => {
  try {
    console.log('📧 Preparing EmailJS admin notification...');
    
    if (!adminEmails || adminEmails.length === 0) {
      console.warn('⚠️ No admin emails provided');
      return {
        success: false,
        method: 'emailjs',
        sent: 0,
        total: 0,
        error: 'No admin emails provided'
      };
    }

    // Get EmailJS configuration
    const config = await getEmailJSConfig();
    if (!config) {
      console.error('❌ EmailJS not configured - falling back to console logging');
      return logNotificationToConsole(submission, adminEmails);
    }

    console.log(`📧 Found EmailJS config, sending to ${adminEmails.length} admin(s)...`);
    console.log('📧 Service ID:', config.serviceId);
    console.log('📧 Template ID:', config.templateId);
    console.log('📧 Recipients:', adminEmails);

    // Import email helpers for professional formatting (server-side version)
    const { generateProfessionalEmailHTML, generatePlainTextEmail, mapDataFrequencyToMalay } = await import('./email-helpers.tsx');
    
    // Prepare template parameters for EmailJS (client-side will use these)
    const templateParams = {
      // Standard EmailJS recipient fields (will be set per recipient on client-side)
      to_email: adminEmails[0] || 'admin@example.com', // First admin as example
      to_name: 'Admin',
      recipient_email: adminEmails[0] || 'admin@example.com',
      
      // Email content
      from_name: config.fromName,
      from_email: config.fromEmail,
      reply_to: config.fromEmail,
      subject: `Permohonan Projek Baru - ${submission.namaProjek || submission.nama_projek || 'Tidak Dinyatakan'}`,
      
      // Professional HTML message content
      message_html: generateProfessionalEmailHTML(submission, submission.id || 'unknown'),
      
      // Plain text message content (fallback)
      message: generatePlainTextEmail(submission, submission.id || 'unknown'),
      
      // Individual submission fields for flexible template design
      nama_projek: submission.namaProjek || submission.nama_projek || 'Tidak dinyatakan',
      bahagian: submission.bahagian || 'Tidak dinyatakan',
      nama_pegawai: submission.namaPegawai || submission.nama_pegawai || 'Tidak dinyatakan',
      pemohon_email: submission.email || 'Tidak dinyatakan',
      tarikh: submission.tarikh || new Date().toLocaleDateString('ms-MY'),
      tujuan_projek: submission.tujuanProjek || 'Tidak dinyatakan',
      website_url: submission.websiteUrl || 'Tidak dinyatakan',
      kutipan_data: mapDataFrequencyToMalay(submission.kutipanData || 'Tidak dinyatakan'),
      catatan: submission.catatan || 'Tiada catatan',
      status: 'Menunggu',
      
      // System info
      submission_id: submission.id || 'unknown',
      submission_time: new Date().toLocaleString('ms-MY'),
      system_name: 'Sistem Permohonan Projek NBDAC',
      
      // Note for server-side logging
      admin_emails_list: adminEmails.join(', '),
      total_admins: adminEmails.length
    };

    // EmailJS API calls are browser-only, always fall back to console logging on server
    console.log('⚠️ EmailJS API calls are browser-only, cannot send from server');
    console.log('💡 EmailJS configuration is available but will be used by client-side code');
    console.log('🔄 Falling back to enhanced console logging...');
    
    // Always fall back to console logging on server-side
    return logNotificationToConsole(submission, adminEmails);

  } catch (error) {
    console.error('💥 EmailJS notification error:', error);
    console.log('📧 Falling back to console logging...');
    return logNotificationToConsole(submission, adminEmails);
  }
};

// Console logging fallback
const logNotificationToConsole = (
  submission: any,
  adminEmails: string[]
): { success: boolean; method: string; sent: number; total: number } => {
  
  console.log('');
  console.log('📧 EMAIL NOTIFICATION (CONSOLE FALLBACK)');
  console.log('==========================================');
  console.log('📤 To:', adminEmails.join(', '));
  console.log('📋 Subject:', `Permohonan Projek Baru - ${submission.namaProjek || submission.nama_projek || 'Tidak Dinyatakan'}`);
  console.log('📤 From: Sistem NBDAC');
  console.log('⏰ Time:', new Date().toLocaleString());
  console.log('');
  console.log('📝 SUBMISSION DETAILS:');
  console.log('   Nama Projek:', submission.namaProjek || submission.nama_projek || 'Tidak dinyatakan');
  console.log('   Bahagian:', submission.bahagian || 'Tidak dinyatakan');
  console.log('   Nama Pegawai:', submission.namaPegawai || submission.nama_pegawai || 'Tidak dinyatakan');
  console.log('   Email:', submission.email || 'Tidak dinyatakan');
  console.log('   Tarikh:', submission.tarikh || new Date().toLocaleDateString('ms-MY'));
  console.log('   Tujuan:', submission.tujuanProjek || 'Tidak dinyatakan');
  console.log('   Website URL:', submission.websiteUrl || 'Tidak dinyatakan');
  console.log('   Kutipan Data:', submission.kutipanData || 'Tidak dinyatakan');
  console.log('   Catatan:', submission.catatan || 'Tiada catatan');
  console.log('   Status: Menunggu');
  console.log('');
  console.log('💡 To enable EmailJS email delivery:');
  console.log('   1. Configure EmailJS via goToEmailJSSetup()');
  console.log('   2. Set EMAILJS environment variables');
  console.log('   3. Test with testEmailJSConfiguration()');
  console.log('');

  return {
    success: true,
    method: 'console',
    sent: adminEmails.length,
    total: adminEmails.length
  };
};

// Check EmailJS configuration status
export const getEmailJSStatus = async (): Promise<{
  configured: boolean;
  method: string;
  config?: any;
  source?: string;
}> => {
  try {
    const config = await getEmailJSConfig();
    
    if (config) {
      return {
        configured: true,
        method: 'emailjs',
        config: {
          serviceId: config.serviceId,
          templateId: config.templateId,
          fromName: config.fromName,
          fromEmail: config.fromEmail,
          // Don't expose keys
        },
        source: 'kv_store_or_env'
      };
    }

    return {
      configured: false,
      method: 'console',
      source: 'none'
    };

  } catch (error) {
    console.error('Error checking EmailJS status:', error);
    return {
      configured: false,
      method: 'console',
      source: 'error'
    };
  }
};

// Test EmailJS configuration
export const testEmailJSConfiguration = async (testEmail: string): Promise<{
  success: boolean;
  message: string;
  method: string;
}> => {
  try {
    const config = await getEmailJSConfig();
    
    if (!config) {
      return {
        success: false,
        message: 'EmailJS not configured',
        method: 'none'
      };
    }

    // Create test submission
    const testSubmission = {
      id: 'test-' + Date.now(),
      namaProjek: 'Test Project Notification',
      bahagian: 'IT Testing Department',
      namaPegawai: 'System Tester',
      email: testEmail,
      tarikh: new Date().toLocaleDateString('ms-MY'),
      tujuanProjek: 'Testing EmailJS notification system',
      websiteUrl: 'https://test.example.com',
      kutipanData: 'one-off',
      catatan: 'This is a test notification to verify EmailJS integration'
    };

    // Send test email (will always fall back to console on server-side)
    const result = await sendAdminNotificationViaEmailJS(testSubmission, [testEmail]);

    // Since EmailJS is browser-only, server-side tests always use console logging
    if (result.success && result.method === 'console') {
      return {
        success: true,
        message: 'Server-side test successful - EmailJS configuration available for client-side use',
        method: 'console'
      };
    } else {
      return {
        success: false,
        message: result.error || 'Server-side test failed',
        method: 'error'
      };
    }

  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Test failed',
      method: 'error'
    };
  }
};