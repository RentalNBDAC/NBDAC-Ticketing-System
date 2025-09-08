// Simple EmailJS Test - No Syntax Issues
// This file tests EmailJS environment variables with basic syntax

export const simpleEmailJSTest = () => {
  console.log('🧪 SIMPLE EMAILJS TEST');
  console.log('======================');
  console.log('');

  // Simple variable checks
  let serviceId = '';
  let templateId = '';
  let publicKey = '';
  let privateKey = '';
  let fromName = '';
  let fromEmail = '';

  // Check process.env safely
  try {
    if (process && process.env) {
      serviceId = process.env.EMAILJS_SERVICE_ID || '';
      templateId = process.env.EMAILJS_TEMPLATE_ID || '';
      publicKey = process.env.EMAILJS_PUBLIC_KEY || '';
      privateKey = process.env.EMAILJS_PRIVATE_KEY || '';
      fromName = process.env.EMAILJS_FROM_NAME || '';
      fromEmail = process.env.EMAILJS_FROM_EMAIL || '';
    }
  } catch (e) {
    console.log('⚠️ Could not access process.env');
  }

  // Report findings
  console.log('📊 ENVIRONMENT VARIABLES:');
  console.log(`   EMAILJS_SERVICE_ID: ${serviceId ? '✅ Found' : '❌ Missing'}`);
  console.log(`   EMAILJS_TEMPLATE_ID: ${templateId ? '✅ Found' : '❌ Missing'}`);
  console.log(`   EMAILJS_PUBLIC_KEY: ${publicKey ? '✅ Found' : '❌ Missing'}`);
  console.log(`   EMAILJS_PRIVATE_KEY: ${privateKey ? '✅ Found' : '⚠️ Not set'}`);
  console.log(`   EMAILJS_FROM_NAME: ${fromName ? '✅ Found' : '⚠️ Using default'}`);
  console.log(`   EMAILJS_FROM_EMAIL: ${fromEmail ? '✅ Found' : '⚠️ Using default'}`);

  console.log('');
  const requiredFound = [serviceId, templateId, publicKey].filter(v => v && v !== '').length;
  const configured = requiredFound === 3;

  console.log('📋 STATUS:');
  console.log(`   Required variables: ${requiredFound}/3 found`);
  console.log(`   Configuration: ${configured ? '✅ Complete' : '❌ Incomplete'}`);

  if (!configured) {
    console.log('');
    console.log('🔧 TO FIX:');
    if (!serviceId) console.log('   • Set EMAILJS_SERVICE_ID environment variable');
    if (!templateId) console.log('   • Set EMAILJS_TEMPLATE_ID environment variable');
    if (!publicKey) console.log('   • Set EMAILJS_PUBLIC_KEY environment variable');
    console.log('');
    console.log('💡 ALTERNATIVE:');
    console.log('   • Use goToEmailJSSetup() for manual configuration');
  } else {
    console.log('');
    console.log('🎉 EmailJS environment is configured!');
    console.log('🧪 Test email: testEmailJS("your-email@example.com")');
  }

  return {
    configured,
    requiredFound,
    variables: {
      serviceId: !!serviceId,
      templateId: !!templateId,
      publicKey: !!publicKey,
      privateKey: !!privateKey,
      fromName: !!fromName,
      fromEmail: !!fromEmail
    }
  };
};