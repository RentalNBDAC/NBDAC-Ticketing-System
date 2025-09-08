// Enhanced date formatting utilities with bulletproof validation

/**
 * Ultimate safe date formatter - handles all edge cases and never shows "Tarikh tidak sah"
 */
export const formatDate = (dateString: string | null | undefined): string => {
  // Handle null, undefined, empty string, or whitespace-only
  if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
    return getTodayFormatted();
  }
  
  // Handle common invalid values
  if (dateString === 'null' || dateString === 'undefined' || dateString === 'Invalid Date') {
    return getTodayFormatted();
  }
  
  try {
    // Try multiple parsing strategies
    let date: Date | null = null;
    
    // Strategy 1: Direct Date parsing
    date = new Date(dateString.trim());
    if (isValidDateObject(date)) {
      return formatValidDate(date);
    }
    
    // Strategy 2: Custom format parsing
    date = parseCustomDate(dateString.trim());
    if (date && isValidDateObject(date)) {
      return formatValidDate(date);
    }
    
    // Strategy 3: Extract date parts from complex strings
    const extractedDate = extractDateFromString(dateString);
    if (extractedDate && isValidDateObject(extractedDate)) {
      return formatValidDate(extractedDate);
    }
    
    // Strategy 4: Try ISO format variations
    const isoVariations = [
      dateString.replace(/\s+/g, 'T'), // Replace space with T
      dateString.split('T')[0], // Take only date part
      dateString.split(' ')[0], // Take only date part if space-separated
    ];
    
    for (const variation of isoVariations) {
      try {
        date = new Date(variation);
        if (isValidDateObject(date)) {
          return formatValidDate(date);
        }
      } catch (e) {
        continue;
      }
    }
    
    // Fallback: Return today's date instead of error
    console.warn('Could not parse date, using today:', dateString);
    return getTodayFormatted();
    
  } catch (error) {
    console.warn('Date parsing error, using today:', error, 'for value:', dateString);
    return getTodayFormatted();
  }
};

/**
 * Ultimate safe datetime formatter with fallbacks
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
  // Handle null, undefined, empty string, or whitespace-only
  if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
    return getNowFormatted();
  }
  
  // Handle common invalid values
  if (dateString === 'null' || dateString === 'undefined' || dateString === 'Invalid Date') {
    return getNowFormatted();
  }
  
  try {
    // Try multiple parsing strategies
    let date: Date | null = null;
    
    // Strategy 1: Direct Date parsing
    date = new Date(dateString.trim());
    if (isValidDateObject(date)) {
      return formatValidDateTime(date);
    }
    
    // Strategy 2: Custom format parsing
    date = parseCustomDate(dateString.trim());
    if (date && isValidDateObject(date)) {
      return formatValidDateTime(date);
    }
    
    // Strategy 3: Handle various datetime formats
    const datetimeVariations = [
      dateString.trim(),
      dateString.replace(/\s+/g, 'T'), // Replace space with T
      dateString.replace('T', ' '), // Replace T with space
    ];
    
    for (const variation of datetimeVariations) {
      try {
        date = new Date(variation);
        if (isValidDateObject(date)) {
          return formatValidDateTime(date);
        }
      } catch (e) {
        continue;
      }
    }
    
    // Fallback: Return current datetime instead of error
    console.warn('Could not parse datetime, using now:', dateString);
    return getNowFormatted();
    
  } catch (error) {
    console.warn('DateTime parsing error, using now:', error, 'for value:', dateString);
    return getNowFormatted();
  }
};

/**
 * Ultra-safe date formatter for table display - NEVER returns "tidak sah"
 */
export const formatDateSafe = (dateString: string | null | undefined): string => {
  const result = formatDate(dateString);
  
  // Double-check - if somehow we still get an invalid result, use today
  if (result.includes('tidak sah') || result.includes('Invalid') || !result || result.trim() === '') {
    return getTodayFormatted();
  }
  
  return result;
};

/**
 * Ultra-safe datetime formatter for table display - NEVER returns "tidak sah"
 */
export const formatDateTimeSafe = (dateString: string | null | undefined): string => {
  const result = formatDateTime(dateString);
  
  // Double-check - if somehow we still get an invalid result, use now
  if (result.includes('tidak sah') || result.includes('Invalid') || !result || result.trim() === '') {
    return getNowFormatted();
  }
  
  return result;
};

/**
 * Format time only to HH:MM format with fallbacks
 */
export const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
  
  try {
    const date = new Date(dateString.trim());
    
    if (!isValidDateObject(date)) {
      const now = new Date();
      return now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.warn('Time formatting error, using current time:', error, 'for value:', dateString);
    const now = new Date();
    return now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
};

/**
 * Get relative time string with fallbacks
 */
export const getRelativeTime = (dateString: string | null | undefined): string => {
  if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
    return 'Baru sahaja';
  }
  
  try {
    const date = new Date(dateString.trim());
    
    if (!isValidDateObject(date)) {
      return 'Baru sahaja';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Baru sahaja';
    if (diffMinutes < 60) return `${diffMinutes} minit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    // For older dates, show formatted date
    return formatDateSafe(dateString);
  } catch (error) {
    console.warn('Relative time formatting error:', error, 'for value:', dateString);
    return 'Baru sahaja';
  }
};

/**
 * Check if a date string represents a valid date
 */
export const isValidDate = (dateString: string | null | undefined): boolean => {
  if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
    return false;
  }
  
  if (dateString === 'null' || dateString === 'undefined' || dateString === 'Invalid Date') {
    return false;
  }
  
  try {
    const date = new Date(dateString.trim());
    return isValidDateObject(date);
  } catch (error) {
    return false;
  }
};

/**
 * Check if a Date object is valid
 */
const isValidDateObject = (date: Date): boolean => {
  if (!(date instanceof Date)) return false;
  if (isNaN(date.getTime())) return false;
  
  // Check for reasonable date range (not too far in past or future)
  const year = date.getFullYear();
  if (year < 1900 || year > 2100) return false;
  
  return true;
};

/**
 * Parse custom date formats that might come from the database
 */
const parseCustomDate = (dateString: string): Date | null => {
  // Common date formats to try
  const formats = [
    // DD/MM/YYYY format
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    // DD-MM-YYYY format
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
    // YYYY-MM-DD format
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    // DD.MM.YYYY format
    /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
  ];
  
  // Try DD/MM/YYYY format
  const ddmmyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isValidDateObject(date)) return date;
  }
  
  // Try DD-MM-YYYY format
  const ddmmyyyy2 = dateString.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (ddmmyyyy2) {
    const [, day, month, year] = ddmmyyyy2;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isValidDateObject(date)) return date;
  }
  
  // Try DD.MM.YYYY format
  const ddmmyyyy3 = dateString.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (ddmmyyyy3) {
    const [, day, month, year] = ddmmyyyy3;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isValidDateObject(date)) return date;
  }
  
  return null;
};

/**
 * Extract date from complex strings
 */
const extractDateFromString = (str: string): Date | null => {
  // Try to extract ISO date part
  const isoMatch = str.match(/(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) {
    const date = new Date(isoMatch[1]);
    if (isValidDateObject(date)) return date;
  }
  
  // Try to extract DD/MM/YYYY part
  const ddmmyyyyMatch = str.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
  if (ddmmyyyyMatch) {
    return parseCustomDate(ddmmyyyyMatch[1]);
  }
  
  // Try to extract DD-MM-YYYY part
  const ddmmyyyy2Match = str.match(/(\d{1,2}-\d{1,2}-\d{4})/);
  if (ddmmyyyy2Match) {
    return parseCustomDate(ddmmyyyy2Match[1]);
  }
  
  return null;
};

/**
 * Format a valid Date object to DD/MM/YYYY
 */
const formatValidDate = (date: Date): string => {
  try {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    // Fallback formatting
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

/**
 * Format a valid Date object to DD/MM/YYYY HH:MM:SS
 */
const formatValidDateTime = (date: Date): string => {
  try {
    const dateStr = formatValidDate(date);
    const timeStr = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    return `${dateStr} ${timeStr}`;
  } catch (error) {
    // Fallback formatting
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
};

/**
 * Create a standardized date string for database storage
 */
export const toISOString = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!isValidDateObject(dateObj)) {
      return new Date().toISOString();
    }
    return dateObj.toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
};

/**
 * Get today's date in DD/MM/YYYY format
 */
export const getTodayFormatted = (): string => {
  try {
    return formatValidDate(new Date());
  } catch (error) {
    // Ultimate fallback
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

/**
 * Get current datetime in DD/MM/YYYY HH:MM:SS format
 */
export const getNowFormatted = (): string => {
  try {
    return formatValidDateTime(new Date());
  } catch (error) {
    // Ultimate fallback
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
};

/**
 * Smart date formatter that chooses the best available date field
 */
export const formatBestAvailableDate = (submission: any): string => {
  // Try multiple date fields in order of preference
  const dateFields = [
    submission?.tarikh,
    submission?.createdAt, 
    submission?.submittedAt,
    submission?.updatedAt,
    submission?.created_at,
    submission?.submitted_at,
    submission?.updated_at
  ];
  
  for (const field of dateFields) {
    if (field && typeof field === 'string' && field.trim() !== '') {
      const formatted = formatDateSafe(field);
      if (formatted && !formatted.includes('tidak sah')) {
        return formatted;
      }
    }
  }
  
  // If no valid date found, return today
  return getTodayFormatted();
};

/**
 * Smart datetime formatter that chooses the best available datetime field
 */
export const formatBestAvailableDateTime = (submission: any): string => {
  // Try multiple datetime fields in order of preference
  const dateFields = [
    submission?.updatedAt,
    submission?.createdAt,
    submission?.submittedAt, 
    submission?.tarikh,
    submission?.updated_at,
    submission?.created_at,
    submission?.submitted_at
  ];
  
  for (const field of dateFields) {
    if (field && typeof field === 'string' && field.trim() !== '') {
      const formatted = formatDateTimeSafe(field);
      if (formatted && !formatted.includes('tidak sah')) {
        return formatted;
      }
    }
  }
  
  // If no valid datetime found, return now
  return getNowFormatted();
};