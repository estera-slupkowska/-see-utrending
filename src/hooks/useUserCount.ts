import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client'

export function useUserCount() {
  const [userCount, setUserCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchUserCount = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Query the auth.users table to get total user count
        // Note: This requires RLS policies to be set up properly
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

        if (error) {
          console.error('Error fetching user count:', error)
          setError(error.message)
          // Fallback: Use a mock number or 0 if database not ready
          if (mounted) {
            setUserCount(0)
          }
        } else {
          if (mounted) {
            setUserCount(count || 0)
          }
        }
      } catch (err) {
        console.error('Error in fetchUserCount:', err)
        setError('Failed to fetch user count')
        if (mounted) {
          setUserCount(0)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Initial fetch
    fetchUserCount()

    // Set up real-time subscription for user count updates
    const subscription = supabase
      .channel('user_count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          // Refetch count when profiles table changes
          fetchUserCount()
        }
      )
      .subscribe()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { userCount, loading, error }
}