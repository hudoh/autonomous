import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    throw new Error(
      `Missing Supabase env vars: URL=${url ? 'present' : 'MISSING'}, KEY=${key ? 'present' : 'MISSING'}`
    )
  }
  
  _client = createClient(url, key)
  return _client
}

// Proxy that lazily initializes the real Supabase client
// and delegates all property/method access to it
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
  has(_target, prop) {
    return prop in getClient()
  }
})
