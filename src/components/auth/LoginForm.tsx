import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Mail, Lock, X } from 'lucide-react'
import { Button } from '../ui'
import { useAuthForm } from '../../lib/auth/hooks'

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.validation.email_required')
    .email('auth.validation.email_invalid'),
  password: z
    .string()
    .min(1, 'auth.validation.password_required')
    .min(6, 'auth.validation.password_min_length'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
  onForgotPassword?: () => void
  onClose?: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister, onForgotPassword, onClose }: LoginFormProps) {
  const { t } = useTranslation()
  const { signIn, loading, error, clearError } = useAuthForm()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: LoginFormData) => {
    clearError()
    clearErrors()
    
    const success = await signIn(data.email, data.password)
    
    if (success) {
      onSuccess?.()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card-clean">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h2 className="text-3xl font-display font-bold gradient-text">
              {t('auth.login.title')}
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-surface/50 border border-border/50 hover:border-primary/50 flex items-center justify-center hover:bg-surface transition-all duration-200"
                disabled={loading}
              >
                <X className="w-4 h-4 text-text-secondary hover:text-primary" />
              </button>
            )}
          </div>
          <p className="text-text-secondary">
            {t('auth.login.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              {t('auth.fields.email')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-text-muted" />
              </div>
              <input
                {...register('email')}
                type="email"
                id="email"
                placeholder={t('auth.placeholders.email')}
                className={`w-full pl-10 pr-4 py-3 bg-surface border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  errors.email ? 'border-error-red' : 'border-border'
                }`}
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p className="text-error-red text-sm mt-1">{t(errors.email.message!)}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
              {t('auth.fields.password')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-text-muted" />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder={t('auth.placeholders.password')}
                className={`w-full pl-10 pr-12 py-3 bg-surface border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  errors.password ? 'border-error-red' : 'border-border'
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-text-muted hover:text-text-secondary transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-text-muted hover:text-text-secondary transition-colors" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-error-red text-sm mt-1">{t(errors.password.message!)}</p>
            )}
          </div>

          {/* Auth Error */}
          {error && (
            <div className="bg-error-red/10 border border-error-red/20 rounded-lg p-4">
              <p className="text-error-red text-sm text-center">{t(error)}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading || !isValid}
            loading={loading}
          >
            {loading ? t('auth.login.signing_in') : t('auth.login.submit')}
          </Button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-primary hover:text-primary-light text-sm font-medium transition-colors"
              disabled={loading}
            >
              {t('auth.login.forgot_password')}
            </button>
          </div>
        </form>

        {/* Switch to Register */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-text-secondary text-sm">
            {t('auth.login.no_account')}{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-primary hover:text-primary-light font-medium transition-colors"
              disabled={loading}
            >
              {t('auth.login.sign_up')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}