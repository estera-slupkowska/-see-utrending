import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/supabase'

// Helper function to clean and validate environment variables
function sanitizeEnvVar(value: string | undefined, fallback: string, name: string): string {
  if (!value) {
    console.log(`Using fallback for ${name}`)
    return fallback
  }

  // Clean the value: trim whitespace and remove any control characters
  const cleaned = value.replace(/[\r\n\t]/g, '').trim()

  // Validate that it doesn't contain invalid header characters
  const invalidChars = cleaned.match(/[^\x20-\x7E]/g)
  if (invalidChars) {
    console.error(`❌ Invalid characters found in ${name}:`, invalidChars)
    console.log(`Using fallback for ${name} due to invalid characters`)
    return fallback
  }

  return cleaned
}

const supabaseUrl = sanitizeEnvVar(
  import.meta.env.VITE_SUPABASE_URL,
  'https://sxmjwvrjxgylqtbfqykr.supabase.co',
  'VITE_SUPABASE_URL'
)

const supabaseAnonKey = sanitizeEnvVar(
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bWp3dnJqeGd5bHF0YmZxeWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNDgxNzEsImV4cCI6MjA3MjgyNDE3MX0.gcJ4xwSb-2pHHqbxkim8GkZt23y005CkC3ZkJ85kAe8',
  'VITE_SUPABASE_ANON_KEY'
)

// Debug logging for production
console.log('🔧 Supabase Configuration:')
console.log('URL:', supabaseUrl)
console.log('Key exists:', !!supabaseAnonKey)
console.log('Key length:', supabaseAnonKey?.length || 0)
console.log('Key first 20 chars:', supabaseAnonKey?.substring(0, 20) || 'none')
console.log('Key last 10 chars:', supabaseAnonKey?.slice(-10) || 'none')
console.log('Environment:', import.meta.env.MODE || 'unknown')
console.log('Raw env key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
console.log('Raw env key length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0)

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