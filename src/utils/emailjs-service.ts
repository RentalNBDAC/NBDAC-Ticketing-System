// EmailJS Service - Handle email notifications via EmailJS
import emailjs from '@emailjs/browser';

// EmailJS configuration interface
export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  privateKey?: string;
  fromName: string;
  fromEmail: string;
}

// EmailJS service class
export class EmailJSService {
  private config: EmailJSConfig | null = null;
  private initialized = false;

  constructor() {
    // Load config from server API (environment variables are server-side only)
    this.loadConfigFromServer().catch(error => {
      console.warn('EmailJS constructor error:', error);
      console.log('💡 EmailJS will be available for manual configuration via goToEmailJSSetup()');
    });
  }

  // Load configuration from server API (where environment variables are accessible)
  private async loadConfigFromServer(): Promise<void> {
    try {
      // Import server info dynamically to avoid circular imports
      const { projectId, publicAnonKey } = await import('./supabase/info');
      
      console.log('📧 Loading EmailJS configuration from server...');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/emailjs-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('📧 Server EmailJS Status Response:');
      console.log(`   Success: ${result.success}`);
      console.log(`   Configured: ${result.emailjs?.configured || false}`);

      if (result.success && result.emailjs && result.emailjs.configured) {
        // The server response doesn't include publicKey in emailjs-status for security
        // We need to make another request to get the complete config, or modify the response
        
        console.log('✅ EmailJS configured on server, getting full configuration...');
        
        // Make another request to get full config including publicKey
        const configResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/get-full-emailjs-config`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (configResponse.ok) {
          const configResult = await configResponse.json();
          
          if (configResult.success && configResult.config) {
            this.config = {
              serviceId: configResult.config.serviceId,
              templateId: configResult.config.templateId,
              publicKey: configResult.config.publicKey,
              privateKey: configResult.config.privateKey,
              fromName: configResult.config.fromName || 'Sistem NBDAC',
              fromEmail: configResult.config.fromEmail || 'noreply@nbdac.gov.my'
            };
            
            console.log('✅ Full EmailJS configuration loaded from server');
            console.log(`   Service ID: ${this.config.serviceId}`);
            console.log(`   Template ID: ${this.config.templateId}`);
            console.log(`   From Name: ${this.config.fromName}`);
            console.log(`   From Email: ${this.config.fromEmail}`);
            
            this.initialize();
            return;
          }
        }
        
        console.warn('⚠️ Could not get full EmailJS configuration');
        console.log('💡 Trying client-side environment fallback...');
        await this.tryClientSideFallback();
      } else {
        console.log('⚠️ EmailJS not configured on server');
        console.log('💡 Server response:', result);
        console.log('💡 Use goToEmailJSSetup() for manual configuration');
        
        // Try fallback to client-side environment check
        await this.tryClientSideFallback();
      }
    } catch (error) {
      console.warn('Failed to load EmailJS config from server:', error);
      console.log('💡 Trying client-side environment fallback...');
      
      // Try fallback to client-side environment check
      await this.tryClientSideFallback();
    }
  }

  // Fallback: Try to load from client-side environment (may not work in production)
  private async tryClientSideFallback(): Promise<void> {
    try {
      const { getAllEmailJSEnvVars } = await import('./emailjs-env-safe');
      const envResult = getAllEmailJSEnvVars();
      
      console.log('🔄 Client-side EmailJS Environment Fallback:');
      console.log(`   Service ID: ${envResult.variables.serviceId.found ? '✅ Found' : '❌ Missing'}`);
      console.log(`   Template ID: ${envResult.variables.templateId.found ? '✅ Found' : '❌ Missing'}`);
      console.log(`   Public Key: ${envResult.variables.publicKey.found ? '✅ Found' : '❌ Missing'}`);

      if (envResult.configured) {
        this.config = {
          serviceId: envResult.variables.serviceId.value!,
          templateId: envResult.variables.templateId.value!,
          publicKey: envResult.variables.publicKey.value!,
          privateKey: envResult.variables.privateKey.value,
          fromName: envResult.variables.fromName.value || 'Sistem NBDAC',
          fromEmail: envResult.variables.fromEmail.value || 'noreply@nbdac.gov.my'
        };
        console.log('✅ EmailJS configuration loaded from client-side fallback');
        this.initialize();
      } else {
        console.log('⚠️ EmailJS configuration not available');
        console.log('💡 Use goToEmailJSSetup() for manual configuration');
      }
    } catch (error) {
      console.warn('Client-side fallback also failed:', error);
      console.log('💡 Use goToEmailJSSetup() for manual configuration');
    }
  }

  // Initialize EmailJS with configuration
  initialize(config?: EmailJSConfig): boolean {
    try {
      if (config) {
        this.config = config;
      }

      if (!this.config) {
        console.warn('EmailJS: No configuration provided');
        return false;
      }

      // Initialize EmailJS
      emailjs.init({
        publicKey: this.config.publicKey,
        privateKey: this.config.privateKey,
      });

      this.initialized = true;
      console.log('✅ EmailJS initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize EmailJS:', error);
      return false;
    }
  }

  // Check if EmailJS is properly configured
  isConfigured(): boolean {
    return this.initialized && this.config !== null;
  }

  // Get current configuration (without sensitive data)
  getConfig(): Partial<EmailJSConfig> | null {
    if (!this.config) return null;
    
    return {
      serviceId: this.config.serviceId,
      templateId: this.config.templateId,
      fromName: this.config.fromName,
      fromEmail: this.config.fromEmail,
      // Don't expose private keys
    };
  }

  // Send admin notification email
  async sendAdminNotification(submission: any, adminEmails: string[]): Promise<boolean> {
    if (!this.isConfigured()) {
      console.error('EmailJS: Service not configured');
      return false;
    }

    if (!adminEmails || adminEmails.length === 0) {
      console.warn('EmailJS: No admin emails provided');
      return false;
    }

    try {
      console.log('📧 Sending EmailJS notification to:', adminEmails);
      
      // Send individual emails to each admin to ensure proper delivery
      let successCount = 0;
      const errors: string[] = [];

      for (const adminEmail of adminEmails) {
        try {
          // Import email helpers for professional formatting
          const { generateProfessionalEmailHTML, generatePlainTextEmail, mapDataFrequencyToMalay } = await import('./email-helpers');
          
          // Prepare email template parameters for each recipient using multiple field variations
          const templateParams = {
            // Primary recipient fields (try multiple variations)
            to_email: adminEmail,
            recipient_email: adminEmail,
            user_email: adminEmail, // Some templates use this
            to_name: 'Admin',
            user_name: 'Admin', // Alternative field
            
            // Email content (multiple variations)
            subject: `Permohonan Projek Baru - ${submission.namaProjek || 'Tidak Dinyatakan'}`,
            email_subject: `Permohonan Projek Baru - ${submission.namaProjek || 'Tidak Dinyatakan'}`,
            
            // Sender information
            from_name: this.config!.fromName,
            sender_name: this.config!.fromName,
            from_email: this.config!.fromEmail,
            sender_email: this.config!.fromEmail,
            reply_to: this.config!.fromEmail,
            
            // Professional HTML message content
            message_html: generateProfessionalEmailHTML(submission, submission.id),
            
            // Plain text message content (fallback)
            message: generatePlainTextEmail(submission, submission.id),
            
            // Alternative message field names
            email_message: `Permohonan projek baru: ${submission.namaProjek || 'Tidak dinyatakan'}`,
            content: `Permohonan projek baru telah diterima dari ${submission.namaPegawai || 'Tidak dinyatakan'} (${submission.bahagian || 'Tidak dinyatakan'}).`,
            
            // Individual submission fields for flexible template design
            nama_projek: submission.namaProjek || 'Tidak dinyatakan',
            bahagian: submission.bahagian || 'Tidak dinyatakan',
            nama_pegawai: submission.namaPegawai || 'Tidak dinyatakan',
            pemohon_email: submission.email || 'Tidak dinyatakan',
            tarikh: submission.tarikh || new Date().toLocaleDateString('ms-MY'),
            tujuan_projek: submission.tujuanProjek || 'Tidak dinyatakan',
            website_url: submission.websiteUrl || 'Tidak dinyatakan',
            kutipan_data: mapDataFrequencyToMalay(submission.kutipanData || 'Tidak dinyatakan'),
            catatan: submission.catatan || 'Tiada catatan',
            status: submission.status || 'Menunggu',
            
            // System info
            submission_id: submission.id,
            submission_time: new Date().toLocaleString('ms-MY'),
            system_name: 'Sistem Permohonan Projek NBDAC',
          };

          console.log(`📤 Sending to: ${adminEmail}`);
          
          // Debug template parameters
          console.log('🔍 Template parameters for debugging:');
          console.log('   Recipient fields:', { 
            to_email: templateParams.to_email, 
            recipient_email: templateParams.recipient_email,
            user_email: templateParams.user_email
          });
          console.log('   Subject:', templateParams.subject);
          console.log('   Service ID:', this.config!.serviceId);
          console.log('   Template ID:', this.config!.templateId);
          
          // Send email using EmailJS
          const response = await emailjs.send(
            this.config!.serviceId,
            this.config!.templateId,
            templateParams
          );

          if (response.status === 200) {
            console.log(`✅ Email sent successfully to: ${adminEmail}`);
            successCount++;
          } else {
            console.error(`❌ Email failed to: ${adminEmail}`, response);
            errors.push(`${adminEmail}: ${response.text || 'Unknown error'}`);
          }

        } catch (emailError) {
          console.error(`💥 Error sending to ${adminEmail}:`, emailError);
          errors.push(`${adminEmail}: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`);
        }
      }

      if (successCount > 0) {
        console.log(`✅ EmailJS notifications sent successfully to ${successCount}/${adminEmails.length} recipients`);
        if (errors.length > 0) {
          console.warn('⚠️ Some emails failed:', errors);
        }
        return true;
      } else {
        console.error('❌ All EmailJS notifications failed');
        console.error('Errors:', errors);
        return false;
      }

    } catch (error) {
      console.error('💥 EmailJS notification error:', error);
      return false;
    }
  }

  // Test EmailJS configuration
  async testConfiguration(testEmail: string): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'EmailJS tidak dikonfigurasi dengan betul'
      };
    }

    try {
      // Import email helpers for professional formatting
      const { generateProfessionalEmailHTML, generatePlainTextEmail } = await import('./email-helpers');
      
      // Create test submission object
      const testSubmission = {
        id: 'test-' + Date.now(),
        namaProjek: 'Test Project - Email Configuration',
        bahagian: 'IT Department',
        namaPegawai: 'System Tester',
        email: testEmail,
        tarikh: new Date().toLocaleDateString('ms-MY'),
        tujuanProjek: 'Testing EmailJS notification system with professional government-style template',
        websiteUrl: 'https://example.com',
        kutipanData: 'one-off',
        catatan: 'This is a test email to verify EmailJS integration and professional template formatting'
      };
      
      const testParams = {
        // Primary recipient fields (multiple variations for compatibility)
        to_email: testEmail,
        recipient_email: testEmail,
        user_email: testEmail,
        to_name: 'Test User',
        user_name: 'Test User',
        
        // Email content (multiple field variations)
        subject: 'Test Email - Sistem NBDAC',
        email_subject: 'Test Email - Sistem NBDAC',
        
        // Sender information
        from_name: this.config!.fromName,
        sender_name: this.config!.fromName,
        from_email: this.config!.fromEmail,
        sender_email: this.config!.fromEmail,
        reply_to: this.config!.fromEmail,
        
        // Professional HTML message content
        message_html: generateProfessionalEmailHTML(testSubmission, testSubmission.id),
        
        // Plain text test message (fallback)
        message: generatePlainTextEmail(testSubmission, testSubmission.id),
        
        // Alternative message fields
        email_message: 'Test email dari Sistem NBDAC',
        content: `Test email configuration untuk ${testEmail}`,
        
        // Individual fields for template flexibility
        nama_projek: testSubmission.namaProjek,
        bahagian: testSubmission.bahagian,
        nama_pegawai: testSubmission.namaPegawai,
        pemohon_email: testSubmission.email,
        tarikh: testSubmission.tarikh,
        tujuan_projek: testSubmission.tujuanProjek,
        website_url: testSubmission.websiteUrl,
        kutipan_data: 'Satu kali sahaja', // Malay version of 'one-off'
        catatan: testSubmission.catatan,
        status: 'Test',
        submission_id: testSubmission.id,
        submission_time: new Date().toLocaleString('ms-MY'),
        system_name: 'Sistem Permohonan Projek NBDAC - Test Mode',
      };

      const response = await emailjs.send(
        this.config!.serviceId,
        this.config!.templateId,
        testParams
      );

      if (response.status === 200) {
        return {
          success: true,
          message: 'Email test berjaya! Sila semak inbox anda.'
        };
      } else {
        return {
          success: false,
          message: `Email test gagal: ${response.text || 'Unknown error'}`
        };
      }

    } catch (error) {
      return {
        success: false,
        message: `Email test gagal: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Update configuration
  updateConfig(newConfig: EmailJSConfig): boolean {
    try {
      this.config = newConfig;
      return this.initialize();
    } catch (error) {
      console.error('Failed to update EmailJS config:', error);
      return false;
    }
  }

  // Clear configuration
  clearConfig(): void {
    this.config = null;
    this.initialized = false;
    console.log('EmailJS configuration cleared');
  }
}

// Create singleton instance
export const emailjsService = new EmailJSService();

// Helper function for easy email sending
export const sendEmailNotification = async (submission: any, adminEmails: string[]): Promise<boolean> => {
  return await emailjsService.sendAdminNotification(submission, adminEmails);
};

// Helper function for testing email configuration
export const testEmailConfiguration = async (testEmail: string): Promise<{ success: boolean; message: string }> => {
  return await emailjsService.testConfiguration(testEmail);
};