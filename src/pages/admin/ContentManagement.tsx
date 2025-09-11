import { useState } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  FileText,
  Bell,
  Save
} from 'lucide-react'

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
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    // Mock data - will be replaced with real API calls
    {
      id: '1',
      section: 'updates',
      title: '1000 pierwszych użytkowników otrzyma bonusowe punkty XP',
      content: 'Pierwsze 1000 użytkowników, którzy założą konto na SeeUTrending otrzyma bonusowe punkty które zwiększają szansę na zdobycie niektórych odznak i nagród, takich jak wejścia na imprezy.',
      priority: 1,
      visible: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      section: 'updates',
      title: 'Pierwszy konkurs na żywo już wkrótce!',
      content: 'Przygotowujemy pierwszy konkurs z prawdziwymi nagrodami i możliwością zdobycia prestiżowych odznak. Szykuj swoją kreatywność!',
      priority: 2,
      visible: true,
      created_at: '2024-01-02T00:00:00Z'
    }
  ])
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 1,
    visible: true
  })

  const handleEdit = (block: ContentBlock) => {
    setEditingBlock(block)
    setFormData({
      title: block.title,
      content: block.content,
      priority: block.priority,
      visible: block.visible
    })
    setIsEditModalOpen(true)
  }

  const handleCreate = () => {
    setEditingBlock(null)
    setFormData({
      title: '',
      content: '',
      priority: 1,
      visible: true
    })
    setIsEditModalOpen(true)
  }

  const handleSave = () => {
    if (editingBlock) {
      // Update existing block
      setContentBlocks(prev => 
        prev.map(block => 
          block.id === editingBlock.id 
            ? { ...block, ...formData }
            : block
        )
      )
    } else {
      // Create new block
      const newBlock: ContentBlock = {
        id: Date.now().toString(),
        section: 'updates',
        ...formData,
        created_at: new Date().toISOString()
      }
      setContentBlocks(prev => [...prev, newBlock])
    }
    setIsEditModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content block?')) {
      setContentBlocks(prev => prev.filter(block => block.id !== id))
    }
  }

  const toggleVisibility = (id: string) => {
    setContentBlocks(prev => 
      prev.map(block => 
        block.id === id 
          ? { ...block, visible: !block.visible }
          : block
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Content Management</h1>
          <p className="text-text-muted mt-1">Manage landing page notifications and content blocks</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Content</span>
        </button>
      </div>

      {/* Content Blocks */}
      <div className="space-y-4">
        {contentBlocks
          .sort((a, b) => a.priority - b.priority)
          .map((block) => (
            <div
              key={block.id}
              className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-1 bg-purple-500/20 rounded">
                      <Bell className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white text-lg">{block.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        Priority: {block.priority}
                      </span>
                      {block.visible ? (
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
                  
                  <p className="text-text-muted mb-3 leading-relaxed">{block.content}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-text-muted">
                    <span>Section: {block.section}</span>
                    <span>•</span>
                    <span>Created: {new Date(block.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleVisibility(block.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      block.visible 
                        ? 'text-green-400 hover:bg-green-500/10' 
                        : 'text-red-400 hover:bg-red-500/10'
                    }`}
                    title={block.visible ? 'Hide' : 'Show'}
                  >
                    {block.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => handleEdit(block)}
                    className="p-2 hover:bg-surface rounded-lg text-text-muted hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(block.id)}
                    className="p-2 hover:bg-surface rounded-lg text-text-muted hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Edit/Create Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-white">
                {editingBlock ? 'Edit Content Block' : 'Create Content Block'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
                  placeholder="Enter content title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary resize-vertical"
                  placeholder="Enter content description"
                />
              </div>
              
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
                <span>{editingBlock ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Live Preview</span>
        </h2>
        
        <div className="space-y-3">
          {contentBlocks
            .filter(block => block.visible)
            .sort((a, b) => a.priority - b.priority)
            .map((block) => (
              <div key={block.id} className="p-4 bg-background/50 rounded-lg border border-border">
                <h3 className="font-semibold text-white mb-2">{block.title}</h3>
                <p className="text-text-muted text-sm">{block.content}</p>
              </div>
            ))}
        </div>
        
        {contentBlocks.filter(block => block.visible).length === 0 && (
          <div className="text-center py-8 text-text-muted">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No visible content blocks</p>
          </div>
        )}
      </div>
    </div>
  )
}