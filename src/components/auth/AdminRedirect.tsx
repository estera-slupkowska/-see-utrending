import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePermissions } from '../../lib/auth/hooks'

interface AdminRedirectProps {
  children: React.ReactNode
}

export function AdminRedirect({ children }: AdminRedirectProps) {
  const { isAdmin } = usePermissions()
  const navigate = useNavigate()

  useEffect(() => {
    // If user is admin and accessing /dashboard, redirect to /admin
    if (isAdmin() && window.location.pathname === '/dashboard') {
      navigate('/admin', { replace: true })
    }
  }, [isAdmin, navigate])

  // If admin, don't show user dashboard
  if (isAdmin()) {
    return null
  }

  return <>{children}</>
}