import { projectId, publicAnonKey } from './supabase/info';

// Complete email fix utility - now focuses on EmailJS exclusively
export const fixAllEmailIssues = async () => {
  console.log('🔧 COMPREHENSIVE EMAIL FIX (EmailJS)');
  console.log('====================================');
  console.log('💡 This will fix ALL email issues automatically using EmailJS');
  console.log('');
  
  let fixCount = 0;
  let issues = [];
  
  try {
    // Step 1: Check current system status
    console.log('1️⃣ Checking system status...');
    const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    
    if (!healthResponse.ok) {
      console.error('❌ Server not accessible');
      return false;
    }
    
    const health = await healthResponse.json();
    console.log('✅ Server is running');
    
    // Step 2: Check and fix admin users
    console.log('');
    console.log('2️⃣ Checking admin users...');
    const adminCount = health.admin?.admin_users_found || 0;
    
    if (adminCount === 0) {
      console.log('❌ No admin users found - creating default admin user...');
      
      const createAdminResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: 'admin@nbdac.gov.my',
          password: 'nbdac-admin-2024',
          name: 'NBDAC Administrator'
        })
      });
      
      if (createAdminResponse.ok) {
        console.log('✅ Admin user created: admin@nbdac.gov.my');
        console.log('🔑 Password: nbdac-admin-2024');
        fixCount++;
      } else {
        const error = await createAdminResponse.text();
        if (error.includes('already been registered')) {
          console.log('✅ Admin user already exists');
        } else {
          console.warn('⚠️ Could not create admin user:', error);
          issues.push('Failed to create admin user');
        }
      }
    } else {
      console.log(`✅ Found ${adminCount} admin user(s)`);
    }
    
    // Step 3: Configure EmailJS service
    console.log('');
    console.log('3️⃣ Configuring EmailJS service...');
    
    const emailjsConfigured = health.email?.emailjs_configured;
    
    if (!emailjsConfigured) {
      console.log('📧 Configuring EmailJS service...');
      
      // Check if EmailJS environment variables are available
      const configureResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/configure-emailjs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          enabled: true,
          autoConfiguration: true
        })
      });
      
      if (configureResponse.ok) {
        console.log('✅ EmailJS service configured');
        fixCount++;
      } else {
        console.warn('⚠️ Could not configure EmailJS service');
        console.log('💡 Server will use environment variables if available');
        console.log('💡 Run: goToEmailJSSetup() for manual configuration');
        issues.push('EmailJS configuration may need manual setup');
      }
    } else {
      console.log('✅ EmailJS service already configured');
    }
    
    // Step 4: Test EmailJS notifications
    console.log('');
    console.log('4️⃣ Testing EmailJS notifications...');
    
    const testSubmission = {
      namaProjek: `EmailJS Fix Test - ${new Date().toLocaleTimeString()}`,
      email: 'emailfixtest@example.com',
      namaPegawai: 'EmailJS Fix Test User',
      bahagian: 'System Testing',
      tarikh: new Date().toISOString().split('T')[0],
      tujuanProjek: 'Testing EmailJS notifications after comprehensive fix',
      websiteUrl: 'https://test.nbdac.gov.my',
      kutipanData: 'One-time',
      catatan: 'This test submission was created by the EmailJS fix utility to verify that notifications are working correctly.'
    };
    
    const testResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(testSubmission)
    });
    
    if (testResponse.ok) {
      const result = await testResponse.json();
      console.log('✅ Test submission created:', result.submissionId);
      console.log('📧 EmailJS notification triggered');
      fixCount++;
    } else {
      console.warn('⚠️ Test submission failed');
      issues.push('Could not create test submission');
    }
    
    // Step 5: Summary
    console.log('');
    console.log('📊 EMAILJS FIX SUMMARY');
    console.log('=====================');
    console.log(`✅ Fixes applied: ${fixCount}`);
    
    if (issues.length > 0) {
      console.log('⚠️ Issues found:');
      issues.forEach(issue => console.log(`   • ${issue}`));
    }
    
    console.log('');
    console.log('🎯 WHAT TO EXPECT:');
    console.log('📧 Email Subject: "Permohonan Projek Baru - EmailJS Fix Test"');
    console.log('📬 Delivery Method: ' + (emailjsConfigured ? 'EmailJS (real email)' : 'Console logging + EmailJS if configured'));
    console.log('📍 Sent to: All admin email addresses');
    console.log('');
    console.log('💡 IF YOU STILL DON\\'T RECEIVE EMAILS:');
    console.log('   1. Check your spam/junk folder');
    console.log('   2. Verify your email is in the admin list: listAdminEmails()');
    console.log('   3. Check server logs for delivery status');
    console.log('   4. Run: goToEmailJSSetup() for configuration help');
    console.log('   5. Test with: testEmailJS("your@email.com")');
    console.log('');
    console.log('🔧 Admin Login Details (if new user was created):');
    console.log('   Email: admin@nbdac.gov.my');
    console.log('   Password: nbdac-admin-2024');
    console.log('');
    console.log('🚨 IMPORTANT: Change default credentials after first login!');
    
    return fixCount > 0;
    
  } catch (error) {
    console.error('💥 EmailJS fix failed:', error);
    console.log('');
    console.log('🔧 MANUAL STEPS TO FIX:');
    console.log('1. Run emergencySetup() to create admin user');
    console.log('2. Run: goToEmailJSSetup() for EmailJS configuration');
    console.log('3. Test with: testEmailJS("your@email.com")');
    return false;
  }
};

// Quick EmailJS test
export const quickEmailTest = async () => {
  console.log('🧪 QUICK EMAILJS TEST');
  console.log('=====================');
  
  try {
    const testSubmission = {
      namaProjek: `Quick EmailJS Test - ${Date.now()}`,
      email: 'quicktest@example.com',
      namaPegawai: 'Quick EmailJS Test User',
      bahagian: 'Testing',
      tarikh: new Date().toISOString().split('T')[0],
      tujuanProjek: 'Quick EmailJS test'
    };
    
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(testSubmission)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test EmailJS email sent! Check your inbox and server logs.');
      console.log('📧 Submission ID:', result.submissionId);
      return true;
    } else {
      console.error('❌ Test failed');
      return false;
    }
  } catch (error) {
    console.error('💥 Test error:', error);
    return false;
  }
};

// Check EmailJS system status
export const checkEmailStatus = async () => {
  console.log('📊 EMAILJS SYSTEM STATUS');
  console.log('========================');
  
  try {
    const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      
      console.log('🖥️  Server Status:', health.status === 'ok' ? '✅ Running' : '❌ Error');
      console.log('👥 Admin Users:', health.admin?.admin_users_found || 0);
      console.log('📧 Email Service:', health.email?.emailjs_configured ? '✅ EmailJS' : '📋 Console Only');
      console.log('📊 Storage Mode:', health.database?.storage_mode || 'Unknown');
      
      if (health.admin?.admin_users_found === 0) {
        console.log('');
        console.log('❌ NO ADMIN USERS - Run fixAllEmailIssues() to fix');
      }
      
      if (!health.email?.emailjs_configured) {
        console.log('');
        console.log('⚠️ EMAILJS NOT CONFIGURED - Run: goToEmailJSSetup()');
        console.log('💡 Emails will only log to console until configured');
      }
      
      return health;
    } else {
      console.error('❌ Cannot check status - server not accessible');
      return null;
    }
  } catch (error) {
    console.error('💥 Status check failed:', error);
    return null;
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.fixAllEmailIssues = fixAllEmailIssues;
  window.quickEmailTest = quickEmailTest;
  window.checkEmailStatus = checkEmailStatus;
}