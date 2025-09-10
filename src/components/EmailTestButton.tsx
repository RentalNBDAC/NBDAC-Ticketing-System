import React, { useState } from 'react';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { toast } from '../utils/toast';

interface EmailTestButtonProps {
  onAddSubmission: (data: any) => Promise<boolean>;
  onRefreshSubmissions: () => Promise<void>;
  loading?: boolean;
  className?: string;
}

export default function EmailTestButton({ 
  onAddSubmission, 
  onRefreshSubmissions, 
  loading = false,
  className = ""
}: EmailTestButtonProps) {
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  const handleTestEmail = async () => {
    try {
      setSendingTestEmail(true);
      
      // Create a test submission with realistic data
      const testSubmission = {
        id: `test-email-${Date.now()}`,
        namaProjek: 'Test Email - Sistem Permohonan Projek Web Scraping NBDAC',
        bahagian: 'Bahagian Teknologi Maklumat',
        namaPegawai: 'Pentadbir Sistem',
        email: 'admin@nbdac.gov.my',
        tarikh: new Date().toLocaleDateString('ms-MY'),
        tujuanProjek: 'Ini adalah email ujian untuk memastikan sistem notifikasi berfungsi dengan betul. Email ini dihantar untuk menguji konfigurasi EmailJS dan format template.',
        websiteUrl: 'https://nbdac.gov.my',
        kutipanData: 'one-off',
        catatan: 'Email ujian - sila abaikan permohonan ini. Sistem sedang menguji format email dan konfigurasi notification.',
        status: 'Menunggu',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('📧 Sending test email notification...');
      toast.info('Menghantar email ujian...', 'Sistem sedang menghantar email ujian kepada semua pentadbir.');

      // Call the submission handler to trigger the email notification system
      const success = await onAddSubmission(testSubmission);
      
      if (success) {
        toast.success(
          'Email ujian berjaya dihantar!', 
          'Email ujian telah dihantar menggunakan sistem notifikasi yang sama seperti permohonan sebenar. Sila semak email anda untuk melihat format yang akan diterima.'
        );
        
        // Refresh submissions to show the test entry
        await onRefreshSubmissions();
      } else {
        toast.error(
          'Email ujian gagal dihantar', 
          'Terdapat masalah dengan sistem email. Sila semak konfigurasi EmailJS atau hubungi pentadbir sistem.'
        );
      }
    } catch (error) {
      console.error('Test email error:', error);
      toast.error(
        'Ralat menghantar email ujian', 
        'Terdapat ralat semasa menghantar email ujian. Sila cuba lagi atau semak konfigurasi sistem.'
      );
    } finally {
      setSendingTestEmail(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleTestEmail}
      disabled={loading || sendingTestEmail}
      className={`flex items-center gap-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 ${className}`}
    >
      <Send className={`h-4 w-4 ${sendingTestEmail ? 'animate-pulse' : ''}`} />
      {sendingTestEmail ? 'Menghantar...' : 'Uji Email'}
    </Button>
  );
}