import { supabase } from '../lib/supabaseClient'

export async function getAuthHeader(): Promise<Record<string, string>> {
  if (!supabase) {
    throw new Error('Supabase client is not configured')
  }

  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  if (!token) {
    throw new Error('No active Supabase access token')
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}
