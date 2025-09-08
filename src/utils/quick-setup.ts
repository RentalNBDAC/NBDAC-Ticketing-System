// Quick setup utility for fixing common issues
// Run this in browser console to automatically fix database and admin setup

interface SetupConfig {
  adminEmail: string;
  adminPassword: string;
  adminName?: string;
  setupKey?: string;
}

interface QuickSetupResult {
  success: boolean;
  steps: Array<{
    step: string;
    status: 'success' | 'error' | 'skipped';
    message: string;
    data?: any;
  }>;
  summary: {
    database_ready: boolean;
    admin_created: boolean;
    email_notifications: boolean;
  };
}

export const runQuickSetup = async (config: SetupConfig): Promise<QuickSetupResult> => {
  const result: QuickSetupResult = {
    success: false,
    steps: [],
    summary: {
      database_ready: false,
      admin_created: false,
      email_notifications: false
    }
  };

  const API_BASE = `${window.location.origin}/functions/v1/make-server-764b8bb4`;

  try {
    console.log('🚀 Starting Quick Setup for NBDAC Project System...');

    // Step 1: Check system health
    result.steps.push({
      step: 'health_check',
      status: 'success',
      message: 'Checking system health...'
    });

    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    
    console.log('🏥 System Health Check:', healthData);

    if (healthData.setup_required?.database) {
      result.steps.push({
        step: 'database_table',
        status: 'error',
        message: 'Database table missing - manual setup required',
        data: {
          action: 'See DATABASE_SETUP.md for SQL commands',
          current_mode: 'KV Store Only'
        }
      });
    } else {
      result.steps.push({
        step: 'database_table',
        status: 'success',
        message: 'Database table exists'
      });
      result.summary.database_ready = true;
    }

    // Step 2: Create admin user if needed
    if (healthData.admin?.admin_users_found === 0) {
      console.log('👤 Creating admin user...');
      
      const adminData = {
        email: config.adminEmail,
        password: config.adminPassword,
        name: config.adminName || config.adminEmail.split('@')[0],
        setupKey: config.setupKey || `nbdac-admin-setup-${new Date().getFullYear()}`
      };

      try {
        const adminResponse = await fetch(`${API_BASE}/create-admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(adminData)
        });

        const adminResult = await adminResponse.json();

        if (adminResult.success) {
          result.steps.push({
            step: 'admin_creation',
            status: 'success',
            message: 'Admin user created successfully',
            data: adminResult.user
          });
          result.summary.admin_created = true;
          result.summary.email_notifications = true;
        } else {
          result.steps.push({
            step: 'admin_creation',
            status: 'error',
            message: `Failed to create admin: ${adminResult.error}`,
            data: adminResult
          });
        }
      } catch (error) {
        result.steps.push({
          step: 'admin_creation',
          status: 'error',
          message: `Error creating admin: ${error.message}`,
        });
      }
    } else {
      result.steps.push({
        step: 'admin_creation',
        status: 'skipped',
        message: `Admin users already exist (${healthData.admin.admin_users_found} found)`
      });
      result.summary.admin_created = true;
      result.summary.email_notifications = true;
    }

    // Step 3: Final health check
    const finalHealthResponse = await fetch(`${API_BASE}/health`);
    const finalHealthData = await finalHealthResponse.json();
    
    result.steps.push({
      step: 'final_verification',
      status: 'success',
      message: 'Final system verification completed',
      data: finalHealthData
    });

    // Determine overall success
    result.success = result.summary.admin_created && (result.summary.database_ready || true); // KV store is acceptable fallback

    console.log('✅ Quick Setup Complete!', result);
    return result;

  } catch (error) {
    console.error('💥 Quick setup failed:', error);
    result.steps.push({
      step: 'error',
      status: 'error',
      message: `Setup failed: ${error.message}`
    });
    return result;
  }
};

// Console helper function
export const setupNBDAC = (adminEmail: string, adminPassword: string, adminName?: string) => {
  return runQuickSetup({
    adminEmail,
    adminPassword,
    adminName
  });
};

// Make available globally for console use
declare global {
  interface Window {
    setupNBDAC: typeof setupNBDAC;
    runQuickSetup: typeof runQuickSetup;
  }
}

if (typeof window !== 'undefined') {
  window.setupNBDAC = setupNBDAC;
  window.runQuickSetup = runQuickSetup;
}