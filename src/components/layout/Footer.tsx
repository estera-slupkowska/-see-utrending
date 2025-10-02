import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Mail,
  Instagram,
  Twitter,
  Heart,
  Star,
  Send,
  ExternalLink,
  Shield,
  FileText,
  Users,
  Trophy,
  BookOpen,
  Gift
} from 'lucide-react'

export function Footer() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubscribing(true)
    // Simulate newsletter signup
    setTimeout(() => {
      setIsSubscribing(false)
      setEmail('')
      // Could integrate with real newsletter service
    }, 1000)
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-50 bg-slate-950 border-t border-purple-500/20 overflow-hidden">
      {/* Cosmic Footer Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle particles */}
        <div className="absolute top-10 left-10 w-1 h-1 bg-purple-400 rounded-full animate-twinkle opacity-30"></div>
        <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-25"></div>
        <div className="absolute bottom-10 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-35"></div>
        <div className="absolute bottom-20 right-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-twinkle opacity-30"></div>

        {/* Subtle glow effects */}
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-cyan-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold gradient-text">
                SeeUTrending
              </h3>
            </div>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Platforma która pozwalam zwykłym użytkownikom zdobywać nagrody za ich aktywność na TikToku!
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://tiktok.com/@seeutrending"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-surface-light hover:bg-purple-500/20 rounded-xl transition-all duration-300 hover:scale-110 group border border-border hover:border-purple-400/60"
              >
                <svg className="w-5 h-5 text-text-muted group-hover:text-pink-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/seeutrending"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-surface-light hover:bg-purple-500/20 rounded-xl transition-all duration-300 hover:scale-110 group border border-border hover:border-purple-400/60"
              >
                <Instagram className="w-5 h-5 text-text-muted group-hover:text-pink-400 transition-colors" />
              </a>
              <a
                href="https://twitter.com/seeutrending"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-surface-light hover:bg-purple-500/20 rounded-xl transition-all duration-300 hover:scale-110 group border border-border hover:border-purple-400/60"
              >
                <Twitter className="w-5 h-5 text-text-muted group-hover:text-cyan-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Platforma
            </h4>
            <nav className="space-y-3">
              <Link
                to="/contests"
                className="block text-text-secondary hover:text-primary transition-colors duration-300 hover:translate-x-1 transform"
              >
                Konkursy
              </Link>
              <Link
                to="/users"
                className="block text-text-secondary hover:text-primary transition-colors duration-300 hover:translate-x-1 transform"
              >
                Użytkownicy
              </Link>
              <Link
                to="/rewards"
                className="block text-text-secondary hover:text-primary transition-colors duration-300 hover:translate-x-1 transform"
              >
                Nagrody
              </Link>
              <Link
                to="/education-hub"
                className="block text-text-secondary hover:text-primary transition-colors duration-300 hover:translate-x-1 transform"
              >
                Education Hub
              </Link>
            </nav>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Wsparcie
            </h4>
            <nav className="space-y-3">
              <a
                href="mailto:support@seeutrending.com"
                className="block text-text-secondary hover:text-primary transition-colors duration-300 hover:translate-x-1 transform"
              >
                Kontakt
              </a>
              <a
                href="/regulamin"
                className="block text-text-secondary hover:text-primary transition-colors duration-300 hover:translate-x-1 transform"
              >
                Regulamin
              </a>
              <a
                href="/prywatnosc"
                className="block text-text-secondary hover:text-primary transition-colors duration-300 hover:translate-x-1 transform"
              >
                Polityka Prywatności
              </a>
              <a
                href="/pomoc"
                className="block text-text-secondary hover:text-primary transition-colors duration-300 hover:translate-x-1 transform"
              >
                Centrum Pomocy
              </a>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" />
              Newsletter
            </h4>
            <p className="text-text-secondary mb-4 text-sm">
              Bądź na bieżąco z nowościami i ekskluzywnymi konkursami!
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Twój email"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  disabled={isSubscribing}
                />
              </div>

              <button
                type="submit"
                disabled={isSubscribing || !email}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                {isSubscribing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Zapisz się
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <span>© {currentYear} SeeUTrending.</span>
              <span>Stworzone z</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>w Polsce</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-400" />
                Społeczność twórców
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 animate-twinkle" />
                Powered by AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}