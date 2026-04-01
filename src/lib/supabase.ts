export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const getSupabaseHeaders = (token?: string) => ({
  apikey: supabaseKey,
  Authorization: `Bearer ${token || supabaseKey}`,
  'Content-Type': 'application/json',
})
