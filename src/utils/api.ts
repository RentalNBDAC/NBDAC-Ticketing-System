import { projectId, publicAnonKey } from './supabase/info';

const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4`;

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const url = `${baseUrl}${endpoint}`;
    console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    console.log(`📡 API Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        console.log('❌ Error response data:', errorData);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (jsonError) {
        console.warn('Failed to parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('📥 API Response data:', data);
    return data;
  } catch (error) {
    console.error('💥 API call failed:', error);
    throw error;
  }
};

const validateSubmission = (submission: any) => {
  const isValid = submission && 
         typeof submission === 'object' && 
         submission.id && 
         typeof submission.id === 'string' &&
         submission.namaProjek &&
         submission.bahagian &&
         submission.namaPengawai &&
         submission.email;
  
  if (!isValid) {
    console.log('❌ Invalid submission detected:', submission);
    console.log('❌ Validation details:', {
      hasSubmission: !!submission,
      isObject: typeof submission === 'object',
      hasId: submission?.id,
      idIsString: typeof submission?.id === 'string',
      hasNamaProjek: submission?.namaProjek,
      hasBahagian: submission?.bahagian,
      hasNamaPengawai: submission?.namaPengawai,
      hasEmail: submission?.email
    });
  }
  
  return isValid;
};

export const api = {
  // Create a new submission
  createSubmission: async (submissionData: any) => {
    if (!submissionData || typeof submissionData !== 'object') {
      throw new Error('Invalid submission data');
    }
    
    console.log('📤 Creating submission:', submissionData);
    return apiCall('/submissions', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  },

  // Get all submissions
  getAllSubmissions: async () => {
    console.log('📥 Fetching all submissions...');
    const response = await apiCall('/submissions');
    
    // Validate and filter submissions
    if (response.submissions && Array.isArray(response.submissions)) {
      const originalCount = response.submissions.length;
      console.log('🔍 Original submissions before validation:', response.submissions);
      
      response.submissions = response.submissions.filter(validateSubmission);
      const validCount = response.submissions.length;
      
      console.log(`✅ Submissions filtered: ${originalCount} -> ${validCount} valid`);
      
      if (originalCount > 0 && validCount === 0) {
        console.warn('⚠️ All submissions were filtered out! This suggests a data structure issue.');
        console.warn('⚠️ Sample raw submission:', response.submissions[0]);
      }
    } else {
      console.log('⚠️ No submissions array found in response, creating empty array');
      console.log('⚠️ Response structure:', response);
      response.submissions = [];
    }
    
    return response;
  },

  // Get submissions by email
  getSubmissionsByEmail: async (email: string) => {
    if (!email || typeof email !== 'string') {
      throw new Error('Valid email is required');
    }
    
    console.log('📧 Fetching submissions for email:', email);
    const response = await apiCall(`/submissions/email/${encodeURIComponent(email)}`);
    
    // Validate and filter submissions
    if (response.submissions && Array.isArray(response.submissions)) {
      const originalCount = response.submissions.length;
      response.submissions = response.submissions.filter(validateSubmission);
      const validCount = response.submissions.length;
      
      console.log(`✅ Email submissions filtered: ${originalCount} -> ${validCount} valid`);
    } else {
      console.log('⚠️ No submissions array found in email response, creating empty array');
      response.submissions = [];
    }
    
    return response;
  },

  // Update submission status
  updateSubmissionStatus: async (id: string, status: string) => {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid submission ID is required');
    }
    
    if (!status || typeof status !== 'string') {
      throw new Error('Valid status is required');
    }
    
    console.log('🔄 Updating submission status:', { id, status });
    return apiCall(`/submissions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Get submission by ID
  getSubmissionById: async (id: string) => {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid submission ID is required');
    }
    
    console.log('🔍 Fetching submission by ID:', id);
    return apiCall(`/submissions/${id}`);
  },

  // Health check
  healthCheck: async () => {
    console.log('🏥 Performing health check...');
    return apiCall('/health');
  },

  // Debug endpoint to inspect KV store
  debugKV: async () => {
    console.log('🔧 Debug: Inspecting KV store...');
    return apiCall('/debug/kv');
  },
};

// EmailJS API functions
export const emailjsAPI = {
  // Save EmailJS configuration
  saveConfig: async (config: {
    serviceId: string;
    templateId: string;
    publicKey: string;
    privateKey?: string;
    fromName?: string;
    fromEmail?: string;
  }) => {
    console.log('📧 Saving EmailJS configuration...');
    return apiCall('/save-emailjs-config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  },
  
  // Get EmailJS configuration
  getConfig: async () => {
    console.log('📧 Getting EmailJS configuration...');
    return apiCall('/get-emailjs-config');
  },
  
  // Clear EmailJS configuration
  clearConfig: async () => {
    console.log('📧 Clearing EmailJS configuration...');
    return apiCall('/clear-emailjs-config', { method: 'DELETE' });
  },
  
  // Test EmailJS configuration
  test: async (testEmail: string) => {
    console.log('🧪 Testing EmailJS configuration...');
    return apiCall('/test-emailjs', {
      method: 'POST',
      body: JSON.stringify({ testEmail }),
    });
  },
  
  // Get EmailJS status
  getStatus: async () => {
    console.log('📊 Getting EmailJS status...');
    return apiCall('/emailjs-status');
  },
  
  // Get admin emails for notifications
  getAdminEmails: async () => {
    console.log('👥 Getting admin emails...');
    return apiCall('/get-admin-emails');
  },
  
  // Set admin emails
  setAdminEmails: async (emails: string[]) => {
    console.log('👥 Setting admin emails...');
    return apiCall('/set-admin-emails', {
      method: 'POST',
      body: JSON.stringify({ emails }),
    });
  },
};