// Email formatting helpers and utilities for NBDAC system - OUTLOOK COMPATIBLE

// Initialize email helpers (placeholder function for compatibility)
export const initializeEmailHelpers = (): void => {
  // This function is called during app initialization
  // Currently serves as a placeholder for any email helper initialization needed
  console.log('📧 Email helpers initialized');
};

// Legacy compatibility - in case anything still references the old name
export const initializeEmailHelpers2 = initializeEmailHelpers;

// Map data collection frequency from English to Malay
export const mapDataFrequencyToMalay = (frequency: string): string => {
  const frequencyMap: Record<string, string> = {
    'one-off': 'Satu kali sahaja',
    'daily': 'Harian',
    'weekly': 'Mingguan', 
    'monthly': 'Bulanan',
    'quarterly': 'Suku Tahunan',
    'yearly': 'Tahunan'
  };
  
  return frequencyMap[frequency] || frequency;
};

// Generate OUTLOOK-COMPATIBLE professional government-style HTML email template
export const generateProfessionalEmailHTML = (submission: any, submissionId: string): string => {
  const kutipanDataMalay = mapDataFrequencyToMalay(submission.kutipanData || submission.kekerapanPengumpulan || 'Tidak dinyatakan');
  
  return `
<!--[if mso]>
<table width="650" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td>
<![endif]-->
<div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;background-color:#ffffff;">

  <!-- Header with BLUE Background - OUTLOOK COMPATIBLE -->
  <!--[if mso]>
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td bgcolor="#2563eb">
  <![endif]-->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#2563eb" style="background-color:#2563eb;">
    <tr>
      <td bgcolor="#2563eb" style="background-color:#2563eb;color:#ffffff;padding:25px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align:center;border-bottom:2px solid rgba(255,255,255,0.2);padding-bottom:15px;margin-bottom:15px;">
              <h1 style="margin:0;font-size:18px;font-weight:600;color:#ffffff;font-family:Arial,sans-serif;line-height:1.2;">
                Sistem Permohonan<br>
                Projek NBDAC
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding-top:15px;text-align:center;">
              <h2 style="margin:0 0 8px 0;font-size:16px;font-weight:500;color:#ffffff;font-family:Arial,sans-serif;">
                Permohonan Projek Baru
              </h2>
              <p style="margin:0;text-align:center;font-size:14px;color:#ffffff;font-family:Arial,sans-serif;font-weight:600;">
                ${submission.namaProjek || submission.nama_projek || 'Tidak Dinyatakan'}
              </p>
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
  <![endif]-->

  <!-- Main Content -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fafafa" style="background-color:#fafafa;">
    <tr>
      <td bgcolor="#fafafa" style="background-color:#fafafa;padding:30px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff;">
          <tr>
            <td bgcolor="#ffffff" style="background-color:#ffffff;padding:25px;">
              
              <p style="margin:0 0 20px 0;font-size:16px;color:#374151;font-family:Arial,sans-serif;">
                <strong>Kepada:</strong> Pentadbir Sistem
              </p>
              
              <p style="margin:0 0 25px 0;font-size:16px;color:#374151;line-height:1.6;font-family:Arial,sans-serif;">
                Permohonan projek baru telah diterima dan memerlukan semakan serta tindakan daripada pihak pentadbir.
              </p>

              <!-- Project Details Section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="background-color:#f8fafc;margin:20px 0;">
                <tr>
                  <td bgcolor="#f8fafc" style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:20px;">
                    <h3 style="margin:0 0 15px 0;color:#1e293b;font-size:18px;font-weight:600;border-bottom:2px solid #3b82f6;padding-bottom:8px;font-family:Arial,sans-serif;">
                      BUTIRAN PERMOHONAN
                    </h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-size:14px;">
                      <tr style="border-bottom:1px solid #e5e7eb;">
                        <td style="padding:12px 0;font-weight:600;color:#374151;width:35%;font-family:Arial,sans-serif;">Nama Projek:</td>
                        <td style="padding:12px 0;color:#1f2937;font-family:Arial,sans-serif;">${submission.namaProjek || submission.nama_projek || 'Tidak dinyatakan'}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #e5e7eb;">
                        <td style="padding:12px 0;font-weight:600;color:#374151;font-family:Arial,sans-serif;">Bahagian:</td>
                        <td style="padding:12px 0;color:#1f2937;font-family:Arial,sans-serif;">${submission.bahagian || 'Tidak dinyatakan'}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #e5e7eb;">
                        <td style="padding:12px 0;font-weight:600;color:#374151;font-family:Arial,sans-serif;">Nama Pegawai:</td>
                        <td style="padding:12px 0;color:#1f2937;font-family:Arial,sans-serif;">${submission.namaPegawai || submission.nama_pegawai || 'Tidak dinyatakan'}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #e5e7eb;">
                        <td style="padding:12px 0;font-weight:600;color:#374151;font-family:Arial,sans-serif;">Email:</td>
                        <td style="padding:12px 0;color:#1f2937;font-family:Arial,sans-serif;">${submission.email || 'Tidak dinyatakan'}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #e5e7eb;">
                        <td style="padding:12px 0;font-weight:600;color:#374151;font-family:Arial,sans-serif;">Tarikh:</td>
                        <td style="padding:12px 0;color:#1f2937;font-family:Arial,sans-serif;">${submission.tarikh || new Date().toLocaleDateString('ms-MY')}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #e5e7eb;">
                        <td style="padding:12px 0;font-weight:600;color:#374151;font-family:Arial,sans-serif;">Kekerapan Kutipan Data:</td>
                        <td style="padding:12px 0;color:#1f2937;text-transform:capitalize;font-family:Arial,sans-serif;">${kutipanDataMalay}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;font-weight:600;color:#374151;font-family:Arial,sans-serif;">Status:</td>
                        <td style="padding:12px 0;font-family:Arial,sans-serif;">
                          <span style="background-color:#fef3c7;color:#92400e;padding:4px 12px;font-size:12px;font-weight:600;display:inline-block;">
                            🟡 Menunggu
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Project Purpose Section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f0f9ff" style="background-color:#f0f9ff;margin:20px 0;">
                <tr>
                  <td bgcolor="#f0f9ff" style="background-color:#f0f9ff;border:1px solid #bae6fd;padding:20px;">
                    <h4 style="margin:0 0 10px 0;color:#0c4a6e;font-size:16px;font-weight:600;font-family:Arial,sans-serif;">
                      Tujuan Projek
                    </h4>
                    <p style="margin:0;color:#1e293b;line-height:1.6;font-size:14px;font-family:Arial,sans-serif;">
                      ${submission.tujuanProjek || submission.tujuan || 'Tidak dinyatakan'}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Website URLs Section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f0fdf4" style="background-color:#f0fdf4;margin:20px 0;">
                <tr>
                  <td bgcolor="#f0fdf4" style="background-color:#f0fdf4;border:1px solid #bbf7d0;padding:20px;">
                    <h4 style="margin:0 0 10px 0;color:#14532d;font-size:16px;font-weight:600;font-family:Arial,sans-serif;">
                      Laman Web
                    </h4>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f7fee7" style="background-color:#f7fee7;">
                      <tr>
                        <td bgcolor="#f7fee7" style="background-color:#f7fee7;border:1px solid #d9f99d;padding:12px;font-family:'Courier New',monospace;font-size:13px;color:#365314;word-break:break-all;">
                          ${submission.websiteUrl || submission.lamanWeb || 'Tidak dinyatakan'}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Additional Notes -->
              ${(submission.catatan || submission.nota) ? `
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fefce8" style="background-color:#fefce8;margin:20px 0;">
                <tr>
                  <td bgcolor="#fefce8" style="background-color:#fefce8;border:1px solid #fde047;padding:20px;">
                    <h4 style="margin:0 0 10px 0;color:#713f12;font-size:16px;font-weight:600;font-family:Arial,sans-serif;">
                      Catatan Tambahan
                    </h4>
                    <p style="margin:0;color:#1e293b;line-height:1.6;font-size:14px;font-family:Arial,sans-serif;">
                      ${submission.catatan || submission.nota}
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}
              
            </td>
          </tr>
        </table>

        <!-- Action Required Section - RED Background OUTLOOK COMPATIBLE -->
        <!--[if mso]>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td bgcolor="#dc2626">
        <![endif]-->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#dc2626" style="background-color:#dc2626;margin:25px 0;">
          <tr>
            <td bgcolor="#dc2626" style="background-color:#dc2626;color:#ffffff;padding:25px;">
              <h3 style="margin:0 0 15px 0;font-size:18px;font-weight:600;text-align:center;color:#ffffff;font-family:Arial,sans-serif;">
                ⚠️ TINDAKAN DIPERLUKAN
              </h3>
              <p style="margin:0 0 15px 0;font-size:16px;text-align:center;color:#ffffff;font-family:Arial,sans-serif;">
                Sila log masuk ke sistem untuk menyemak dan menguruskan permohonan ini.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff;margin:15px 0;">
                <tr>
                  <td bgcolor="#ffffff" style="background-color:#ffffff;padding:15px;">
                    <h4 style="margin:0 0 10px 0;font-size:16px;font-weight:600;color:#dc2626;font-family:Arial,sans-serif;">
                      Langkah-langkah:
                    </h4>
                    <table width="100%" cellpadding="3" cellspacing="0" border="0">
                      <tr>
                        <td style="color:#374151;font-size:14px;line-height:1.8;border-left:3px solid #dc2626;padding-left:10px;font-family:Arial,sans-serif;">
                          • Semak butiran lengkap permohonan
                        </td>
                      </tr>
                      <tr>
                        <td style="color:#374151;font-size:14px;line-height:1.8;border-left:3px solid #dc2626;padding-left:10px;font-family:Arial,sans-serif;">
                          • Tukar status kepada "Sedang Diproses" atau "Selesai"
                        </td>
                      </tr>
                      <tr>
                        <td style="color:#374151;font-size:14px;line-height:1.8;border-left:3px solid #dc2626;padding-left:10px;font-family:Arial,sans-serif;">
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
        <!--[if mso]>
            </td>
          </tr>
        </table>
        <![endif]-->

        <!-- System Information -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8f9fa" style="background-color:#f8f9fa;margin:20px 0;">
          <tr>
            <td bgcolor="#f8f9fa" style="background-color:#f8f9fa;border:1px solid #e5e7eb;padding:20px;">
              <h4 style="margin:0 0 12px 0;color:#000000;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;font-family:Arial,sans-serif;">
                Maklumat Sistem
              </h4>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:13px;">
                <tr>
                  <td style="padding:4px 0;font-weight:600;color:#000000;font-family:Arial,sans-serif;">ID Permohonan:</td>
                  <td style="padding:4px 0;font-family:'Courier New',monospace;font-weight:600;color:#000000;">${submissionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-weight:600;color:#000000;font-family:Arial,sans-serif;">Masa Permohonan:</td>
                  <td style="padding:4px 0;font-weight:600;color:#000000;font-family:Arial,sans-serif;">${new Date().toLocaleString('ms-MY')}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>

  <!-- Footer -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#374151" style="background-color:#374151;">
    <tr>
      <td bgcolor="#374151" style="background-color:#374151;color:#ffffff;padding:20px;text-align:center;">
        <p style="margin:0 0 8px 0;font-size:16px;font-weight:600;color:#ffffff;font-family:Arial,sans-serif;">
          Sistem Permohonan Projek Web Scraping NBDAC
        </p>
        <p style="margin:0;font-size:12px;color:#ffffff;font-family:Arial,sans-serif;">
          Automated message via EmailJS
        </p>
      </td>
    </tr>
  </table>

</div>
<!--[if mso]>
    </td>
  </tr>
</table>
<![endif]-->
  `.trim();
};

// Generate plain text version for email templates that need both
export const generatePlainTextEmail = (submission: any, submissionId: string): string => {
  const kutipanDataMalay = mapDataFrequencyToMalay(submission.kutipanData || submission.kekerapanPengumpulan || 'Tidak dinyatakan');
  
  return `
Permohonan Projek Baru - ${submission.namaProjek || submission.nama_projek || 'Tidak Dinyatakan'}

Kepada Admin,

Permohonan projek baru telah diterima dan memerlukan semakan serta tindakan daripada pihak pentadbir.

BUTIRAN PERMOHONAN:
==================
Nama Projek: ${submission.namaProjek || submission.nama_projek || 'Tidak dinyatakan'}
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
• Tukar status kepada "Sedang Diproses" atau "Selesai"  
• Hubungi pemohon jika diperlukan

MAKLUMAT SISTEM:
================
ID Permohonan: ${submissionId}
Masa Permohonan: ${new Date().toLocaleString('ms-MY')}

Sistem Permohonan Projek Web Scraping NBDAC
Automated message via EmailJS
  `.trim();
};

// Console utility to display EmailJS template guidance
export const showEmailJSTemplateGuide = (): void => {
  console.log('');
  console.log('📧 EMAILJS TEMPLATE SETUP GUIDE - OUTLOOK COMPATIBLE');
  console.log('======================================================');
  console.log('');
  console.log('🎨 TEMPLATE PARAMETERS (Use these in your EmailJS template):');
  console.log('');
  console.log('📝 Basic Fields:');
  console.log('   • {{to_email}} - Recipient email address');
  console.log('   • {{to_name}} - Recipient name (usually "Admin")');
  console.log('   • {{subject}} - Email subject line');
  console.log('   • {{from_name}} - Sender name (from config)');
  console.log('   • {{reply_to}} - Reply-to email address');
  console.log('');
  console.log('📋 Content Fields:');
  console.log('   • {{{message_html}}} - OUTLOOK-compatible HTML formatted content');
  console.log('   • {{message}} - Plain text content (fallback)');
  console.log('');
  console.log('🔧 RECOMMENDED EMAILJS TEMPLATE STRUCTURE:');
  console.log('');
  console.log('Subject Line Template:');
  console.log('   {{subject}}');
  console.log('');
  console.log('Email Body Template (HTML format):');
  console.log(`   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
     <h2 style="color: #1a73e8; border-bottom: 2px solid #e8f0fe; padding-bottom: 10px;">
       {{subject}}
     </h2>
     
     <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0;">
       <p>Hi {{to_name}},</p>
       
       <div style="margin: 20px 0;">
         {{{message_html}}}
       </div>
     </div>

     <div style="text-align: center; margin: 30px 0; padding: 20px; border-top: 1px solid #e0e0e0;">
       <p style="color: #666; font-size: 14px; margin: 0;">
         {{from_name}}<br>
         <em>Automated message via EmailJS</em>
       </p>
     </div>
   </div>`);
  console.log('');
  console.log('⚠️ OUTLOOK COMPATIBILITY FEATURES:');
  console.log('   ✅ Blue header background using bgcolor + conditional comments');
  console.log('   ✅ Red "Tindakan Diperlukan" background using bgcolor + conditional comments');
  console.log('   ✅ High contrast text colors (#000000 for readability)');
  console.log('   ✅ Table-based layout (no divs with CSS backgrounds)');
  console.log('   ✅ Arial font family specified for all text');
  console.log('   ✅ No CSS gradients (solid colors only)');
  console.log('   ✅ Outlook-specific conditional comments');
  console.log('');
  console.log('🚀 FEATURES INCLUDED:');
  console.log('   ✅ Professional government-style design');
  console.log('   ✅ Malay language for data collection frequency');
  console.log('   ✅ Action required section for admins');
  console.log('   ✅ Structured project information display');
  console.log('   ✅ OUTLOOK-compatible HTML email format');
  console.log('   ✅ Proper corporate branding');
  console.log('');
  console.log('🔧 TEST YOUR TEMPLATE:');
  console.log('   • Use testEmailJSConfiguration("your@email.com") to test');
  console.log('   • Test specifically in Outlook Desktop and Outlook Web');
  console.log('   • Verify background colors appear correctly');
  console.log('   • Check both HTML and plain text versions');
  console.log('');
};