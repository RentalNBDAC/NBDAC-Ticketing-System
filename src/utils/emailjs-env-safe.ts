// Ultra-Safe EmailJS Environment Variable Access
// This file avoids any problematic syntax and provides a simple fallback

export interface SafeEnvResult {
  found: boolean;
  value?: string;
  source?: string;
}

// Simple environment variable getter that avoids syntax issues
export const getEmailJSEnvVar = (varName: string): SafeEnvResult => {
  // Try process.env (Node.js/build time)
  try {
    if (process && process.env && process.env[varName]) {
      const value = process.env[varName];
      if (value && value !== 'undefined' && value !== '') {
        return { found: true, value, source: 'process.env' };
      }
    }
  } catch (e) {
    // Ignore process.env errors
  }

  // Try window-attached variables
  try {
    if (typeof window !== 'undefined') {
      const windowEnv = (window as any).env;
      if (windowEnv && windowEnv[varName]) {
        const value = windowEnv[varName];
        if (value && value !== 'undefined' && value !== '') {
          return { found: true, value, source: 'window.env' };
        }
      }

      // Try direct window property
      const directValue = (window as any)[varName];
      if (directValue && directValue !== 'undefined' && directValue !== '') {
        return { found: true, value: directValue, source: 'window' };
      }
    }
  } catch (e) {
    // Ignore window errors
  }

  return { found: false };
};

// Get all EmailJS environment variables safely
export const getAllEmailJSEnvVars = () => {
  const vars = {
    serviceId: getEmailJSEnvVar('EMAILJS_SERVICE_ID'),
    templateId: getEmailJSEnvVar('EMAILJS_TEMPLATE_ID'),
    publicKey: getEmailJSEnvVar('EMAILJS_PUBLIC_KEY'),
    privateKey: getEmailJSEnvVar('EMAILJS_PRIVATE_KEY'),
    fromName: getEmailJSEnvVar('EMAILJS_FROM_NAME'),
    fromEmail: getEmailJSEnvVar('EMAILJS_FROM_EMAIL')
  };

  const requiredFound = [vars.serviceId, vars.templateId, vars.publicKey].filter(v => v.found).length;
  const configured = requiredFound === 3;

  return {
    variables: vars,
    configured,
    requiredFound,
    totalRequired: 3
  };
};

// Display EmailJS environment status safely
export const displaySafeEmailJSStatus = () => {
  console.log('📧 SAFE EMAILJS ENVIRONMENT CHECK');
  console.log('=================================');
  console.log('');

  const result = getAllEmailJSEnvVars();

  console.log('📊 REQUIRED VARIABLES:');
  console.log(`   Service ID: ${result.variables.serviceId.found ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Template ID: ${result.variables.templateId.found ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Public Key: ${result.variables.publicKey.found ? '✅ Found' : '❌ Missing'}`);

  console.log('');
  console.log('📊 OPTIONAL VARIABLES:');
  console.log(`   Private Key: ${result.variables.privateKey.found ? '✅ Found' : '⚠️ Not set'}`);
  console.log(`   From Name: ${result.variables.fromName.found ? '✅ Found' : '⚠️ Using default'}`);
  console.log(`   From Email: ${result.variables.fromEmail.found ? '✅ Found' : '⚠️ Using default'}`);

  console.log('');
  console.log('📋 SUMMARY:');
  console.log(`   Required: ${result.requiredFound}/${result.totalRequired} found`);
  console.log(`   Status: ${result.configured ? '✅ Configured' : '❌ Incomplete'}`);

  if (!result.configured) {
    console.log('');
    console.log('🔧 MISSING VARIABLES:');
    if (!result.variables.serviceId.found) console.log('   • EMAILJS_SERVICE_ID');
    if (!result.variables.templateId.found) console.log('   • EMAILJS_TEMPLATE_ID');
    if (!result.variables.publicKey.found) console.log('   • EMAILJS_PUBLIC_KEY');
    console.log('');
    console.log('💡 FIX OPTIONS:');
    console.log('   • Set environment variables in your deployment');
    console.log('   • Use goToEmailJSSetup() for manual configuration');
  } else {
    console.log('');
    console.log('🎉 EmailJS is ready to use!');
    console.log('🧪 Test with: testEmailJS("your-email@example.com")');
  }

  return result;
};