import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth/context'
import { usePermissions } from '../../lib/auth/hooks'

interface ProtectedRouteProps {
  children: ReactNode
  requireRole?: 'creator' | 'brand' | 'spectator' | 'admin'
  fallback?: string
}

export function ProtectedRoute({ 
  children, 
  requireRole,
  fallback = '/auth/login'
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const { hasRole } = usePermissions()
  const location = useLocation()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen main-content-area flex items-center justify-center" style={{backgroundColor: '#0A0A0A', color: '#FFFFFF'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Ładowanie...</p>
        </div>
      </div>
    )
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to={fallback} state={{ from: location }} replace />
  }

  // Check role permissions if required
  if (requireRole && !hasRole(requireRole)) {
    return (
      <div className="min-h-screen main-content-area flex items-center justify-center" style={{backgroundColor: '#0A0A0A', color: '#FFFFFF'}}>
        <div className="text-center max-w-md mx-auto">
          <div className="card-clean">
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              Brak uprawnień
            </h2>
            <p className="text-gray-300 mb-6">
              Nie masz wystarczających uprawnień, aby uzyskać dostęp do tej strony.
            </p>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              Wróć
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Higher-order component for role-specific routes
export function withRoleProtection(
  Component: React.ComponentType, 
  requiredRole: 'creator' | 'brand' | 'spectator' | 'admin'
) {
  return function ProtectedComponent(props: any) {
    return (
      <ProtectedRoute requireRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}