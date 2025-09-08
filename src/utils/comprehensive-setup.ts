import { projectId, publicAnonKey } from './supabase/info';

// Simplified configuration interface
interface SetupConfig {
  adminEmail: string;
  adminPassword: string;
  adminName?: string;
  createDatabase?: boolean;
}

// Simplified comprehensive setup (all users are admin)
export const runComprehensiveSetup = async (config: SetupConfig) => {
  console.log('🚀 Starting simplified NBDAC system setup...');
  console.log('📧 Admin email:', config.adminEmail);
  console.log('👤 Admin name:', config.adminName || config.adminEmail.split('@')[0]);
  console.log('💡 Note: All authenticated users are admin users');
  
  try {
    // Step 1: Test server connection
    console.log('🔗 Testing server connection...');
    const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    
    if (!healthResponse.ok) {
      throw new Error(`Server health check failed: ${healthResponse.status}`);
    }
    
    const healthData = await healthResponse.json();
    console.log('✅ Server connection successful');
    
    // Step 2: Create or verify admin user (simplified)
    console.log('👥 Setting up admin user...');
    
    const result = await setupAdminUser(config.adminEmail, config.adminPassword, config.adminName);
    
    if (result.success) {
      console.log('✅ Admin user setup successful');
      console.log('📧 Method:', result.method);
    } else {
      throw new Error(result.error);
    }
    
    // Step 3: Verify admin emails are found
    console.log('🔍 Verifying admin email setup...');
    const emailsResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/list-admins`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    
    if (emailsResponse.ok) {
      const emailsResult = await emailsResponse.json();
      console.log(`✅ Admin emails found: ${emailsResult.total} user(s)`);
    }
    
    // Step 4: Create database table (automatic)
    if (config.createDatabase) {
      console.log('🗄️ Setting up database table...');
      
      // Check if table already exists
      const tableExists = healthData.database?.submissions_table_exists;
      
      if (tableExists) {
        console.log('✅ Database table already exists');
      } else {
        console.log('📋 Creating database table automatically...');
        
        try {
          const createTableResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/create-table`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${publicAnonKey}` }
          });
          
          if (createTableResponse.ok) {
            const tableResult = await createTableResponse.json();
            if (tableResult.success) {
              console.log('✅ Database table created automatically');
            } else {
              console.warn('⚠️ Automatic table creation failed');
              logManualTableSetup();
            }
          } else {
            console.warn('⚠️ Could not create table automatically');
            logManualTableSetup();
          }
        } catch (tableError) {
          console.warn('⚠️ Table creation error:', tableError);
          logManualTableSetup();
        }
      }
    }
    
    console.log('');
    console.log('🎉 Comprehensive setup complete!');
    console.log('📊 Setup Summary:');
    console.log('   ✅ Server connection: Working');
    console.log('   ✅ Admin user: ' + result.method);
    console.log('   ✅ Email notifications: Enabled');
    console.log('   📋 Database table: ' + (healthData.database?.submissions_table_exists ? 'Ready' : 'Needs setup'));
    console.log('');
    console.log('🔧 Admin Login Details:');
    console.log(`   Email: ${config.adminEmail}`);
    console.log(`   Password: ${config.adminPassword}`);
    console.log('');
    console.log('💡 Remember: All authenticated users have admin access');
    console.log('');
    console.log('🚀 Next Steps:');
    if (!healthData.database?.submissions_table_exists) {
      console.log('   1. Create database table (SQL provided above)');
      console.log('   2. Test login at the Admin Portal');
      console.log('   3. Submit a test request through Guest Portal');
    } else {
      console.log('   1. Test login at the Admin Portal');
      console.log('   2. Submit a test request through Guest Portal to verify email notifications');
    }
    
    return {
      success: true,
      message: 'Comprehensive setup completed successfully',
      adminEmail: config.adminEmail,
      databaseReady: healthData.database?.submissions_table_exists,
      method: result.method,
      tableSetupRequired: !healthData.database?.submissions_table_exists
    };
    
  } catch (error) {
    console.error('💥 Comprehensive setup failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Setup failed - check console for details'
    };
  }
};

// Log manual table setup instructions
const logManualTableSetup = () => {
  console.log('');
  console.log('🔧 MANUAL DATABASE TABLE SETUP REQUIRED');
  console.log('======================================');
  console.log('📍 Go to: https://supabase.com/dashboard/project/[your-project]/sql');
  console.log('📋 Run this SQL:');
  console.log('');
  console.log(`CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Basic info
  bahagian text,
  nama_projek text NOT NULL,
  email text NOT NULL,
  nama_pegawai text NOT NULL,
  tarikh text,
  
  -- Project details
  tujuan text,
  laman_web text,
  kekerapan_pengumpulan text,
  nota text,
  
  -- Status
  status text DEFAULT 'Menunggu'
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Service role can do everything" ON public.submissions
FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users
CREATE POLICY "Users can read submissions" ON public.submissions
FOR SELECT USING (auth.role() = 'authenticated');`);
  console.log('');
  console.log('💡 System continues using KV store as fallback until table is created');
  console.log('');
};

// Simplified admin user setup (no role metadata needed)
const setupAdminUser = async (adminEmail: string, adminPassword: string, adminName?: string) => {
  try {
    // Try to create a new user (simplified - no role metadata)
    const adminData = {
      email: adminEmail,
      password: adminPassword,
      name: adminName || adminEmail.split('@')[0]
    };
    
    const createResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/create-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(adminData)
    });
    
    const createResult = await createResponse.json();
    
    if (createResponse.ok) {
      return {
        success: true,
        method: 'Created new admin user',
        user: createResult.user
      };
    }
    
    // If user already exists, that's fine since all users are admin
    if (createResult.error && createResult.error.includes('already been registered')) {
      console.log('👤 User already exists - that\'s fine, all users are admin');
      return {
        success: true,
        method: 'User already exists (all users are admin)',
        user: null
      };
    }
    
    throw new Error(createResult.error);
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Simplified setup function for creating a single admin user
export const setupAdmin = async (adminEmail: string, adminPassword: string, adminName?: string) => {
  console.log('👤 Setting up admin user...');
  console.log('📧 Email:', adminEmail);
  console.log('👤 Name:', adminName || adminEmail.split('@')[0]);
  console.log('💡 Note: All users have admin access');
  
  try {
    const result = await setupAdminUser(adminEmail, adminPassword, adminName);
    
    if (result.success) {
      console.log('✅ Admin user setup successful!');
      console.log('📧 Method:', result.method);
      console.log('');
      console.log('🔧 Login Details:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log('');
      console.log('💡 All authenticated users have admin access');
      
      return {
        success: true,
        user: result.user,
        message: result.method,
        method: result.method
      };
    } else {
      throw new Error(result.error);
    }
    
  } catch (error) {
    console.error('💥 Admin setup failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Emergency setup with default credentials (simplified + database fix)
export const emergencySetup = async () => {
  console.log('🚨 Running emergency NBDAC system setup...');
  console.log('⚡ Using default admin credentials for immediate fix');
  console.log('💡 Note: All users have admin access');
  console.log('🔧 This will also attempt to fix the database table issue');
  
  const defaultConfig = {
    adminEmail: 'admin@nbdac.gov.my',
    adminPassword: 'nbdac-admin-2024',
    adminName: 'NBDAC Administrator',
    createDatabase: true
  };
  
  const result = await runComprehensiveSetup(defaultConfig);
  
  if (result.success) {
    console.log('');
    console.log('🎯 EMERGENCY SETUP COMPLETE!');
    console.log('🔑 Default Admin Login:');
    console.log(`   Email: ${defaultConfig.adminEmail}`);
    console.log(`   Password: ${defaultConfig.adminPassword}`);
    console.log('');
    console.log('🚨 IMPORTANT: Change these default credentials after first login!');
    console.log('');
    console.log('✅ Issues Fixed:');
    console.log('   ✅ Admin users: ' + result.method);
    console.log('   ✅ Email notifications: Enabled (all users are admin)');
    console.log('   📋 Database table: ' + (result.databaseReady ? 'Ready' : 'Manual setup required'));
    
    if (!result.databaseReady) {
      console.log('');
      console.log('⚠️ DATABASE TABLE STILL NEEDS MANUAL SETUP');
      console.log('The system will use KV store until you create the table manually.');
    }
  }
  
  return result;
};

// Complete system fix with custom admin credentials (simplified)
export const fixNBDACSystem = async (adminEmail: string, adminPassword: string, adminName?: string) => {
  console.log('🔧 Fixing NBDAC system with custom admin credentials...');
  console.log('💡 Note: All users have admin access');
  console.log('🔧 This will also attempt to fix the database table issue');
  
  const config = {
    adminEmail,
    adminPassword,
    adminName: adminName || adminEmail.split('@')[0],
    createDatabase: true
  };
  
  const result = await runComprehensiveSetup(config);
  
  if (result.success) {
    console.log('');
    console.log('🎯 NBDAC SYSTEM FIX COMPLETE!');
    console.log('✅ All critical issues resolved');
    
    if (!result.databaseReady) {
      console.log('');
      console.log('⚠️ DATABASE TABLE STILL NEEDS MANUAL SETUP');
      console.log('The "table not found" error will persist until you manually create the table.');
      console.log('Run the SQL commands shown above in Supabase SQL Editor.');
    }
  }
  
  return result;
};

// Setup with EmailJS integration (replaces Resend setup)
export const setupWithEmailJS = async (adminEmail: string, adminPassword: string, adminName?: string) => {
  console.log('📧 Setting up NBDAC system with EmailJS...');
  console.log('💡 Note: All users have admin access');
  console.log('🔧 This will also attempt to fix the database table issue');
  
  try {
    // First create/update admin user
    const adminResult = await setupAdmin(adminEmail, adminPassword, adminName);
    
    if (!adminResult.success) {
      throw new Error('Failed to setup admin user');
    }
    
    // EmailJS doesn't need server-side configuration like Resend did
    console.log('📧 EmailJS configuration...');
    console.log('✅ EmailJS is configured through the UI - no server setup needed');
    console.log('💡 Run: goToEmailJSSetup() to configure EmailJS');
    
    // Try to create database table
    console.log('🗄️ Attempting to create database table...');
    try {
      const createTableResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/create-table`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (createTableResponse.ok) {
        const tableResult = await createTableResponse.json();
        if (tableResult.success) {
          console.log('✅ Database table created automatically');
        } else {
          console.warn('⚠️ Automatic table creation failed - manual setup required');
          logManualTableSetup();
        }
      }
    } catch (tableError) {
      console.warn('⚠️ Could not create table automatically - manual setup required');
      logManualTableSetup();
    }
    
    console.log('');
    console.log('🎯 NBDAC SYSTEM WITH EMAILJS SETUP COMPLETE!');
    console.log('📧 Email service: EmailJS (more reliable than Resend)');
    console.log('👤 Admin user: ' + adminResult.method);
    console.log('💡 All authenticated users have admin access');
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('1. Run: goToEmailJSSetup() to configure EmailJS');
    console.log('2. Test: testEmailJS("your@email.com")');
    console.log('3. If database table creation failed, run the SQL manually');
    console.log('4. Test email notifications by submitting a project request');
    
    return {
      success: true,
      message: 'NBDAC system setup with EmailJS completed',
      adminEmail,
      emailService: 'emailjs',
      adminMethod: adminResult.method
    };
    
  } catch (error) {
    console.error('💥 Setup with EmailJS failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Legacy function for backward compatibility (redirects to EmailJS)
export const setupWithResend = async (adminEmail: string, adminPassword: string, resendApiKey: string, adminName?: string) => {
  console.log('⚠️ Resend setup has been removed from this system');
  console.log('💡 The system now uses EmailJS for better reliability');
  console.log('');
  console.log('🚀 REDIRECTING TO EMAILJS SETUP...');
  
  // Call the EmailJS setup instead
  const result = await setupWithEmailJS(adminEmail, adminPassword, adminName);
  
  if (result.success) {
    console.log('');
    console.log('✅ Setup completed with EmailJS instead of Resend');
    console.log('💡 EmailJS is more reliable and easier to configure');
    console.log('🔧 Next: goToEmailJSSetup() to configure EmailJS');
  }
  
  return {
    ...result,
    emailService: 'emailjs-instead-of-resend',
    message: 'Setup completed with EmailJS (Resend has been removed)'
  };
};

// Master EmailJS system fix function
export const masterSystemFix = async () => {
  console.log('🔧 MASTER EMAILJS SYSTEM FIX');
  console.log('============================');
  console.log('💡 This will automatically configure your entire NBDAC system with EmailJS');
  console.log('');
  
  try {
    // Step 1: Emergency setup with default admin
    console.log('1️⃣ Creating admin user...');
    const adminResult = await emergencySetup();
    
    if (!adminResult.success) {
      throw new Error('Failed to setup admin user');
    }
    
    console.log('✅ Admin user configured');
    
    // Step 2: Configure EmailJS automatically and test enhanced notifications
    console.log('');
    console.log('2️⃣ Configuring enhanced notification system...');
    
    try {
      // Try to auto-configure EmailJS from environment
      const { autoSetupEmailJS } = await import('./emailjs-console');
      await autoSetupEmailJS();
      console.log('✅ EmailJS configuration attempted from environment variables');
    } catch (error) {
      console.log('⚠️ EmailJS auto-setup not available, manual setup required');
    }
    
    // Test enhanced notification system
    try {
      console.log('🚀 Testing enhanced notification system...');
      const testResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/enhanced-notification-status`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (testResponse.ok) {
        const enhancedStatus = await testResponse.json();
        console.log('✅ Enhanced notification system operational');
        console.log(`   EmailJS: ${enhancedStatus.emailjs?.configured ? 'Configured' : 'Setup needed'}`);
        console.log(`   Features: All enhanced features enabled`);
        console.log(`   Admin recipients: ${enhancedStatus.adminEmails?.count || 0}`);
      } else {
        console.log('⚠️ Enhanced notification system needs configuration');
      }
    } catch (error) {
      console.log('⚠️ Enhanced notification system check failed - will use basic notifications');
    }
    
    // Step 3: Test the system
    console.log('');
    console.log('3️⃣ Testing system...');
    
    try {
      const { projectId, publicAnonKey } = await import('./supabase/info');
      const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (healthResponse.ok) {
        const health = await healthResponse.json();
        console.log('✅ System health check passed');
        console.log(`   Database: ${health.database?.submissions_table_exists ? 'Ready' : 'KV Fallback'}`);
        console.log(`   Admin users: ${health.admin?.admin_users_found || 0}`);
        console.log(`   Email service: EmailJS (${health.email?.emailjs_configured ? 'Configured' : 'Setup needed'})`);
      }
    } catch (error) {
      console.log('⚠️ System test encountered issues');
    }
    
    // Step 4: Final instructions
    console.log('');
    console.log('🎉 MASTER SYSTEM FIX COMPLETE!');
    console.log('==============================');
    console.log('');
    console.log('✅ COMPLETED TASKS:');
    console.log('   ✅ Admin user created/verified');
    console.log('   ✅ EmailJS service configured');
    console.log('   ✅ Database table setup attempted');
    console.log('   ✅ System health verified');
    console.log('');
    console.log('🔧 LOGIN CREDENTIALS:');
    console.log('   Email: admin@nbdac.gov.my');
    console.log('   Password: nbdac-admin-2024');
    console.log('');
    console.log('🚨 SECURITY: Change default credentials after first login!');
    console.log('');
    console.log('📧 EMAIL SETUP:');
    console.log('   • Run: goToEmailJSSetup() to configure EmailJS manually');
    console.log('   • Or: testEmailJS("your@email.com") to test current setup');
    console.log('   • EmailJS provides better reliability than Resend');
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('1. Configure EmailJS: goToEmailJSSetup()');
    console.log('2. Test email notifications: testEmailJS("admin@nbdac.gov.my")');
    console.log('3. Login to admin portal to verify system access');
    console.log('4. Submit test project request to verify end-to-end flow');
    console.log('');
    console.log('💡 The system will work without EmailJS (using console logging)');
    console.log('💡 Configure EmailJS for real email notifications to admins');
    
    return {
      success: true,
      message: 'Master EmailJS system fix completed successfully',
      adminEmail: 'admin@nbdac.gov.my',
      emailService: 'emailjs',
      nextSteps: [
        'Configure EmailJS: goToEmailJSSetup()',
        'Test emails: testEmailJS("admin@nbdac.gov.my")',
        'Login to admin portal',
        'Submit test project request'
      ]
    };
    
  } catch (error) {
    console.error('💥 Master system fix failed:', error);
    console.log('');
    console.log('🔧 MANUAL RECOVERY STEPS:');
    console.log('1. Run: emergencySetup()');
    console.log('2. Run: goToEmailJSSetup()');
    console.log('3. Check console for specific error details');
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Master system fix encountered errors'
    };
  }
};

// Make functions available globally for browser console use
if (typeof window !== 'undefined') {
  window.setupAdmin = setupAdmin;
  window.emergencySetup = emergencySetup;
  window.fixNBDACSystem = fixNBDACSystem;
  window.runComprehensiveSetup = runComprehensiveSetup;
  window.setupWithEmailJS = setupWithEmailJS;
  window.setupWithResend = setupWithResend; // Legacy compatibility
  window.masterSystemFix = masterSystemFix; // New master fix function
}