// BULLETPROOF Email Template - Multiple Fallback Methods for Outlook
import { EMAIL_STYLES } from './email-styles.tsx';

// Method 1: VML + bgcolor attribute + CSS (Triple Fallback)
export const buildEmailHeader = (projectName: string): string => {
  return `
  <!-- Header - BULLETPROOF Method with Triple Fallback -->
  <!--[if mso]>
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td bgcolor="#f8fafc">
  <![endif]-->
  <div style="background-color:#f8fafc;mso-line-height-rule:exactly;">
    <!--[if mso]>
    <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;">
      <v:fill type="tile" color="#f8fafc" />
      <v:textbox inset="25px,25px,25px,25px">
    <![endif]-->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="background-color:#f8fafc;border:4px solid #2563eb;">
      <tr>
        <td bgcolor="#f8fafc" style="background-color:#f8fafc;padding:25px;text-align:center;">
          <h1 style="margin:0 0 15px 0;font-size:24px;font-weight:600;color:#000000;text-align:center;font-family:Arial,sans-serif;">
            Sistem Permohonan Projek NBDAC
          </h1>
          <div style="border-top:2px solid #2563eb;margin:15px auto;width:60px;height:2px;"></div>
          <h2 style="margin:0 0 10px 0;font-size:20px;font-weight:500;color:#000000;text-align:center;font-family:Arial,sans-serif;">
            Permohonan Projek Baru
          </h2>
          <p style="margin:0;font-size:16px;font-weight:600;color:#000000;text-align:center;font-family:Arial,sans-serif;">
            ${projectName}
          </p>
        </td>
      </tr>
    </table>
    <!--[if mso]>
      </v:textbox>
    </v:rect>
    <![endif]-->
  </div>
  <!--[if mso]>
      </td>
    </tr>
  </table>
  <![endif]-->`;
};

// Method 2: Pure Table with bgcolor (Most Reliable for Outlook)
export const buildActionRequiredSection = (): string => {
  return `
    <!-- Action Required - PURE TABLE METHOD (Most Reliable) -->
    <!--[if mso]>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td bgcolor="#fef2f2">
    <![endif]-->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fef2f2" style="background-color:#fef2f2;border:4px solid #dc2626;margin:25px 0;">
      <tr>
        <td bgcolor="#fef2f2" style="background-color:#fef2f2;padding:25px;">
          <!-- Red Background Content -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="text-align:center;padding-bottom:15px;">
                <h3 style="margin:0;font-size:18px;font-weight:600;color:#b91c1c;text-align:center;font-family:Arial,sans-serif;">
                  ⚠️ TINDAKAN DIPERLUKAN
                </h3>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;padding-bottom:20px;">
                <p style="margin:0;font-size:16px;color:#b91c1c;text-align:center;font-weight:600;font-family:Arial,sans-serif;">
                  Sila log masuk ke sistem untuk menyemak dan menguruskan permohonan ini.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <!-- White content box inside red background -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff;border:2px solid #dc2626;">
                  <tr>
                    <td bgcolor="#ffffff" style="background-color:#ffffff;padding:15px;">
                      <h4 style="margin:0 0 10px 0;font-size:16px;font-weight:600;color:#b91c1c;font-family:Arial,sans-serif;">
                        Langkah-langkah:
                      </h4>
                      <table width="100%" cellpadding="3" cellspacing="0" border="0">
                        <tr>
                          <td style="color:#b91c1c;font-size:14px;line-height:1.8;border-left:3px solid #dc2626;padding-left:10px;font-family:Arial,sans-serif;">
                            • Semak butiran lengkap permohonan
                          </td>
                        </tr>
                        <tr>
                          <td style="color:#b91c1c;font-size:14px;line-height:1.8;border-left:3px solid #dc2626;padding-left:10px;font-family:Arial,sans-serif;">
                            • Tukar status kepada "Sedang Diproses" atau "Selesai"
                          </td>
                        </tr>
                        <tr>
                          <td style="color:#b91c1c;font-size:14px;line-height:1.8;border-left:3px solid #dc2626;padding-left:10px;font-family:Arial,sans-serif;">
                            • Hubungi pemohon jika diperlukan
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <!--[if mso]>
        </td>
      </tr>
    </table>
    <![endif]-->`;
};

// Method 3: Outlook-Safe Project Details (Using bgcolor attribute)
export const buildProjectDetailsSection = (submission: any, kutipanDataMalay: string): string => {
  return `
      <!-- Project Details - OUTLOOK SAFE METHOD -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#3b82f6" style="background-color:#3b82f6;margin:20px 0;">
        <tr>
          <td bgcolor="#3b82f6" style="background-color:#3b82f6;padding:2px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff;">
              <tr>
                <td bgcolor="#ffffff" style="background-color:#ffffff;padding:20px;">
                  
                  <!-- Section Header -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff;">
                    <tr>
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding-bottom:15px;border-bottom:2px solid #3b82f6;">
                        <h3 style="margin:0;color:#1e293b;font-size:18px;font-weight:600;font-family:Arial,sans-serif;">
                          📊 BUTIRAN PERMOHONAN
                        </h3>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Details Table -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff;margin-top:15px;border-collapse:collapse;font-size:14px;">
                    <tr bgcolor="#ffffff" style="border-bottom:1px solid #e5e7eb;">
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;font-weight:600;color:#374151;width:35%;font-family:Arial,sans-serif;">Nama Projek:</td>
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;color:#1f2937;font-family:Arial,sans-serif;">${submission.namaProjek || submission.nama_projek || 'Tidak dinyatakan'}</td>
                    </tr>
                    <tr bgcolor="#ffffff" style="border-bottom:1px solid #e5e7eb;">
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;font-weight:600;color:#374151;font-family:Arial,sans-serif;">Bahagian:</td>
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;color:#1f2937;font-family:Arial,sans-serif;">${submission.bahagian || 'Tidak dinyatakan'}</td>
                    </tr>
                    <tr bgcolor="#ffffff" style="border-bottom:1px solid #e5e7eb;">
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;font-weight:600;color:#374151;font-family:Arial,sans-serif;">Nama Pegawai:</td>
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;color:#1f2937;font-family:Arial,sans-serif;">${submission.namaPegawai || submission.nama_pegawai || 'Tidak dinyatakan'}</td>
                    </tr>
                    <tr bgcolor="#ffffff" style="border-bottom:1px solid #e5e7eb;">
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;font-weight:600;color:#374151;font-family:Arial,sans-serif;">Email:</td>
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;color:#1f2937;font-family:Arial,sans-serif;">${submission.email || 'Tidak dinyatakan'}</td>
                    </tr>
                    <tr bgcolor="#ffffff" style="border-bottom:1px solid #e5e7eb;">
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;font-weight:600;color:#374151;font-family:Arial,sans-serif;">Tarikh:</td>
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;color:#1f2937;font-family:Arial,sans-serif;">${submission.tarikh || new Date().toLocaleDateString('ms-MY')}</td>
                    </tr>
                    <tr bgcolor="#ffffff" style="border-bottom:1px solid #e5e7eb;">
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;font-weight:600;color:#374151;font-family:Arial,sans-serif;">Kekerapan Kutipan Data:</td>
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;color:#1f2937;text-transform:capitalize;font-family:Arial,sans-serif;">${kutipanDataMalay}</td>
                    </tr>
                    <tr bgcolor="#ffffff">
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;font-weight:600;color:#374151;font-family:Arial,sans-serif;">Status:</td>
                      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px 0;color:#1f2937;font-family:Arial,sans-serif;">
                        <span style="border:2px solid #f59e0b;color:#92400e;padding:4px 12px;font-size:12px;font-weight:600;display:inline-block;">
                          🟡 Menunggu
                        </span>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
};

// Keep other sections with bgcolor method
export const buildProjectPurposeSection = (submission: any): string => {
  return `
      <!-- Project Purpose Section -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#3b82f6" style="background-color:#3b82f6;margin:20px 0;">
        <tr>
          <td bgcolor="#3b82f6" style="background-color:#3b82f6;padding:2px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff;">
              <tr>
                <td bgcolor="#ffffff" style="background-color:#ffffff;padding:20px;">
                  <h4 style="margin:0 0 10px 0;color:#1e40af;font-size:16px;font-weight:600;font-family:Arial,sans-serif;">
                    🎯 Tujuan Projek
                  </h4>
                  <p style="margin:0;color:#374151;line-height:1.6;font-size:14px;font-family:Arial,sans-serif;">
                    ${submission.tujuanProjek || submission.tujuan || 'Tidak dinyatakan'}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
};

export const buildWebsiteSection = (submission: any): string => {
  return `
      <!-- Website URLs Section -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#16a34a" style="background-color:#16a34a;margin:20px 0;">
        <tr>
          <td bgcolor="#16a34a" style="background-color:#16a34a;padding:2px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff;">
              <tr>
                <td bgcolor="#ffffff" style="background-color:#ffffff;padding:20px;">
                  <h4 style="margin:0 0 10px 0;color:#15803d;font-size:16px;font-weight:600;font-family:Arial,sans-serif;">
                    🌐 Laman Web
                  </h4>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#16a34a" style="background-color:#16a34a;">
                    <tr>
                      <td bgcolor="#16a34a" style="background-color:#16a34a;padding:2px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff;">
                          <tr>
                            <td bgcolor="#ffffff" style="background-color:#ffffff;padding:12px;font-family:'Courier New',monospace;font-size:13px;color:#15803d;word-break:break-all;">
                              ${submission.websiteUrl || submission.lamanWeb || 'Tidak dinyatakan'}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
};

export const buildNotesSection = (submission: any): string => {
  if (!(submission.catatan || submission.nota)) {
    return '';
  }
  
  return `
      <!-- Additional Notes -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f59e0b" style="background-color:#f59e0b;margin:20px 0;">
        <tr>
          <td bgcolor="#f59e0b" style="background-color:#f59e0b;padding:2px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff;">
              <tr>
                <td bgcolor="#ffffff" style="background-color:#ffffff;padding:20px;">
                  <h4 style="margin:0 0 10px 0;color:#d97706;font-size:16px;font-weight:600;font-family:Arial,sans-serif;">
                    📝 Catatan Tambahan
                  </h4>
                  <p style="margin:0;color:#374151;line-height:1.6;font-size:14px;font-family:Arial,sans-serif;">
                    ${submission.catatan || submission.nota}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
};

export const buildSystemInfoSection = (submissionId: string): string => {
  return `
    <!-- System Information - FIXED CONTRAST -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#6b7280" style="background-color:#6b7280;margin:20px 0;">
      <tr>
        <td bgcolor="#6b7280" style="background-color:#6b7280;padding:2px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8f9fa" style="background-color:#f8f9fa;">
            <tr>
              <td bgcolor="#f8f9fa" style="background-color:#f8f9fa;padding:20px;">
                <h4 style="margin:0 0 12px 0;color:#000000;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;font-family:Arial,sans-serif;">
                  Maklumat Sistem
                </h4>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8f9fa" style="background-color:#f8f9fa;font-size:13px;">
                  <tr bgcolor="#f8f9fa">
                    <td bgcolor="#f8f9fa" style="background-color:#f8f9fa;padding:4px 0;font-weight:600;color:#000000;font-family:Arial,sans-serif;">ID Permohonan:</td>
                    <td bgcolor="#f8f9fa" style="background-color:#f8f9fa;padding:4px 0;font-family:'Courier New',monospace;font-weight:600;color:#000000;">${submissionId}</td>
                  </tr>
                  <tr bgcolor="#f8f9fa">
                    <td bgcolor="#f8f9fa" style="background-color:#f8f9fa;padding:4px 0;font-weight:600;color:#000000;font-family:Arial,sans-serif;">Masa Permohonan:</td>
                    <td bgcolor="#f8f9fa" style="background-color:#f8f9fa;padding:4px 0;font-weight:600;color:#000000;font-family:Arial,sans-serif;">${new Date().toLocaleString('ms-MY')}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
};

export const buildEmailFooter = (): string => {
  return `
  <!-- Footer - BULLETPROOF METHOD -->
  <!--[if mso]>
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td bgcolor="#f8fafc">
  <![endif]-->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="background-color:#f8fafc;border:4px solid #2563eb;">
    <tr>
      <td bgcolor="#f8fafc" style="padding:20px;text-align:center;background-color:#f8fafc;">
        <p style="margin:0 0 8px 0;font-size:16px;font-weight:600;color:#1e293b;text-align:center;font-family:Arial,sans-serif;">
          Sistem Permohonan Projek NBDAC
        </p>
        <p style="margin:0;font-size:12px;color:#64748b;text-align:center;font-family:Arial,sans-serif;">
          Automated message via EmailJS
        </p>
      </td>
    </tr>
  </table>
  <!--[if mso]>
      </td>
    </tr>
  </table>
  <![endif]-->`;
};