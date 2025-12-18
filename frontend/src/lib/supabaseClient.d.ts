import { SupabaseClient } from '@supabase/supabase-js';

declare module './supabaseClient' {
  const supabase: SupabaseClient;
  export default supabase;
}
