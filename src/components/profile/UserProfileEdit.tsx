import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/auth/context'
import { Button } from '../ui'
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  X, 
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader,
  Star,
  Award,
  Crown
} from 'lucide-react'

interface UserProfileEditProps {
  onClose: () => void
  onSave?: (profileData: any) => void
}

export function UserProfileEdit({ onClose, onSave }: UserProfileEditProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    tiktokHandle: '',
    dateOfBirth: '',
    location: '',
    interests: [] as string[],
    notifications: {
      contests: true,
      achievements: true,
      marketing: false,
      updates: true
    },
    privacy: {
      profileVisibility: 'public' as 'public' | 'private',
      showStats: true,
      showBadges: true,
      allowMessages: true
    }
  })

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.name || '',
        email: user.email || '',
        bio: user.user_metadata?.bio || '',
        tiktokHandle: user.user_metadata?.tiktok_handle || '',
        location: user.user_metadata?.location || '',
        interests: user.user_metadata?.interests || []
      }))
    }
  }, [user])

  const availableInterests = [
    'Taniec', 'Komedia', 'Gotowanie', 'Moda', 'Makijaż', 'Fitness', 
    'Podróże', 'Muzyka', 'Sztuka', 'Technologia', 'Gaming', 'Zwierzęta',
    'DIY', 'Edukacja', 'Sport', 'Lifestyle', 'ASMR', 'Reviews'
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Imię jest wymagane')
      }

      if (!formData.email.trim()) {
        throw new Error('Email jest wymagany')
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Save to localStorage for sandbox
      const profileData = {
        ...formData,
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem('user_profile_data', JSON.stringify(profileData))
      
      setSuccessMessage('Profil został zaktualizowany pomyślnie!')
      
      if (onSave) {
        onSave(profileData)
      }

      // Auto close after success
      setTimeout(() => {
        onClose()
      }, 2000)

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Wystąpił błąd podczas zapisywania profilu')
    } finally {
      setIsSaving(false)
    }
  }

  const getUserLevel = () => {
    // Mock user level based on saved profile or default
    const savedProfile = localStorage.getItem('user_profile_data')
    if (savedProfile) {
      return JSON.parse(savedProfile).level || 3
    }
    return 3
  }

  const getUserBadgeCount = () => {
    // Count unlocked badges from BadgeCollection
    return 3 // hot-start, early-adopter, streak-7
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-text-primary">
                Edytuj profil
              </h2>
              <p className="text-sm text-text-secondary">
                Zaktualizuj swoje informacje osobiste
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-light rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 p-3 bg-success-green/10 border border-success-green/20 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success-green flex-shrink-0" />
              <p className="text-sm text-success-green">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-error-red/10 border border-error-red/20 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-error-red flex-shrink-0" />
              <p className="text-sm text-error-red">{errorMessage}</p>
            </div>
          )}

          {/* Profile Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-lg font-bold text-text-primary">{getUserLevel()}</span>
              </div>
              <p className="text-xs text-text-muted">Poziom</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="w-4 h-4 text-xp-gold" />
                <span className="text-lg font-bold text-text-primary">{getUserBadgeCount()}</span>
              </div>
              <p className="text-xs text-text-muted">Odznaki</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Crown className="w-4 h-4 text-purple-400" />
                <span className="text-lg font-bold text-text-primary">127</span>
              </div>
              <p className="text-xs text-text-muted">Ranking</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <User className="w-4 h-4" />
              Informacje podstawowe
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Imię *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="Twoje imię"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="twoj@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                placeholder="Opowiedz coś o sobie..."
                maxLength={150}
              />
              <p className="text-xs text-text-muted mt-1">
                {formData.bio.length}/150 znaków
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                TikTok Handle
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.tiktokHandle}
                  onChange={(e) => handleInputChange('tiktokHandle', e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="username"
                />
                <span className="absolute left-3 top-2.5 text-text-muted text-sm">@</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Lokalizacja
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Miasto, Kraj"
              />
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-text-primary">
              Zainteresowania
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
                    formData.interests.includes(interest)
                      ? 'bg-primary text-white shadow-md transform scale-105'
                      : 'bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary hover:scale-105'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted">
              Wybrano {formData.interests.length} z {availableInterests.length} kategorii
            </p>
          </div>

          {/* Advanced Settings Toggle */}
          <div className="mb-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary-600 transition-colors"
            >
              {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAdvanced ? 'Ukryj ustawienia zaawansowane' : 'Pokaż ustawienia zaawansowane'}
            </button>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="space-y-6 p-4 bg-surface/50 rounded-lg border border-border/50">
              {/* Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">
                  Powiadomienia
                </h3>
                <div className="space-y-3">
                  {[
                    { key: 'contests', label: 'Nowe konkursy i wydarzenia' },
                    { key: 'achievements', label: 'Odznaki i osiągnięcia' },
                    { key: 'updates', label: 'Aktualizacje platformy' },
                    { key: 'marketing', label: 'Oferty marketingowe' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.notifications[key as keyof typeof formData.notifications]}
                        onChange={(e) => handleNestedChange('notifications', key, e.target.checked)}
                        className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary/50 focus:ring-2"
                      />
                      <span className="text-sm text-text-secondary">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Privacy */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">
                  Prywatność
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Widoczność profilu
                    </label>
                    <select
                      value={formData.privacy.profileVisibility}
                      onChange={(e) => handleNestedChange('privacy', 'profileVisibility', e.target.value)}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    >
                      <option value="public">Publiczny</option>
                      <option value="private">Prywatny</option>
                    </select>
                  </div>

                  {[
                    { key: 'showStats', label: 'Pokaż statystyki' },
                    { key: 'showBadges', label: 'Pokaż odznaki' },
                    { key: 'allowMessages', label: 'Zezwalaj na wiadomości' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.privacy[key as keyof typeof formData.privacy]}
                        onChange={(e) => handleNestedChange('privacy', key, e.target.checked)}
                        className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary/50 focus:ring-2"
                      />
                      <span className="text-sm text-text-secondary">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <p className="text-xs text-text-muted">
            * Pola wymagane
          </p>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={onClose}
              disabled={isSaving}
            >
              Anuluj
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={isSaving}
              className="min-w-[100px]"
            >
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Zapisz
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}