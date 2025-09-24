import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sxmjwvrjxgylqtbfqykr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bWp3dnJqeGd5bHF0YmZxeWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNDgxNzEsImV4cCI6MjA3MjgyNDE3MX0.gcJ4xwSb-2pHHqbxkim8GkZt23y005CkC3ZkJ85kAe8'

// Debug logging for production
console.log('🔧 Supabase Configuration:')
console.log('URL:', supabaseUrl)
console.log('Key exists:', !!supabaseAnonKey)
console.log('Key length:', supabaseAnonKey?.length || 0)
console.log('Environment:', import.meta.env.MODE || 'unknown')

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})