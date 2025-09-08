// Database setup utilities for submissions table

import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

// SQL for creating submissions table
export const CREATE_SUBMISSIONS_TABLE_SQL = `
-- Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Form fields (using consistent naming)
    tarikh TEXT,
    bahagian TEXT,
    nama_projek TEXT,
    tujuan TEXT,
    laman_web TEXT,
    kekerapan_pengumpulan TEXT,
    nama_pegawai TEXT,
    email TEXT,
    nota TEXT,
    
    -- Status field
    status TEXT DEFAULT 'Menunggu',
    
    -- Admin note fields (for completed submissions)
    admin_note TEXT,
    note_added_at TIMESTAMP WITH TIME ZONE
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_submissions_updated_at ON public.submissions;
CREATE TRIGGER update_submissions_updated_at 
    BEFORE UPDATE ON public.submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can manage submissions" ON public.submissions;
DROP POLICY IF EXISTS "Authenticated users can read submissions" ON public.submissions;

-- Create policy to allow service role full access
CREATE POLICY "Service role can manage submissions" ON public.submissions
    FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users to read
CREATE POLICY "Authenticated users can read submissions" ON public.submissions
    FOR SELECT USING (auth.role() = 'authenticated');
`;

// Check if submissions table exists
export const checkSubmissionsTableExists = async (supabase: any): Promise<boolean> => {
  try {
    // Try a simple query to check if table exists
    const { error } = await supabase
      .from('submissions')
      .select('id')
      .limit(1);
    
    // If no error or the error is not about missing table, table exists
    if (!error) return true;
    
    // Check for specific "table does not exist" or "schema cache" errors
    const errorMessage = error.message?.toLowerCase() || '';
    const isTableMissing = errorMessage.includes('does not exist') || 
                          errorMessage.includes('schema cache') ||
                          errorMessage.includes('pgrst205');
    
    console.log(`Table check result: ${isTableMissing ? 'missing' : 'exists'}`);
    return !isTableMissing;
    
  } catch (error) {
    console.log('Table check failed, assuming table does not exist');
    return false;
  }
};

// Create submissions table using direct SQL execution
export const createSubmissionsTable = async (supabase: any): Promise<boolean> => {
  try {
    console.log('📋 Creating submissions table...');
    
    // Split SQL into individual statements for better error handling
    const statements = [
      // Create table
      `CREATE TABLE IF NOT EXISTS public.submissions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        tarikh TEXT,
        bahagian TEXT,
        nama_projek TEXT,
        tujuan TEXT,
        laman_web TEXT,
        kekerapan_pengumpulan TEXT,
        nama_pegawai TEXT,
        email TEXT,
        nota TEXT,
        status TEXT DEFAULT 'Menunggu',
        admin_note TEXT,
        note_added_at TIMESTAMP WITH TIME ZONE
      );`,
      
      // Create trigger function
      `CREATE OR REPLACE FUNCTION update_updated_at_column()
       RETURNS TRIGGER AS $$
       BEGIN
           NEW.updated_at = timezone('utc'::text, now());
           RETURN NEW;
       END;
       $$ language 'plpgsql';`,
      
      // Drop existing trigger if exists
      'DROP TRIGGER IF EXISTS update_submissions_updated_at ON public.submissions;',
      
      // Create trigger
      `CREATE TRIGGER update_submissions_updated_at 
       BEFORE UPDATE ON public.submissions 
       FOR EACH ROW 
       EXECUTE FUNCTION update_updated_at_column();`,
      
      // Enable RLS
      'ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;',
      
      // Drop existing policies
      'DROP POLICY IF EXISTS "Service role can manage submissions" ON public.submissions;',
      'DROP POLICY IF EXISTS "Authenticated users can read submissions" ON public.submissions;',
      
      // Create service role policy
      `CREATE POLICY "Service role can manage submissions" ON public.submissions
       FOR ALL USING (auth.role() = 'service_role');`,
      
      // Create authenticated user policy
      `CREATE POLICY "Authenticated users can read submissions" ON public.submissions
       FOR SELECT USING (auth.role() = 'authenticated');`
    ];
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      try {
        const { error } = await supabase.rpc('exec', { sql: statements[i] });
        if (error) {
          console.warn(`⚠️ Statement ${i + 1} warning:`, error.message);
          // Continue with other statements even if one fails
        }
      } catch (stmtError) {
        console.warn(`⚠️ Statement ${i + 1} error:`, stmtError);
        // Continue execution
      }
    }
    
    // Test if table was created successfully
    const tableExists = await checkSubmissionsTableExists(supabase);
    
    if (tableExists) {
      console.log('✅ Submissions table created successfully');
      return true;
    } else {
      console.warn('⚠️ Table creation completed but verification failed');
      return false;
    }
    
  } catch (error) {
    console.error('💥 Error creating submissions table:', error);
    return false;
  }
};

// Auto-create submissions table if it doesn't exist (enhanced version)
export const ensureSubmissionsTableExists = async (supabase: any): Promise<boolean> => {
  try {
    console.log('🔄 Checking submissions table...');
    
    const tableExists = await checkSubmissionsTableExists(supabase);
    
    if (tableExists) {
      console.log('✅ Submissions table already exists');
      return true;
    }
    
    console.log('📋 Submissions table missing, attempting auto-creation...');
    
    // Try to create the table
    const created = await createSubmissionsTable(supabase);
    
    if (created) {
      console.log('✅ Auto-created submissions table successfully');
      return true;
    } else {
      console.log('⚠️ Auto-creation failed, manual setup required');
      logManualSetupInstructions();
      return false;
    }
    
  } catch (error) {
    console.error('💥 Error during table setup:', error);
    logManualSetupInstructions();
    return false;
  }
};

// Log detailed manual setup instructions
const logManualSetupInstructions = () => {
  console.log('');
  console.log('🔧 MANUAL DATABASE SETUP REQUIRED');
  console.log('==================================');
  console.log('📍 Go to: https://supabase.com/dashboard/project/[your-project]/sql');
  console.log('📋 Run this SQL:');
  console.log('');
  console.log(CREATE_SUBMISSIONS_TABLE_SQL);
  console.log('');
  console.log('💡 ALTERNATIVE: Use emergencySetup() with database creation:');
  console.log('   emergencySetup() - will provide SQL commands');
  console.log('');
  console.log('⚠️ System continues using KV store as fallback');
  console.log('');
};

// Get table creation instructions
export const getTableSetupInstructions = () => {
  return {
    message: 'Submissions table not found',
    instructions: [
      '1. Go to Supabase Dashboard → SQL Editor',
      '2. Copy the SQL from the console logs above',
      '3. Execute the SQL to create the table',
      '4. Or run emergencySetup() for complete setup',
      '5. System continues using KV store as fallback'
    ],
    sqlFile: 'See console logs for complete SQL',
    fallback: 'Using KV store for data persistence',
    autoSetup: 'Automatic table creation attempted but failed'
  };
};

// Create database table via endpoint (for manual triggering)
export const createTableViaEndpoint = async (supabase: any) => {
  try {
    console.log('🔧 Manual table creation triggered...');
    const created = await createSubmissionsTable(supabase);
    
    if (created) {
      return {
        success: true,
        message: 'Submissions table created successfully',
        table_exists: true
      };
    } else {
      return {
        success: false,
        message: 'Failed to create submissions table - manual setup required',
        table_exists: false,
        instructions: getTableSetupInstructions()
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error during table creation',
      error: error instanceof Error ? error.message : 'Unknown error',
      table_exists: false,
      instructions: getTableSetupInstructions()
    };
  }
};