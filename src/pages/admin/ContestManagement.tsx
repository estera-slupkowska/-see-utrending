import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Play,
  Pause,
  Eye,
  Trophy,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react'
import { ContestCreationForm } from '../../components/admin/ContestCreationForm'
import { ContestsService } from '../../services/admin/contests.service'

interface Contest {
  id: string
  title: string
  description: string
  brand_name: string
  hashtag: string
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  start_date: string
  end_date: string
  total_submissions: number
  first_prize: string
  created_at: string
}

export function ContestManagement() {
  const navigate = useNavigate()
  const [contests, setContests] = useState<Contest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load contests from database
  const loadContests = async () => {
    try {
      setIsLoading(true)
      const data = await ContestsService.getContests()
      setContests(data)
    } catch (error) {
      console.error('Failed to load contests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load contests on mount
  useEffect(() => {
    loadContests()
  }, [])

  // Handle successful contest creation
  const handleContestCreated = () => {
    loadContests()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />
      case 'draft':
        return <Edit className="w-4 h-4" />
      case 'completed':
        return <Trophy className="w-4 h-4" />
      case 'cancelled':
        return <Pause className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Contest Management</h1>
          <p className="text-text-muted mt-1">Create and manage TikTok contests</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/contests/preview')}
            className="flex items-center space-x-2 px-6 py-3 bg-surface hover:bg-surface-light text-white font-medium rounded-lg transition-colors border border-primary/30"
          >
            <Eye className="w-5 h-5" />
            <span>Preview Demo Contest</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Contest</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Play className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-text-muted text-sm">Active</p>
            </div>
          </div>
        </div>
        
        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Edit className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-text-muted text-sm">Draft</p>
            </div>
          </div>
        </div>
        
        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-text-muted text-sm">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-text-muted text-sm">Total Participants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search contests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contests List */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-lg">
        {contests.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">No contests yet</h3>
            <p className="text-text-muted mb-6">Create your first contest to get started</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
            >
              Create Contest
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-4 text-text-muted font-medium">Contest</th>
                  <th className="text-left p-4 text-text-muted font-medium">Brand</th>
                  <th className="text-left p-4 text-text-muted font-medium">Status</th>
                  <th className="text-left p-4 text-text-muted font-medium">Period</th>
                  <th className="text-left p-4 text-text-muted font-medium">Submissions</th>
                  <th className="text-left p-4 text-text-muted font-medium">Prize</th>
                  <th className="text-left p-4 text-text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contests.map((contest) => (
                  <tr key={contest.id} className="border-b border-border hover:bg-surface/30">
                    <td className="p-4">
                      <div>
                        <h3 className="font-medium text-white">{contest.title}</h3>
                        <p className="text-sm text-text-muted">#{contest.hashtag}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white">{contest.brand_name || 'SeeUTrending'}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(contest.status)}`}>
                        {getStatusIcon(contest.status)}
                        <span className="capitalize">{contest.status}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-white">{new Date(contest.start_date).toLocaleDateString()}</p>
                        <p className="text-text-muted">{new Date(contest.end_date).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white font-medium">{contest.total_submissions}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-white">{contest.first_prize}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-surface rounded-lg text-text-muted hover:text-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-surface rounded-lg text-text-muted hover:text-white transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-surface rounded-lg text-text-muted hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-surface rounded-lg text-text-muted hover:text-white transition-colors">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Contest Form */}
      {isCreateModalOpen && (
        <ContestCreationForm
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleContestCreated}
        />
      )}
    </div>
  )
}