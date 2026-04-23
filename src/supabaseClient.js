import { createClient } from '@supabase/supabase-js';

const fallbackSupabaseUrl = 'https://erytgbzkubgalcdsjjlk.supabase.co';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || fallbackSupabaseUrl;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabaseConfigError =
  !supabaseUrl
    ? 'Missing Supabase URL. Set VITE_SUPABASE_URL in your environment.'
    : !supabaseKey
      ? 'Missing Supabase anon key. Set VITE_SUPABASE_KEY in your environment.'
      : null;

export const supabase = supabaseConfigError
  ? null
  : createClient(supabaseUrl, supabaseKey);

export function getSupabaseErrorMessage(error) {
  if (supabaseConfigError) return supabaseConfigError;

  if (error instanceof TypeError || error?.message === 'Failed to fetch') {
    return `Unable to reach Supabase at ${supabaseUrl}. Check VITE_SUPABASE_URL and confirm the Supabase project still exists.`;
  }

  return error?.message || 'Unexpected Supabase error.';
}
