import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type User, type Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  userRole: string | null
  roleLoading: boolean
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ data: any, error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Record<string, any>) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [roleLoading, setRoleLoading] = useState(false)

  // Fetch user role from profiles table
  useEffect(() => {
    async function fetchUserRole() {
      if (!user?.id) {
        setUserRole(null)
        return
      }

      setRoleLoading(true)
      try {
        console.log('AuthContext: Fetching role for user:', user.id)
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('AuthContext: Error fetching user role:', error)
          const fallbackRole = user.user_metadata?.role || 'spectator'
          console.log('AuthContext: Using fallback role:', fallbackRole)
          setUserRole(fallbackRole)
        } else {
          console.log('AuthContext: Successfully fetched role from database:', data.role)
          setUserRole(data.role)
        }
      } catch (err) {
        console.error('AuthContext: Exception fetching user role:', err)
        const fallbackRole = user.user_metadata?.role || 'spectator'
        console.log('AuthContext: Using fallback role after exception:', fallbackRole)
        setUserRole(fallbackRole)
      } finally {
        setRoleLoading(false)
      }
    }

    fetchUserRole()
  }, [user])

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }

      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in:', session?.user?.email)
            break
          case 'SIGNED_OUT':
            console.log('User signed out')
            break
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed')
            break
          case 'USER_UPDATED':
            console.log('User updated')
            break
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    
    return { error }
  }

  const updateProfile = async (updates: Record<string, any>) => {
    const { error } = await supabase.auth.updateUser({
      data: updates
    })
    
    return { error }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    userRole,
    roleLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}