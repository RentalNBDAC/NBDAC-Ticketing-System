// Safe EmailJS Environment Variable Checker
// This utility safely checks for EmailJS environment variables without throwing errors

export interface EnvVarResult {
  available: boolean;
  value?: string;
  source?: string;
  error?: string;
}

export interface EmailJSEnvCheck {
  accessible: boolean;
  variables: {
    serviceId: EnvVarResult;
    templateId: EnvVarResult;
    publicKey: EnvVarResult;
    privateKey: EnvVarResult;
    fromName: EnvVarResult;
    fromEmail: EnvVarResult;
  };
  configured: boolean;
  summary: string;
}

// Safe environment variable getter
export const safeGetEnvVar = (name: string): EnvVarResult => {
  // Try process.env first (most reliable)
  try {
    if (typeof process !== 'undefined' && process.env) {
      const nodeVar = process.env[name];
      if (nodeVar && nodeVar !== 'undefined') {
        return { available: true, value: nodeVar, source: 'process.env' };
      }
    }
  } catch (e) {
    // process might not be available - this is expected in browser environments
  }
  
  // Try window environment (if variables are attached to window)
  try {
    if (typeof window !== 'undefined') {
      // Check for window.env
      if ((window as any).env) {
        const windowVar = (window as any).env[name];
        if (windowVar && windowVar !== 'undefined') {
          return { available: true, value: windowVar, source: 'window.env' };
        }
      }
      
      // Check for environment variables directly on window
      const directVar = (window as any)[name];
      if (directVar && directVar !== 'undefined') {
        return { available: true, value: directVar, source: 'window' };
      }
    }
  } catch (e) {
    // window might not be available - this is expected in server environments
  }
  
  return { available: false, error: 'Variable not found in any environment source' };
};

// Check all EmailJS environment variables safely
export const checkEmailJSEnvironment = (): EmailJSEnvCheck => {
  const variables = {
    serviceId: safeGetEnvVar('EMAILJS_SERVICE_ID'),
    templateId: safeGetEnvVar('EMAILJS_TEMPLATE_ID'),
    publicKey: safeGetEnvVar('EMAILJS_PUBLIC_KEY'),
    privateKey: safeGetEnvVar('EMAILJS_PRIVATE_KEY'),
    fromName: safeGetEnvVar('EMAILJS_FROM_NAME'),
    fromEmail: safeGetEnvVar('EMAILJS_FROM_EMAIL'),
  };

  const requiredVars = [variables.serviceId, variables.templateId, variables.publicKey];
  const availableRequired = requiredVars.filter(v => v.available).length;
  const configured = availableRequired === 3;

  let summary = '';
  if (configured) {
    summary = `✅ EmailJS fully configured (${availableRequired}/3 required variables found)`;
  } else {
    summary = `⚠️ EmailJS incomplete (${availableRequired}/3 required variables found)`;
  }

  return {
    accessible: true,
    variables,
    configured,
    summary
  };
};

// Console-friendly display of EmailJS environment status
export const displayEmailJSEnvironmentStatus = (): EmailJSEnvCheck => {
  console.log('📧 EMAILJS ENVIRONMENT VARIABLE CHECK');
  console.log('====================================');
  
  const check = checkEmailJSEnvironment();
  
  console.log('');
  console.log('📊 REQUIRED VARIABLES:');
  console.log(`   Service ID: ${check.variables.serviceId.available ? '✅ Found' : '❌ Missing'} ${check.variables.serviceId.source ? `(${check.variables.serviceId.source})` : ''}`);
  console.log(`   Template ID: ${check.variables.templateId.available ? '✅ Found' : '❌ Missing'} ${check.variables.templateId.source ? `(${check.variables.templateId.source})` : ''}`);
  console.log(`   Public Key: ${check.variables.publicKey.available ? '✅ Found' : '❌ Missing'} ${check.variables.publicKey.source ? `(${check.variables.publicKey.source})` : ''}`);
  
  console.log('');
  console.log('📊 OPTIONAL VARIABLES:');
  console.log(`   Private Key: ${check.variables.privateKey.available ? '✅ Found' : '⚠️ Not set'} ${check.variables.privateKey.source ? `(${check.variables.privateKey.source})` : ''}`);
  console.log(`   From Name: ${check.variables.fromName.available ? '✅ Found' : '⚠️ Using default'} ${check.variables.fromName.source ? `(${check.variables.fromName.source})` : ''}`);
  console.log(`   From Email: ${check.variables.fromEmail.available ? '✅ Found' : '⚠️ Using default'} ${check.variables.fromEmail.source ? `(${check.variables.fromEmail.source})` : ''}`);
  
  console.log('');
  console.log('📋 SUMMARY:');
  console.log(`   ${check.summary}`);
  
  if (!check.configured) {
    console.log('');
    console.log('🔧 TO FIX:');
    if (!check.variables.serviceId.available) console.log('   • Set EMAILJS_SERVICE_ID environment variable');
    if (!check.variables.templateId.available) console.log('   • Set EMAILJS_TEMPLATE_ID environment variable');
    if (!check.variables.publicKey.available) console.log('   • Set EMAILJS_PUBLIC_KEY environment variable');
    console.log('');
    console.log('💡 ALTERNATIVES:');
    console.log('   • Use goToEmailJSSetup() for manual configuration');
    console.log('   • Visit EmailJS setup page in admin interface');
  } else {
    console.log('');
    console.log('🎉 EmailJS is ready!');
    console.log('🧪 Test with: testEmailJS("your-email@example.com")');
  }
  
  return check;
};