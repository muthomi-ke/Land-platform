import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log environment variables for debugging (remove in production)
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ Supabase URL or anon key is missing. Please check your .env file.'
  );
  console.log('Make sure you have the following in your .env file:');
  console.log('VITE_SUPABASE_URL=your-project-url');
  console.log('VITE_SUPABASE_ANON_KEY=your-anon-key');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Test the connection if in development
if (import.meta.env.DEV && supabase) {
  supabase.from('plots').select('*').limit(1)
    .then(({ error }) => {
      if (error) {
        console.error('❌ Supabase connection error:', error);
      } else {
        console.log('✅ Successfully connected to Supabase');
      }
    });
}


