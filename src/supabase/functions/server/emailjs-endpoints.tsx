// EmailJS Server Endpoints - Handle EmailJS configuration and notifications
import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';
import { getAdminEmails } from './admin-endpoints.tsx';

const app = new Hono();

// EmailJS configuration keys in KV store
const EMAILJS_CONFIG_KEY = 'emailjs_config';
const ADMIN_EMAILS_KEY = 'admin_emails';

// Save EmailJS configuration
app.post('/save-emailjs-config', async (c) => {
  try {
    const config = await c.req.json();
    
    console.log('📧 Saving EmailJS configuration...');
    
    // Validate required fields
    if (!config.serviceId || !config.templateId || !config.publicKey) {
      return c.json({
        success: false,
        error: 'Missing required EmailJS configuration fields'
      }, 400);
    }

    // Save configuration to KV store
    await kv.set(EMAILJS_CONFIG_KEY, {
      serviceId: config.serviceId,
      templateId: config.templateId,
      publicKey: config.publicKey,
      privateKey: config.privateKey || null,
      fromName: config.fromName || 'Sistem NBDAC',
      fromEmail: config.fromEmail || 'noreply@nbdac.gov.my',
      updatedAt: new Date().toISOString()
    });

    console.log('✅ EmailJS configuration saved successfully');
    
    return c.json({
      success: true,
      message: 'EmailJS configuration saved successfully'
    });

  } catch (error) {
    console.error('💥 Error saving EmailJS configuration:', error);
    return c.json({
      success: false,
      error: 'Failed to save EmailJS configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get EmailJS configuration (safe version without keys)
app.get('/get-emailjs-config', async (c) => {
  try {
    console.log('📧 Retrieving EmailJS configuration...');
    
    // Check KV store first
    let config = await kv.get(EMAILJS_CONFIG_KEY);
    let configSource = 'kv_store';
    
    if (!config) {
      // Fallback to environment variables
      console.log('📧 No config in KV store, checking environment variables...');
      
      const envServiceId = Deno.env.get('EMAILJS_SERVICE_ID');
      const envTemplateId = Deno.env.get('EMAILJS_TEMPLATE_ID');
      const envPublicKey = Deno.env.get('EMAILJS_PUBLIC_KEY');
      const envPrivateKey = Deno.env.get('EMAILJS_PRIVATE_KEY');
      const envFromName = Deno.env.get('EMAILJS_FROM_NAME');
      const envFromEmail = Deno.env.get('EMAILJS_FROM_EMAIL');
      
      if (envServiceId && envTemplateId && envPublicKey) {
        config = {
          serviceId: envServiceId,
          templateId: envTemplateId,
          publicKey: envPublicKey,
          privateKey: envPrivateKey,
          fromName: envFromName || 'Sistem NBDAC',
          fromEmail: envFromEmail || 'noreply@nbdac.gov.my'
        };
        configSource = 'environment_variables';
        console.log('✅ EmailJS configuration loaded from environment variables');
      }
    }
    
    if (!config) {
      return c.json({
        success: true,
        configured: false,
        config: null,
        source: null
      });
    }

    // Return config without sensitive private key
    const safeConfig = {
      serviceId: config.serviceId,
      templateId: config.templateId,
      fromName: config.fromName,
      fromEmail: config.fromEmail,
      source: configSource
      // Don't return publicKey or privateKey for security
    };

    console.log(`✅ EmailJS configuration retrieved from ${configSource}`);
    
    return c.json({
      success: true,
      configured: true,
      config: safeConfig
    });

  } catch (error) {
    console.error('💥 Error retrieving EmailJS configuration:', error);
    return c.json({
      success: false,
      error: 'Failed to retrieve EmailJS configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get FULL EmailJS configuration including keys (for client-side initialization)
app.get('/get-full-emailjs-config', async (c) => {
  try {
    console.log('📧 Retrieving FULL EmailJS configuration for client initialization...');
    
    // Check KV store first
    let config = await kv.get(EMAILJS_CONFIG_KEY);
    let configSource = 'kv_store';
    
    if (!config) {
      // Fallback to environment variables
      console.log('📧 No config in KV store, checking environment variables...');
      
      const envServiceId = Deno.env.get('EMAILJS_SERVICE_ID');
      const envTemplateId = Deno.env.get('EMAILJS_TEMPLATE_ID');
      const envPublicKey = Deno.env.get('EMAILJS_PUBLIC_KEY');
      const envPrivateKey = Deno.env.get('EMAILJS_PRIVATE_KEY');
      const envFromName = Deno.env.get('EMAILJS_FROM_NAME');
      const envFromEmail = Deno.env.get('EMAILJS_FROM_EMAIL');
      
      if (envServiceId && envTemplateId && envPublicKey) {
        config = {
          serviceId: envServiceId,
          templateId: envTemplateId,
          publicKey: envPublicKey,
          privateKey: envPrivateKey,
          fromName: envFromName || 'Sistem NBDAC',
          fromEmail: envFromEmail || 'noreply@nbdac.gov.my'
        };
        configSource = 'environment_variables';
        console.log('✅ EmailJS configuration loaded from environment variables');
      }
    }
    
    if (!config) {
      return c.json({
        success: true,
        configured: false,
        config: null,
        source: null
      });
    }

    // Return full config including publicKey (needed for client-side EmailJS)
    const fullConfig = {
      serviceId: config.serviceId,
      templateId: config.templateId,
      publicKey: config.publicKey, // Include for client-side initialization
      privateKey: config.privateKey, // Include if available
      fromName: config.fromName,
      fromEmail: config.fromEmail,
      source: configSource
    };

    console.log(`✅ FULL EmailJS configuration retrieved from ${configSource}`);
    
    return c.json({
      success: true,
      configured: true,
      config: fullConfig
    });

  } catch (error) {
    console.error('💥 Error retrieving full EmailJS configuration:', error);
    return c.json({
      success: false,
      error: 'Failed to retrieve full EmailJS configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Clear EmailJS configuration
app.delete('/clear-emailjs-config', async (c) => {
  try {
    console.log('📧 Clearing EmailJS configuration...');
    
    await kv.del(EMAILJS_CONFIG_KEY);
    
    console.log('✅ EmailJS configuration cleared');
    
    return c.json({
      success: true,
      message: 'EmailJS configuration cleared successfully'
    });

  } catch (error) {
    console.error('💥 Error clearing EmailJS configuration:', error);
    return c.json({
      success: false,
      error: 'Failed to clear EmailJS configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Test EmailJS configuration
app.post('/test-emailjs', async (c) => {
  try {
    const { testEmail } = await c.req.json();
    
    if (!testEmail) {
      return c.json({
        success: false,
        error: 'Test email address is required'
      }, 400);
    }

    console.log(`📧 Testing EmailJS configuration with email: ${testEmail}`);
    
    // Get EmailJS configuration (check KV store first, then environment variables)
    let config = await kv.get(EMAILJS_CONFIG_KEY);
    let configSource = 'kv_store';
    
    if (!config) {
      // Fallback to environment variables
      const envServiceId = Deno.env.get('EMAILJS_SERVICE_ID');
      const envTemplateId = Deno.env.get('EMAILJS_TEMPLATE_ID');
      const envPublicKey = Deno.env.get('EMAILJS_PUBLIC_KEY');
      const envPrivateKey = Deno.env.get('EMAILJS_PRIVATE_KEY');
      const envFromName = Deno.env.get('EMAILJS_FROM_NAME');
      const envFromEmail = Deno.env.get('EMAILJS_FROM_EMAIL');
      
      if (envServiceId && envTemplateId && envPublicKey) {
        config = {
          serviceId: envServiceId,
          templateId: envTemplateId,
          publicKey: envPublicKey,
          privateKey: envPrivateKey,
          fromName: envFromName || 'Sistem NBDAC',
          fromEmail: envFromEmail || 'noreply@nbdac.gov.my'
        };
        configSource = 'environment_variables';
      }
    }
    
    if (!config) {
      return c.json({
        success: false,
        error: 'EmailJS not configured in KV store or environment variables'
      }, 400);
    }

    // For server-side testing, we'll just validate the configuration
    // The actual email sending will be done client-side via EmailJS
    const isValid = config.serviceId && config.templateId && config.publicKey;
    
    if (isValid) {
      console.log(`✅ EmailJS configuration is valid (source: ${configSource})`);
      return c.json({
        success: true,
        message: 'EmailJS configuration is valid. Test email should be sent from client.',
        config: {
          serviceId: config.serviceId,
          templateId: config.templateId,
          fromName: config.fromName,
          fromEmail: config.fromEmail,
          source: configSource
        }
      });
    } else {
      return c.json({
        success: false,
        error: 'EmailJS configuration is incomplete'
      });
    }

  } catch (error) {
    console.error('💥 Error testing EmailJS:', error);
    return c.json({
      success: false,
      error: 'Failed to test EmailJS configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get admin emails for notifications (fetch from Supabase Auth)
app.get('/get-admin-emails', async (c) => {
  try {
    console.log('👥 Retrieving admin emails from Supabase authentication...');
    
    // Fetch admin emails directly from Supabase auth users
    const adminEmails = await getAdminEmails();
    
    if (!adminEmails || adminEmails.length === 0) {
      console.warn('⚠️ No admin users found in Supabase authentication');
      console.log('💡 TIP: Create users in Supabase Auth (all users are admin)');
      console.log('🔧 Quick fix: Run emergencySetup() to create admin user');
      
      return c.json({
        success: true,
        emails: [],
        source: 'supabase_auth',
        recipients: 0,
        message: 'No admin users found in Supabase authentication'
      });
    }

    console.log(`✅ Retrieved ${adminEmails.length} admin email(s) from Supabase auth:`, adminEmails);
    
    return c.json({
      success: true,
      emails: adminEmails,
      source: 'supabase_auth',
      recipients: adminEmails.length
    });

  } catch (error) {
    console.error('💥 Error retrieving admin emails from Supabase auth:', error);
    return c.json({
      success: false,
      error: 'Failed to retrieve admin emails from Supabase authentication',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Set admin emails
app.post('/set-admin-emails', async (c) => {
  try {
    const { emails } = await c.req.json();
    
    if (!emails || !Array.isArray(emails)) {
      return c.json({
        success: false,
        error: 'Invalid emails array provided'
      }, 400);
    }

    // Validate email format
    const validEmails = emails.filter(email => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return typeof email === 'string' && emailRegex.test(email);
    });

    if (validEmails.length === 0) {
      return c.json({
        success: false,
        error: 'No valid email addresses provided'
      }, 400);
    }

    console.log(`👥 Saving ${validEmails.length} admin emails...`);
    
    await kv.set(ADMIN_EMAILS_KEY, validEmails);
    
    console.log('✅ Admin emails saved successfully');
    
    return c.json({
      success: true,
      message: `${validEmails.length} admin emails saved successfully`,
      emails: validEmails
    });

  } catch (error) {
    console.error('💥 Error saving admin emails:', error);
    return c.json({
      success: false,
      error: 'Failed to save admin emails',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// EmailJS status check
app.get('/emailjs-status', async (c) => {
  try {
    console.log('📧 Checking EmailJS status...');
    
    // Check KV store configuration first
    const config = await kv.get(EMAILJS_CONFIG_KEY);
    let emailJSConfig = null;
    let configSource = null;
    
    if (config && config.serviceId && config.templateId && config.publicKey) {
      emailJSConfig = config;
      configSource = 'kv_store';
      console.log('📧 EmailJS config found in KV store');
    } else {
      // Fallback to environment variables
      console.log('🔍 Loading EmailJS configuration from environment variables...');
      const envServiceId = Deno.env.get('EMAILJS_SERVICE_ID');
      const envTemplateId = Deno.env.get('EMAILJS_TEMPLATE_ID');
      const envPublicKey = Deno.env.get('EMAILJS_PUBLIC_KEY');
      const envPrivateKey = Deno.env.get('EMAILJS_PRIVATE_KEY');
      const envFromName = Deno.env.get('EMAILJS_FROM_NAME');
      const envFromEmail = Deno.env.get('EMAILJS_FROM_EMAIL');
      
      if (envServiceId && envTemplateId && envPublicKey) {
        emailJSConfig = {
          serviceId: envServiceId,
          templateId: envTemplateId,
          publicKey: envPublicKey,
          privateKey: envPrivateKey,
          fromName: envFromName || 'Sistem NBDAC',
          fromEmail: envFromEmail || 'noreply@nbdac.gov.my',
          updatedAt: 'environment_variables'
        };
        configSource = 'environment_variables';
        console.log('✅ EmailJS config loaded from environment variables');
      } else {
        console.log('❌ Environment variables not found or incomplete.');
        console.log('💡 Available variables:');
        console.log(`   EMAILJS_SERVICE_ID: ${envServiceId ? '✅' : '❌'}`);
        console.log(`   EMAILJS_TEMPLATE_ID: ${envTemplateId ? '✅' : '❌'}`);
        console.log(`   EMAILJS_PUBLIC_KEY: ${envPublicKey ? '✅' : '❌'}`);
        console.log(`   EMAILJS_PRIVATE_KEY: ${envPrivateKey ? '✅' : '❌'}`);
        console.log(`   EMAILJS_FROM_NAME: ${envFromName ? '✅' : '❌'}`);
        console.log(`   EMAILJS_FROM_EMAIL: ${envFromEmail ? '✅' : '❌'}`);
      }
    }
    
    const adminEmails = await getAdminEmails(); // Fetch from Supabase auth
    
    const isConfigured = !!emailJSConfig;
    const hasAdminEmails = adminEmails && adminEmails.length > 0;
    
    return c.json({
      success: true,
      emailjs: {
        configured: isConfigured,
        serviceId: emailJSConfig?.serviceId || null,
        templateId: emailJSConfig?.templateId || null,
        fromName: emailJSConfig?.fromName || 'Sistem NBDAC',
        fromEmail: emailJSConfig?.fromEmail || 'noreply@nbdac.gov.my',
        lastUpdated: emailJSConfig?.updatedAt || null,
        source: configSource
      },
      adminEmails: {
        configured: hasAdminEmails,
        count: adminEmails.length,
        emails: adminEmails,
        source: 'supabase_auth'
      },
      ready: isConfigured && hasAdminEmails
    });

  } catch (error) {
    console.error('💥 Error checking EmailJS status:', error);
    return c.json({
      success: false,
      error: 'Failed to check EmailJS status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Send test email for admin notification testing
app.post('/send-test-email', async (c) => {
  try {
    console.log('📧 Sending test email notification via enhanced notification service...');
    
    // Import the enhanced notification service
    const { sendEnhancedAdminNotification } = await import('./enhanced-notification-service.tsx');
    
    // Create a test submission with realistic data
    const testSubmission = {
      id: `test-email-${Date.now()}`,
      namaProjek: 'Test Email - Sistem Permohonan Projek Web Scraping NBDAC',
      nama_projek: 'Test Email - Sistem Permohonan Projek Web Scraping NBDAC',
      bahagian: 'Bahagian Teknologi Maklumat',
      namaPegawai: 'Pentadbir Sistem',
      nama_pegawai: 'Pentadbir Sistem',
      email: 'admin@nbdac.gov.my',
      tarikh: new Date().toLocaleDateString('ms-MY'),
      tujuanProjek: 'Ini adalah email ujian untuk memastikan sistem notifikasi berfungsi dengan betul. Email ini dihantar untuk menguji konfigurasi EmailJS dan format template.',
      websiteUrl: 'https://nbdac.gov.my',
      kutipanData: 'one-off',
      catatan: 'Email ujian - sila abaikan permohonan ini. Sistem sedang menguji format email dan konfigurasi notification.',
      status: 'Menunggu',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('📧 Test submission data prepared');
    
    // Send the enhanced notification
    const result = await sendEnhancedAdminNotification(testSubmission);
    
    console.log('📧 Enhanced notification result:', result);
    
    return c.json({
      success: true,
      message: 'Test email notification sent successfully',
      submissionData: {
        id: testSubmission.id,
        namaProjek: testSubmission.namaProjek,
        bahagian: testSubmission.bahagian,
        namaPegawai: testSubmission.namaPegawai,
        email: testSubmission.email
      },
      notificationResult: result
    });

  } catch (error) {
    console.error('💥 Error sending test email:', error);
    return c.json({
      success: false,
      error: 'Failed to send test email notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default app;