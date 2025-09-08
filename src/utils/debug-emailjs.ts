// Debug EmailJS Configuration Issues
import { getAllEmailJSEnvVars } from './emailjs-env-safe';
import { emailjsService } from './emailjs-service';

// Debug EmailJS configuration and environment variables  
export const debugEmailJSConfiguration = async (): Promise<void> => {
  console.log('🔍 DEBUGGING EMAILJS CONFIGURATION');
  console.log('=====================================');
  console.log('');

  // Check environment variables
  console.log('📊 Environment Variables Status:');
  const envResult = getAllEmailJSEnvVars();
  
  console.log(`   Service ID: ${envResult.variables.serviceId.found ? '✅ Found' : '❌ Missing'} ${envResult.variables.serviceId.source ? `(${envResult.variables.serviceId.source})` : ''}`);
  console.log(`   Template ID: ${envResult.variables.templateId.found ? '✅ Found' : '❌ Missing'} ${envResult.variables.templateId.source ? `(${envResult.variables.templateId.source})` : ''}`);
  console.log(`   Public Key: ${envResult.variables.publicKey.found ? '✅ Found' : '❌ Missing'} ${envResult.variables.publicKey.source ? `(${envResult.variables.publicKey.source})` : ''}`);
  console.log(`   Private Key: ${envResult.variables.privateKey.found ? '✅ Found' : '⚠️ Missing'} ${envResult.variables.privateKey.source ? `(${envResult.variables.privateKey.source})` : ''}`);
  console.log(`   From Name: ${envResult.variables.fromName.found ? '✅ Found' : '⚠️ Using default'} ${envResult.variables.fromName.source ? `(${envResult.variables.fromName.source})` : ''}`);
  console.log(`   From Email: ${envResult.variables.fromEmail.found ? '✅ Found' : '⚠️ Using default'} ${envResult.variables.fromEmail.source ? `(${envResult.variables.fromEmail.source})` : ''}`);
  console.log('');

  // Check if client-side environment variables are available
  console.log('🌐 Client-side Environment Check:');
  try {
    // Check if Supabase info is available (to test env access)
    const { projectId, publicAnonKey } = await import('./supabase/info');
    console.log('   ✅ Supabase environment variables accessible');
    console.log(`   📋 Project ID: ${projectId ? 'Found' : 'Missing'}`);
    console.log(`   🔑 Anon Key: ${publicAnonKey ? 'Found' : 'Missing'}`);
  } catch (error) {
    console.log('   ❌ Error accessing environment variables:', error);
  }
  console.log('');

  // Check EmailJS service status
  console.log('📧 EmailJS Service Status:');
  console.log(`   Configured: ${emailjsService.isConfigured() ? '✅ Yes' : '❌ No'}`);
  console.log(`   Config Object: ${emailjsService.getConfig() ? '✅ Available' : '❌ Missing'}`);
  
  if (emailjsService.isConfigured()) {
    const config = emailjsService.getConfig();
    console.log('   📋 Configuration Details:');
    console.log(`      Service ID: ${config?.serviceId ? 'Set' : 'Missing'}`);
    console.log(`      Template ID: ${config?.templateId ? 'Set' : 'Missing'}`);
    console.log(`      From Name: ${config?.fromName || 'Default'}`);
    console.log(`      From Email: ${config?.fromEmail || 'Default'}`);
  }
  console.log('');

  // Check process.env directly
  console.log('🔧 Direct Environment Variable Check:');
  try {
    console.log(`   EMAILJS_SERVICE_ID: ${process.env.EMAILJS_SERVICE_ID ? 'Found' : 'Missing'}`);
    console.log(`   EMAILJS_TEMPLATE_ID: ${process.env.EMAILJS_TEMPLATE_ID ? 'Found' : 'Missing'}`);
    console.log(`   EMAILJS_PUBLIC_KEY: ${process.env.EMAILJS_PUBLIC_KEY ? 'Found' : 'Missing'}`);
    console.log(`   EMAILJS_PRIVATE_KEY: ${process.env.EMAILJS_PRIVATE_KEY ? 'Found' : 'Missing'}`);
    console.log(`   EMAILJS_FROM_NAME: ${process.env.EMAILJS_FROM_NAME ? 'Found' : 'Missing'}`);
    console.log(`   EMAILJS_FROM_EMAIL: ${process.env.EMAILJS_FROM_EMAIL ? 'Found' : 'Missing'}`);
  } catch (error) {
    console.log('   ❌ Cannot access process.env:', error);
  }
  console.log('');

  // Recommendations
  console.log('💡 TROUBLESHOOTING RECOMMENDATIONS:');
  if (!envResult.configured) {
    console.log('   ❌ EmailJS environment variables are not properly configured');
    console.log('   🔧 These variables are set in Supabase Edge Function secrets, not client environment');
    console.log('   📊 Check server health: await healthCheck()');
    console.log('   🧪 Test server EmailJS: await testServerEmailJS()');
    console.log('   ⚙️ Use server-side configuration: goToEmailJSSetup()');
  } else {
    console.log('   ✅ Environment variables look good');
    console.log('   📧 Service should be ready for email sending');
    console.log('   🧪 Test configuration: await testEmailJS("your@email.com")');
  }
  console.log('');
};

// Test if EmailJS can actually send an email
export const testEmailJSDirectly = async (testEmail: string): Promise<{ success: boolean; message: string; details?: any }> => {
  console.log('🧪 Testing EmailJS directly...');
  
  try {
    if (!emailjsService.isConfigured()) {
      return {
        success: false,
        message: 'EmailJS service is not configured',
        details: { 
          configured: false,
          envVars: getAllEmailJSEnvVars()
        }
      };
    }

    const result = await emailjsService.testConfiguration(testEmail);
    
    return {
      success: result.success,
      message: result.message,
      details: {
        configured: true,
        config: emailjsService.getConfig()
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Direct test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error }
    };
  }
};

// Add debugging function to window for easy access
if (typeof window !== 'undefined') {
  (window as any).debugEmailJS = debugEmailJSConfiguration;
  (window as any).testEmailJSDirectly = testEmailJSDirectly;
  
  console.log('🔧 Debug functions added to window:');
  console.log('   - debugEmailJS() - Debug configuration');
  console.log('   - testEmailJSDirectly("email@example.com") - Test sending');
}