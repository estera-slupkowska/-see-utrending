import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Bell,
  Plus,
  Search,
  Filter,
  Send,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  X,
  Image,
  Link as LinkIcon
} from 'lucide-react'
import { NotificationsService, Notification, CreateNotificationData, NotificationType } from '../../services/admin/notifications.service'

export function NotificationsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  // Form state
  const [formData, setFormData] = useState<CreateNotificationData>({
    title: '',
    message: '',
    type: 'announcement',
    target_audience: ['all'],
    action_url: '',
    image_url: '',
    published: false
  })

  useEffect(() => {
    loadNotifications()
    loadStats()

    // Open create modal if ?new=true in URL
    if (searchParams.get('new') === 'true') {
      setIsCreateModalOpen(true)
      setSearchParams({}) // Clear URL param
    }
  }, [statusFilter])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await NotificationsService.getNotifications({
        published: statusFilter === 'published' ? true : statusFilter === 'draft' ? false : undefined,
        limit: 50
      })

      setNotifications(data)
    } catch (err) {
      console.error('Failed to load notifications:', err)
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await NotificationsService.getNotificationStats()
      setStats(statsData)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const handleCreateNotification = async () => {
    try {
      setError(null)
      await NotificationsService.createNotification(formData)
      setIsCreateModalOpen(false)
      resetForm()
      loadNotifications()
      loadStats()
    } catch (err) {
      console.error('Failed to create notification:', err)
      setError('Failed to create notification')
    }
  }

  const handlePublishNotification = async (id: string) => {
    try {
      await NotificationsService.publishNotification(id)
      loadNotifications()
      loadStats()
    } catch (err) {
      console.error('Failed to publish notification:', err)
      setError('Failed to publish notification')
    }
  }

  const handleDeleteNotification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return

    try {
      await NotificationsService.deleteNotification(id)
      loadNotifications()
      loadStats()
    } catch (err) {
      console.error('Failed to delete notification:', err)
      setError('Failed to delete notification')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'announcement',
      target_audience: ['all'],
      action_url: '',
      image_url: '',
      published: false
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'contest_start':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'contest_end':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'winner':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'badge_earned':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Notifications Management</h1>
          <p className="text-text-muted mt-1">Create and manage platform-wide notifications</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Create Notification</span>
        </button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Bell className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stats.totalNotifications}</p>
            <p className="text-text-muted text-sm">Total Notifications</p>
          </div>

          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stats.publishedNotifications}</p>
            <p className="text-text-muted text-sm">Published</p>
          </div>

          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stats.draftNotifications}</p>
            <p className="text-text-muted text-sm">Drafts</p>
          </div>

          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stats.readRate}</p>
            <p className="text-text-muted text-sm">Read Rate</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-muted">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
            <p className="text-text-muted mb-2">No notifications found</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-primary hover:underline"
            >
              Create your first notification
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start justify-between p-4 bg-background/50 rounded-lg border border-border hover:border-border-light transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{notification.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(notification.type)}`}>
                      {notification.type.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full border ${
                      notification.published
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {notification.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <p className="text-text-secondary mb-3">{notification.message}</p>

                  <div className="flex items-center space-x-6 text-sm text-text-muted">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{notification.total_sent} sent</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{notification.total_read} read</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!notification.published && (
                    <button
                      onClick={() => handlePublishNotification(notification.id)}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                      title="Publish"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Create Notification</h2>
              <button
                onClick={() => { setIsCreateModalOpen(false); resetForm(); }}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Notification title..."
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Notification message..."
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as NotificationType })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="announcement">Announcement</option>
                  <option value="contest_start">Contest Start</option>
                  <option value="contest_end">Contest End</option>
                  <option value="winner">Winner</option>
                  <option value="badge_earned">Badge Earned</option>
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Target Audience *</label>
                <div className="space-y-2">
                  {['all', 'creators', 'brands', 'spectators'].map(audience => (
                    <label key={audience} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.target_audience?.includes(audience)}
                        onChange={(e) => {
                          const current = formData.target_audience || []
                          if (e.target.checked) {
                            setFormData({ ...formData, target_audience: [...current, audience] })
                          } else {
                            setFormData({ ...formData, target_audience: current.filter(a => a !== audience) })
                          }
                        }}
                        className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-white capitalize">{audience}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action URL */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Action URL (optional)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="url"
                    value={formData.action_url}
                    onChange={(e) => setFormData({ ...formData, action_url: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Image URL (optional)</label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Publish Immediately */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-white">Publish immediately</span>
                </label>
                <p className="text-sm text-text-muted mt-1">If unchecked, notification will be saved as draft</p>
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end space-x-4">
              <button
                onClick={() => { setIsCreateModalOpen(false); resetForm(); }}
                className="px-6 py-2 border border-border rounded-lg text-white hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNotification}
                disabled={!formData.title || !formData.message}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all"
              >
                {formData.published ? 'Create & Publish' : 'Save as Draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
