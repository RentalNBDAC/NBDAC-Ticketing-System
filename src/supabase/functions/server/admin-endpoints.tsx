import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

// Initialize Supabase client for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Get all admin emails (simplified - all users are admin)
export const getAdminEmails = async (): Promise<string[]> => {
  try {
    console.log('📧 Getting admin emails (all users are admin)...');
    
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100 // Get up to 100 users
    });

    if (error) {
      console.error('Error listing users:', error);
      return [];
    }

    // Since all users are admin, get all email addresses
    const adminEmails = data.users
      .filter(user => user.email && user.email_confirmed_at) // Only confirmed emails
      .map(user => user.email!);

    console.log(`✅ Found ${adminEmails.length} admin email(s):`, adminEmails);
    return adminEmails;

  } catch (error) {
    console.error('Error getting admin emails:', error);
    return [];
  }
};

// Get admin user details (all users are admin)
export const getAdminUsers = async () => {
  try {
    console.log('👥 Getting admin users (all users are admin)...');
    
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100
    });

    if (error) {
      console.error('Error listing users:', error);
      return [];
    }

    // All users are admin users
    const adminUsers = data.users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
      verified: !!user.email_confirmed_at,
      lastSignIn: user.last_sign_in_at,
      createdAt: user.created_at,
      role: 'admin' // All users are admin
    }));

    console.log(`✅ Found ${adminUsers.length} admin user(s)`);
    return adminUsers;

  } catch (error) {
    console.error('Error getting admin users:', error);
    return [];
  }
};

// Check if there are any admin users (any users at all)
export const hasAdminUsers = async (): Promise<boolean> => {
  const adminEmails = await getAdminEmails();
  return adminEmails.length > 0;
};

// Get total admin count
export const getAdminCount = async (): Promise<number> => {
  const adminEmails = await getAdminEmails();
  return adminEmails.length;
};