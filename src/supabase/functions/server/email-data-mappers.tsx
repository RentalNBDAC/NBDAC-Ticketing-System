// Data mapping utilities for email templates

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

// Extract project name with fallbacks
export const getProjectName = (submission: any): string => {
  return submission.namaProjek || submission.nama_projek || 'Tidak Dinyatakan';
};

// Extract officer name with fallbacks
export const getOfficerName = (submission: any): string => {
  return submission.namaPegawai || submission.nama_pegawai || 'Tidak dinyatakan';
};

// Extract project purpose with fallbacks
export const getProjectPurpose = (submission: any): string => {
  return submission.tujuanProjek || submission.tujuan || 'Tidak dinyatakan';
};

// Extract website URL with fallbacks
export const getWebsiteUrl = (submission: any): string => {
  return submission.websiteUrl || submission.lamanWeb || 'Tidak dinyatakan';
};

// Extract additional notes with fallbacks
export const getAdditionalNotes = (submission: any): string => {
  return submission.catatan || submission.nota || 'Tiada catatan';
};

// Check if additional notes exist
export const hasAdditionalNotes = (submission: any): boolean => {
  return !!(submission.catatan || submission.nota);
};