// EmailJS Template Validator - Helps identify template configuration issues

export const validateEmailJSTemplate = (templateParams: any): { valid: boolean; issues: string[]; recommendations: string[] } => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for recipient fields
  const recipientFields = ['to_email', 'recipient_email', 'to_name', 'user_email'];
  const hasRecipientField = recipientFields.some(field => templateParams[field]);
  
  if (!hasRecipientField) {
    issues.push('No recipient field found (to_email, recipient_email, user_email)');
    recommendations.push('Add {{to_email}} or {{recipient_email}} to your EmailJS template');
  }

  // Check for required content fields
  const contentFields = [
    { field: 'subject', required: true },
    { field: 'message', required: true },
    { field: 'from_name', required: false },
    { field: 'from_email', required: false }
  ];

  contentFields.forEach(({ field, required }) => {
    if (required && !templateParams[field]) {
      issues.push(`Missing required field: ${field}`);
      recommendations.push(`Add {{${field}}} to your EmailJS template`);
    }
  });

  // Check for common EmailJS template issues
  if (!templateParams.to_email && !templateParams.recipient_email) {
    issues.push('Missing primary recipient field - this commonly causes "recipients address is empty" error');
    recommendations.push('Ensure your template has {{to_email}} or {{recipient_email}} field');
  }

  const valid = issues.length === 0;

  return {
    valid,
    issues,
    recommendations
  };
};

// Test template parameters with common EmailJS field variations
export const testCommonEmailJSFields = (baseParams: any): any[] => {
  const variations = [
    {
      name: 'Standard EmailJS Fields',
      params: {
        to_email: baseParams.to_email || baseParams.recipient_email || 'test@example.com',
        to_name: baseParams.to_name || 'Test User',
        subject: baseParams.subject || 'Test Email',
        message: baseParams.message || 'Test message content',
        from_name: baseParams.from_name || 'System',
        from_email: baseParams.from_email || 'noreply@example.com',
        reply_to: baseParams.reply_to || baseParams.from_email || 'noreply@example.com'
      }
    },
    {
      name: 'Alternative Recipient Fields',
      params: {
        recipient_email: baseParams.to_email || baseParams.recipient_email || 'test@example.com',
        user_name: baseParams.to_name || 'Test User',
        email_subject: baseParams.subject || 'Test Email',
        email_message: baseParams.message || 'Test message content',
        sender_name: baseParams.from_name || 'System',
        sender_email: baseParams.from_email || 'noreply@example.com'
      }
    },
    {
      name: 'Simple Fields Only',
      params: {
        to_email: baseParams.to_email || baseParams.recipient_email || 'test@example.com',
        subject: baseParams.subject || 'Test Email',
        message: baseParams.message || 'Test message content'
      }
    }
  ];

  return variations;
};

// Generate debugging template parameters
export const generateDebugTemplateParams = (recipient: string): any => {
  return {
    // Primary recipient fields (most common)
    to_email: recipient,
    recipient_email: recipient,
    user_email: recipient,
    to_name: 'Debug Test User',
    
    // Content fields
    subject: 'EmailJS Debug Test - Sistem NBDAC',
    message: `This is a debug test email to identify template configuration issues.

Recipient: ${recipient}
Test Time: ${new Date().toLocaleString('ms-MY')}
Purpose: Debugging "recipients address is empty" error

If you receive this email, the template configuration is working correctly.

System: Sistem Permohonan Projek NBDAC`,

    // Sender fields
    from_name: 'Sistem NBDAC Debug',
    from_email: 'noreply@nbdac.gov.my',
    reply_to: 'noreply@nbdac.gov.my',
    
    // Additional common fields
    user_name: 'Debug Test User',
    email_subject: 'EmailJS Debug Test - Sistem NBDAC',
    email_message: 'Debug test message content',
    sender_name: 'Sistem NBDAC Debug',
    sender_email: 'noreply@nbdac.gov.my',
    
    // System info
    test_id: `debug-${Date.now()}`,
    test_time: new Date().toISOString(),
    system_name: 'Sistem Permohonan Projek NBDAC - Debug Mode'
  };
};

// Console debugging helper
export const debugEmailJSTemplate = (templateParams: any): void => {
  console.log('🔍 EMAILJS TEMPLATE DEBUG');
  console.log('========================');
  console.log('');
  
  const validation = validateEmailJSTemplate(templateParams);
  
  console.log('📋 Template Parameters:');
  Object.keys(templateParams).forEach(key => {
    console.log(`   ${key}: ${templateParams[key]}`);
  });
  
  console.log('');
  console.log(`✅ Validation Result: ${validation.valid ? 'PASSED' : 'FAILED'}`);
  
  if (validation.issues.length > 0) {
    console.log('');
    console.log('❌ Issues Found:');
    validation.issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
  }
  
  if (validation.recommendations.length > 0) {
    console.log('');
    console.log('💡 Recommendations:');
    validation.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
  }
  
  console.log('');
  console.log('🎯 Common Template Structure:');
  console.log('Subject: {{subject}}');
  console.log('To: {{to_email}} or {{recipient_email}}');
  console.log('');
  console.log('Hello {{to_name}},');
  console.log('');
  console.log('{{message}}');
  console.log('');
  console.log('Best regards,');
  console.log('{{from_name}}');
};