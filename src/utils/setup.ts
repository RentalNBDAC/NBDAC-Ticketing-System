// Admin Setup Utilities for Production - SECURED VERSION
// Use these functions to create admin users with direct passwords

export interface AdminCreationData {
  email: string;
  password: string;
  name?: string;
  setupKey: string;
}

export interface AdminCreationResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Check if admin setup is allowed in current environment
 * PRODUCTION SECURITY: Disable setup page in production
 */
export function isAdminSetupAllowed(): { allowed: boolean; reason?: string } {
  // Browser-safe environment detection
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  
  // Check if we're in production environment based on hostname
  const isProduction = hostname !== 'localhost' && 
                      hostname !== '127.0.0.1' &&
                      !hostname.includes('preview') &&
                      !hostname.includes('staging') &&
                      !hostname.includes('dev');

  // Check for explicit environment variable to allow setup (browser-safe)
  const allowSetup = typeof window !== 'undefined' && 
                    (window as any).__ALLOW_ADMIN_SETUP === true;
  
  // Check for development environment
  const isDevelopment = hostname === 'localhost' || 
                       hostname === '127.0.0.1' ||
                       hostname.includes('dev');

  if (isProduction && !allowSetup) {
    return {
      allowed: false,
      reason: 'Setup page dimatikan untuk keselamatan produksi. Gunakan Supabase Dashboard untuk cipta admin.'
    };
  }

  if (!isDevelopment && !allowSetup) {
    return {
      allowed: false,  
      reason: 'Setup page hanya tersedia dalam mod pembangunan atau dengan konfigurasi khas.'
    };
  }

  return { allowed: true };
}

/**
 * Enhanced admin creation with additional security checks
 */
export async function createAdminUser(data: AdminCreationData): Promise<AdminCreationResult> {
  try {
    // First check if setup is allowed
    const setupCheck = isAdminSetupAllowed();
    if (!setupCheck.allowed) {
      return {
        success: false,
        error: setupCheck.reason || 'Setup tidak dibenarkan'
      };
    }

    // Additional security: Check for master setup key (browser-safe)
    const masterKey = typeof window !== 'undefined' && 
                     (window as any).__MASTER_SETUP_KEY;
    if (masterKey && data.setupKey !== masterKey) {
      // If master key is set, it must match
      return {
        success: false,
        error: 'Master setup key diperlukan untuk operasi ini'
      };
    }

    const { projectId } = await import('./supabase/info');
    
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4/create-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        name: data.name || data.email.split('@')[0],
        setupKey: data.setupKey
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Gagal mencipta admin'
      };
    }

    // Log admin creation for security audit
    console.log('🔐 Admin user created:', {
      email: data.email,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      origin: window.location.origin
    });

    return result;
  } catch (error) {
    console.error('Admin creation error:', error);
    return {
      success: false,
      error: 'Ralat sambungan rangkaian'
    };
  }
}

/**
 * Get production-safe setup key
 * In production, this should come from environment variables
 */
export function getCurrentSetupKey(): string {
  // Browser-safe environment variable access
  const envSetupKey = typeof window !== 'undefined' && 
                     (window as any).__SETUP_KEY;
  if (envSetupKey) {
    return envSetupKey;
  }

  // Fallback for development
  const currentYear = new Date().getFullYear();
  return `nbdac-admin-setup-${currentYear}`;
}

/**
 * Validate admin email format with domain restrictions
 */
export function validateAdminEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: 'Email diperlukan' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Format email tidak sah' };
  }

  // PRODUCTION SECURITY: Restrict to organizational domains (browser-safe)
  const allowedDomains = typeof window !== 'undefined' && 
                        (window as any).__ALLOWED_ADMIN_DOMAINS || [];
  if (allowedDomains.length > 0) {
    const emailDomain = email.split('@')[1].toLowerCase();
    if (!allowedDomains.includes(emailDomain)) {
      return { 
        valid: false, 
        error: `Hanya email dari domain yang dibenarkan: ${allowedDomains.join(', ')}` 
      };
    }
  }

  return { valid: true };
}

/**
 * Enhanced password validation for production security
 */
export function validateAdminPassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Kata laluan diperlukan' };
  }

  if (password.length < 12) {
    return { valid: false, error: 'Kata laluan minimum 12 karakter untuk keselamatan' };
  }

  // Enhanced password requirements for production
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecialChars) {
    return { 
      valid: false, 
      error: 'Kata laluan mesti mengandungi huruf besar, huruf kecil, nombor, dan karakter khas' 
    };
  }

  // Check for common weak passwords
  const weakPasswords = ['password123!', 'admin123!', 'Password123!'];
  if (weakPasswords.some(weak => password.toLowerCase().includes(weak.toLowerCase()))) {
    return {
      valid: false,
      error: 'Kata laluan terlalu mudah diteka. Gunakan gabungan yang lebih unik.'
    };
  }

  return { valid: true };
}

/**
 * Get environment info for security display
 */
export function getEnvironmentInfo(): {
  environment: string;
  setupAllowed: boolean;
  securityLevel: 'development' | 'staging' | 'production';
} {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isStaging = hostname.includes('staging') || hostname.includes('preview');
  const isDevelopment = isLocalhost || hostname.includes('dev');
  
  let environment = 'production';
  let securityLevel: 'development' | 'staging' | 'production' = 'production';
  
  if (isDevelopment) {
    environment = 'development';
    securityLevel = 'development';
  } else if (isStaging) {
    environment = 'staging';
    securityLevel = 'staging';  
  }

  const setupCheck = isAdminSetupAllowed();

  return {
    environment,
    setupAllowed: setupCheck.allowed,
    securityLevel
  };
}

// PRODUCTION SECURITY: Disable console helpers in production
if (typeof window !== 'undefined') {
  // Defer environment check to avoid immediate execution issues
  setTimeout(() => {
    try {
      const envInfo = getEnvironmentInfo();
      
      if (envInfo.securityLevel === 'development') {
        // Only add console helpers in development
        (window as any).createAdmin = async (email: string, password: string, name?: string) => {
          console.log('🔧 Creating admin user (development mode)...');
          
          const setupKey = getCurrentSetupKey();
          console.log(`🔑 Using setup key: ${setupKey}`);
          
          const result = await createAdminUser({
            email,
            password,
            name,
            setupKey
          });
          
          if (result.success) {
            console.log('✅ Admin created successfully:', result.user);
            console.log('🎉 You can now login with these credentials');
          } else {
            console.error('❌ Admin creation failed:', result.error);
          }
          
          return result;
        };
        
        console.log('💡 Development mode: Admin creation helper loaded. Use: window.createAdmin("admin@nbdac.gov.my", "SecurePass123!", "Admin Name")');
      } else {
        console.log('🔒 Production mode: Admin creation helpers disabled for security');
      }
    } catch (error) {
      console.warn('Setup initialization warning:', error);
    }
  }, 100);
}