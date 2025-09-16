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
      title: 'CEO & Owner – Visioner',
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
    },
    // Core Team
    {
      id: 'head-of-talent',
      title: 'Head of Talent – Mission Recruiter',
      subtitle: 'Rekrutacja i rozwój zespołu',
      description: 'Rekrutacja i rozwój zespołu, wyszukiwanie odpowiednich osób, prowadzenie rozmów i onboarding.',
      fullDescription: 'Odpowiedzialny za budowanie najlepszego zespołu dla SeeUTrending i rozwój kultury organizacyjnej.',
      responsibilities: [
        'Wyszukiwanie odpowiednich osób (od core team po krótkoterminowych współpracowników)',
        'Prowadzenie rozmów rekrutacyjnych',
        'Przekazywanie wizji firmy kandydatom',
        'Proces onboarding nowych członków zespołu',
        'Uczestniczenie w social mediach i produkcji contentu',
        'Promocja SeeUTrending jako „miejsca, do którego chce się dołączyć"',
        'Rozwijanie i nadzorowanie Buzz Creators Squad'
      ],
      icon: UserPlus,
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      tier: 'core'
    },
    {
      id: 'creative-director',
      title: 'Creative Director – Contest Tailor',
      subtitle: 'Projektowanie konkursów',
      description: 'Przygotowywanie i projektowanie konkursów, opisy trendów, tworzenie scenariuszy TikToków.',
      fullDescription: 'Kreator wszystkich konkursów na platformie SeeUTrending, odpowiedzialny za twórcze aspekty kampanii.',
      responsibilities: [
        'Opisy trendów i analiza viral content',
        'Tworzenie scenariuszy przykładowych TikToków',
        'Wymyślanie mechanik konkursowych',
        'Prowadzenie Trend Makers Team',
        'Prowadzenie social mediów (TikTok, Instagram, YouTube) we współpracy z CEO'
      ],
      icon: Palette,
      gradient: 'from-green-500 via-teal-500 to-blue-500',
      tier: 'core'
    },
    {
      id: 'event-producer',
      title: 'Event Producer – Experience Orchestrator',
      subtitle: 'Organizacja wydarzeń offline',
      description: 'Organizacja wydarzeń offline, przygotowanie imprez dla zwycięzców, wybór lokalu, koordynacja.',
      fullDescription: 'Architekt wszystkich eventów SeeUTrending, tworzący niezapomniane doświadczenia dla społeczności.',
      responsibilities: [
        'Przygotowanie pierwszej imprezy dla zwycięzców',
        'Wybór lokalu i negocjacje',
        'Organizacja nagłośnienia i techniki',
        'Koordynacja bufetu, napojów i alkoholu (tylko pełnoletnia osoba)',
        'Koordynacja na miejscu podczas eventu',
        'Dbanie o logistykę i bezpieczeństwo eventów'
      ],
      icon: Calendar,
      gradient: 'from-purple-500 via-indigo-500 to-blue-500',
      tier: 'core'
    },
    {
      id: 'media-producer',
      title: 'Media Producer – Story Capture Specialist',
      subtitle: 'Nagrywanie i edycja wideo',
      description: 'Nagrywanie i edytowanie treści wideo, obsługa kamery podczas nagrań, przygotowywanie materiałów.',
      fullDescription: 'Specjalista od tworzenia wszystkich materiałów wideo dla SeeUTrending i dokumentowania historii platformy.',
      responsibilities: [
        'Obsługa kamery podczas nagrań',
        'Przygotowywanie materiałów do zwiastunów',
        'Wsparcie w tworzeniu treści konkursowych',
        'Montaż prostych filmów promocyjnych',
        'Współpraca z Creative Directorem i CEO'
      ],
      icon: Video,
      gradient: 'from-red-500 via-pink-500 to-purple-500',
      tier: 'core'
    },
    // Supporting Groups
    {
      id: 'trend-makers',
      title: 'Trend Makers Team',
      subtitle: 'Twórcy przykładowych treści',
      description: 'Osoby nagrywające przykładowe TikToki i pojawiające się w zwiastunach.',
      fullDescription: 'Grupa kreatywnych twórców, którzy nadają ton każdemu konkursowi poprzez przykładowe materiały.',
      responsibilities: [
        'Nagrywanie przykładowych TikToków dla konkursów',
        'Pojawianie się w zwiastunach kampanii',
        'Inspirowanie społeczności poprzez kreatywne treści'
      ],
      requirements: [
        'Kreatywność i pomysłowość',
        'Obycie przed kamerą',
        'Własna kamera/telefon + mikrofon'
      ],
      icon: TrendingUp,
      gradient: 'from-amber-400 via-yellow-500 to-orange-500',
      tier: 'supporting'
    },
    {
      id: 'buzz-creators',
      title: 'Buzz Creators Squad',
      subtitle: 'Promocja w social mediach',
      description: 'Osoby promujące konkursy w social mediach i docierające do młodego pokolenia.',
      fullDescription: 'Ambasadorzy SeeUTrending w mediach społecznościowych, budujący buzz wokół każdego konkursu.',
      responsibilities: [
        'Promocja konkursów na social mediach',
        'Docieranie do młodego pokolenia',
        'Tworzenie viral content o SeeUTrending'
      ],
      requirements: [
        'Aktywność na TikToku/Instagramie',
        'Podstawowe umiejętności komunikacyjne',
        'Rozumienie memów i języka Gen Z'
      ],
      icon: Megaphone,
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      tier: 'supporting'
    },
    {
      id: 'event-support',
      title: 'Event Support Crew',
      subtitle: 'Wsparcie podczas wydarzeń',
      description: 'Osoby pomagające podczas imprez - rozdawanie napojów, obsługa wejścia, wsparcie logistyczne.',
      fullDescription: 'Zespół wsparcia zapewniający płynny przebieg wszystkich eventów SeeUTrending.',
      responsibilities: [
        'Rozdawanie napojów/alkoholu (tylko pełnoletni)',
        'Obsługa wejścia i rejestracji gości',
        'Logistyczne wsparcie podczas eventów',
        'Pomoc w organizacji przestrzeni'
      ],
      requirements: [
        'Odpowiedzialność i rzetelność',
        'Dyspozycyjność w dniu eventu',
        'Umiejętność pracy w grupie',
        'Dla obsługi alkoholu: pełnoletność'
      ],
      icon: Search,
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      tier: 'supporting'
    },
    {
      id: 'legal-advisor',
      title: 'Legal Advisor – Compliance Partner',
      subtitle: 'Wsparcie prawne',
      description: 'Osoba wspierająca w sprawach prawnych - regulaminy, RODO, zgody rodziców, aspekty eventów.',
      fullDescription: 'Ekspert prawny zapewniający zgodność wszystkich działań SeeUTrending z obowiązującymi przepisami.',
      responsibilities: [
        'Tworzenie regulaminów konkursów',
        'Kwestie RODO i ochrony danych',
        'Zgody rodziców dla nieletnich uczestników',
        'Aspekty alkoholu i bezpieczeństwa eventów',
        'Ogólne doradztwo prawne'
      ],
      requirements: [
        'Podstawowa wiedza z prawa konsumenckiego/marketingowego',
        'Doświadczenie z eventami będzie plusem',
        'Znajomość regulacji dotyczących mediów społecznościowych'
      ],
      icon: ShieldCheck,
      gradient: 'from-violet-500 via-purple-500 to-indigo-500',
      tier: 'supporting'
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

          {/* Connection Lines to Core Team */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-px h-16 bg-gradient-to-b from-yellow-400/50 to-purple-400/50"></div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Core Team Level */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Zespół Kierowniczy</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {coreMembers.map((member, index) => {
                const IconComponent = member.icon
                return (
                  <div
                    key={member.id}
                    className="relative group"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="relative p-6 bg-surface/70 backdrop-blur-sm border-2 border-border rounded-2xl hover:border-purple-400/50 transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:shadow-xl h-full">
                      {/* Core Team Glow */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${member.gradient.replace('from-', 'from-').replace('via-', 'via-').replace('to-', 'to-')}/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      
                      <div className="relative z-10 text-center space-y-4">
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${member.gradient} p-3`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-white mb-2">{member.title}</h3>
                          <p className="text-sm text-purple-400 font-semibold mb-3">{member.subtitle}</p>
                          <p className="text-text-secondary text-xs leading-relaxed mb-3">{member.description}</p>
                          <button
                            onClick={() => setSelectedMember(member)}
                            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-purple-400/20 hover:bg-purple-400/30 border border-purple-400/30 rounded-lg transition-all duration-300 text-purple-400 hover:text-purple-300 text-xs"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Czytaj więcej</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Connection Lines to Supporting Groups */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-px h-16 bg-gradient-to-b from-purple-400/50 to-blue-400/50"></div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Supporting Groups Level */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Zespoły Wspierające</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {supportingMembers.map((member, index) => {
                const IconComponent = member.icon
                return (
                  <div
                    key={member.id}
                    className="relative group"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="relative p-5 bg-surface/60 backdrop-blur-sm border border-border rounded-xl hover:border-blue-400/50 transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:shadow-lg h-full">
                      {/* Supporting Glow */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${member.gradient}/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      
                      <div className="relative z-10 text-center space-y-3">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${member.gradient} p-2.5`}>
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{member.title}</h3>
                          <p className="text-sm text-blue-400 font-semibold mb-2">{member.subtitle}</p>
                          <p className="text-text-secondary text-xs leading-relaxed mb-3">{member.description}</p>
                          <button
                            onClick={() => setSelectedMember(member)}
                            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-400/20 hover:bg-blue-400/30 border border-blue-400/30 rounded-lg transition-all duration-300 text-blue-400 hover:text-blue-300 text-xs"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Czytaj więcej</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
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