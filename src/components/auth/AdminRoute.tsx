import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth/context'
import { usePermissions } from '../../lib/auth/hooks'

interface AdminRouteProps {
  children: ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth()
  const { isAdmin } = usePermissions()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-text-muted">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Proper admin check - only admin users can access admin panel
  if (!user || !isAdmin()) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}