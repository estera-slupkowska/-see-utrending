import { useState } from 'react'
import { useAuth } from '../../lib/auth/context'
import { ProfileService } from '../../lib/supabase/profiles'
import { supabase } from '../../lib/supabase/client'
import { Button } from '../ui'
import {
  X,
  Settings,
  User,
  Mail,
  Lock,
  Download,
  Trash2,
  AlertTriangle,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  Loader
} from 'lucide-react'

interface AccountSettingsProps {
  onClose: () => void
}

export function AccountSettings({ onClose }: AccountSettingsProps) {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<'general' | 'privacy' | 'delete'>('general')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Form states
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePasswordChange = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setErrorMessage('Wszystkie pola są wymagane')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMessage('Nowe hasło musi mieć co najmniej 6 znaków')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('Nowe hasła nie są takie same')
      return
    }

    setIsChangingPassword(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      })

      if (error) {
        setErrorMessage(error.message || 'Nie udało się zmienić hasła')
        return
      }

      setSuccessMessage('Hasło zostało pomyślnie zmienione!')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrorMessage('Wystąpił błąd podczas zmiany hasła')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user?.id || deleteConfirmText !== 'USUŃ KONTO') return

    setIsDeleting(true)
    setErrorMessage('')

    try {
      const { success, error } = await ProfileService.deleteAccount(user.id)

      if (!success) {
        setErrorMessage(error || 'Nie udało się usunąć konta')
        return
      }

      // Sign out and redirect
      await signOut()
      window.location.href = '/'
    } catch (error) {
      setErrorMessage('Wystąpił błąd podczas usuwania konta')
    } finally {
      setIsDeleting(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'Ogólne', icon: User },
    { id: 'privacy', label: 'Prywatność', icon: Shield },
    { id: 'delete', label: 'Usuń konto', icon: AlertTriangle }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-text-primary">
                Ustawienia konta
              </h2>
              <p className="text-sm text-text-secondary">
                Zarządzaj swoim kontem i danymi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-light rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-64 border-r border-border p-6">
            <nav className="space-y-2">
              {tabs.map(tab => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-6 flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-400">{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-red-400">{errorMessage}</span>
              </div>
            )}

            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Informacje o koncie</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-surface-light rounded-lg border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-4 h-4 text-text-muted" />
                        <span className="text-sm font-medium text-text-primary">Email</span>
                      </div>
                      <p className="text-text-secondary">{user?.email}</p>
                    </div>

                    <div className="p-4 bg-surface-light rounded-lg border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-4 h-4 text-text-muted" />
                        <span className="text-sm font-medium text-text-primary">Rola</span>
                      </div>
                      <p className="text-text-secondary capitalize">{user?.user_metadata?.role || 'creator'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-text-primary mb-3">Zmień email</h4>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Nowy adres email"
                      value={emailForm.newEmail}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Potwierdź hasłem"
                        value={emailForm.password}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button variant="secondary" className="w-full" disabled>
                      Zmień email (Wkrótce)
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Ustawienia prywatności</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-surface-light rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-text-primary">Profil publiczny</h4>
                          <p className="text-sm text-text-secondary">Czy inni użytkownicy mogą zobaczyć Twój profil</p>
                        </div>
                        <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
                          Włączone
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-surface-light rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-text-primary">Analityka aktywności</h4>
                          <p className="text-sm text-text-secondary">Czy możemy analizować Twoją aktywność</p>
                        </div>
                        <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
                          Włączone
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-text-primary mb-3">Zmień hasło</h4>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Obecne hasło"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                    <input
                      type="password"
                      placeholder="Nowe hasło"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                    <input
                      type="password"
                      placeholder="Potwierdź nowe hasło"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                    <Button
                      variant="secondary"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Zmiana hasła...
                        </>
                      ) : (
                        'Zmień hasło'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Tab */}
            {activeTab === 'delete' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4 text-red-400">Strefa zagrożenia</h3>
                  <p className="text-text-secondary mb-6">
                    Te działania są nieodwracalne. Przemyśl swoje decyzje.
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-red-400 mb-2">Usuń konto</h4>
                          <p className="text-sm text-text-secondary mb-4">
                            To działanie permanentnie usunie Twoje konto, wszystkie dane, zdjęcia i nie można go cofnąć.
                          </p>

                          {!showDeleteConfirm ? (
                            <Button
                              variant="danger"
                              onClick={() => setShowDeleteConfirm(true)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Usuń konto
                            </Button>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-sm text-yellow-400 font-medium">
                                Aby potwierdzić, wpisz: <span className="text-red-400">USUŃ KONTO</span>
                              </p>
                              <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="USUŃ KONTO"
                                className="w-full px-3 py-2 bg-surface border border-red-500/50 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                              />
                              <div className="flex gap-3">
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    setShowDeleteConfirm(false)
                                    setDeleteConfirmText('')
                                  }}
                                >
                                  Anuluj
                                </Button>
                                <Button
                                  variant="danger"
                                  onClick={handleDeleteAccount}
                                  disabled={deleteConfirmText !== 'USUŃ KONTO' || isDeleting}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  {isDeleting ? (
                                    <>
                                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                                      Usuwanie...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Usuń konto na zawsze
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-surface-light border-t border-border p-6">
          <div className="flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Zamknij
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}