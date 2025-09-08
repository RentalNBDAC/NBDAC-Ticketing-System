// Server-side email formatting helpers and utilities for NBDAC system
import { mapDataFrequencyToMalay, getProjectName } from './email-data-mappers.tsx';
import { EMAIL_STYLES } from './email-styles.tsx';
import {
  buildEmailHeader,
  buildProjectDetailsSection,
  buildProjectPurposeSection,
  buildWebsiteSection,
  buildNotesSection,
  buildActionRequiredSection,
  buildSystemInfoSection,
  buildEmailFooter
} from './email-template-sections.tsx';

// Re-export the mapper for backward compatibility
export { mapDataFrequencyToMalay };

// Generate professional government-style HTML email template with SUPER AGGRESSIVE Outlook compatibility
export const generateProfessionalEmailHTML = (submission: any, submissionId: string): string => {
  const kutipanDataMalay = mapDataFrequencyToMalay(submission.kutipanData || submission.kekerapanPengumpulan || 'Tidak dinyatakan');
  const projectName = getProjectName(submission);
  
  return `
<!-- Super Aggressive Outlook Compatible Email Template -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff !important; font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto;">
  <tr>
    <td bgcolor="#ffffff" style="background-color: #ffffff !important;">
      
      ${buildEmailHeader(projectName)}

      <!-- Main Content Wrapper - Table Based -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#2563eb" style="background-color: #2563eb !important;">
        <tr>
          <td bgcolor="#2563eb" style="background-color: #2563eb !important; padding: 0 3px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff !important;">
              <tr>
                <td bgcolor="#ffffff" style="background-color: #ffffff !important; padding: 30px;">
                  
                  <!-- Inner Content Wrapper -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff !important;">
                    <tr>
                      <td bgcolor="#ffffff" style="background-color: #ffffff !important; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        
                        <!-- Greeting Section -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff !important;">
                          <tr>
                            <td bgcolor="#ffffff" style="background-color: #ffffff !important; padding-bottom: 20px;">
                              <p style="margin: 0; font-size: 16px; color: #374151 !important; background-color: #ffffff !important;">
                                <strong>Kepada:</strong> Pentadbir Sistem
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td bgcolor="#ffffff" style="background-color: #ffffff !important; padding-bottom: 25px;">
                              <p style="margin: 0; font-size: 16px; color: #374151 !important; line-height: 1.6; background-color: #ffffff !important;">
                                Permohonan projek baru telah diterima dan memerlukan semakan serta tindakan daripada pihak pentadbir.
                              </p>
                            </td>
                          </tr>
                        </table>

                        ${buildProjectDetailsSection(submission, kutipanDataMalay)}

                        ${buildProjectPurposeSection(submission)}

                        ${buildWebsiteSection(submission)}

                        ${buildNotesSection(submission)}
                        
                      </td>
                    </tr>
                  </table>

                  ${buildActionRequiredSection()}

                  ${buildSystemInfoSection(submissionId)}
                  
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${buildEmailFooter()}
      
    </td>
  </tr>
</table>
  `.trim();
};

// Generate plain text version for email templates that need both
export const generatePlainTextEmail = (submission: any, submissionId: string): string => {
  const kutipanDataMalay = mapDataFrequencyToMalay(submission.kutipanData || submission.kekerapanPengumpulan || 'Tidak dinyatakan');
  const projectName = getProjectName(submission);
  
  return `
📋 Permohonan Projek Baru - ${projectName}

Kepada Admin,

Permohonan projek baru telah diterima dan memerlukan semakan serta tindakan daripada pihak pentadbir.

BUTIRAN PERMOHONAN:
==================
Nama Projek: ${projectName}
Bahagian: ${submission.bahagian || 'Tidak dinyatakan'}
Nama Pegawai: ${submission.namaPegawai || submission.nama_pegawai || 'Tidak dinyatakan'}
Email: ${submission.email || 'Tidak dinyatakan'}
Tarikh: ${submission.tarikh || new Date().toLocaleDateString('ms-MY')}
Tujuan Projek: ${submission.tujuanProjek || submission.tujuan || 'Tidak dinyatakan'}
Website URL: ${submission.websiteUrl || submission.lamanWeb || 'Tidak dinyatakan'}
Kekerapan Kutipan Data: ${kutipanDataMalay}
Catatan: ${submission.catatan || submission.nota || 'Tiada catatan'}
Status: Menunggu

⚠️ TINDAKAN DIPERLUKAN
======================
Sila log masuk ke sistem untuk menyemak dan menguruskan permohonan ini.

Langkah-langkah:
• Semak butiran lengkap permohonan
• Tukar status kepada "Sedang Diprocess" atau "Selesai"  
• Hubungi pemohon jika diperlukan

MAKLUMAT SISTEM:
================
ID Permohonan: ${submissionId}
Masa Permohonan: ${new Date().toLocaleString('ms-MY')}

Sistem Permohonan Projek NBDAC
Automated message via EmailJS
  `.trim();
};