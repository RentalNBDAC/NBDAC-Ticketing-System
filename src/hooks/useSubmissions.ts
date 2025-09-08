import { useState, useCallback } from 'react';
import { toast } from '../utils/toast';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Submission {
  id: string;
  tarikh: string;
  submittedAt: string;
  bahagian: string;
  namaProjek: string;
  email: string;
  namaPegawai: string;
  tujuanProjek?: string;
  websiteUrl?: string;
  kutipanData?: string;
  catatan?: string;
  status: 'Menunggu' | 'Sedang Diprocess' | 'Selesai';
  adminNote?: string;
  noteAddedAt?: string;
  updatedAt?: string;
}

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/submissions`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Gagal memuat data permohonan');
      }

      console.log(`📊 Loaded ${data.total} submissions from ${data.source}`);
      setSubmissions(data.submissions || []);
      
      // Show source info if using fallback
      if (data.source === 'kv_store') {
        console.log('💡 Using KV store - database table may need setup');
      }
      
    } catch (error) {
      console.error('❌ Error loading submissions:', error);
      toast.error('Gagal memuat senarai permohonan');
      setSubmissions([]); // Clear submissions on error
    } finally {
      setLoading(false);
    }
  }, []);

  const addSubmission = useCallback(async (submissionData: any) => {
    try {
      console.log('📝 Submitting new project request...', submissionData);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(submissionData),
      });

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server response not ok:', response.status, errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      // Parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse server response:', parseError);
        throw new Error('Server returned invalid response');
      }

      // Check if submission was successful according to server
      if (!data.success) {
        console.error('❌ Server reported submission failure:', data.error);
        throw new Error(data.error || 'Server rejected submission');
      }

      // Validate that we received confirmation data
      if (!data.submissionId || !data.submission) {
        console.warn('⚠️ Incomplete response data:', data);
        throw new Error('Submission saved but no confirmation received');
      }

      console.log('✅ Submission successful:', {
        id: data.submissionId,
        storage: data.storage,
        timestamp: data.submission.createdAt
      });
      
      console.log('📧 Email notifications will be sent automatically by server to all admin users');

      // Show success message with details
      toast.success('Permohonan berjaya dihantar!', {
        description: `ID: ${data.submissionId} • Status: ${data.submission.status}`
      });

      // Show warning if using backup storage
      if (data.warning) {
        console.warn('⚠️ Storage warning:', data.warning);
        toast.warning('Permohonan disimpan menggunakan simpanan sandaran');
      }

      // Add the new submission to local state using server response data
      const newSubmission: Submission = {
        id: data.submissionId,
        tarikh: data.submission.tarikh || new Date().toISOString().split('T')[0],
        submittedAt: data.submission.createdAt,
        bahagian: data.submission.bahagian || '',
        namaProjek: data.submission.namaProjek || '',
        email: data.submission.email || '',
        namaPegawai: data.submission.namaPegawai || '',
        tujuanProjek: data.submission.tujuanProjek || '',
        websiteUrl: data.submission.websiteUrl || '',
        kutipanData: data.submission.kutipanData || '',
        catatan: data.submission.catatan || '',
        status: data.submission.status || 'Menunggu'
      };

      // Update local submissions list
      setSubmissions(prev => [newSubmission, ...prev]);

      // Send email notification via client-side EmailJS (required since EmailJS only works in browser)
      console.log('📧 Triggering client-side EmailJS notification...');
      try {
        const { sendEmailNotificationForSubmission } = await import('../utils/emailjs-integration');
        await sendEmailNotificationForSubmission(newSubmission);
        console.log('✅ Client-side EmailJS notification triggered successfully');
      } catch (emailError) {
        console.warn('⚠️ Client-side EmailJS notification failed:', emailError);
        console.log('💡 Note: Server-side logging is still active');
      }

      return {
        success: true,
        submissionId: data.submissionId,
        data: newSubmission
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('💥 Failed to add submission:', errorMessage);
      
      // Show user-friendly error message
      toast.error('Gagal menghantar permohonan', {
        description: errorMessage
      });

      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  const updateSubmissionStatus = useCallback(async (id: string, status: string, adminNote?: string) => {
    try {
      console.log(`📝 Updating submission ${id} status to: ${status}`);
      if (adminNote) {
        console.log(`📄 Adding admin note for completion`);
      }
      
      const requestBody: any = { status };
      
      // Add admin note if status is "Selesai" and note is provided
      if (status === 'Selesai' && adminNote && adminNote.trim()) {
        requestBody.adminNote = adminNote.trim();
      }
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/submissions/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Gagal mengemaskini status');
      }

      console.log('✅ Status updated successfully:', data);
      
      // Update local state with the updated submission data from server
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id 
            ? { 
                ...sub, 
                status: status as any,
                adminNote: requestBody.adminNote || sub.adminNote,
                noteAddedAt: data.submission?.noteAddedAt || sub.noteAddedAt,
                updatedAt: data.submission?.updatedAt || new Date().toISOString()
              }
            : sub
        )
      );

      toast.success(data.message || 'Status berjaya dikemaskini');
      
      return { success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Error updating status:', errorMessage);
      toast.error('Gagal mengemaskini status');
      return { success: false, error: errorMessage };
    }
  }, []);

  const getSubmissionsByEmail = useCallback(async (email: string) => {
    try {
      console.log(`🔍 Checking submissions for email: ${email}`);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/submissions/check/${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Gagal menyemak status permohonan');
      }

      console.log(`✅ Found ${data.total} submissions for ${email} (source: ${data.source})`);
      
      return {
        success: true,
        submissions: data.submissions || [],
        total: data.total || 0,
        source: data.source
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Error checking submissions:', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        submissions: [],
        total: 0
      };
    }
  }, []);

  return {
    submissions,
    loading,
    loadSubmissions,
    addSubmission,
    updateSubmissionStatus,
    getSubmissionsByEmail,
  };
};