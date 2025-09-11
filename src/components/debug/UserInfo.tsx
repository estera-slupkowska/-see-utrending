import { useAuth } from '../../lib/auth/context'

export function UserInfo() {
  const { user } = useAuth()
  
  if (!user) return null
  
  return (
    <div className="fixed top-4 right-4 bg-surface border border-border rounded-lg p-4 text-xs text-white z-50">
      <h3 className="font-bold mb-2">Current User Info:</h3>
      <div>ID: <code className="bg-background px-1 rounded">{user.id}</code></div>
      <div>Email: <code className="bg-background px-1 rounded">{user.email}</code></div>
      <div className="mt-2 text-yellow-400">
        Copy the ID above and run this in Supabase SQL Editor:
      </div>
      <div className="bg-background p-2 rounded mt-1 text-green-400 text-xs">
        UPDATE profiles SET role = 'admin' WHERE id = '{user.id}';
      </div>
    </div>
  )
}