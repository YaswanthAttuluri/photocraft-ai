import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setUser(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) throw error

      // Always create user profile manually (more reliable than triggers)
      if (data.user) {
        const isAdmin = email.toLowerCase() === 'yaswanth.attuluri@gmail.com'
        
        // Wait a moment for auth user to be fully created
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            subscription_tier: isAdmin ? 'enterprise' : 'free',
            credits_remaining: isAdmin ? 999999 : 50,
            is_admin: isAdmin
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // If profile creation fails, clean up the auth user
          await supabase.auth.signOut()
          throw new Error(`Failed to create user profile: ${profileError.message}`)
        }
      }

      return data
    } catch (error: any) {
      console.error('Signup error:', error)
      throw new Error(error.message || 'Failed to create account')
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return data
    } catch (error: any) {
      console.error('Signin error:', error)
      throw new Error(error.message || 'Failed to sign in')
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (error: any) {
      console.error('Signout error:', error)
      throw new Error('Failed to sign out')
    }
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      setUser(data)
      return data
    } catch (error: any) {
      console.error('Update user error:', error)
      throw new Error('Failed to update profile')
    }
  }

  const deductCredits = async (amount: number) => {
    if (!user || user.is_admin) return user

    try {
      const newCredits = Math.max(0, user.credits_remaining - amount)
      return await updateUser({ credits_remaining: newCredits })
    } catch (error) {
      console.error('Credit deduction error:', error)
      return user
    }
  }

  const logProcessing = async (processingMode: string, creditsUsed: number) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('processing_history')
        .insert({
          user_id: user.id,
          processing_mode: processingMode,
          credits_used: creditsUsed
        })

      if (error) console.error('Error logging processing:', error)
    } catch (error) {
      console.error('Processing log error:', error)
    }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateUser,
    deductCredits,
    logProcessing
  }
}