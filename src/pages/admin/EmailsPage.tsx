import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Mail,
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
  Clock,
  X,
  CheckCircle,
  XCircle,
  MousePointer,
  BarChart3,
  TestTube
} from 'lucide-react'
import { EmailService, EmailCampaign, CampaignStats } from '../../services/admin/email.service'

export function EmailsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [overallStats, setOverallStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null)
  const [campaignStats, setCampaignStats] = useState<Record<string, CampaignStats>>({})

  // Composer form state
  const [formData, setFormData] = useState({
    subject: '',
    preview_text: '',
    html_content: '',
    plain_text_content: '',
    from_name: 'SeeUTrending',
    from_email: 'noreply@seeutrending.com',
    reply_to: '',
    target_all_users: true,
    target_roles: [] as string[],
    scheduled_at: ''
  })

  // Test email state
  const [testEmailAddress, setTestEmailAddress] = useState('')
  const [sendingTest, setSendingTest] = useState(false)

  useEffect(() => {
    loadCampaigns()
    loadOverallStats()

    // Open composer if ?new=true in URL
    if (searchParams.get('new') === 'true') {
      setIsComposerOpen(true)
      setSearchParams({}) // Clear URL param
    }
  }, [statusFilter])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await EmailService.getCampaigns({
        status: statusFilter === 'all' ? undefined : statusFilter as any,
        limit: 50
      })

      setCampaigns(data)

      // Load stats for each campaign
      const statsPromises = data.map(campaign =>
        EmailService.getCampaignStats(campaign.id).catch(() => null)
      )
      const stats = await Promise.all(statsPromises)

      const statsMap: Record<string, CampaignStats> = {}
      data.forEach((campaign, index) => {
        if (stats[index]) {
          statsMap[campaign.id] = stats[index]
        }
      })
      setCampaignStats(statsMap)

    } catch (err) {
      console.error('Failed to load campaigns:', err)
      setError('Failed to load email campaigns')
    } finally {
      setLoading(false)
    }
  }

  const loadOverallStats = async () => {
    try {
      const stats = await EmailService.getOverallStats()
      setOverallStats(stats)
    } catch (err) {
      console.error('Failed to load overall stats:', err)
    }
  }

  const handleCreateCampaign = async () => {
    try {
      setError(null)

      // Build target audience
      const target_audience = formData.target_all_users
        ? { all: true }
        : { roles: formData.target_roles }

      await EmailService.createCampaign({
        subject: formData.subject,
        preview_text: formData.preview_text,
        html_content: formData.html_content,
        plain_text_content: formData.plain_text_content,
        from_name: formData.from_name,
        from_email: formData.from_email,
        reply_to: formData.reply_to || undefined,
        target_audience,
        scheduled_at: formData.scheduled_at || undefined
      })

      setIsComposerOpen(false)
      resetForm()
      loadCampaigns()
      loadOverallStats()
    } catch (err) {
      console.error('Failed to create campaign:', err)
      setError('Failed to create email campaign')
    }
  }

  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this email campaign? This action cannot be undone.')) return

    try {
      setError(null)
      const result = await EmailService.sendCampaign(campaignId)
      alert(`Campaign sent! ${result.sent} of ${result.total} emails sent successfully.`)
      loadCampaigns()
      loadOverallStats()
    } catch (err) {
      console.error('Failed to send campaign:', err)
      setError('Failed to send campaign')
      alert('Failed to send campaign. Please try again.')
    }
  }

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign? This will also delete all tracking data.')) return

    try {
      await EmailService.deleteCampaign(id)
      loadCampaigns()
      loadOverallStats()
    } catch (err) {
      console.error('Failed to delete campaign:', err)
      setError('Failed to delete campaign')
    }
  }

  const handleSendTestEmail = async (campaignId: string) => {
    if (!testEmailAddress) {
      alert('Please enter a test email address')
      return
    }

    try {
      setSendingTest(true)
      await EmailService.sendTestEmail(campaignId, testEmailAddress)
      alert(`Test email sent to ${testEmailAddress}`)
      setTestEmailAddress('')
    } catch (err) {
      console.error('Failed to send test email:', err)
      alert('Failed to send test email')
    } finally {
      setSendingTest(false)
    }
  }

  const resetForm = () => {
    setFormData({
      subject: '',
      preview_text: '',
      html_content: '',
      plain_text_content: '',
      from_name: 'SeeUTrending',
      from_email: 'noreply@seeutrending.com',
      reply_to: '',
      target_all_users: true,
      target_roles: [],
      scheduled_at: ''
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'sending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'scheduled':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Check if in dev mode (no Resend API key)
  const isDevMode = !import.meta.env.VITE_RESEND_API_KEY

  return (
    <div className="space-y-6">
      {/* Dev Mode Banner */}
      {isDevMode && (
        <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <TestTube className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-yellow-400 font-semibold mb-1">Development Mode Active</h3>
              <p className="text-yellow-400/80 text-sm">
                Email campaigns will be simulated without actually sending emails. All UI features are fully functional - campaigns will be marked as sent in the database, but no real emails will be delivered. Check the browser console to see simulated email details.
              </p>
              <p className="text-yellow-400/60 text-xs mt-2">
                To enable real email sending, add your Resend API key to .env.local: <code className="bg-black/30 px-2 py-1 rounded">VITE_RESEND_API_KEY=your_key</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Email Campaigns</h1>
          <p className="text-text-muted mt-1">Send newsletters and bulk emails to your users with tracking</p>
        </div>
        <button
          onClick={() => setIsComposerOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Stats Grid */}
      {overallStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{overallStats.totalCampaigns}</p>
            <p className="text-text-muted text-sm">Total Campaigns</p>
          </div>

          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Send className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{overallStats.totalSent.toLocaleString()}</p>
            <p className="text-text-muted text-sm">Emails Sent</p>
          </div>

          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{overallStats.averageOpenRate.toFixed(1)}%</p>
            <p className="text-text-muted text-sm">Average Open Rate</p>
          </div>

          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <MousePointer className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{overallStats.averageClickRate.toFixed(1)}%</p>
            <p className="text-text-muted text-sm">Average Click Rate</p>
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
              placeholder="Search campaigns..."
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
              <option value="draft">Drafts</option>
              <option value="scheduled">Scheduled</option>
              <option value="sending">Sending</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Campaigns List */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-muted">Loading campaigns...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
            <p className="text-text-muted mb-2">No email campaigns found</p>
            <button
              onClick={() => setIsComposerOpen(true)}
              className="text-primary hover:underline"
            >
              Create your first campaign
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => {
              const stats = campaignStats[campaign.id]
              return (
                <div
                  key={campaign.id}
                  className="flex items-start justify-between p-4 bg-background/50 rounded-lg border border-border hover:border-border-light transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{campaign.subject}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>

                    {campaign.preview_text && (
                      <p className="text-text-secondary text-sm mb-3">{campaign.preview_text}</p>
                    )}

                    <div className="flex items-center space-x-6 text-sm text-text-muted">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{campaign.total_recipients} recipients</span>
                      </div>
                      {campaign.status === 'sent' && stats && (
                        <>
                          <div className="flex items-center space-x-1">
                            <Send className="w-4 h-4" />
                            <span>{campaign.total_sent} sent</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{stats.total_opened} opened ({stats.open_rate.toFixed(1)}%)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MousePointer className="w-4 h-4" />
                            <span>{stats.total_clicked} clicked ({stats.click_rate.toFixed(1)}%)</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {campaign.sent_at
                            ? `Sent ${new Date(campaign.sent_at).toLocaleDateString()}`
                            : campaign.scheduled_at
                            ? `Scheduled ${new Date(campaign.scheduled_at).toLocaleDateString()}`
                            : `Created ${new Date(campaign.created_at).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                    </div>

                    {/* Test Email for Drafts */}
                    {campaign.status === 'draft' && (
                      <div className="mt-4 flex items-center space-x-2">
                        <input
                          type="email"
                          placeholder="test@example.com"
                          value={selectedCampaign?.id === campaign.id ? testEmailAddress : ''}
                          onChange={(e) => {
                            setTestEmailAddress(e.target.value)
                            setSelectedCampaign(campaign)
                          }}
                          className="flex-1 max-w-xs px-3 py-1.5 text-sm bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={() => handleSendTestEmail(campaign.id)}
                          disabled={sendingTest || !testEmailAddress}
                          className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <TestTube className="w-3.5 h-3.5" />
                          <span>Send Test</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                      <button
                        onClick={() => handleSendCampaign(campaign.id)}
                        className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                        title="Send Campaign"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    {campaign.status !== 'sending' && (
                      <button
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Email Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Create Email Campaign</h2>
              <button
                onClick={() => { setIsComposerOpen(false); resetForm(); }}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your amazing subject line..."
                />
              </div>

              {/* Preview Text */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Preview Text (optional)</label>
                <input
                  type="text"
                  value={formData.preview_text}
                  onChange={(e) => setFormData({ ...formData, preview_text: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Appears in email preview..."
                />
                <p className="text-xs text-text-muted mt-1">This text appears in email clients before opening</p>
              </div>

              {/* HTML Content */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email Content (HTML) *</label>
                <textarea
                  value={formData.html_content}
                  onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="<div>Your HTML email content here...</div>"
                />
                <p className="text-xs text-text-muted mt-1">Use HTML for rich formatting. Links and images will be tracked automatically.</p>
              </div>

              {/* Plain Text Content */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Plain Text Version (optional)</label>
                <textarea
                  value={formData.plain_text_content}
                  onChange={(e) => setFormData({ ...formData, plain_text_content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Plain text fallback for email clients that don't support HTML..."
                />
              </div>

              {/* Sender Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">From Name</label>
                  <input
                    type="text"
                    value={formData.from_name}
                    onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">From Email</label>
                  <input
                    type="email"
                    value={formData.from_email}
                    onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Reply To */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Reply To (optional)</label>
                <input
                  type="email"
                  value={formData.reply_to}
                  onChange={(e) => setFormData({ ...formData, reply_to: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="support@seeutrending.com"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Target Audience *</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={formData.target_all_users}
                      onChange={() => setFormData({ ...formData, target_all_users: true, target_roles: [] })}
                      className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-white">All registered users</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={!formData.target_all_users}
                      onChange={() => setFormData({ ...formData, target_all_users: false })}
                      className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-white">Specific user roles</span>
                  </label>
                  {!formData.target_all_users && (
                    <div className="ml-6 space-y-2">
                      {['creator', 'brand', 'spectator'].map(role => (
                        <label key={role} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.target_roles.includes(role)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, target_roles: [...formData.target_roles, role] })
                              } else {
                                setFormData({ ...formData, target_roles: formData.target_roles.filter(r => r !== role) })
                              }
                            }}
                            className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary"
                          />
                          <span className="text-white capitalize">{role}s</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Schedule (optional)</label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-text-muted mt-1">Leave empty to save as draft</p>
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end space-x-4">
              <button
                onClick={() => { setIsComposerOpen(false); resetForm(); }}
                className="px-6 py-2 border border-border rounded-lg text-white hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                disabled={!formData.subject || !formData.html_content || (!formData.target_all_users && formData.target_roles.length === 0)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all"
              >
                {formData.scheduled_at ? 'Schedule Campaign' : 'Save as Draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
