import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}
// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier: 'free' | 'pro' | 'enterprise'
  credits_remaining: number
  is_admin: boolean
  created_at: string
  updated_at: string
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export interface ProcessingHistory {
  id: string
  user_id: string
  processing_mode: string
  credits_used: number
  created_at: string
}