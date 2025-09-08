// EmailJS Environment Variables Test
// Run this to verify EmailJS configuration is loading properly

export const testEmailJSEnvironment = () => {
  console.log('🧪 TESTING EMAILJS ENVIRONMENT VARIABLES');
  console.log('========================================');
  console.log('');

  // Safe environment variable access function
  const getEnvVar = (name: string): string | undefined => {
    // Try process.env first (most reliable)
    try {
      if (typeof process !== 'undefined' && process.env) {
        const nodeVar = process.env[name];
        if (nodeVar && nodeVar !== 'undefined') return nodeVar;
      }
    } catch (e) {
      // process might not be available
    }
    
    // Try window environment (if variables are attached to window)
    try {
      if (typeof window !== 'undefined') {
        // Check for window.env
        if ((window as any).env) {
          const windowVar = (window as any).env[name];
          if (windowVar && windowVar !== 'undefined') return windowVar;
        }
        
        // Check for environment variables directly on window
        const directVar = (window as any)[name];
        if (directVar && directVar !== 'undefined') return directVar;
      }
    } catch (e) {
      // window might not be available
    }
    
    return undefined;
  };

  // Check for environment variables
  const checkEnvVar = (name: string) => {
    const value = getEnvVar(name);
    if (value && value !== 'undefined') {
      console.log(`✅ ${name}: Found (${value.substring(0, 20)}...)`);
      return value;
    }
    console.log(`❌ ${name}: Not found`);
    return null;
  };

  // Check Service ID
  const serviceId = checkEnvVar('EMAILJS_SERVICE_ID');

  // Check Template ID
  const templateId = checkEnvVar('EMAILJS_TEMPLATE_ID');

  // Check Public Key
  const publicKey = checkEnvVar('EMAILJS_PUBLIC_KEY');

  // Check Private Key (optional)
  const privateKey = checkEnvVar('EMAILJS_PRIVATE_KEY');

  // Check From Name
  const fromName = getEnvVar('EMAILJS_FROM_NAME') || 'Sistem NBDAC';

  // Check From Email
  const fromEmail = getEnvVar('EMAILJS_FROM_EMAIL') || 'noreply@nbdac.gov.my';

  console.log('');
  console.log('📊 SUMMARY:');
  const requiredVars = [serviceId, templateId, publicKey];
  const foundRequired = requiredVars.filter(v => v).length;
  
  console.log(`   Required variables: ${foundRequired}/3 found`);
  console.log(`   Optional variables: ${privateKey ? '2/2' : '1/2'} found`);
  console.log(`   From Name: ${fromName}`);
  console.log(`   From Email: ${fromEmail}`);
  
  console.log('');
  if (foundRequired === 3) {
    console.log('✅ EmailJS environment variables are properly configured!');
    console.log('💡 You can now test with: testEmailJS("your-email@example.com")');
    
    return {
      configured: true,
      serviceId,
      templateId,
      publicKey,
      privateKey,
      fromName,
      fromEmail
    };
  } else {
    console.log('❌ EmailJS configuration incomplete');
    console.log('');
    console.log('🔧 TO FIX:');
    if (!serviceId) console.log('   • Set EMAILJS_SERVICE_ID environment variable');
    if (!templateId) console.log('   • Set EMAILJS_TEMPLATE_ID environment variable');
    if (!publicKey) console.log('   • Set EMAILJS_PUBLIC_KEY environment variable');
    console.log('');
    console.log('💡 You can also use: goToEmailJSSetup() to configure manually');
    
    return {
      configured: false,
      missing: {
        serviceId: !serviceId,
        templateId: !templateId,
        publicKey: !publicKey
      }
    };
  }
};