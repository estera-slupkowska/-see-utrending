import { supabase } from './client'

export class StorageService {
  private static AVATAR_BUCKET = 'avatars'
  private static MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  private static ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

  /**
   * Upload avatar image to Supabase storage
   */
  static async uploadAvatar(file: File, userId: string): Promise<{ data: string | null, error: any }> {
    try {
      // Validate file
      if (!this.ALLOWED_FORMATS.includes(file.type)) {
        return { data: null, error: 'Nieprawidłowy format pliku. Dozwolone: JPG, PNG, WebP, GIF' }
      }

      if (file.size > this.MAX_FILE_SIZE) {
        return { data: null, error: 'Plik jest za duży. Maksymalny rozmiar: 5MB' }
      }

      // Create unique filename
      const fileExtension = file.name.split('.').pop()
      const fileName = `${userId}/avatar-${Date.now()}.${fileExtension}`

      // Upload file
      const { data, error } = await supabase.storage
        .from(this.AVATAR_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        console.error('Upload error:', error)
        return { data: null, error: 'Błąd podczas przesyłania pliku' }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.AVATAR_BUCKET)
        .getPublicUrl(fileName)

      return { data: publicUrl, error: null }
    } catch (error) {
      console.error('Avatar upload failed:', error)
      return { data: null, error: 'Wystąpił błąd podczas przesyłania zdjęcia' }
    }
  }

  /**
   * Delete avatar from storage
   */
  static async deleteAvatar(avatarUrl: string): Promise<{ success: boolean, error?: any }> {
    try {
      // Extract file path from URL
      const urlParts = avatarUrl.split(`/${this.AVATAR_BUCKET}/`)
      if (urlParts.length < 2) {
        return { success: false, error: 'Nieprawidłowy URL avatara' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from(this.AVATAR_BUCKET)
        .remove([filePath])

      if (error) {
        console.error('Delete error:', error)
        return { success: false, error: 'Błąd podczas usuwania zdjęcia' }
      }

      return { success: true }
    } catch (error) {
      console.error('Avatar deletion failed:', error)
      return { success: false, error: 'Wystąpił błąd podczas usuwania zdjęcia' }
    }
  }

  /**
   * Get public URL for avatar
   */
  static getAvatarUrl(fileName: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from(this.AVATAR_BUCKET)
      .getPublicUrl(fileName)

    return publicUrl
  }

  /**
   * Resize image on client side before upload
   */
  static resizeImage(file: File, maxWidth = 400, maxHeight = 400, quality = 0.8): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        // Set canvas size
        canvas.width = width
        canvas.height = height

        // Draw and resize image
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to blob
        canvas.toBlob(resolve, 'image/jpeg', quality)
      }

      img.src = URL.createObjectURL(file)
    })
  }
}