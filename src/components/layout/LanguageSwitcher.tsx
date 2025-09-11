import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <div className="flex items-center space-x-1 bg-surface rounded-lg p-1">
      <button
        onClick={() => i18n.changeLanguage('pl')}
        className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200 ${
          i18n.language === 'pl' 
            ? 'bg-primary text-white shadow-sm' 
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        PL
      </button>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200 ${
          i18n.language === 'en' 
            ? 'bg-primary text-white shadow-sm' 
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        EN
      </button>
    </div>
  )
}