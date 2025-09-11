import { useAuth } from '../../lib/auth/context'
import { usePermissions } from '../../lib/auth/hooks'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase/client'

export function AdminDebug() {
  const { user } = useAuth()
  const { isAdmin } = usePermissions()
  const [dbRole, setDbRole] = useState<string | null>(null)
  
  useEffect(() => {
    if (user?.id) {
      // Fetch role directly from database
      supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (data) setDbRole(data.role)
          if (error) console.error('Role fetch error:', error)
        })
    }
  }, [user?.id])
  
  if (!user) return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-surface border border-border rounded-lg p-4 text-xs text-white z-50 max-w-xs">
      <h3 className="font-bold mb-2 text-yellow-400">Admin Debug Info:</h3>
      <div className="space-y-1">
        <div><strong>User ID:</strong> {user.id.slice(0, 8)}...</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Role from DB:</strong> <span className="text-green-400">{dbRole || 'Loading...'}</span></div>
        <div><strong>isAdmin():</strong> <span className={isAdmin() ? 'text-green-400' : 'text-red-400'}>{isAdmin().toString()}</span></div>
        <div><strong>Access:</strong> {isAdmin() ? '✅ Should see admin panel' : '❌ Will be redirected'}</div>
      </div>
      
      {dbRole !== 'admin' && (
        <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-red-400">
          <div className="text-xs">❌ Role is not 'admin'</div>
          <div className="text-xs mt-1">Run this SQL in Supabase:</div>
          <code className="text-xs bg-background p-1 rounded block mt-1">
            UPDATE profiles SET role = 'admin' WHERE id = '{user.id}';
          </code>
        </div>
      )}
    </div>
  )
}