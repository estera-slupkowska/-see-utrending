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
  UserCheck
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

  const benefits = [
    {
      icon: Zap,
      title: t('howItWorks.benefits.points.title'),
      description: t('howItWorks.benefits.points.description')
    },
    {
      icon: Star,
      title: t('howItWorks.benefits.badges.title'),
      description: t('howItWorks.benefits.badges.description')
    },
    {
      icon: Gift,
      title: t('howItWorks.benefits.rewards.title'),
      description: t('howItWorks.benefits.rewards.description')
    },
    {
      icon: Heart,
      title: t('howItWorks.benefits.prestige.title'),
      description: t('howItWorks.benefits.prestige.description')
    },
    {
      icon: Calendar,
      title: t('howItWorks.benefits.events.title'),
      description: t('howItWorks.benefits.events.description')
    },
    {
      icon: UserCheck,
      title: t('howItWorks.benefits.opportunities.title'),
      description: t('howItWorks.benefits.opportunities.description')
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

        {/* Benefits Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-4">{t('howItWorks.benefitsTitle')}</h3>
          <p className="text-lg text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            {t('howItWorks.benefitsSubtitle')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-surface/30 rounded-xl p-6 border border-border/30 hover:border-primary/40 transition-all duration-300 hover:bg-surface/50"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{benefit.title}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {benefit.description}
                    </p>
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