import { useState, useEffect } from 'react'
import { useAuth } from './context'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase/client'

interface UseAuthFormResult {
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<boolean>
  signOut: () => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
  clearError: () => void
}

export function useAuthForm(): UseAuthFormResult {
  const { t } = useTranslation()
  const auth = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const { error: authError } = await auth.signIn(email, password)
      
      if (authError) {
        setError(getErrorMessage(authError.message))
        setLoading(false)
        return false
      }

      setLoading(false)
      return true
    } catch (err) {
      setError(t('auth.errors.unexpected'))
      setLoading(false)
      return false
    }
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, any>): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const { error: authError } = await auth.signUp(email, password, metadata)
      
      if (authError) {
        setError(getErrorMessage(authError.message))
        setLoading(false)
        return false
      }

      setLoading(false)
      return true
    } catch (err) {
      setError(t('auth.errors.unexpected'))
      setLoading(false)
      return false
    }
  }

  const signOut = async (): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const { error: authError } = await auth.signOut()
      
      if (authError) {
        setError(getErrorMessage(authError.message))
        setLoading(false)
        return false
      }

      setLoading(false)
      return true
    } catch (err) {
      setError(t('auth.errors.unexpected'))
      setLoading(false)
      return false
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const { error: authError } = await auth.resetPassword(email)
      
      if (authError) {
        setError(getErrorMessage(authError.message))
        setLoading(false)
        return false
      }

      setLoading(false)
      return true
    } catch (err) {
      setError(t('auth.errors.unexpected'))
      setLoading(false)
      return false
    }
  }

  return {
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    clearError,
  }
}

// Helper function to map Supabase error messages to user-friendly messages
function getErrorMessage(errorMessage: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'auth.errors.invalid_credentials',
    'User already registered': 'auth.errors.user_exists',
    'Password should be at least 6 characters': 'auth.errors.password_too_short',
    'Unable to validate email address: invalid format': 'auth.errors.invalid_email',
    'Email not confirmed': 'auth.errors.email_not_confirmed',
    'Invalid email': 'auth.errors.invalid_email',
  }

  return errorMap[errorMessage] || 'auth.errors.unexpected'
}

// Hook for checking if user has specific permissions
export function usePermissions() {
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch user role from profiles table
  useEffect(() => {
    async function fetchUserRole() {
      if (!user?.id) {
        setUserRole(null)
        return
      }

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching user role:', error)
          // Fallback to user_metadata
          setUserRole(user.user_metadata?.role || 'spectator')
        } else {
          setUserRole(data.role)
        }
      } catch (err) {
        console.error('Error fetching user role:', err)
        // Fallback to user_metadata
        setUserRole(user.user_metadata?.role || 'spectator')
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [user])

  const hasRole = (role: string): boolean => {
    return userRole === role
  }

  const isCreator = (): boolean => hasRole('creator')
  const isBrand = (): boolean => hasRole('brand')
  const isSpectator = (): boolean => hasRole('spectator')
  const isAdmin = (): boolean => hasRole('admin')

  return {
    userRole,
    loading,
    hasRole,
    isCreator,
    isBrand,
    isSpectator,
    isAdmin,
  }
}

// Hook for user profile management
export function useProfile() {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateUserProfile = async (updates: Record<string, any>): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const { error: authError } = await updateProfile(updates)
      
      if (authError) {
        setError(getErrorMessage(authError.message))
        setLoading(false)
        return false
      }

      setLoading(false)
      return true
    } catch (err) {
      setError('Profile update failed')
      setLoading(false)
      return false
    }
  }

  return {
    user,
    loading,
    error,
    updateUserProfile,
    clearError: () => setError(null),
  }
}