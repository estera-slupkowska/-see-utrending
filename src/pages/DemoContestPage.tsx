import { useState } from 'react'
import { useAuth } from '../lib/auth/context'
import { Button, Badge } from '../components/ui'
import { VideoSubmissionForm } from '../components/contest/VideoSubmissionForm'
import { LiveLeaderboard } from '../components/contest/LiveLeaderboard'
import { 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  Star, 
  Gift,
  Target,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react'

export function DemoContestPage() {
  const { user } = useAuth()
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'submit'>('overview')

  const demoContest = {
    id: 'demo-contest-1',
    title: 'Summer Vibes Challenge 2024',
    description: 'Stwórz kreatywny film TikTok pokazujący swoje letnie przygody! Najlepsze filmy wygrają niesamowite nagrody.',
    hashtag: '#SummerVibesChallenge',
    status: 'active' as const,
    startDate: '2024-09-10T10:00:00Z',
    endDate: '2024-09-20T23:59:59Z',
    totalSubmissions: 247,
    totalViews: 1250000,
    totalLikes: 89500,
    totalComments: 12400,
    maxParticipants: 1000,
    prizes: {
      first: 'iPhone 15 Pro + 10,000 PLN',
      second: 'AirPods Pro + 5,000 PLN',
      third: 'Apple Watch + 2,500 PLN'
    },
    rules: [
      'Film musi być oryginalny i stworzony specjalnie na konkurs',
      'Użyj hashtagu #SummerVibesChallenge w opisie',
      'Film musi mieć od 15 do 60 sekund',
      'Zawartość musi być zgodna z regulaminem TikTok i SeeUTrending',
      'Jeden uczestnik może przesłać maksymalnie 3 filmy'
    ],
    brandInfo: {
      name: 'Summer Brand Co.',
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=summerbrand',
      description: 'Marka lifestyle\'owa wspierająca kreatywność i letni styl życia'
    }
  }

  const getTimeRemaining = () => {
    const end = new Date(demoContest.endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Konkurs zakończony'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    return `${days} dni, ${hours} godzin`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const isConnected = localStorage.getItem('tiktok_oauth_completed') === 'true'

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary-600 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-white mb-8">
            <Badge variant="gaming" className="mb-4">
              AKTYWNY KONKURS
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
              {demoContest.title}
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto mb-6">
              {demoContest.description}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Kończy się: {getTimeRemaining()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{demoContest.totalSubmissions} zgłoszeń</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <Eye className="w-6 h-6 mx-auto mb-2 text-white" />
              <div className="text-2xl font-bold text-white">{formatNumber(demoContest.totalViews)}</div>
              <div className="text-xs text-white/70">Wyświetleń</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-white" />
              <div className="text-2xl font-bold text-white">{formatNumber(demoContest.totalLikes)}</div>
              <div className="text-xs text-white/70">Polubień</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <MessageCircle className="w-6 h-6 mx-auto mb-2 text-white" />
              <div className="text-2xl font-bold text-white">{formatNumber(demoContest.totalComments)}</div>
              <div className="text-xs text-white/70">Komentarzy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-white" />
              <div className="text-2xl font-bold text-white">85%</div>
              <div className="text-xs text-white/70">Zaangażowanie</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex border-b border-border">
          {[
            { key: 'overview', label: 'Przegląd', icon: Target },
            { key: 'leaderboard', label: 'Ranking', icon: Trophy },
            { key: 'submit', label: 'Weź udział', icon: Star }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contest Details */}
              <div className="card-clean">
                <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
                  O konkursie
                </h2>
                <p className="text-text-secondary mb-6">
                  {demoContest.description}
                </p>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-text-primary mb-3">Hashtag</h3>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-lg">
                    <span className="text-lg font-mono">{demoContest.hashtag}</span>
                    <Button size="sm" variant="ghost">Kopiuj</Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary mb-3">Regulamin</h3>
                  <ul className="space-y-2">
                    {demoContest.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Timeline */}
              <div className="card-clean">
                <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
                  Timeline konkursu
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-success-green/10 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-success-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">Start konkursu</h3>
                      <p className="text-sm text-text-secondary">
                        {new Date(demoContest.startDate).toLocaleString('pl-PL')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-warning-amber/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-warning-amber" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">Koniec zgłoszeń</h3>
                      <p className="text-sm text-text-secondary">
                        {new Date(demoContest.endDate).toLocaleString('pl-PL')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">Ogłoszenie wyników</h3>
                      <p className="text-sm text-text-secondary">
                        21 września 2024, 18:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Prizes */}
              <div className="card-clean">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-display font-bold text-text-primary">
                    Nagrody
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-xp-gold/10 to-xp-gold/5 rounded-lg border border-xp-gold/20">
                    <div className="text-2xl">🥇</div>
                    <div>
                      <div className="font-semibold text-text-primary">1. miejsce</div>
                      <div className="text-sm text-text-secondary">{demoContest.prizes.first}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                    <div className="text-2xl">🥈</div>
                    <div>
                      <div className="font-semibold text-text-primary">2. miejsce</div>
                      <div className="text-sm text-text-secondary">{demoContest.prizes.second}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                    <div className="text-2xl">🥉</div>
                    <div>
                      <div className="font-semibold text-text-primary">3. miejsce</div>
                      <div className="text-sm text-text-secondary">{demoContest.prizes.third}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Sponsor */}
              <div className="card-clean">
                <h2 className="text-xl font-display font-bold text-text-primary mb-4">
                  Sponsor konkursu
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={demoContest.brandInfo.logo}
                    alt={demoContest.brandInfo.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-text-primary">{demoContest.brandInfo.name}</h3>
                    <p className="text-sm text-text-secondary">{demoContest.brandInfo.description}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="card-clean">
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => setActiveTab('submit')}
                  disabled={!user}
                >
                  {!user ? 'Zaloguj się, aby wziąć udział' : 'Weź udział w konkursie'}
                </Button>
                {!user && (
                  <p className="text-xs text-text-muted mt-2 text-center">
                    Musisz być zalogowany, aby brać udział w konkursach
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <LiveLeaderboard 
            contestId={demoContest.id}
            contestTitle={demoContest.title}
            isLive={true}
            maxEntries={15}
          />
        )}

        {activeTab === 'submit' && (
          <div className="max-w-2xl mx-auto">
            {!user ? (
              <div className="card-clean text-center">
                <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
                  Zaloguj się, aby wziąć udział
                </h2>
                <p className="text-text-secondary mb-6">
                  Musisz mieć konto w SeeUTrending, aby brać udział w konkursach.
                </p>
                <Button variant="primary" onClick={() => window.location.href = '/auth/login'}>
                  Przejdź do logowania
                </Button>
              </div>
            ) : !isConnected ? (
              <div className="card-clean text-center">
                <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
                  Połącz konto TikTok
                </h2>
                <p className="text-text-secondary mb-6">
                  Aby wziąć udział w konkursie, musisz połączyć swoje konto TikTok.
                </p>
                <Button variant="primary" onClick={() => window.location.href = '/dashboard'}>
                  Przejdź do panelu
                </Button>
              </div>
            ) : (
              <VideoSubmissionForm
                contestId={demoContest.id}
                contestTitle={demoContest.title}
                onSubmissionSuccess={() => setActiveTab('leaderboard')}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}