import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { 
  ArrowLeft, 
  Crown,
  Search,
  Palette,
  Calendar,
  Video,
  TrendingUp,
  UserPlus,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Building2,
  X,
  Eye
} from 'lucide-react'

interface TeamMember {
  id: string
  title: string
  subtitle: string
  description: string
  fullDescription: string
  responsibilities: string[]
  icon: React.ComponentType<any>
  gradient: string
  tier: 'ceo' | 'core' | 'supporting'
  requirements?: string[]
}

export function TeamStructurePage() {
  const navigate = useNavigate()
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const teamMembers: TeamMember[] = [
    // CEO Tier
    {
      id: 'ceo',
      title: 'CEO & Owner',
      subtitle: 'Estera Słupkowska',
      description: 'Strategia, nadzór nad całością, kontakty z klientami (markami), finanse i wszystkie zadania które nie zostały oddelegowane.',
      fullDescription: 'Lider i główny wizjoner firmy SeeUTrending. Odpowiada za strategiczne kierunki rozwoju i kształtowanie przyszłości platformy.',
      responsibilities: [
        'Strategia biznesowa i wizja firmy',
        'Nadzór nad całością operacji',
        'Kontakty z klientami (markami)',
        'Zarządzanie finansami firmy',
        'Wszystkie inne zadania, które nie zostały oddelegowane',
        'Rola CTO — budowanie web app, dbanie o produkt/ofertę, techniczność'
      ],
      icon: Crown,
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      tier: 'ceo'
    }
  ]

  const ceoMember = teamMembers.filter(member => member.tier === 'ceo')
  const coreMembers = teamMembers.filter(member => member.tier === 'core')
  const supportingMembers = teamMembers.filter(member => member.tier === 'supporting')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-900/20 to-background">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-400/10 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute top-60 right-20 w-48 h-48 bg-blue-400/10 rounded-full blur-xl animate-float-reverse"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-pink-400/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-1/4 w-36 h-36 bg-yellow-400/10 rounded-full blur-xl animate-float-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        {/* Header */}
        <div className="border-b border-border pb-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center space-x-2 text-text-muted hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Powrót do panelu admin</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text animate-pulse-glow mb-4">
              Struktura Zespołu SeeUTrending
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Poznaj nasz zespół i hierarchię organizacyjną - od wizjonera po zespoły wspierające
            </p>
          </div>
        </div>

        {/* Team Pyramid Structure */}
        <div className="space-y-12">
          {/* CEO Level */}
          <div className="flex justify-center">
            <div className="relative group">
              {ceoMember.map((member) => {
                const IconComponent = member.icon
                return (
                  <div
                    key={member.id}
                    className="relative p-8 bg-surface/80 backdrop-blur-sm border-2 border-border rounded-3xl hover:border-yellow-400/50 transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl w-96"
                  >
                    {/* CEO Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 text-center space-y-4">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${member.gradient} p-3 animate-pulse`}>
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{member.title}</h3>
                        <p className="text-lg text-yellow-400 font-semibold mb-4">{member.subtitle}</p>
                        <p className="text-text-secondary leading-relaxed mb-4">{member.description}</p>
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/30 rounded-lg transition-all duration-300 text-yellow-400 hover:text-yellow-300"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Czytaj więcej</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {/* Crown Animation */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Crown className="w-12 h-12 text-yellow-400 animate-bounce" />
                <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-lg animate-pulse"></div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-surface/40 border border-border rounded-full">
            <Building2 className="w-5 h-5 text-purple-400" />
            <span className="text-text-secondary">SeeUTrending - Struktura Organizacyjna 2024</span>
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Modal for detailed view */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${selectedMember.gradient} p-3`}>
                    <selectedMember.icon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedMember.title}</h2>
                    <p className="text-lg text-purple-400 font-semibold">{selectedMember.subtitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 hover:bg-surface-light rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-text-muted hover:text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                <div>
                  <p className="text-text-secondary leading-relaxed">{selectedMember.fullDescription}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Główne odpowiedzialności:</h3>
                  <ul className="space-y-2">
                    {selectedMember.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-text-secondary">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedMember.requirements && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Wymagania:</h3>
                    <ul className="space-y-2">
                      {selectedMember.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-success-green rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-text-secondary">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t border-border">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-full px-4 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors font-medium"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}