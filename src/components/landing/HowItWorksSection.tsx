import { useTranslation } from 'react-i18next'
import {
  Building2,
  Users,
  Trophy,
  Sparkles,
  Zap,
  Heart,
  Calendar,
  TrendingUp,
  ArrowRight,
  Star,
  Gift,
  UserCheck,
  PartyPopper,
  ShoppingBag,
  Gem
} from 'lucide-react'

export function HowItWorksSection() {
  const { t } = useTranslation()

  const steps = [
    {
      id: 'brands-create',
      icon: Building2,
      title: t('howItWorks.steps.brands.title'),
      description: t('howItWorks.steps.brands.description'),
      color: 'from-blue-500 to-cyan-500',
      stakeholder: 'brands'
    },
    {
      id: 'creators-participate',
      icon: Users,
      title: t('howItWorks.steps.creators.title'),
      description: t('howItWorks.steps.creators.description'),
      color: 'from-purple-500 to-pink-500',
      stakeholder: 'creators'
    },
    {
      id: 'earn-rewards',
      icon: Trophy,
      title: t('howItWorks.steps.rewards.title'),
      description: t('howItWorks.steps.rewards.description'),
      color: 'from-yellow-500 to-orange-500',
      stakeholder: 'everyone'
    }
  ]

  const rewardTypes = [
    {
      id: 'money',
      title: t('rewards.types.money.title'),
      description: t('rewards.types.money.description'),
      icon: Trophy,
      gradient: 'from-yellow-400 to-orange-500',
      examples: ['500-5000 PLN', 'Nagrody w konkursach', 'Bonusy za wyniki']
    },
    {
      id: 'experiences',
      title: t('rewards.types.experiences.title'),
      description: t('rewards.types.experiences.description'),
      icon: PartyPopper,
      gradient: 'from-pink-500 to-purple-500',
      examples: ['Ekskluzywne imprezy', 'Wydarzenia brandów', 'Spotkania twórców']
    },
    {
      id: 'products',
      title: t('rewards.types.products.title'),
      description: t('rewards.types.products.description'),
      icon: ShoppingBag,
      gradient: 'from-blue-500 to-cyan-500',
      examples: ['Najnowsze gadżety', 'Modne produkty', 'Merchandising brandów']
    },
    {
      id: 'recognition',
      title: t('rewards.types.recognition.title'),
      description: t('rewards.types.recognition.description'),
      icon: Gem,
      gradient: 'from-purple-500 to-pink-500',
      examples: ['Odznaki profilu', 'Sława w rankingu', 'Uznanie społeczne']
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="gradient-text">{t('howItWorks.title')}</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* How It Works Steps */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-12">{t('howItWorks.stepsTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary via-accent to-success"></div>
            
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="bg-surface/50 rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} p-4 mx-auto mb-6`}>
                    <step.icon className="w-full h-full text-white" />
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-xl font-bold mb-4">{step.title}</h4>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      step.stakeholder === 'brands' ? 'bg-blue-500/20 text-blue-400' :
                      step.stakeholder === 'creators' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-gradient-to-r from-primary/20 to-accent/20 text-primary'
                    }`}>
                      {t(`howItWorks.stakeholder.${step.stakeholder}`)}
                    </div>
                  </div>
                </div>
                
                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-4 md:hidden">
                    <ArrowRight className="w-6 h-6 text-primary/60" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reward Types Section - Engaging tables from rewards page */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-4">{t('rewards.types.title')}</h3>
          <p className="text-lg text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            {t('rewards.types.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rewardTypes.map((reward, index) => (
              <div key={reward.id} className="group relative">
                {/* Enhanced Reward Type Card */}
                <div className="h-full p-8 bg-surface/50 rounded-3xl border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl magnetic-hover">

                  {/* Floating Background Effect */}
                  <div className={`
                    absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500
                    bg-gradient-to-br ${reward.gradient}
                  `} />

                  <div className="relative z-10 space-y-6">
                    {/* Enhanced Icon with Multiple Effects */}
                    <div className="relative mx-auto w-20 h-20">
                      <div className={`
                        w-full h-full rounded-3xl bg-gradient-to-br ${reward.gradient} p-5 shadow-xl
                        group-hover:scale-125 group-hover:rotate-12 group-hover:shadow-2xl
                        transition-all duration-500 viral-shimmer
                      `}>
                        <reward.icon className="w-full h-full text-white drop-shadow-lg" />
                      </div>

                      {/* Pulsing Ring */}
                      <div className="absolute inset-0 rounded-3xl border-2 border-current opacity-0 group-hover:opacity-30 animate-ping transition-opacity duration-300"
                           style={{ color: reward.id === 'money' ? '#F59E0B' : reward.id === 'experiences' ? '#EC4899' : reward.id === 'products' ? '#06B6D4' : '#A855F7' }} />

                      {/* Orbiting Elements */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                          <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-2" />
                        </div>
                        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
                          <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full transform -translate-x-1/2 translate-y-2" />
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="text-center space-y-4">
                      <h4 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors duration-300">
                        {reward.title}
                      </h4>
                      <p className="text-text-secondary text-sm leading-relaxed group-hover:text-text-primary transition-colors duration-300">
                        {reward.description}
                      </p>
                    </div>

                    {/* Enhanced Examples Section */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider text-center group-hover:text-accent transition-colors duration-300">
                        Przykłady
                      </p>
                      <ul className="space-y-2">
                        {reward.examples.map((example, idx) => (
                          <li
                            key={idx}
                            className="flex items-center space-x-3 p-2 rounded-lg bg-background/20 group-hover:bg-background/40 transition-all duration-300 transform group-hover:translate-x-1"
                            style={{ animationDelay: `${idx * 100}ms` }}
                          >
                            <div className={`
                              w-2 h-2 rounded-full transition-all duration-300
                              bg-gradient-to-r ${reward.gradient} group-hover:animate-pulse
                            `} />
                            <span className="text-xs text-text-muted group-hover:text-text-primary transition-colors duration-300 font-medium">
                              {example}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Glow Line */}
                  <div className={`
                    absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl opacity-0 group-hover:opacity-100
                    bg-gradient-to-r ${reward.gradient} transition-opacity duration-500
                  `} />
                </div>

                {/* Floating Achievement Indicator */}
                <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                  <div className={`
                    w-8 h-8 rounded-full bg-gradient-to-r ${reward.gradient}
                    flex items-center justify-center shadow-lg animate-bounce
                  `}>
                    <Star className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-success/10 border border-primary/20 rounded-3xl p-12 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-8 w-3 h-3 bg-accent rounded-full animate-pulse delay-75"></div>
              <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-success rounded-full animate-pulse delay-150"></div>
              <div className="absolute bottom-4 right-6 w-2.5 h-2.5 bg-primary rounded-full animate-pulse delay-300"></div>
            </div>
            
            <div className="relative">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                <Trophy className="w-6 h-6 text-success" />
              </div>
              
              <h3 className="text-3xl font-bold mb-4">
                {t('howItWorks.cta.title')}
              </h3>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                {t('howItWorks.cta.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 min-w-[200px]"
                  onClick={() => window.location.href = '/auth/register'}
                >
                  <Trophy className="mr-2 h-5 w-5 inline" />
                  {t('howItWorks.cta.primary')}
                </button>
                <button 
                  className="bg-surface/50 border border-border text-text-primary px-8 py-4 rounded-xl font-semibold hover:border-primary/50 transition-all duration-300 min-w-[200px]"
                  onClick={() => window.location.href = '/brands'}
                >
                  <Building2 className="mr-2 h-5 w-5 inline" />
                  {t('howItWorks.cta.secondary')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}