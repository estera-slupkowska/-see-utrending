import { useState, useRef } from 'react'
import { Camera, Upload, X, Check, Loader } from 'lucide-react'
import { DefaultAvatar } from './DefaultAvatar'
import { StorageService } from '../../lib/supabase/storage'

interface AvatarUploadProps {
  currentAvatar?: string
  userName?: string
  onUploadComplete?: (avatarUrl: string) => void
  onUploadError?: (error: string) => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  userId: string
}

export function AvatarUpload({
  currentAvatar,
  userName = 'User',
  onUploadComplete,
  onUploadError,
  size = 'lg',
  userId
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true)

      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Resize image
      const resizedBlob = await StorageService.resizeImage(file)
      const resizedFile = new File([resizedBlob!], file.name, { type: 'image/jpeg' })

      // Upload to Supabase
      const { data: avatarUrl, error } = await StorageService.uploadAvatar(resizedFile, userId)

      if (error) {
        onUploadError?.(error)
        setPreview(null)
        return
      }

      if (avatarUrl) {
        onUploadComplete?.(avatarUrl)
        setPreview(null)
        URL.revokeObjectURL(previewUrl)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      onUploadError?.('Wystąpił błąd podczas przesyłania zdjęcia')
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file && StorageService['ALLOWED_FORMATS'].includes(file.type)) {
      handleFileSelect(file)
    }
  }

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div
        className={`${sizeClasses[size]} relative group cursor-pointer transition-all duration-300 hover:scale-105`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Current Avatar or Default */}
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full rounded-full object-cover border-4 border-purple-400 shadow-lg"
          />
        ) : currentAvatar ? (
          <img
            src={currentAvatar}
            alt={userName}
            className="w-full h-full rounded-full object-cover border-4 border-purple-400 shadow-lg"
          />
        ) : (
          <DefaultAvatar name={userName} size={size} />
        )}

        {/* Upload Overlay */}
        <div
          className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ${
            dragOver
              ? 'bg-purple-500/80 opacity-100'
              : 'bg-black/50 opacity-0 group-hover:opacity-100'
          }`}
        >
          {isUploading ? (
            <Loader className="w-6 h-6 text-white animate-spin" />
          ) : dragOver ? (
            <Upload className="w-6 h-6 text-white" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Success Indicator */}
        {!isUploading && currentAvatar && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="text-center">
        <p className="text-sm text-text-secondary mb-2">
          {isUploading ? 'Przesyłanie...' : 'Kliknij lub przeciągnij zdjęcie'}
        </p>
        <p className="text-xs text-text-muted">
          JPG, PNG, WebP, GIF (max 5MB)
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  )
}