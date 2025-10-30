/**
 * Contest Preview Page - Demo Contest View
 * Shows how a live contest will look to users with demo data
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Trophy,
  Users,
  Video,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Crown,
  Award,
  Target,
  Sparkles,
  PartyPopper,
  Clock
} from 'lucide-react'
import { Button, Badge } from '../../components/ui'
import { mockContestDetails, rankedCreators, allVideos, type MockCreator } from '../../data/mockContestData'

type ViewMode = 'users' | 'videos'

export function ContestPreviewPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>('users')
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const isPolish = i18n.language === 'pl'

  // Pagination logic
  const totalItems = viewMode === 'users' ? rankedCreators.length : allVideos.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const displayedCreators = rankedCreators.slice(startIndex, endIndex)
  const displayedVideos = allVideos.slice(startIndex, endIndex)

  const toggleUserExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Award className="w-6 h-6 text-gray-400" />
      case 3:
        return <Target className="w-6 h-6 text-orange-600" />
      default:
        return null
    }
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-orange-500'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-orange-600 to-amber-700'
    return 'from-purple-500 to-pink-500'
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/contests')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {isPolish ? 'Powrót do zarządzania' : 'Back to Management'}
            </Button>

            <Badge variant="primary" className="text-sm">
              {isPolish ? 'DEMO PODGLĄD' : 'DEMO PREVIEW'}
            </Badge>
          </div>

          {/* Brand Header */}
          <div className="flex items-center gap-6 mb-6">
            <img
              src={mockContestDetails.brand_logo}
              alt={mockContestDetails.brand_name}
              className="w-20 h-20 rounded-2xl"
            />
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                {mockContestDetails.title}
              </h1>
              <p className="text-xl text-text-secondary">
                {isPolish ? mockContestDetails.description : mockContestDetails.descriptionEn}
              </p>
            </div>
          </div>

          {/* Contest Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm text-text-secondary">
                  {isPolish ? 'Uczestnicy' : 'Participants'}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {mockContestDetails.total_participants}
              </div>
            </div>

            <div className="bg-background/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-5 h-5 text-primary" />
                <span className="text-sm text-text-secondary">
                  {isPolish ? 'Zgłoszenia' : 'Submissions'}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {mockContestDetails.total_submissions}
              </div>
            </div>

            <div className="bg-background/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-primary" />
                <span className="text-sm text-text-secondary">
                  {isPolish ? 'Wyświetlenia' : 'Views'}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {mockContestDetails.total_organic_views.toLocaleString()}
              </div>
            </div>

            <div className="bg-background/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-primary" />
                <span className="text-sm text-text-secondary">
                  {isPolish ? 'Polubienia' : 'Likes'}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {mockContestDetails.total_likes.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Contest Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Prizes Card */}
            <div className="bg-surface rounded-2xl border-2 border-primary/30 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">
                    {isPolish ? 'Nagrody' : 'Prizes'}
                  </h2>
                </div>

                <div className="space-y-4">
                  {mockContestDetails.prizes.map((prize, index) => (
                    <div
                      key={prize.place}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105
                        ${prize.place === 1 ? 'border-yellow-400/50 bg-yellow-400/10' : ''}
                        ${prize.place === 2 ? 'border-gray-400/50 bg-gray-400/10' : ''}
                        ${prize.place === 3 ? 'border-orange-600/50 bg-orange-600/10' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getRankIcon(prize.place)}
                          <div>
                            <div className="text-sm text-text-secondary">
                              {prize.place === 1 && (isPolish ? '1. miejsce' : '1st place')}
                              {prize.place === 2 && (isPolish ? '2. miejsce' : '2nd place')}
                              {prize.place === 3 && (isPolish ? '3. miejsce' : '3rd place')}
                            </div>
                            <div className="text-2xl font-bold text-white">
                              {prize.amount.toLocaleString()} {prize.currency}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly XP Party Bonus */}
            <div className="bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-2xl border-2 border-primary/30 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <PartyPopper className="w-32 h-32" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">
                    {isPolish ? 'Bonus XP' : 'XP Bonus'}
                  </h3>
                </div>
                <p className="text-white leading-relaxed">
                  {isPolish ? mockContestDetails.monthlyBonus.pl : mockContestDetails.monthlyBonus.en}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-surface rounded-2xl border border-border p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {isPolish ? 'Wymagania' : 'Requirements'}
              </h3>
              <ul className="space-y-3">
                {(isPolish ? mockContestDetails.requirements.pl : mockContestDetails.requirements.en).map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-text-secondary">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Winner Selection */}
            <div className="bg-surface rounded-2xl border border-border p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {isPolish ? 'Wybór zwycięzcy' : 'Winner Selection'}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {isPolish ? mockContestDetails.winnerSelection.pl : mockContestDetails.winnerSelection.en}
              </p>
            </div>

            {/* Submit Button */}
            <Button className="w-full h-14 text-lg" variant="primary">
              <Video className="w-5 h-5 mr-2" />
              {isPolish ? 'Zgłoś swoje video' : 'Submit Your Video'}
            </Button>
          </div>

          {/* RIGHT COLUMN - Live Ranking */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-2xl border border-border p-6">
              {/* Header with View Mode Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {isPolish ? 'Ranking na żywo' : 'Live Ranking'}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>{isPolish ? 'Aktualizowane na żywo' : 'Updated in real-time'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm text-text-secondary">
                    {isPolish ? 'Koniec za 12 dni' : 'Ends in 12 days'}
                  </span>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => {
                    setViewMode('users')
                    setCurrentPage(1)
                    setExpandedUser(null)
                  }}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200
                    ${viewMode === 'users'
                      ? 'bg-primary text-white shadow-lg shadow-primary/50'
                      : 'bg-background text-text-secondary hover:bg-background-light'
                    }
                  `}
                >
                  <Users className="w-5 h-5" />
                  {isPolish ? 'UŻYTKOWNICY' : 'USERS'}
                </button>

                <button
                  onClick={() => {
                    setViewMode('videos')
                    setCurrentPage(1)
                    setExpandedUser(null)
                  }}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200
                    ${viewMode === 'videos'
                      ? 'bg-primary text-white shadow-lg shadow-primary/50'
                      : 'bg-background text-text-secondary hover:bg-background-light'
                    }
                  `}
                >
                  <Video className="w-5 h-5" />
                  {isPolish ? 'FILMY' : 'VIDEOS'}
                </button>
              </div>

              {/* USERS VIEW */}
              {viewMode === 'users' && (
                <div className="space-y-3">
                  {displayedCreators.map((creator, index) => {
                    const globalRank = startIndex + index + 1
                    const isExpanded = expandedUser === creator.id

                    return (
                      <div
                        key={creator.id}
                        className={`
                          bg-background rounded-xl border-2 transition-all duration-300
                          ${globalRank <= 3 ? 'border-primary/50' : 'border-border'}
                          hover:border-primary/70 hover:shadow-lg
                        `}
                      >
                        {/* Main User Row */}
                        <div className="p-4">
                          <div className="flex items-center gap-4">
                            {/* Rank */}
                            <div className="flex-shrink-0 w-12 text-center">
                              {globalRank <= 3 ? (
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankBadgeColor(globalRank)} flex items-center justify-center`}>
                                  {getRankIcon(globalRank)}
                                </div>
                              ) : (
                                <div className="text-2xl font-bold text-white">
                                  #{globalRank}
                                </div>
                              )}
                            </div>

                            {/* Avatar & Name */}
                            <a
                              href={creator.tiktok_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={creator.avatar_url}
                                alt={creator.name}
                                className="w-12 h-12 rounded-full"
                              />
                              <div>
                                <div className="font-semibold text-white flex items-center gap-2">
                                  {creator.name}
                                  <ExternalLink className="w-3 h-3 text-text-secondary" />
                                </div>
                                <div className="text-sm text-text-secondary">
                                  {creator.tiktok_handle}
                                </div>
                              </div>
                            </a>

                            {/* Stats */}
                            <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                              <div>
                                <div className="text-sm text-text-secondary mb-1">
                                  {isPolish ? 'Wyświetlenia' : 'Views'}
                                </div>
                                <div className="text-lg font-bold text-white">
                                  {creator.total_views.toLocaleString()}
                                </div>
                              </div>

                              <div>
                                <div className="text-sm text-text-secondary mb-1">
                                  {isPolish ? 'Organiczne' : 'Organic'}
                                </div>
                                <div className="text-lg font-bold text-primary">
                                  {creator.total_organic_views.toLocaleString()}
                                </div>
                              </div>

                              <div>
                                <div className="text-sm text-text-secondary mb-1">
                                  {isPolish ? 'Polubienia' : 'Likes'}
                                </div>
                                <div className="text-lg font-bold text-pink-500">
                                  {creator.total_likes.toLocaleString()}
                                </div>
                              </div>
                            </div>

                            {/* Expand Button */}
                            <button
                              onClick={() => toggleUserExpand(creator.id)}
                              className="flex-shrink-0 p-2 rounded-lg bg-surface hover:bg-surface-light transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-white" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-white" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Videos Section */}
                        {isExpanded && (
                          <div className="border-t border-border p-4 bg-background-light">
                            <h4 className="text-sm font-semibold text-white mb-3">
                              {isPolish ? `Zgłoszone filmy (${creator.videos.length})` : `Submitted Videos (${creator.videos.length})`}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {creator.videos.map((video) => (
                                <a
                                  key={video.id}
                                  href={video.tiktok_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex gap-3 p-3 bg-surface rounded-lg hover:bg-surface-light transition-colors border border-border hover:border-primary/50 group"
                                >
                                  {/* Thumbnail */}
                                  <img
                                    src={video.thumbnail}
                                    alt="Video thumbnail"
                                    className="w-20 h-28 object-cover rounded-lg"
                                  />

                                  {/* Video Stats */}
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                                        Video
                                      </span>
                                      <ExternalLink className="w-3 h-3 text-text-secondary" />
                                    </div>

                                    <div className="space-y-1 text-xs">
                                      <div className="flex items-center gap-2 text-text-secondary">
                                        <Eye className="w-3 h-3" />
                                        <span>{video.views.toLocaleString()}</span>
                                        <span className="text-primary">
                                          ({video.organic_views.toLocaleString()} {isPolish ? 'org.' : 'org'})
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 text-text-secondary">
                                        <Heart className="w-3 h-3" />
                                        <span>{video.likes.toLocaleString()}</span>
                                      </div>

                                      <div className="flex items-center gap-2 text-text-secondary">
                                        <MessageCircle className="w-3 h-3" />
                                        <span>{video.comments.toLocaleString()}</span>
                                      </div>

                                      <div className="flex items-center gap-2 text-text-secondary">
                                        <Share2 className="w-3 h-3" />
                                        <span>{video.shares.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* VIDEOS VIEW */}
              {viewMode === 'videos' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedVideos.map((video, index) => {
                    const globalRank = startIndex + index + 1

                    return (
                      <a
                        key={video.id}
                        href={video.tiktok_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          relative bg-background rounded-xl border-2 p-4 hover:border-primary/70 transition-all duration-300 hover:shadow-lg group
                          ${globalRank <= 10 ? 'border-primary/50' : 'border-border'}
                        `}
                      >
                        {/* Rank Badge */}
                        {globalRank <= 10 && (
                          <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br ${getRankBadgeColor(globalRank)} flex items-center justify-center font-bold text-white shadow-lg z-10`}>
                            #{globalRank}
                          </div>
                        )}

                        <div className="flex gap-4">
                          {/* Thumbnail */}
                          <img
                            src={video.thumbnail}
                            alt="Video thumbnail"
                            className="w-28 h-36 object-cover rounded-lg"
                          />

                          {/* Info */}
                          <div className="flex-1">
                            {/* Creator */}
                            <div className="flex items-center gap-2 mb-3">
                              <img
                                src={video.creator_avatar}
                                alt={video.creator_name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                                  {video.creator_name}
                                </div>
                                <div className="text-xs text-text-secondary">
                                  {video.creator_handle}
                                </div>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-text-secondary">
                                  <Eye className="w-4 h-4" />
                                  <span>{isPolish ? 'Wyśw.' : 'Views'}</span>
                                </div>
                                <span className="font-semibold text-white">
                                  {video.views.toLocaleString()}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-text-secondary">
                                  <Sparkles className="w-4 h-4 text-primary" />
                                  <span>{isPolish ? 'Org.' : 'Organic'}</span>
                                </div>
                                <span className="font-semibold text-primary">
                                  {video.organic_views.toLocaleString()}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-text-secondary">
                                  <Heart className="w-4 h-4 text-pink-500" />
                                  <span>{isPolish ? 'Polub.' : 'Likes'}</span>
                                </div>
                                <span className="font-semibold text-pink-500">
                                  {video.likes.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* External Link Icon */}
                            <div className="mt-2 flex items-center gap-1 text-xs text-text-secondary group-hover:text-primary transition-colors">
                              <span>{isPolish ? 'Zobacz na TikTok' : 'View on TikTok'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </a>
                    )
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between pt-6 border-t border-border">
                  <div className="text-sm text-text-secondary">
                    {isPolish ? 'Strona' : 'Page'} {currentPage} {isPolish ? 'z' : 'of'} {totalPages}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      {isPolish ? 'Poprzednia' : 'Previous'}
                    </Button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`
                            w-10 h-10 rounded-lg font-semibold transition-all duration-200
                            ${currentPage === pageNum
                              ? 'bg-primary text-white'
                              : 'bg-background text-text-secondary hover:bg-background-light'
                            }
                          `}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      {isPolish ? 'Następna' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
