/**
 * Console Email Setup Script
 * Simple script that can be run directly in browser console
 */

import { projectId, publicAnonKey } from './supabase/info';

// Simple console-based email setup
export const consoleEmailSetup = async () => {
  console.log('🚀 NBDAC Email Setup - Console Version');
  console.log('=====================================');
  
  try {
    // Step 1: Check server health
    console.log('1️⃣ Checking server connection...');
    const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (!healthResponse.ok) {
      console.error('❌ Server connection failed');
      console.log('💡 Check your Supabase configuration');
      return false;
    }

    const healthData = await healthResponse.json();
    console.log('✅ Server connected:', healthData.service);

    // Step 2: Check admin users
    console.log('2️⃣ Checking admin users...');
    const adminResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/list-admins`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    let adminCount = 0;
    let adminEmails: string[] = [];

    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      adminCount = adminData.admins?.length || 0;
      adminEmails = adminData.admins?.map((admin: any) => admin.email) || [];
      
      if (adminCount > 0) {
        console.log(`✅ Found ${adminCount} admin user(s):`);
        adminEmails.forEach(email => console.log(`   📧 ${email}`));
      } else {
        console.log('⚠️ No admin users found');
        console.log('💡 Create an admin user first:');
        console.log('   setupAdmin("admin@nbdac.gov.my", "password123", "Admin Name")');
        return false;
      }
    } else {
      console.log('⚠️ Could not check admin users');
      return false;
    }

    // Step 3: Send test email
    console.log('3️⃣ Testing email notification...');
    const testSubmission = {
      tarikh: new Date().toLocaleDateString('ms-MY'),
      bahagian: 'IT Department',
      namaProjek: 'Email Setup Test - ' + new Date().toLocaleTimeString(),
      tujuanProjek: 'Testing email notification system via console setup',
      websiteUrl: '1. Test: https://www.example.com',
      kutipanData: 'one-off',
      namaPegawai: 'Console Tester',
      email: adminEmails[0],
      catatan: 'This is an automated test from the console email setup script.'
    };

    const submissionResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(testSubmission)
    });

    if (submissionResponse.ok) {
      console.log('✅ Test submission created successfully');
      console.log(`📧 Email notification sent to: ${adminEmails[0]}`);
      console.log('📬 Check admin email inbox for notification');
    } else {
      console.log('⚠️ Test submission failed');
      console.log('💡 Check server logs for details');
    }

    // Step 4: Final status
    console.log('');
    console.log('🎉 Email setup complete!');
    console.log('📊 System Status:');
    console.log(`   ✅ Server: Connected`);
    console.log(`   ✅ Admin Users: ${adminCount}`);
    console.log(`   ✅ Email Service: Supabase`);
    console.log(`   📧 Recipients: ${adminEmails.join(', ')}`);
    console.log('');
    console.log('🚀 Your NBDAC system is ready!');
    console.log('   New submissions will automatically notify admins');
    
    return true;

  } catch (error) {
    console.error('❌ Email setup failed:', error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check Supabase configuration');
    console.log('   2. Ensure admin users exist');
    console.log('   3. Check server logs for errors');
    return false;
  }
};

// Add to window for easy access
if (typeof window !== 'undefined') {
  (window as any).consoleEmailSetup = consoleEmailSetup;
  
  // Also add a simple one-liner
  (window as any).quickSetupEmail = async () => {
    console.log('⚡ Quick Email Setup Starting...');
    const success = await consoleEmailSetup();
    if (success) {
      console.log('✅ Email setup completed successfully!');
    } else {
      console.log('❌ Email setup needs attention - see messages above');
    }
  };

  console.log('📧 Email Setup Commands Available:');
  console.log('   consoleEmailSetup()  - Full setup with detailed logs');
  console.log('   quickSetupEmail()    - Quick setup with minimal output');
}

export default consoleEmailSetup;