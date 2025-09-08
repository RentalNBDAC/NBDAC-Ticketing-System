// Application Constants
export const APP_CONSTANTS = {
  // Local storage keys
  CURRENT_PAGE_KEY: 'nbdac-current-page',
  
  // Default values
  DEFAULT_PAGE: 'home',
  
  // Toast configuration
  TOAST_DURATION: 4000,
  TOAST_VISIBLE_COUNT: 1,
  
  // Loading states
  AUTH_CHECK_MESSAGE: 'Memeriksa pengesahan...',
  
  // Page names
  PAGES: {
    HOME: 'home',
    GUEST: 'guest',
    INTERNAL: 'internal',
    ADMIN_LOGIN: 'admin-login',
    ADMIN_SETUP: 'admin-setup',
    EMAIL_SETUP: 'email-setup',
    EMAILJS_SETUP: 'emailjs-setup',
    PERMOHONAN_BARU: 'permohonan-baru',
    SEMAK_STATUS: 'semak-status',
  } as const,
  
  // Messages
  MESSAGES: {
    AUTH_REQUIRED: 'Pengesahan diperlukan',
    AUTH_REQUIRED_DESC: 'Sila log masuk untuk mengakses portal dalaman.',
    LOGIN_SUCCESS: 'Berjaya log masuk!',
    LOGOUT_SUCCESS: 'Berjaya log keluar',
    LOGOUT_SUCCESS_DESC: 'Anda telah log keluar dengan selamat.',
    STATUS_UPDATED: 'Status berjaya dikemaskini!',
    STATUS_UPDATE_ERROR: 'Gagal mengemaskini status',
    STATUS_UPDATE_ERROR_DESC: 'Sila cuba lagi atau hubungi pentadbir sistem.',
    LOGIN_ERROR: 'Ralat log masuk',
    LOGIN_ERROR_DESC: 'Berlaku ralat semasa proses log masuk.',
    LOGOUT_ERROR: 'Ralat log keluar',
    LOGOUT_ERROR_DESC: 'Berlaku ralat semasa log keluar.',
    CLEANUP_SUCCESS: 'Cleanup completed!',
    CLEANUP_ERROR: 'Cleanup failed',
  } as const,
} as const;

export type PageType = typeof APP_CONSTANTS.PAGES[keyof typeof APP_CONSTANTS.PAGES];