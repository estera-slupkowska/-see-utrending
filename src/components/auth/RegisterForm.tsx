import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Mail, Lock, User, Building, X } from 'lucide-react'
import { Button } from '../ui'
import { useAuthForm } from '../../lib/auth/hooks'

// Validation schema
const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'auth.validation.name_required')
    .min(2, 'auth.validation.name_min_length')
    .max(50, 'auth.validation.name_max_length'),
  email: z
    .string()
    .min(1, 'auth.validation.email_required')
    .email('auth.validation.email_invalid'),
  password: z
    .string()
    .min(1, 'auth.validation.password_required')
    .min(6, 'auth.validation.password_min_length')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'auth.validation.password_complexity'),
  confirmPassword: z
    .string()
    .min(1, 'auth.validation.confirm_password_required'),
  accountType: z
    .enum(['creator']),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, 'auth.validation.terms_required'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'auth.validation.passwords_match',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
  onClose?: () => void
}

export function RegisterForm({ onSuccess, onSwitchToLogin, onClose }: RegisterFormProps) {
  const { t } = useTranslation()
  const { signUp, loading, error, clearError } = useAuthForm()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      accountType: 'creator' as const,
      acceptTerms: false,
    }
  })

  const onSubmit = async (data: RegisterFormData) => {
    clearError()
    clearErrors()
    
    const metadata = {
      name: data.name,
      role: 'creator', // Always creator since that's the only option
    }
    
    const success = await signUp(data.email, data.password, metadata)
    
    if (success) {
      onSuccess?.()
    }
  }

  const handleBrandContact = () => {
    // Redirect to contact or show contact modal
    window.open('mailto:brands@seeutrending.com?subject=Partnership Inquiry', '_blank')
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="card-clean">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h2 className="text-3xl font-display font-bold gradient-text">
              {t('auth.register.title')}
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
            {t('auth.register.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
              {t('auth.fields.name')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-text-muted" />
              </div>
              <input
                {...register('name')}
                type="text"
                id="name"
                placeholder={t('auth.placeholders.name')}
                className={`w-full pl-10 pr-4 py-3 bg-surface border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  errors.name ? 'border-error-red' : 'border-border'
                }`}
                disabled={loading}
              />
            </div>
            {errors.name && (
              <p className="text-error-red text-sm mt-1">{t(errors.name.message!)}</p>
            )}
          </div>

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

          {/* Account Type Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Wybierz typ konta
            </label>
            <div className="space-y-3">
              {/* Creator Option */}
              <label className="cursor-pointer">
                <input
                  {...register('accountType')}
                  type="radio"
                  value="creator"
                  className="sr-only"
                  disabled={loading}
                />
                <div className="p-4 rounded-lg border border-primary bg-primary/5 shadow-glow-sm">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 mt-0.5 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-medium text-primary">
                        Jestem twórcą treści
                      </h4>
                      <p className="text-text-secondary text-sm mt-1">
                        Twórz treści, rywalizuj i zdobywaj nagrody w konkursach
                      </p>
                    </div>
                  </div>
                </div>
              </label>

              {/* Brand Option - Contact Only */}
              <div
                onClick={handleBrandContact}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 mt-0.5 text-text-muted" />
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">
                      Reprezentuję markę
                    </h4>
                    <p className="text-text-secondary text-sm mt-1">
                      Skontaktuj się z nami w sprawie współpracy biznesowej
                    </p>
                    <p className="text-primary text-xs mt-2">
                      Kliknij aby otworzyć formularz kontaktowy →
                    </p>
                  </div>
                </div>
              </div>
            </div>
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

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
              {t('auth.fields.confirm_password')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-text-muted" />
              </div>
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder={t('auth.placeholders.confirm_password')}
                className={`w-full pl-10 pr-12 py-3 bg-surface border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  errors.confirmPassword ? 'border-error-red' : 'border-border'
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-text-muted hover:text-text-secondary transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-text-muted hover:text-text-secondary transition-colors" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-error-red text-sm mt-1">{t(errors.confirmPassword.message!)}</p>
            )}
          </div>

          {/* Terms Acceptance */}
          <div className="flex items-start space-x-3">
            <input
              {...register('acceptTerms')}
              type="checkbox"
              id="acceptTerms"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 bg-surface"
              disabled={loading}
            />
            <label htmlFor="acceptTerms" className="text-sm text-text-secondary">
              {t('auth.register.terms_prefix')}{' '}
              <a href="/terms" className="text-primary hover:text-primary-light underline">
                {t('auth.register.terms_link')}
              </a>{' '}
              {t('auth.register.terms_and')}{' '}
              <a href="/privacy" className="text-primary hover:text-primary-light underline">
                {t('auth.register.privacy_link')}
              </a>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-error-red text-sm">{t(errors.acceptTerms.message!)}</p>
          )}

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
            {loading ? t('auth.register.creating_account') : t('auth.register.submit')}
          </Button>
        </form>

        {/* Switch to Login */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-text-secondary text-sm">
            {t('auth.register.have_account')}{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary-light font-medium transition-colors"
              disabled={loading}
            >
              {t('auth.register.sign_in')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}