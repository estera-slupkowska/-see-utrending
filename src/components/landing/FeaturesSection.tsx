import { useTranslation } from 'react-i18next'
import { Target, Rocket, Users } from 'lucide-react'

export function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Target,
      titleKey: 'features.forBrands.title',
      descriptionKey: 'features.forBrands.description',
      color: 'text-primary'
    },
    {
      icon: Rocket,
      titleKey: 'features.forCreators.title', 
      descriptionKey: 'features.forCreators.description',
      color: 'text-accent'
    },
    {
      icon: Users,
      titleKey: 'features.forSpectators.title',
      descriptionKey: 'features.forSpectators.description', 
      color: 'text-secondary-400'
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-light">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index}
                className="card-clean text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-light mb-6 ${feature.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-display font-semibold text-text-primary mb-4">
                  {t(feature.titleKey)}
                </h3>
                
                <p className="text-text-secondary text-lg leading-relaxed">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}