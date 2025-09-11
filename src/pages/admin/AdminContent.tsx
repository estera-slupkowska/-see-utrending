import { useState, useEffect } from 'react'
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Globe,
  Bell,
  Award,
  Users,
  Search
} from 'lucide-react'
import { ContentService, ContentBlock, CreateContentBlockData } from '../../services/admin/content.service'

interface ContentFormData extends CreateContentBlockData {
  id?: string
}

export function AdminContent() {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentBlock | null>(null)
  const [sectionFilter, setSectionFilter] = useState<string>('all')

  const [formData, setFormData] = useState<ContentFormData>({
    type: 'hero',
    section: 'landing',
    title: '',
    content: '',
    button_text: '',
    button_link: '',
    visible: true,
    priority: 0
  })

  useEffect(() => {
    loadContent()
  }, [sectionFilter])

  const loadContent = async () => {
    try {
      setLoading(true)
      const data = await ContentService.getAllContentBlocks({
        section: sectionFilter === 'all' ? undefined : sectionFilter
      })
      setContentBlocks(data)
    } catch (err) {
      console.error('Failed to load content:', err)
      setError('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingContent) {
        const { id, ...updateData } = formData
        await ContentService.updateContentBlock(editingContent.id, updateData)
      } else {
        await ContentService.createContentBlock(formData)
      }
      
      resetForm()
      loadContent()
    } catch (err) {
      console.error('Failed to save content:', err)
      setError('Failed to save content')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content block?')) return

    try {
      await ContentService.deleteContentBlock(id)
      loadContent()
    } catch (err) {
      console.error('Failed to delete content:', err)
      setError('Failed to delete content')
    }
  }

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    try {
      await ContentService.toggleContentVisibility(id, visible)
      loadContent()
    } catch (err) {
      console.error('Failed to toggle visibility:', err)
      setError('Failed to toggle visibility')
    }
  }

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentBlock = contentBlocks.find(b => b.id === id)
    if (!currentBlock) return

    const newPriority = direction === 'up' ? currentBlock.priority - 1 : currentBlock.priority + 1
    
    try {
      await ContentService.reorderContentBlock(id, newPriority)
      loadContent()
    } catch (err) {
      console.error('Failed to reorder content:', err)
      setError('Failed to reorder content')
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'hero',
      section: 'landing',
      title: '',
      content: '',
      button_text: '',
      button_link: '',
      visible: true,
      priority: 0
    })
    setEditingContent(null)
    setShowForm(false)
  }

  const startEdit = (content: ContentBlock) => {
    setFormData({
      type: content.type,
      section: content.section,
      title: content.title || '',
      content: content.content,
      button_text: content.button_text || '',
      button_link: content.button_link || '',
      visible: content.visible,
      priority: content.priority
    })
    setEditingContent(content)
    setShowForm(true)
  }

  const getTypeIcon = (type: ContentBlock['type']) => {
    switch (type) {
      case 'hero': return <Globe className="w-4 h-4" />
      case 'notification': return <Bell className="w-4 h-4" />
      case 'feature': return <Award className="w-4 h-4" />
      case 'testimonial': return <Users className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: ContentBlock['type']) => {
    switch (type) {
      case 'hero': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'notification': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'feature': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'testimonial': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Content Management</h1>
          <p className="text-text-muted mt-1">Manage landing page content, notifications, and features</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Content</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-300 hover:text-red-200 text-sm mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <Search className="text-text-muted w-4 h-4" />
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Sections</option>
            <option value="landing">Landing Page</option>
            <option value="dashboard">Dashboard</option>
            <option value="contests">Contests</option>
            <option value="brands">Brands</option>
            <option value="education">Education Hub</option>
          </select>
        </div>
      </div>

      {/* Content Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingContent ? 'Edit Content Block' : 'Create Content Block'}
              </h2>
              <button
                onClick={resetForm}
                className="text-text-muted hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ContentBlock['type'] })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="hero">Hero Section</option>
                    <option value="notification">Notification</option>
                    <option value="feature">Feature</option>
                    <option value="testimonial">Testimonial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Section *
                  </label>
                  <select
                    required
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="landing">Landing Page</option>
                    <option value="dashboard">Dashboard</option>
                    <option value="contests">Contests</option>
                    <option value="brands">Brands</option>
                    <option value="education">Education Hub</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Priority
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="Display order"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
                  placeholder="Content title"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Content *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
                  placeholder="Enter content text, HTML, or Markdown"
                />
                <p className="text-text-muted text-xs mt-1">
                  Supports HTML and Markdown formatting
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
                    placeholder="Button text (optional)"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
                    placeholder="/path or https://example.com"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="visible"
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  className="w-4 h-4 text-purple-500 bg-background border-border rounded focus:ring-purple-500"
                />
                <label htmlFor="visible" className="text-white text-sm">
                  Visible on website
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-border text-text-muted hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  {editingContent ? 'Update Content' : 'Create Content'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-background/50 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        ) : contentBlocks.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">No content blocks found</h3>
            <p className="text-text-muted mb-4">
              {sectionFilter !== 'all' 
                ? 'No content for this section' 
                : 'Create your first content block to get started'
              }
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Content
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {contentBlocks.map((content) => (
              <div key={content.id} className="p-6 hover:bg-surface/70 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {content.title && (
                        <h3 className="text-lg font-semibold text-white">{content.title}</h3>
                      )}
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getTypeColor(content.type)}`}>
                        {getTypeIcon(content.type)}
                        <span className="capitalize">{content.type}</span>
                      </div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                        {content.section}
                      </span>
                      {!content.visible && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                          Hidden
                        </span>
                      )}
                    </div>
                    
                    <div className="text-text-muted text-sm mb-3 line-clamp-3">
                      {content.content.length > 200 
                        ? `${content.content.substring(0, 200)}...` 
                        : content.content
                      }
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div>
                        <span className="text-text-muted">Priority: </span>
                        <span className="text-white font-semibold">{content.priority}</span>
                      </div>
                      {content.button_text && (
                        <div>
                          <span className="text-text-muted">Button: </span>
                          <span className="text-purple-400">{content.button_text}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-text-muted">Updated: </span>
                        <span className="text-white">
                          {new Date(content.updated_at).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleReorder(content.id, 'up')}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReorder(content.id, 'down')}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(content.id, !content.visible)}
                      className={`p-2 rounded-lg transition-colors ${
                        content.visible 
                          ? 'text-yellow-400 hover:bg-yellow-500/20' 
                          : 'text-green-400 hover:bg-green-500/20'
                      }`}
                      title={content.visible ? 'Hide content' : 'Show content'}
                    >
                      {content.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => startEdit(content)}
                      className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors"
                      title="Edit content"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Delete content"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => {
            setFormData({ ...formData, type: 'notification', section: 'landing', title: 'Platform Update' })
            setShowForm(true)
          }}
          className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl hover:bg-yellow-500/20 transition-colors"
        >
          <Bell className="w-6 h-6 text-yellow-400 mb-2" />
          <h3 className="text-white font-medium">Add Notification</h3>
          <p className="text-text-muted text-sm">Quick platform update</p>
        </button>
        
        <button
          onClick={() => {
            setFormData({ ...formData, type: 'feature', section: 'landing', title: 'New Feature' })
            setShowForm(true)
          }}
          className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl hover:bg-purple-500/20 transition-colors"
        >
          <Award className="w-6 h-6 text-purple-400 mb-2" />
          <h3 className="text-white font-medium">Add Feature</h3>
          <p className="text-text-muted text-sm">Highlight platform feature</p>
        </button>
        
        <button
          onClick={() => {
            setFormData({ ...formData, type: 'hero', section: 'landing', title: 'Hero Section' })
            setShowForm(true)
          }}
          className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl hover:bg-blue-500/20 transition-colors"
        >
          <Globe className="w-6 h-6 text-blue-400 mb-2" />
          <h3 className="text-white font-medium">Update Hero</h3>
          <p className="text-text-muted text-sm">Landing page hero text</p>
        </button>
        
        <button
          onClick={() => {
            setFormData({ ...formData, type: 'testimonial', section: 'landing', title: 'User Testimonial' })
            setShowForm(true)
          }}
          className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl hover:bg-green-500/20 transition-colors"
        >
          <Users className="w-6 h-6 text-green-400 mb-2" />
          <h3 className="text-white font-medium">Add Testimonial</h3>
          <p className="text-text-muted text-sm">User success story</p>
        </button>
      </div>
    </div>
  )
}