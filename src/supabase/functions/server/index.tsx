import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import * as kv from './kv_store.tsx';
import { 
  ensureSubmissionsTableExists, 
  checkSubmissionsTableExists,
  getTableSetupInstructions,
  createTableViaEndpoint
} from './database-setup.tsx';
import { getAdminEmails, getAdminUsers, getAdminCount } from './admin-endpoints.tsx';
import {
  sendAdminNotificationViaEmailJS,
  getEmailJSStatus,
  testEmailJSConfiguration
} from './emailjs-notification-service.tsx';
import emailjsEndpoints from './emailjs-endpoints.tsx';
import {
  sendEnhancedAdminNotification,
  getNotificationStats,
  cleanupNotificationLogs
} from './enhanced-notification-service.tsx';

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Enhanced admin notification function using the new enhanced service
const sendAdminNotification = async (submission: any) => {
  try {
    console.log('🚀 Preparing enhanced admin notifications...');
    
    // Use the enhanced notification service with retry logic and detailed logging
    const result = await sendEnhancedAdminNotification(submission);
    
    console.log(`📧 Enhanced notification result: ${result.finalStatus}`);
    console.log(`📊 Delivery: ${result.sent}/${result.total} sent via ${result.method}`);
    
    if (result.failed > 0) {
      console.log(`⚠️ Failed deliveries: ${result.failed}`);
    }
    
    if (result.attempts && result.attempts.length > 0) {
      console.log(`🔄 Total attempts: ${result.attempts.length}`);
      const lastAttempt = result.attempts[result.attempts.length - 1];
      console.log(`📝 Last attempt: ${lastAttempt.method} - ${lastAttempt.success ? 'Success' : 'Failed'}`);
    }
    
    if (result.finalStatus === 'console-logged') {
      console.log('💡 Enhanced notification logged to console - admin should check server logs');
      console.log('🔧 To enable real email delivery, configure EmailJS via goToEmailJSSetup()');
    } else if (result.finalStatus === 'delivered') {
      console.log('✅ Enhanced notifications delivered via EmailJS - check recipients\' inboxes');
    } else if (result.finalStatus === 'partial') {
      console.log('⚠️ Partial delivery - some notifications may have failed');
    }
    
  } catch (error) {
    console.error('💥 Error sending enhanced admin notifications:', error);
    // Don't throw - email failure shouldn't break submission
    
    // Fallback to basic notification if enhanced service fails
    try {
      console.log('🔄 Falling back to basic notification service...');
      const adminEmails = await getAdminEmails();
      if (adminEmails.length > 0) {
        await sendAdminNotificationViaEmailJS(submission, adminEmails);
      }
    } catch (fallbackError) {
      console.error('💥 Fallback notification also failed:', fallbackError);
    }
  }
};

// Check and setup database table on startup (non-blocking)
let databaseTableReady = false;
let databaseInitializationInProgress = false;

const initializeDatabase = async () => {
  if (databaseInitializationInProgress) {
    console.log('🔄 Database initialization already in progress...');
    return;
  }
  
  databaseInitializationInProgress = true;
  
  try {
    console.log('🚀 Initializing database (non-blocking)...');
    
    // Set a reasonable timeout for database initialization
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database initialization timeout')), 10000); // 10 second timeout
    });
    
    const initPromise = ensureSubmissionsTableExists(supabase);
    
    try {
      databaseTableReady = await Promise.race([initPromise, timeoutPromise]) as boolean;
    } catch (timeoutError) {
      console.warn('⚠️ Database initialization timed out, continuing with KV store fallback');
      databaseTableReady = false;
    }
    
    if (!databaseTableReady) {
      console.warn('⚠️ Database table setup incomplete - system will use KV store fallback');
      
      // Show abbreviated setup instructions (don't spam the logs)
      console.log('');
      console.log('💡 QUICK FIX: Run emergencySetup() or create table manually');
      console.log('📍 Supabase Dashboard → SQL Editor');
      console.log('💾 System continues using KV store as fallback');
      console.log('');
    } else {
      console.log('✅ Database table ready');
    }
  } catch (error) {
    console.error('💥 Database initialization error:', error);
    databaseTableReady = false;
  } finally {
    databaseInitializationInProgress = false;
  }
};

// Initialize database asynchronously (non-blocking)
// This runs in the background and doesn't block server startup
setTimeout(() => {
  initializeDatabase().catch(error => {
    console.warn('Background database initialization failed:', error);
  });
}, 100); // Small delay to let server start first

// Background retry for database initialization
setInterval(() => {
  if (!databaseTableReady && !databaseInitializationInProgress) {
    console.log('🔄 Retrying database initialization...');
    initializeDatabase().catch(() => {
      // Silent retry - don't spam logs
    });
  }
}, 60000); // Retry every minute if not ready

const app = new Hono();

// Middleware
app.use('*', logger(console.log));
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Mount EmailJS endpoints
app.route('/make-server-764b8bb4', emailjsEndpoints);

// Cache for health check data to avoid repeated expensive operations
let healthCheckCache: any = null;
let healthCheckCacheTime = 0;
const HEALTH_CHECK_CACHE_TTL = 30000; // 30 seconds cache

// Fast health check with comprehensive system status (cached)
app.get('/make-server-764b8bb4/health', async (c) => {
  try {
    // Return cached result if still fresh (within 30 seconds)
    const now = Date.now();
    if (healthCheckCache && (now - healthCheckCacheTime) < HEALTH_CHECK_CACHE_TTL) {
      return c.json({
        ...healthCheckCache,
        cached: true,
        cache_age_seconds: Math.floor((now - healthCheckCacheTime) / 1000)
      });
    }

    console.log('🏥 Performing fresh health check...');
    
    // Get EmailJS status immediately (fast operation)
    const emailjsStatus = await getEmailJSStatus();
    
    // Start async operations for database and admin checks but don't await them blocking the response
    const promises = {
      tableExists: checkSubmissionsTableExists(supabase).catch(() => false),
      adminCount: getAdminCount().catch(() => 0)
    };
    
    // Set a race condition with timeout to prevent blocking
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve({ 
        tableExists: databaseTableReady, // Use cached value
        adminCount: 0 // Default safe value
      }), 2000); // 2 second timeout
    });
    
    // Race between actual checks and timeout
    const results = await Promise.race([
      Promise.all([promises.tableExists, promises.adminCount]).then(([tableExists, adminCount]) => ({
        tableExists,
        adminCount
      })),
      timeoutPromise
    ]) as { tableExists: boolean; adminCount: number };
    
    const healthData = { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'NBDAC Project Request System',
      version: 'simplified - all users are admin',
      email_service: emailjsStatus.configured ? 'EmailJS + Console fallback' : 'Console logging only',
      database: {
        submissions_table_exists: results.tableExists,
        table_ready: databaseTableReady,
        storage_mode: results.tableExists ? 'Database + KV Fallback' : 'KV Store Only',
        error_fix: !results.tableExists ? 'Run emergencySetup() or create table manually' : null
      },
      admin: {
        admin_users_found: results.adminCount,
        email_notifications: results.adminCount > 0 ? 'Enabled' : 'Disabled - No users found',
        note: 'All authenticated users are admin users',
        fix_command: results.adminCount === 0 ? 'emergencySetup()' : null
      },
      email: {
        emailjs_configured: emailjsStatus.configured,
        service: emailjsStatus.configured ? 'emailjs+console' : 'console',
        method: emailjsStatus.method,
        source: emailjsStatus.source,
        config: emailjsStatus.config
      },
      setup_required: {
        database: !results.tableExists,
        admin_users: results.adminCount === 0,
        email_service: !emailjsStatus.configured
      },
      quick_fixes: {
        all_issues: 'emergencySetup()',
        email_only: 'goToEmailJSSetup()',
        diagnostic: 'testEmailJSConfiguration()',
        setup_emailjs: 'setupEmailJSFromSupabase()'
      },
      performance: {
        response_time_ms: Date.now() - now,
        cached: false
      }
    };
    
    // Cache the result
    healthCheckCache = healthData;
    healthCheckCacheTime = now;
    
    console.log(`✅ Health check completed in ${healthData.performance.response_time_ms}ms`);
    return c.json(healthData);
    
  } catch (error) {
    console.error('Health check error:', error);
    
    // Return a basic health status even if detailed checks fail
    return c.json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      service: 'NBDAC Project Request System',
      error: 'Health check failed',
      message: 'Service is running but detailed status unavailable',
      database: {
        submissions_table_exists: databaseTableReady,
        table_ready: databaseTableReady,
        storage_mode: databaseTableReady ? 'Database + KV Fallback' : 'KV Store Only'
      },
      admin: {
        admin_users_found: 0,
        email_notifications: 'Status unknown',
        note: 'All authenticated users are admin users'
      },
      email: {
        emailjs_configured: false,
        service: 'console',
        status: 'Status check failed'
      },
      performance: {
        response_time_ms: Date.now() - Date.now(),
        cached: false
      }
    }, 503);
  }
});

// Simple ping endpoint for basic connectivity testing (always fast)
app.get('/make-server-764b8bb4/ping', async (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'NBDAC Project Request System',
    message: 'Server is responding',
    uptime: process.uptime ? `${Math.floor(process.uptime())}s` : 'unknown'
  });
});

// CREATE TABLE endpoint for manual triggering
app.post('/make-server-764b8bb4/create-table', async (c) => {
  try {
    console.log('🔧 Manual table creation endpoint triggered');
    
    const result = await createTableViaEndpoint(supabase);
    
    if (result.success) {
      // Update the global flag
      databaseTableReady = true;
      console.log('✅ Table creation successful, updating system status');
    }
    
    return c.json(result);
    
  } catch (error) {
    console.error('Create table endpoint error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to create table',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Simplified create admin user endpoint (no role metadata needed)
app.post('/make-server-764b8bb4/create-admin', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, 400);
    }

    console.log('👤 Creating admin user:', email);
    console.log('💡 Note: All users have admin access');

    // Create user in Supabase Auth (simplified - no role metadata)
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { 
        name: name || email.split('@')[0]
      },
      email_confirm: true // Auto-confirm email since we're in development
    });

    if (error) {
      console.error('Admin creation error:', error);
      return c.json({ 
        success: false, 
        error: error.message 
      }, 400);
    }

    console.log('✅ Admin user created successfully:', data.user?.email);
    console.log('💡 User automatically has admin access');

    return c.json({ 
      success: true, 
      user: data.user,
      message: 'Admin user created successfully (all users are admin)' 
    });

  } catch (error) {
    console.error('Create admin error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to create admin user' 
    }, 500);
  }
});

// EmailJS test email endpoint
app.post('/make-server-764b8bb4/test-email', async (c) => {
  try {
    const body = await c.req.json();
    const { testEmail } = body;

    console.log('🧪 Testing EmailJS notification system...');
    
    const adminEmails = await getAdminEmails();
    
    if (adminEmails.length === 0) {
      return c.json({
        success: false,
        error: 'No admin users found to send test email to',
        fix: 'Run emergencySetup() to create admin users'
      }, 400);
    }
    
    // Use provided test email or first admin email
    const emailToTest = testEmail || adminEmails[0];
    
    console.log(`📧 Testing EmailJS with email: ${emailToTest}`);
    
    const result = await testEmailJSConfiguration(emailToTest);
    
    return c.json({
      success: result.success,
      method: result.method,
      message: result.message,
      test_email: emailToTest,
      admin_emails: adminEmails
    });
    
  } catch (error) {
    console.error('Test email error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to test EmailJS configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Debug endpoint to check admin emails from Supabase auth
app.get('/make-server-764b8bb4/list-admins', async (c) => {
  try {
    console.log('👥 Listing admin users from Supabase authentication...');
    
    const adminUsers = await getAdminUsers();
    const adminEmails = await getAdminEmails();
    
    console.log(`✅ Found ${adminUsers.length} admin user(s)`);
    
    return c.json({
      success: true,
      total: adminUsers.length,
      admins: adminUsers,
      emails: adminEmails,
      source: 'supabase_auth',
      note: 'All authenticated users are admin users'
    });
    
  } catch (error) {
    console.error('❌ Error listing admin users:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to list admin users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get all submissions from KV store
app.get('/make-server-764b8bb4/submissions', async (c) => {
  try {
    console.log('📋 Loading all submissions from KV store...');
    
    // Get all submissions using prefix search
    const submissionData = await kv.getByPrefix('submission_');
    
    console.log(`✅ Found ${submissionData.length} submissions in KV store`);
    
    return c.json({
      success: true,
      submissions: submissionData,
      total: submissionData.length,
      source: 'kv_store'
    });

  } catch (error) {
    console.error('❌ Error loading submissions:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to load submissions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Check submissions by email
app.get('/make-server-764b8bb4/submissions/check/:email', async (c) => {
  try {
    const email = c.req.param('email');
    console.log(`📧 Checking submissions for email: ${email}`);

    // Get all submissions and filter by email
    const allSubmissions = await kv.getByPrefix('submission_');
    const userSubmissions = allSubmissions.filter(submission => 
      submission.email === email
    );

    console.log(`✅ Found ${userSubmissions.length} submissions for ${email}`);

    return c.json({
      success: true,
      submissions: userSubmissions,
      total: userSubmissions.length,
      email: email,
      source: 'kv_store'
    });

  } catch (error) {
    console.error(`❌ Error checking submissions:`, error);
    return c.json({ 
      success: false, 
      error: 'Failed to check submissions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Add new submission
app.post('/make-server-764b8bb4/submissions', async (c) => {
  try {
    const submission = await c.req.json();
    
    console.log('📝 Adding new submission...');
    console.log('📋 Submission data:', submission);

    // Generate unique ID
    const submissionId = `submission_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    // Add metadata
    const enrichedSubmission = {
      ...submission,
      id: submissionId,
      createdAt: new Date().toISOString(),
      status: submission.status || 'Menunggu', // Default status in Malay
      source: 'guest_portal'
    };

    // Store in KV store
    await kv.set(submissionId, enrichedSubmission);
    
    console.log(`✅ Submission stored with ID: ${submissionId}`);

    // Send admin notification (non-blocking)
    setTimeout(() => {
      sendAdminNotification(enrichedSubmission).catch(error => {
        console.error('Admin notification failed:', error);
      });
    }, 100);

    return c.json({
      success: true,
      submissionId: submissionId,
      submission: enrichedSubmission,
      message: 'Submission added successfully'
    });

  } catch (error) {
    console.error('❌ Error adding submission:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to add submission',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Update submission status
app.put('/make-server-764b8bb4/submissions/:id/status', async (c) => {
  try {
    const submissionId = c.req.param('id');
    const { status } = await c.req.json();

    console.log(`📝 Updating submission ${submissionId} status to: ${status}`);

    // Get existing submission
    const existingSubmission = await kv.get(submissionId);
    
    if (!existingSubmission) {
      return c.json({ 
        success: false, 
        error: 'Submission not found' 
      }, 404);
    }

    // Update with new status
    const updatedSubmission = {
      ...existingSubmission,
      status: status,
      updatedAt: new Date().toISOString()
    };

    // Store updated submission
    await kv.set(submissionId, updatedSubmission);

    console.log(`✅ Submission status updated: ${submissionId} → ${status}`);

    return c.json({
      success: true,
      submission: updatedSubmission,
      message: 'Status updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating submission status:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to update submission status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get submission by ID
app.get('/make-server-764b8bb4/submissions/:id', async (c) => {
  try {
    const submissionId = c.req.param('id');
    console.log(`📋 Getting submission: ${submissionId}`);

    const submission = await kv.get(submissionId);
    
    if (!submission) {
      return c.json({ 
        success: false, 
        error: 'Submission not found' 
      }, 404);
    }

    console.log(`✅ Found submission: ${submissionId}`);

    return c.json({
      success: true,
      submission: submission,
      source: 'kv_store'
    });

  } catch (error) {
    console.error(`❌ Error getting submission:`, error);
    return c.json({ 
      success: false, 
      error: 'Failed to get submission',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Enhanced notification test endpoint
app.post('/make-server-764b8bb4/test-enhanced-notification', async (c) => {
  try {
    const body = await c.req.json();
    const { testEmail } = body;

    console.log('🚀 Testing enhanced admin notification system...');
    
    const adminEmails = await getAdminEmails();
    
    if (adminEmails.length === 0) {
      return c.json({
        success: false,
        error: 'No admin users found to send test notification to',
        fix: 'Run emergencySetup() to create admin users'
      }, 400);
    }
    
    // Create test submission
    const testSubmission = {
      id: 'enhanced_test_' + Date.now(),
      namaProjek: 'Enhanced Notification Test Project',
      bahagian: 'IT Testing Department (Enhanced)',
      namaPegawai: 'Enhanced System Tester',
      email: testEmail,
      tarikh: new Date().toLocaleDateString('ms-MY'),
      tujuanProjek: 'Testing enhanced notification system with retry logic',
      websiteUrl: 'https://enhanced-test.example.com',
      kutipanData: 'one-off',
      catatan: 'This is an enhanced test notification with retry mechanisms and detailed logging',
      status: 'Test - Enhanced'
    };
    
    console.log(`🧪 Testing enhanced notification to: ${testEmail}`);
    console.log(`📧 Admin emails configured: ${adminEmails.length}`);
    
    // Send enhanced notification
    const notificationResult = await sendEnhancedAdminNotification(testSubmission, [testEmail]);
    
    return c.json({
      success: notificationResult.success,
      notificationResult: notificationResult,
      testEmail: testEmail,
      adminEmails: adminEmails,
      message: 'Enhanced notification test completed'
    });
    
  } catch (error) {
    console.error('Enhanced notification test error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to test enhanced notification system',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Enhanced notification status endpoint
app.get('/make-server-764b8bb4/enhanced-notification-status', async (c) => {
  try {
    console.log('📊 Checking enhanced notification system status...');
    
    // Check EmailJS configuration
    const emailjsStatus = await getEmailJSStatus();
    
    // Check admin emails
    const adminEmails = await getAdminEmails();
    
    // Enhanced features status
    const features = {
      retryMechanism: true,
      emailValidation: true,
      auditLogging: true,
      gracefulFallback: true,
      realtimeMonitoring: true
    };
    
    // Cache status
    const cache = {
      active: true,
      ttl: '5 minutes for config, 1 minute for admin emails'
    };
    
    const ready = emailjsStatus.configured && adminEmails.length > 0;
    
    return c.json({
      ready: ready,
      emailjs: {
        configured: emailjsStatus.configured,
        config: emailjsStatus.config
      },
      adminEmails: {
        count: adminEmails.length,
        emails: adminEmails
      },
      features: features,
      cache: cache,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Enhanced notification status error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to check enhanced notification status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Notification statistics endpoint
app.get('/make-server-764b8bb4/notification-stats', async (c) => {
  try {
    const submissionId = c.req.query('submissionId');
    
    console.log('📊 Getting notification statistics...');
    if (submissionId) {
      console.log(`📋 For submission: ${submissionId}`);
    }
    
    const result = await getNotificationStats(submissionId);
    
    return c.json(result);
    
  } catch (error) {
    console.error('Notification stats error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to get notification statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Cleanup notification logs endpoint
app.post('/make-server-764b8bb4/cleanup-notification-logs', async (c) => {
  try {
    const body = await c.req.json();
    const { olderThanDays = 30 } = body;
    
    console.log(`🧹 Cleaning notification logs older than ${olderThanDays} days...`);
    
    const result = await cleanupNotificationLogs(olderThanDays);
    
    return c.json(result);
    
  } catch (error) {
    console.error('Cleanup logs error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to cleanup notification logs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get admin emails endpoint (for enhanced notifications)
app.get('/make-server-764b8bb4/get-admin-emails', async (c) => {
  try {
    console.log('📧 Getting admin emails for enhanced notifications...');
    
    const adminEmails = await getAdminEmails();
    
    return c.json({
      success: true,
      emails: adminEmails,
      recipients: adminEmails.length,
      source: 'supabase_auth',
      note: 'All authenticated users are admin users'
    });
    
  } catch (error) {
    console.error('Get admin emails error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to get admin emails',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Send test email submission (saves to database AND sends to admins)
app.post('/make-server-764b8bb4/send-test-email', async (c) => {
  try {
    const body = await c.req.json();
    const { testEmail } = body;
    
    console.log('📧 CREATING TEST EMAIL SUBMISSION');
    console.log('=================================');
    console.log('');
    
    // Create realistic test submission data in Malaysian
    const testSubmission = {
      namaProjek: 'Sistem Pengurusan Permohonan Digital NBDAC',
      bahagian: 'Bahagian Teknologi Maklumat',
      namaPegawai: 'Ahmad Zulkifli bin Abdullah',
      email: testEmail || 'test.submission@nbdac.gov.my',
      tarikh: new Date().toLocaleDateString('ms-MY'),
      tujuanProjek: 'Membangunkan sistem pengurusan permohonan projek yang lebih efisien untuk meningkatkan produktiviti dan kemudahan akses bagi semua pengguna.',
      websiteUrl: 'https://permohonan-projek.nbdac.gov.my',
      kutipanData: 'ongoing',
      catatan: 'Projek ini adalah untuk tujuan ujian sistem notifikasi email. Sistem ini akan menggunakan teknologi terkini untuk memastikan keselamatan dan kestabilan data.',
      status: 'Menunggu'
    };
    
    console.log('📋 Creating test submission with data:');
    console.log(`   📝 Project: ${testSubmission.namaProjek}`);
    console.log(`   🏢 Department: ${testSubmission.bahagian}`);
    console.log(`   👤 Officer: ${testSubmission.namaPegawai}`);
    console.log(`   📧 Email: ${testSubmission.email}`);
    console.log(`   📅 Date: ${testSubmission.tarikh}`);
    console.log('');
    
    // Generate unique ID
    const submissionId = `test_submission_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    // Add metadata
    const enrichedSubmission = {
      ...testSubmission,
      id: submissionId,
      createdAt: new Date().toISOString(),
      source: 'test_email_submission'
    };
    
    console.log(`💾 Saving test submission with ID: ${submissionId}`);
    
    // Store in KV store (this makes it appear in the Internal Portal)
    await kv.set(submissionId, enrichedSubmission);
    
    console.log('✅ Test submission saved to database');
    console.log('');
    
    // Get admin emails for notification
    const adminEmails = await getAdminEmails();
    
    if (adminEmails.length === 0) {
      console.log('⚠️ No admin users found - cannot send email notifications');
      console.log('💡 Run emergencySetup() to create admin users');
      
      return c.json({
        success: true,
        submissionData: enrichedSubmission,
        notificationResult: {
          method: 'none',
          finalStatus: 'no-admins',
          sent: 0,
          total: 0,
          failed: 0,
          message: 'Submission saved but no admin emails found for notification'
        },
        message: 'Test submission created but no admin notifications sent'
      });
    }
    
    console.log(`📧 Sending email notification to ${adminEmails.length} admin(s):`);
    adminEmails.forEach(email => console.log(`   • ${email}`));
    console.log('');
    
    // Send enhanced admin notification
    const notificationResult = await sendEnhancedAdminNotification(enrichedSubmission);
    
    console.log('✅ TEST EMAIL SUBMISSION COMPLETED');
    console.log('');
    
    return c.json({
      success: true,
      submissionData: enrichedSubmission,
      notificationResult: notificationResult,
      message: 'Test submission created and notifications sent'
    });
    
  } catch (error) {
    console.error('❌ Test email submission error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to send test email submission',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Send enhanced test submission with specific test email
app.post('/make-server-764b8bb4/test-enhanced-notification', async (c) => {
  try {
    const body = await c.req.json();
    const { testEmail } = body;

    if (!testEmail) {
      return c.json({
        success: false,
        error: 'Test email is required for enhanced notification test'
      }, 400);
    }

    console.log('🚀 ENHANCED TEST SUBMISSION NOTIFICATION');
    console.log('=======================================');
    console.log('');

    // Create enhanced test submission
    const testSubmission = {
      namaProjek: 'Portal Perkhidmatan Digital Terpadu NBDAC',
      bahagian: 'Bahagian Perancangan Strategik',
      namaPegawai: 'Siti Nurhaliza binti Rahman',
      email: testEmail,
      tarikh: new Date().toLocaleDateString('ms-MY'),
      tujuanProjek: 'Membangunkan portal perkhidmatan digital yang menyediakan akses mudah kepada semua perkhidmatan NBDAC dalam satu platform yang user-friendly.',
      websiteUrl: 'https://portal-digital.nbdac.gov.my',
      kutipanData: 'one-off',
      catatan: 'Ujian lanjutan untuk sistem notifikasi dengan ciri-ciri tambahan seperti retry mechanism, audit trail, dan monitoring real-time. Sistem ini direka untuk memastikan semua notifikasi berjaya dihantar.',
      status: 'Menunggu'
    };

    console.log('📝 Creating enhanced test submission:');
    console.log(`   🎯 Target email: ${testEmail}`);
    console.log(`   📋 Project: ${testSubmission.namaProjek}`);
    console.log(`   🏢 Department: ${testSubmission.bahagian}`);
    console.log('');

    // Generate unique ID
    const submissionId = `enhanced_test_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    // Add metadata
    const enrichedSubmission = {
      ...testSubmission,
      id: submissionId,
      createdAt: new Date().toISOString(),
      source: 'enhanced_test_submission'
    };

    console.log(`💾 Saving enhanced test submission: ${submissionId}`);
    
    // Store in KV store
    await kv.set(submissionId, enrichedSubmission);
    
    console.log('✅ Enhanced test submission saved');
    console.log('');
    
    console.log('📧 Sending enhanced notification with retry logic...');
    
    // Send enhanced notification with specific test email
    const notificationResult = await sendEnhancedAdminNotification(enrichedSubmission, [testEmail]);
    
    console.log('🎉 ENHANCED TEST COMPLETED');
    console.log('');

    return c.json({
      success: true,
      submissionData: enrichedSubmission,
      notificationResult: notificationResult,
      message: 'Enhanced test submission completed with detailed logging'
    });
    
  } catch (error) {
    console.error('❌ Enhanced test notification error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to send enhanced test notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Start the server
console.log('🚀 Starting NBDAC Project Request System server...');
console.log('📧 Email service: EmailJS (with console fallback)');
console.log('💾 Data storage: Supabase KV Store (with database fallback)');
console.log('🔐 Authentication: Simplified (all users are admin)');

Deno.serve(app.fetch);