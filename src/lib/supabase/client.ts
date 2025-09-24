import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/supabase'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://sxmjwvrjxgylqtbfqykr.supabase.co').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bWp3dnJqeGd5bHF0YmZxeWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNDgxNzEsImV4cCI6MjA3MjgyNDE3MX0.gcJ4xwSb-2pHHqbxkim8GkZt23y005CkC3ZkJ85kAe8').trim()

// Debug logging for production
console.log('🔧 Supabase Configuration:')
console.log('URL:', supabaseUrl)
console.log('Key exists:', !!supabaseAnonKey)
console.log('Key length:', supabaseAnonKey?.length || 0)
console.log('Key first 20 chars:', supabaseAnonKey?.substring(0, 20) || 'none')
console.log('Key last 10 chars:', supabaseAnonKey?.slice(-10) || 'none')
console.log('Environment:', import.meta.env.MODE || 'unknown')

// Check for invalid characters in the key
if (supabaseAnonKey) {
  const invalidChars = supabaseAnonKey.match(/[^\w\-\.]/g)
  if (invalidChars && invalidChars.length > 0) {
    console.error('❌ Invalid characters found in Supabase key:', invalidChars.join(', '))
    console.error('Key char codes:', supabaseAnonKey.split('').map(c => c.charCodeAt(0)).join(', '))
  } else {
    console.log('✅ Supabase key format looks valid')
  }
}

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