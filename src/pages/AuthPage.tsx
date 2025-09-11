import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth/context'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'
import { X } from 'lucide-react'

type AuthMode = 'login' | 'register'

interface AuthPageProps {
  mode?: AuthMode
}

export function AuthPage({ mode: initialMode = 'login' }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  // Redirect to dashboard if already authenticated
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Sprawdzanie autoryzacji...</p>
        </div>
      </div>
    )
  }

  const handleAuthSuccess = () => {
    // Redirect will happen automatically through the useAuth context
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
      
      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        {mode === 'login' ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setMode('register')}
            onForgotPassword={() => {
              // TODO: Implement forgot password modal/page
              console.log('Forgot password clicked')
            }}
            onClose={() => navigate(-1)}
          />
        ) : (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setMode('login')}
            onClose={() => navigate(-1)}
          />
        )}
      </div>
    </div>
  )
}