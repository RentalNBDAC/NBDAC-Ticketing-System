// Form validation utilities
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FormData {
  tarikh: string;
  bahagian: string;
  namaProjek: string;
  tujuanProjek: string;
  websiteUrl: string;
  kutipanData: string;
  namaPegawai: string;
  email: string;
  catatan?: string;
}

// Sanitize input by trimming and removing weird characters
export const sanitizeInput = (value: string): string => {
  if (!value) return '';

  // Trim leading/trailing spaces but preserve newlines
  let sanitized = value.trim();

  // Remove control characters but keep normal punctuation and newlines
  sanitized = sanitized.replace(/[\x00-\x09\x0B-\x1F\x7F]/g, '');

  // Remove multiple consecutive spaces (but not newlines)
  sanitized = sanitized.replace(/ {2,}/g, ' ');

  return sanitized;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate website URL format - STRICT FORMAT ONLY as requested
export const isValidWebsiteUrl = (url: string): boolean => {
  if (!url || !url.trim()) return false;

  const lines = url.trim().split('\n').filter(line => line.trim() !== '');

  if (lines.length === 0) return false;

  // Each line must match the strict format: "number. SiteName: https://www.example.com"
  const websitePattern = /^\d+\.\s+[A-Za-z][A-Za-z0-9\s]*[A-Za-z0-9]:\s+https?:\/\/[^\s]+$/;

  let validCount = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (trimmedLine === '') continue;

    // Check if line matches the required format
    if (websitePattern.test(trimmedLine)) {
      // Additional validation for the URL part
      const urlPart = trimmedLine.split(/:\s+https?:\/\//)[1];
      if (urlPart && urlPart.includes('.') && urlPart.length > 5) {
        validCount++;
      }
    } else {
      // If any non-empty line doesn't match, it's invalid
      return false;
    }
  }

  // Must have at least one valid website entry
  return validCount > 0;
};

// Check for inappropriate characters
export const hasValidCharacters = (value: string): boolean => {
  // Allow letters, numbers, spaces, and common punctuation including newlines and colons
  const validPattern = /^[a-zA-Z0-9\s\-_.,:;()@&+\n\r\u00C0-\u017F\u0100-\u024F\/]*$/;
  return validPattern.test(value);
};

// Validate individual field
export const validateField = (name: string, value: string): string[] => {
  const errors: string[] = [];
  const sanitizedValue = sanitizeInput(value);

  const requiredFields = ['tarikh', 'bahagian', 'namaProjek', 'tujuanProjek', 'websiteUrl', 'kutipanData', 'namaPegawai', 'email'];
  if (requiredFields.includes(name) && !sanitizedValue) {
    const fieldNames = {
      tarikh: 'Tarikh',
      bahagian: 'Bahagian',
      namaProjek: 'Nama Projek',
      tujuanProjek: 'Tujuan Projek',
      websiteUrl: 'Laman Web',
      kutipanData: 'Kutipan Data',
      namaPegawai: 'Nama Pegawai',
      email: 'Email'
    };
    errors.push(`${fieldNames[name]} adalah wajib diisi`);
    return errors;
  }

  if (!sanitizedValue) return errors;

  // Field-specific validations
  switch (name) {
    case 'email':
      if (!isValidEmail(sanitizedValue)) {
        errors.push('Format email tidak sah');
      }
      break;

    case 'websiteUrl':
      if (!hasValidCharacters(sanitizedValue)) {
        errors.push('Mengandungi aksara yang tidak dibenarkan dalam laman web');
      } else if (!isValidWebsiteUrl(sanitizedValue)) {
        errors.push(
          'Format laman web tidak sah. Mesti mengikut format:\n' +
          'nombor. NamaLamanWeb: https://www.contoh.com\n\n' +
          'Contoh yang betul:\n' +
          '1. iProperty: https://www.iproperty.com.my\n' +
          '2. PropertyGuru: https://www.propertyguru.com.my'
        );
      }
      break;

    case 'namaProjek':
      if (sanitizedValue.length < 3) {
        errors.push('Nama projek mestilah sekurang-kurangnya 3 aksara');
      }
      if (sanitizedValue.length > 100) {
        errors.push('Nama projek tidak boleh melebihi 100 aksara');
      }
      break;

    case 'namaPegawai':
      if (sanitizedValue.length < 2) {
        errors.push('Nama pegawai mestilah sekurang-kurangnya 2 aksara');
      }
      if (sanitizedValue.length > 50) {
        errors.push('Nama pegawai tidak boleh melebihi 50 aksara');
      }
      break;

    case 'bahagian':
      if (sanitizedValue.length < 2) {
        errors.push('Nama bahagian mestilah sekurang-kurangnya 2 aksara');
      }
      break;

    case 'tujuanProjek':
      if (sanitizedValue.length < 10) {
        errors.push('Tujuan projek mestilah sekurang-kurangnya 10 aksara');
      }
      if (sanitizedValue.length > 500) {
        errors.push('Tujuan projek tidak boleh melebihi 500 aksara');
      }
      break;

    case 'catatan':
      if (sanitizedValue.length > 300) {
        errors.push('Catatan tidak boleh melebihi 300 aksara');
      }
      break;
  }

  return errors;
};

// Validate entire form
export const validateForm = (formData: FormData): ValidationResult => {
  const errors: string[] = [];

  // Validate each field
  Object.entries(formData).forEach(([key, value]) => {
    const fieldErrors = validateField(key, value || '');
    if (fieldErrors.length > 0) {
      errors.push(`${key}: ${fieldErrors.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get sanitized form data
export const getSanitizedFormData = (formData: FormData): FormData => {
  const sanitized: FormData = {} as FormData;

  Object.entries(formData).forEach(([key, value]) => {
    sanitized[key] = sanitizeInput(value || '');
  });

  return sanitized;
};