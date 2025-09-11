import { useState, useEffect } from 'react'
import { 
  Trophy, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
  XCircle,
  Play,
  Pause
} from 'lucide-react'
import { ContestsService, Contest, CreateContestData } from '../../services/admin/contests.service'
import { useAuth } from '../../lib/auth/context'

interface ContestFormData extends CreateContestData {
  id?: string
}

export function AdminContests() {
  const { user } = useAuth()
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingContest, setEditingContest] = useState<Contest | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const [formData, setFormData] = useState<ContestFormData>({
    title: '',
    description: '',
    brand_name: '',
    brand_email: '',
    hashtag: '',
    additional_rules: '',
    min_followers: 0,
    first_prize: '',
    second_prize: '',
    third_prize: '',
    participation_reward: 0,
    start_date: '',
    end_date: '',
    submission_deadline: '',
    max_participants: 0,
    featured: false
  })

  useEffect(() => {
    loadContests()
  }, [searchTerm, statusFilter])

  const loadContests = async () => {
    try {
      setLoading(true)
      const data = await ContestsService.getContests({
        status: statusFilter,
        search: searchTerm || undefined,
        limit: 100
      })
      setContests(data)
    } catch (err) {
      console.error('Failed to load contests:', err)
      setError('Failed to load contests')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    try {
      if (editingContest) {
        const { id, ...updateData } = formData
        await ContestsService.updateContest(editingContest.id, updateData)
      } else {
        await ContestsService.createContest(formData, user.id)
      }
      
      resetForm()
      loadContests()
    } catch (err) {
      console.error('Failed to save contest:', err)
      setError('Failed to save contest')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contest?')) return

    try {
      await ContestsService.deleteContest(id)
      loadContests()
    } catch (err) {
      console.error('Failed to delete contest:', err)
      setError('Failed to delete contest')
    }
  }

  const handleStatusChange = async (id: string, status: Contest['status']) => {
    try {
      await ContestsService.updateContestStatus(id, status)
      loadContests()
    } catch (err) {
      console.error('Failed to update contest status:', err)
      setError('Failed to update contest status')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      brand_name: '',
      brand_email: '',
      hashtag: '',
      additional_rules: '',
      min_followers: 0,
      first_prize: '',
      second_prize: '',
      third_prize: '',
      participation_reward: 0,
      start_date: '',
      end_date: '',
      submission_deadline: '',
      max_participants: 0,
      featured: false
    })
    setEditingContest(null)
    setShowForm(false)
  }

  const startEdit = (contest: Contest) => {
    setFormData({
      title: contest.title,
      description: contest.description,
      brand_name: contest.brand_name || '',
      brand_email: contest.brand_email || '',
      hashtag: contest.hashtag,
      additional_rules: contest.additional_rules || '',
      min_followers: contest.min_followers || 0,
      first_prize: contest.first_prize || '',
      second_prize: contest.second_prize || '',
      third_prize: contest.third_prize || '',
      participation_reward: contest.participation_reward || 0,
      start_date: contest.start_date.split('T')[0],
      end_date: contest.end_date.split('T')[0],
      submission_deadline: contest.submission_deadline?.split('T')[0] || '',
      max_participants: contest.max_participants || 0,
      featured: contest.featured || false
    })
    setEditingContest(contest)
    setShowForm(true)
  }

  const getStatusIcon = (status: Contest['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'draft': return <Clock className="w-4 h-4 text-yellow-400" />
      case 'completed': return <Trophy className="w-4 h-4 text-blue-400" />
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-400" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: Contest['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Contest Management</h1>
          <p className="text-text-muted mt-1">Create and manage contests on your platform</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Contest</span>
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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search contests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-text-muted w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contest Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingContest ? 'Edit Contest' : 'Create Contest'}
              </h2>
              <button
                onClick={resetForm}
                className="text-text-muted hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Contest Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
                    placeholder="Enter contest title"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Hashtag *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hashtag}
                    onChange={(e) => setFormData({ ...formData, hashtag: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
                    placeholder="#contesthashtag"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
                  placeholder="Describe the contest rules and requirements"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={formData.brand_name}
                    onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
                    placeholder="Brand or sponsor name"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Brand Email
                  </label>
                  <input
                    type="email"
                    value={formData.brand_email}
                    onChange={(e) => setFormData({ ...formData, brand_email: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
                    placeholder="brand@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Submission Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.submission_deadline}
                    onChange={(e) => setFormData({ ...formData, submission_deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    First Prize
                  </label>
                  <input
                    type="text"
                    value={formData.first_prize}
                    onChange={(e) => setFormData({ ...formData, first_prize: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
                    placeholder="e.g., 5000 PLN"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Second Prize
                  </label>
                  <input
                    type="text"
                    value={formData.second_prize}
                    onChange={(e) => setFormData({ ...formData, second_prize: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
                    placeholder="e.g., 2000 PLN"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Third Prize
                  </label>
                  <input
                    type="text"
                    value={formData.third_prize}
                    onChange={(e) => setFormData({ ...formData, third_prize: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
                    placeholder="e.g., 1000 PLN"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Min Followers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.min_followers}
                    onChange={(e) => setFormData({ ...formData, min_followers: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Participation Reward (XP)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.participation_reward}
                    onChange={(e) => setFormData({ ...formData, participation_reward: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Additional Rules
                </label>
                <textarea
                  rows={2}
                  value={formData.additional_rules}
                  onChange={(e) => setFormData({ ...formData, additional_rules: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
                  placeholder="Any additional rules or requirements"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-purple-500 bg-background border-border rounded focus:ring-purple-500"
                />
                <label htmlFor="featured" className="text-white text-sm">
                  Featured contest (will be highlighted)
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
                  {editingContest ? 'Update Contest' : 'Create Contest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contests List */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-background/50 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">No contests found</h3>
            <p className="text-text-muted mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first contest to get started'
              }
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Create Contest
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {contests.map((contest) => (
              <div key={contest.id} className="p-6 hover:bg-surface/70 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{contest.title}</h3>
                      {contest.featured && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                          Featured
                        </span>
                      )}
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(contest.status)}`}>
                        {getStatusIcon(contest.status)}
                        <span className="capitalize">{contest.status}</span>
                      </div>
                    </div>
                    <p className="text-text-muted text-sm mb-3 line-clamp-2">{contest.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="text-text-muted">
                          {new Date(contest.start_date).toLocaleDateString('pl-PL')} - {new Date(contest.end_date).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-text-muted">{contest.first_prize || 'No prize set'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-text-muted">{contest.total_submissions || 0} submissions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-green-400" />
                        <span className="text-text-muted">{contest.total_views || 0} views</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {contest.status === 'draft' && (
                      <button
                        onClick={() => handleStatusChange(contest.id, 'active')}
                        className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                        title="Activate contest"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    {contest.status === 'active' && (
                      <button
                        onClick={() => handleStatusChange(contest.id, 'completed')}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="Complete contest"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(contest)}
                      className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors"
                      title="Edit contest"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contest.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Delete contest"
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
    </div>
  )
}