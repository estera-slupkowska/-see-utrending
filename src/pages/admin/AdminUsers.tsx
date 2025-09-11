import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter,
  Edit,
  Shield,
  ShieldCheck,
  Award,
  TrendingUp,
  Download,
  Eye,
  UserCheck,
  UserX,
  Crown,
  Star
} from 'lucide-react'
import { UsersService, UserProfile, UserStats } from '../../services/admin/users.service'

export function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    loadUsers()
    loadStats()
  }, [searchTerm, roleFilter])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await UsersService.getUsers({
        role: roleFilter,
        search: searchTerm || undefined,
        limit: 100,
        orderBy: 'created_at',
        ascending: false
      })
      setUsers(data)
    } catch (err) {
      console.error('Failed to load users:', err)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await UsersService.getUserStats()
      setStats(statsData)
    } catch (err) {
      console.error('Failed to load user stats:', err)
    }
  }

  const handleRoleUpdate = async (userId: string, role: UserProfile['role']) => {
    try {
      await UsersService.updateUserRole(userId, role)
      loadUsers()
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, role })
      }
    } catch (err) {
      console.error('Failed to update user role:', err)
      setError('Failed to update user role')
    }
  }

  const handleVerificationUpdate = async (userId: string, verified: boolean) => {
    try {
      await UsersService.updateUserVerification(userId, verified)
      loadUsers()
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, verified })
      }
    } catch (err) {
      console.error('Failed to update user verification:', err)
      setError('Failed to update user verification')
    }
  }

  const handleXPUpdate = async (userId: string, xpPoints: number) => {
    try {
      await UsersService.updateUserXP(userId, xpPoints)
      loadUsers()
      loadStats() // Refresh stats to show updated averages
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, xp_points: xpPoints })
      }
    } catch (err) {
      console.error('Failed to update user XP:', err)
      setError('Failed to update user XP')
    }
  }

  const exportUsers = async () => {
    try {
      const data = await UsersService.exportUsers({
        role: roleFilter === 'all' ? undefined : roleFilter
      })
      
      // Convert to CSV and download
      const headers = ['Email', 'Name', 'Role', 'XP Points', 'Level', 'Verified', 'Created At']
      const csvContent = [
        headers.join(','),
        ...data.map(user => [
          user.email,
          user.name || '',
          user.role,
          user.xp_points,
          user.level,
          user.verified ? 'Yes' : 'No',
          new Date(user.created_at).toLocaleDateString('pl-PL')
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export users:', err)
      setError('Failed to export users')
    }
  }

  const openUserModal = async (user: UserProfile) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const getRoleBadgeColor = (role: UserProfile['role']) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'creator': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'brand': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'spectator': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getRoleIcon = (role: UserProfile['role']) => {
    switch (role) {
      case 'admin': return <Crown className="w-3 h-3" />
      case 'creator': return <Star className="w-3 h-3" />
      case 'brand': return <Award className="w-3 h-3" />
      case 'spectator': return <Eye className="w-3 h-3" />
      default: return <Users className="w-3 h-3" />
    }
  }

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-yellow-400'
    if (level >= 5) return 'text-purple-400'
    if (level >= 3) return 'text-blue-400'
    return 'text-green-400'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">User Management</h1>
          <p className="text-text-muted mt-1">Manage platform users and their permissions</p>
        </div>
        <button
          onClick={exportUsers}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Users</span>
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

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-green-400 text-sm font-medium">
                +{stats.newUsersThisWeek} this week
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-text-muted text-sm">Total Users</p>
          </div>

          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <span className="text-blue-400 text-sm font-medium">
                {stats.activeUsers} active
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.newUsersToday}</p>
            <p className="text-text-muted text-sm">New Today</p>
          </div>

          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">
                {stats.byRole.creators} creators
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.averageXP.toLocaleString()}</p>
            <p className="text-text-muted text-sm">Average XP</p>
          </div>

          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">
                {users.filter(u => u.verified).length} verified
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.byRole.admins}</p>
            <p className="text-text-muted text-sm">Admins</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name, email, or TikTok handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-text-muted w-4 h-4" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Roles</option>
              <option value="creator">Creators</option>
              <option value="brand">Brands</option>
              <option value="spectator">Spectators</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top Users */}
      {stats?.topUsers && stats.topUsers.length > 0 && (
        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Top Users by XP</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topUsers.slice(0, 6).map((user, index) => (
              <div key={user.id} className="flex items-center space-x-3 p-3 bg-background/20 rounded-lg">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                  index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                  index === 1 ? 'bg-gray-400/20 text-gray-300' :
                  index === 2 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{user.name}</p>
                  <p className="text-text-muted text-xs">Level {user.level} • {user.xp_points.toLocaleString()} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-background/50 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
            <p className="text-text-muted">
              {searchTerm || roleFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No users have registered yet'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div key={user.id} className="p-6 hover:bg-surface/70 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name || 'User avatar'}
                          className="w-12 h-12 rounded-full bg-purple-500/20"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {user.name || user.email.split('@')[0]}
                        </h3>
                        {user.verified && (
                          <ShieldCheck className="w-4 h-4 text-green-400" title="Verified user" />
                        )}
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getRoleBadgeColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </div>
                      </div>
                      
                      <p className="text-text-muted text-sm mb-2">{user.email}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-text-muted">Level: </span>
                          <span className={`font-semibold ${getLevelColor(user.level)}`}>
                            {user.level}
                          </span>
                        </div>
                        <div>
                          <span className="text-text-muted">XP: </span>
                          <span className="text-white font-semibold">
                            {user.xp_points.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-text-muted">Followers: </span>
                          <span className="text-white font-semibold">
                            {user.total_followers.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-text-muted">Joined: </span>
                          <span className="text-white">
                            {new Date(user.created_at).toLocaleDateString('pl-PL')}
                          </span>
                        </div>
                      </div>

                      {user.tiktok_handle && (
                        <div className="mt-2">
                          <span className="text-text-muted text-sm">TikTok: </span>
                          <span className="text-purple-400 text-sm">@{user.tiktok_handle}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => openUserModal(user)}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleVerificationUpdate(user.id, !user.verified)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.verified 
                          ? 'text-yellow-400 hover:bg-yellow-500/20' 
                          : 'text-green-400 hover:bg-green-500/20'
                      }`}
                      title={user.verified ? 'Unverify user' : 'Verify user'}
                    >
                      {user.verified ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-text-muted hover:text-white"
              >
                <Users className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-start space-x-4">
                {selectedUser.avatar_url ? (
                  <img
                    src={selectedUser.avatar_url}
                    alt={selectedUser.name || 'User avatar'}
                    className="w-16 h-16 rounded-full bg-purple-500/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-purple-400" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {selectedUser.name || selectedUser.email.split('@')[0]}
                  </h3>
                  <p className="text-text-muted mb-2">{selectedUser.email}</p>
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm border ${getRoleBadgeColor(selectedUser.role)}`}>
                      {getRoleIcon(selectedUser.role)}
                      <span className="capitalize">{selectedUser.role}</span>
                    </div>
                    {selectedUser.verified && (
                      <div className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Role Management */}
              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Role Management</h4>
                <div className="flex flex-wrap gap-2">
                  {(['creator', 'brand', 'spectator', 'admin'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleUpdate(selectedUser.id, role)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        selectedUser.role === role
                          ? getRoleBadgeColor(role)
                          : 'bg-background/50 text-text-muted border-border hover:bg-surface/50'
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* XP Management */}
              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">XP Management</h4>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="0"
                    defaultValue={selectedUser.xp_points}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-purple-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const newXP = parseInt((e.target as HTMLInputElement).value)
                        if (!isNaN(newXP) && newXP >= 0) {
                          handleXPUpdate(selectedUser.id, newXP)
                        }
                      }
                    }}
                  />
                  <span className="text-text-muted text-sm">XP Points</span>
                </div>
                <p className="text-text-muted text-sm mt-2">
                  Current Level: <span className={`font-semibold ${getLevelColor(selectedUser.level)}`}>
                    {selectedUser.level}
                  </span>
                </p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-2">Account Info</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-text-muted">Streak: </span>
                      <span className="text-white">{selectedUser.streak_days} days</span>
                    </div>
                    <div>
                      <span className="text-text-muted">Last Active: </span>
                      <span className="text-white">
                        {selectedUser.last_activity_date 
                          ? new Date(selectedUser.last_activity_date).toLocaleDateString('pl-PL')
                          : 'Never'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/50 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-2">TikTok Info</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-text-muted">Handle: </span>
                      <span className="text-purple-400">
                        {selectedUser.tiktok_handle ? `@${selectedUser.tiktok_handle}` : 'Not connected'}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted">Followers: </span>
                      <span className="text-white">{selectedUser.total_followers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedUser.bio && (
                <div className="bg-background/50 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-2">Bio</h5>
                  <p className="text-text-muted text-sm">{selectedUser.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}