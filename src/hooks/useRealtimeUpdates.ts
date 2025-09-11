import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeUpdatesOptions {
  table: string
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
  filter?: string
}

export function useRealtimeUpdates({
  table,
  onInsert,
  onUpdate,
  onDelete,
  filter
}: UseRealtimeUpdatesOptions) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let realtimeChannel: RealtimeChannel

    const setupChannel = () => {
      try {
        // Create channel with unique name
        const channelName = `${table}_${Date.now()}`
        realtimeChannel = supabase.channel(channelName)

        // Add table listener
        let subscription = realtimeChannel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            ...(filter && { filter })
          },
          (payload) => {
            console.log('Real-time update:', payload)
            
            switch (payload.eventType) {
              case 'INSERT':
                onInsert?.(payload)
                break
              case 'UPDATE':
                onUpdate?.(payload)
                break
              case 'DELETE':
                onDelete?.(payload)
                break
            }
          }
        )

        // Subscribe and handle connection
        realtimeChannel
          .subscribe((status) => {
            console.log(`Real-time subscription status for ${table}:`, status)
            
            if (status === 'SUBSCRIBED') {
              setIsConnected(true)
              setError(null)
            } else if (status === 'CHANNEL_ERROR') {
              setIsConnected(false)
              setError('Failed to connect to real-time updates')
            } else if (status === 'TIMED_OUT') {
              setIsConnected(false)
              setError('Real-time connection timed out')
            }
          })

        setChannel(realtimeChannel)
        setError(null)
      } catch (err) {
        console.error('Error setting up real-time channel:', err)
        setError('Failed to setup real-time updates')
        setIsConnected(false)
      }
    }

    setupChannel()

    // Cleanup function
    return () => {
      if (realtimeChannel) {
        console.log(`Cleaning up real-time subscription for ${table}`)
        realtimeChannel.unsubscribe()
      }
    }
  }, [table, filter, onInsert, onUpdate, onDelete])

  const disconnect = () => {
    if (channel) {
      channel.unsubscribe()
      setChannel(null)
      setIsConnected(false)
    }
  }

  return {
    isConnected,
    error,
    disconnect
  }
}

// Specialized hooks for different data types
export function useContestUpdates(onUpdate?: (contests: any[]) => void) {
  return useRealtimeUpdates({
    table: 'contests',
    onInsert: () => onUpdate?.([]),
    onUpdate: () => onUpdate?.([]),
    onDelete: () => onUpdate?.([])
  })
}

export function useUserUpdates(onUpdate?: (users: any[]) => void) {
  return useRealtimeUpdates({
    table: 'profiles',
    onInsert: () => onUpdate?.([]),
    onUpdate: () => onUpdate?.([]),
    onDelete: () => onUpdate?.([])
  })
}

export function useSubmissionUpdates(onUpdate?: (submissions: any[]) => void) {
  return useRealtimeUpdates({
    table: 'contest_submissions',
    onInsert: () => onUpdate?.([]),
    onUpdate: () => onUpdate?.([]),
    onDelete: () => onUpdate?.([])
  })
}

export function useContentUpdates(onUpdate?: (content: any[]) => void) {
  return useRealtimeUpdates({
    table: 'content_blocks',
    onInsert: () => onUpdate?.([]),
    onUpdate: () => onUpdate?.([]),
    onDelete: () => onUpdate?.([])
  })
}