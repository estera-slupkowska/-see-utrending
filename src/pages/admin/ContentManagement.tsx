import { useState, useEffect } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Bell,
  Save,
  Loader,
  Youtube
} from 'lucide-react'
import { ContentService, ContentNotification, CreateContentNotificationData, BadgeStatus, BadgeType, TrailerConfig, UpdateTrailerData } from '../../services/admin/content.service'

interface ContentBlock {
  id: string
  section: string
  title: string
  content: string
  priority: number
  visible: boolean
  created_at: string
}

export function ContentManagement() {
  const [notifications, setNotifications] = useState<ContentNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingNotification, setEditingNotification] = useState<ContentNotification | null>(null)
  const [formData, setFormData] = useState({
    title_pl: '',
    title_en: '',
    content_pl: '',
    content_en: '',
    badge_status: 'active_now' as BadgeStatus,
    badge_type: 'announcement' as BadgeType,
    priority: 1,
    visible: true
  })

  // Trailer management state
  const [trailerConfig, setTrailerConfig] = useState<TrailerConfig | null>(null)
  const [trailerLoading, setTrailerLoading] = useState(true)
  const [isEditingTrailer, setIsEditingTrailer] = useState(false)
  const [trailerFormData, setTrailerFormData] = useState({
    youtube_video_id: '',
    title_pl: 'Jak to działa',
    title_en: 'How it Works',
    description_pl: '',
    description_en: '',
    visible: true
  })

  // Fetch notifications and trailer on mount
  useEffect(() => {
    loadNotifications()
    loadTrailerConfig()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await ContentService.getContentNotifications()
      setNotifications(data)
    } catch (error) {
      console.error('Failed to load notifications:', error)
      alert('Failed to load notifications. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadTrailerConfig = async () => {
    try {
      setTrailerLoading(true)
      const data = await ContentService.getTrailerConfig()
      setTrailerConfig(data)
      setTrailerFormData({
        youtube_video_id: data.youtube_video_id,
        title_pl: data.title_pl,
        title_en: data.title_en,
        description_pl: data.description_pl || '',
        description_en: data.description_en || '',
        visible: data.visible
      })
    } catch (error) {
      console.error('Failed to load trailer config:', error)
    } finally {
      setTrailerLoading(false)
    }
  }

  const handleSaveTrailer = async () => {
    try {
      const updateData: UpdateTrailerData = {
        youtube_video_id: trailerFormData.youtube_video_id,
        title_pl: trailerFormData.title_pl,
        title_en: trailerFormData.title_en,
        description_pl: trailerFormData.description_pl,
        description_en: trailerFormData.description_en,
        visible: trailerFormData.visible
      }

      await ContentService.updateTrailerConfig(updateData)
      setIsEditingTrailer(false)
      loadTrailerConfig()
      alert('Trailer configuration saved successfully!')
    } catch (error) {
      console.error('Failed to save trailer config:', error)
      alert('Failed to save trailer configuration. Please try again.')
    }
  }

  const handleEdit = (notification: ContentNotification) => {
    setEditingNotification(notification)
    setFormData({
      title_pl: notification.title_pl,
      title_en: notification.title_en,
      content_pl: notification.content_pl,
      content_en: notification.content_en,
      badge_status: notification.badge_status,
      badge_type: notification.badge_type,
      priority: notification.priority,
      visible: notification.visible
    })
    setIsEditModalOpen(true)
  }

  const handleCreate = () => {
    setEditingNotification(null)
    setFormData({
      title_pl: '',
      title_en: '',
      content_pl: '',
      content_en: '',
      badge_status: 'active_now',
      badge_type: 'announcement',
      priority: 1,
      visible: true
    })
    setIsEditModalOpen(true)
  }

  const handleSave = async () => {
    try {
      const notificationData: CreateContentNotificationData = {
        title_pl: formData.title_pl,
        title_en: formData.title_en,
        content_pl: formData.content_pl,
        content_en: formData.content_en,
        badge_status: formData.badge_status,
        badge_type: formData.badge_type,
        priority: formData.priority,
        visible: formData.visible
      }

      if (editingNotification) {
        // Update existing notification
        await ContentService.updateContentNotification(editingNotification.id, notificationData)
      } else {
        // Create new notification
        await ContentService.createContentNotification(notificationData)
      }

      setIsEditModalOpen(false)
      loadNotifications() // Reload the list
    } catch (error) {
      console.error('Failed to save notification:', error)
      alert('Failed to save notification. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      try {
        await ContentService.deleteContentNotification(id)
        loadNotifications() // Reload the list
      } catch (error) {
        console.error('Failed to delete notification:', error)
        alert('Failed to delete notification. Please try again.')
      }
    }
  }

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      await ContentService.toggleNotificationVisibility(id, !currentVisibility)
      loadNotifications() // Reload the list
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
      alert('Failed to toggle visibility. Please try again.')
    }
  }

  const getBadgeStatusLabel = (status: BadgeStatus) => {
    return status === 'active_now' ? 'aktywne teraz' : 'już wkrótce'
  }

  const getBadgeTypeLabel = (type: BadgeType) => {
    return type === 'announcement' ? 'ogłoszenie' : 'nadchodzi'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Notifications Management</h1>
          <p className="text-text-muted mt-1">Manage landing page notifications in Polish and English</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Notification</span>
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {notifications
            .sort((a, b) => a.priority - b.priority)
            .map((notification) => (
              <div
                key={notification.id}
                className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-1 bg-purple-500/20 rounded">
                        <Bell className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg">{notification.title_pl}</h3>
                        <h4 className="text-sm text-text-muted italic">{notification.title_en}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          Priority: {notification.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          notification.badge_status === 'active_now'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {getBadgeStatusLabel(notification.badge_status)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          notification.badge_type === 'announcement'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-pink-500/20 text-pink-400'
                        }`}>
                          {getBadgeTypeLabel(notification.badge_type)}
                        </span>
                        {notification.visible ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>Visible</span>
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center space-x-1">
                            <EyeOff className="w-3 h-3" />
                            <span>Hidden</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <p className="text-text-muted leading-relaxed">
                        <span className="text-xs font-semibold text-purple-400">PL:</span> {notification.content_pl}
                      </p>
                      <p className="text-text-muted leading-relaxed">
                        <span className="text-xs font-semibold text-blue-400">EN:</span> {notification.content_en}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-text-muted">
                      <span>Created: {new Date(notification.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Updated: {new Date(notification.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleVisibility(notification.id, notification.visible)}
                      className={`p-2 rounded-lg transition-colors ${
                        notification.visible
                          ? 'text-green-400 hover:bg-green-500/10'
                          : 'text-red-400 hover:bg-red-500/10'
                      }`}
                      title={notification.visible ? 'Hide' : 'Show'}
                    >
                      {notification.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleEdit(notification)}
                      className="p-2 hover:bg-surface rounded-lg text-text-muted hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 hover:bg-surface rounded-lg text-text-muted hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {notifications.length === 0 && !loading && (
            <div className="text-center py-12 text-text-muted bg-surface/30 rounded-lg">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg">No notifications yet</p>
              <p className="text-sm mt-1">Click "Add Notification" to create your first one</p>
            </div>
          )}
        </div>
      )}

      {/* Edit/Create Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-white">
                {editingNotification ? 'Edit Notification' : 'Create Notification'}
              </h2>
              <p className="text-sm text-text-muted mt-1">Provide content in both Polish and English</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Polish Content */}
              <div className="space-y-4 p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide">Polish Content</h3>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Title (Polish)</label>
                  <input
                    type="text"
                    value={formData.title_pl}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_pl: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
                    placeholder="Wprowadź tytuł po polsku"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Content (Polish)</label>
                  <textarea
                    value={formData.content_pl}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_pl: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary resize-vertical"
                    placeholder="Wprowadź treść po polsku"
                  />
                </div>
              </div>

              {/* English Content */}
              <div className="space-y-4 p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">English Content</h3>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Title (English)</label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
                    placeholder="Enter title in English"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Content (English)</label>
                  <textarea
                    value={formData.content_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary resize-vertical"
                    placeholder="Enter content in English"
                  />
                </div>
              </div>

              {/* Badge Configuration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Badge Status</label>
                  <select
                    value={formData.badge_status}
                    onChange={(e) => setFormData(prev => ({ ...prev, badge_status: e.target.value as BadgeStatus }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary"
                  >
                    <option value="active_now">aktywne teraz (Active Now)</option>
                    <option value="coming_soon">już wkrótce (Coming Soon)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Badge Type</label>
                  <select
                    value={formData.badge_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, badge_type: e.target.value as BadgeType }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary"
                  >
                    <option value="announcement">ogłoszenie (Announcement)</option>
                    <option value="upcoming">nadchodzi (Upcoming)</option>
                  </select>
                </div>
              </div>

              {/* Priority and Visibility */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Priority</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                    min="1"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                  <p className="text-xs text-text-muted mt-1">Lower numbers appear first</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Visibility</label>
                  <select
                    value={formData.visible ? 'visible' : 'hidden'}
                    onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.value === 'visible' }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary"
                  >
                    <option value="visible">Visible</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-text-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{editingNotification ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Live Preview (Visible Notifications)</span>
        </h2>

        <div className="space-y-3">
          {notifications
            .filter(notification => notification.visible)
            .sort((a, b) => a.priority - b.priority)
            .map((notification) => (
              <div key={notification.id} className="p-4 bg-background/50 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{notification.title_pl}</h3>
                    <h4 className="text-xs text-text-muted italic mb-2">{notification.title_en}</h4>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      notification.badge_status === 'active_now'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {getBadgeStatusLabel(notification.badge_status)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      notification.badge_type === 'announcement'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-pink-500/20 text-pink-400'
                    }`}>
                      {getBadgeTypeLabel(notification.badge_type)}
                    </span>
                  </div>
                </div>
                <p className="text-text-muted text-sm">{notification.content_pl}</p>
                <p className="text-text-muted/70 text-xs italic mt-1">{notification.content_en}</p>
              </div>
            ))}
        </div>

        {notifications.filter(notification => notification.visible).length === 0 && (
          <div className="text-center py-8 text-text-muted">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No visible notifications</p>
          </div>
        )}
      </div>

      {/* Trailer Management Section */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Youtube className="w-5 h-5 text-red-400" />
              <span>YouTube Trailer Configuration</span>
            </h2>
            <p className="text-sm text-text-muted mt-1">Manage the "Jak to działa" section with YouTube video</p>
          </div>
          {!isEditingTrailer && (
            <button
              onClick={() => setIsEditingTrailer(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Trailer</span>
            </button>
          )}
        </div>

        {trailerLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : isEditingTrailer ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* YouTube Video ID */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">YouTube Video ID or URL</label>
                <input
                  type="text"
                  value={trailerFormData.youtube_video_id}
                  onChange={(e) => {
                    // Extract video ID from URL if full URL is pasted
                    const value = e.target.value
                    let videoId = value

                    // Check if it's a YouTube URL
                    if (value.includes('youtube.com') || value.includes('youtu.be')) {
                      const urlMatch = value.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
                      if (urlMatch && urlMatch[1]) {
                        videoId = urlMatch[1]
                      }
                    }

                    setTrailerFormData(prev => ({ ...prev, youtube_video_id: videoId }))
                  }}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
                  placeholder="Enter YouTube video ID (e.g., dQw4w9WgXcQ) or full URL"
                />
                <p className="text-xs text-text-muted mt-1">
                  You can paste the full YouTube URL or just the video ID
                </p>
              </div>

              {/* Polish Title and Description */}
              <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20 space-y-4">
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide">Polish Content</h3>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Title (Polish)</label>
                  <input
                    type="text"
                    value={trailerFormData.title_pl}
                    onChange={(e) => setTrailerFormData(prev => ({ ...prev, title_pl: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
                    placeholder="Jak to działa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Description (Polish)</label>
                  <textarea
                    value={trailerFormData.description_pl}
                    onChange={(e) => setTrailerFormData(prev => ({ ...prev, description_pl: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary resize-vertical"
                    placeholder="Zobacz krótki film wyjaśniający..."
                  />
                </div>
              </div>

              {/* English Title and Description */}
              <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20 space-y-4">
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">English Content</h3>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Title (English)</label>
                  <input
                    type="text"
                    value={trailerFormData.title_en}
                    onChange={(e) => setTrailerFormData(prev => ({ ...prev, title_en: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
                    placeholder="How it Works"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Description (English)</label>
                  <textarea
                    value={trailerFormData.description_en}
                    onChange={(e) => setTrailerFormData(prev => ({ ...prev, description_en: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary resize-vertical"
                    placeholder="Watch a short video explaining..."
                  />
                </div>
              </div>

              {/* Visibility Toggle */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Visibility</label>
                <select
                  value={trailerFormData.visible ? 'visible' : 'hidden'}
                  onChange={(e) => setTrailerFormData(prev => ({ ...prev, visible: e.target.value === 'visible' }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  <option value="visible">Visible on Landing Page</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setIsEditingTrailer(false)
                  // Reset form data to current config
                  if (trailerConfig) {
                    setTrailerFormData({
                      youtube_video_id: trailerConfig.youtube_video_id,
                      title_pl: trailerConfig.title_pl,
                      title_en: trailerConfig.title_en,
                      description_pl: trailerConfig.description_pl || '',
                      description_en: trailerConfig.description_en || '',
                      visible: trailerConfig.visible
                    })
                  }
                }}
                className="px-4 py-2 text-text-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTrailer}
                className="flex items-center space-x-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Trailer</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Configuration Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Preview */}
              <div>
                <h3 className="text-sm font-medium text-white mb-3">Current Video</h3>
                <div className="aspect-video bg-background rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerConfig?.youtube_video_id}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Video ID: {trailerConfig?.youtube_video_id}
                </p>
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Polish Content</h3>
                  <div className="bg-background/50 rounded-lg p-3 space-y-1">
                    <p className="text-white font-semibold">{trailerConfig?.title_pl}</p>
                    {trailerConfig?.description_pl && (
                      <p className="text-text-muted text-sm">{trailerConfig.description_pl}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white mb-2">English Content</h3>
                  <div className="bg-background/50 rounded-lg p-3 space-y-1">
                    <p className="text-white font-semibold">{trailerConfig?.title_en}</p>
                    {trailerConfig?.description_en && (
                      <p className="text-text-muted text-sm">{trailerConfig.description_en}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-text-muted">Status:</span>
                  {trailerConfig?.visible ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>Visible</span>
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center space-x-1">
                      <EyeOff className="w-3 h-3" />
                      <span>Hidden</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}