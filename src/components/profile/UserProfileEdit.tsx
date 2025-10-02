import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/auth/context'
import { Button, AvatarUpload } from '../ui'
import { ProfileService } from '../../lib/supabase/profiles'
import type { UpdateProfileData } from '../../types/profiles'
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
  Crown,
  MapPin,
  Hash
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

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    tiktokHandle: '',
    location: '',
    interests: [] as string[],
    avatar_url: ''
  })

  // Load user data from Supabase profile
  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        setIsLoading(true)
        const { data: profile, error } = await ProfileService.getProfile(user.id)

        if (error) {
          console.error('Error loading profile:', error)
          setErrorMessage('Nie udało się załadować danych profilu')
        } else if (profile) {
          setFormData(prev => ({
            ...prev,
            name: profile.name || '',
            email: profile.email || '',
            bio: profile.bio || '',
            tiktokHandle: profile.tiktok_handle || '',
            location: profile.location || '',
            interests: profile.interests || [],
            avatar_url: profile.avatar_url || ''
          }))
        }

        setIsLoading(false)
      }
    }

    loadProfile()
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

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleAvatarUpload = (avatarUrl: string) => {
    handleInputChange('avatar_url', avatarUrl)
    setSuccessMessage('Zdjęcie profilowe zostało zaktualizowane!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleAvatarError = (error: string) => {
    setErrorMessage(error)
    setTimeout(() => setErrorMessage(''), 5000)
  }

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const updateData: UpdateProfileData = {
        name: formData.name,
        bio: formData.bio,
        tiktok_handle: formData.tiktokHandle,
        location: formData.location,
        interests: formData.interests,
        avatar_url: formData.avatar_url
      }

      const { data: updatedProfile, error } = await ProfileService.updateProfile(user.id, updateData)

      if (error) {
        throw new Error('Nie udało się zaktualizować profilu')
      }

      setSuccessMessage('Profil został zaktualizowany pomyślnie!')

      if (onSave && updatedProfile) {
        onSave(updatedProfile)
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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
                Dostosuj swój profil i zdjęcie profilowe
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

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-text-secondary">Ładowanie danych profilu...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-400/20 rounded-xl">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Zdjęcie profilowe</h3>
                {user?.id && (
                  <AvatarUpload
                    currentAvatar={formData.avatar_url}
                    userName={formData.name || 'User'}
                    userId={user.id}
                    onUploadComplete={handleAvatarUpload}
                    onUploadError={handleAvatarError}
                    size="xl"
                  />
                )}
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Podstawowe informacje</h3>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="Wpisz swoje imię i nazwisko"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-10 pr-3 py-2 bg-surface-light border border-border rounded-lg text-text-secondary cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">Email nie może być zmieniony</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
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

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <Hash className="inline w-4 h-4 mr-1" />
                    TikTok Handle
                  </label>
                  <input
                    type="text"
                    value={formData.tiktokHandle}
                    onChange={(e) => handleInputChange('tiktokHandle', e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="@username"
                  />
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
                    placeholder="Opowiedz o sobie..."
                  />
                </div>
              </div>

              {/* Interests */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Zainteresowania</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableInterests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        formData.interests.includes(interest)
                          ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : 'bg-surface-light text-text-secondary hover:bg-surface border border-border hover:border-primary/20'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Success/Error Messages */}
              {successMessage && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-400">{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-400">{errorMessage}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Always Visible */}
        <div className="flex-shrink-0 bg-surface-light border-t border-border p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-muted">
              * Pola wymagane
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-3 text-base font-medium"
              >
                Anuluj
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
                className="min-w-[120px] px-6 py-3 text-base font-medium"
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
    </div>
  )
}