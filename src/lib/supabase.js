import { createClient } from '@supabase/supabase-js';

// Project ID will be auto-injected during deployment
const SUPABASE_URL = 'https://<PROJECT-ID>.supabase.co';
const SUPABASE_ANON_KEY = '<ANON_KEY>';

let supabase = null;

try {
  if (SUPABASE_URL !== 'https://<PROJECT-ID>.supabase.co' && SUPABASE_ANON_KEY !== '<ANON_KEY>') {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Supabase credentials not configured. Statistics will use localStorage fallback.');
  }
} catch (error) {
  console.warn('Failed to initialize Supabase:', error);
}

export default supabase;