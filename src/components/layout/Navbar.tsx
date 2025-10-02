import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { Button, Badge } from '../ui'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useAuth } from '../../lib/auth/context'
import { useAuthForm, usePermissions } from '../../lib/auth/hooks'

export function Navbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const { signOut } = useAuthForm()
  const { isCreator, isBrand, isSpectator, isAdmin } = usePermissions()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    const success = await signOut()
    if (success) {
      navigate('/')
    }
  }

  const getUserRole = () => {
    if (isCreator()) return 'creator'
    if (isBrand()) return 'brand'
    if (isSpectator()) return 'spectator'
    return 'user'
  }

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Użytkownik'

  return (
    <nav className="bg-background-light/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <h1 className="text-2xl font-display font-bold gradient-text hover:opacity-80 transition-opacity">
                  SeeUTrending
                </h1>
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8 min-w-0 flex-shrink-0">
              <Link
                to="/"
                className="text-text-primary hover:text-primary transition-colors duration-200 px-3 py-2 text-sm font-medium whitespace-nowrap"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/contests"
                className="text-text-secondary hover:text-primary transition-colors duration-200 px-3 py-2 text-sm font-medium whitespace-nowrap"
              >
                {t('nav.contests')}
              </Link>
              <Link
                to="/education-hub"
                className="text-text-secondary hover:text-primary transition-colors duration-200 px-3 py-2 text-sm font-medium whitespace-nowrap"
              >
                {t('nav.education_hub')}
              </Link>
              <Link
                to="/rewards"
                className="text-text-secondary hover:text-primary transition-colors duration-200 px-3 py-2 text-sm font-medium whitespace-nowrap"
              >
                {t('nav.rewards')}
              </Link>
              {user && (
                <Link
                  to="/users"
                  className="text-text-secondary hover:text-primary transition-colors duration-200 px-3 py-2 text-sm font-medium whitespace-nowrap"
                >
                  Użytkownicy
                </Link>
              )}
              {!user && (
                <Link
                  to="/brands"
                  className="text-text-secondary hover:text-primary transition-colors duration-200 px-3 py-2 text-sm font-medium whitespace-nowrap"
                >
                  {t('nav.brands')}
                </Link>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {/* Auth section */}
            {loading ? (
              <div className="hidden md:block">
                <div className="animate-pulse bg-surface h-8 w-24 rounded"></div>
              </div>
            ) : user ? (
              // Authenticated user dropdown
              <div className="hidden md:flex items-center space-x-3 relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-text-primary hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-surface"
                >
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">{userName}</span>
                  <Badge variant="primary" size="sm">
                    {t(`auth.roles.${getUserRole()}.title`)}
                  </Badge>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="font-medium text-text-primary">{userName}</p>
                      <p className="text-sm text-text-muted">{user.email}</p>
                    </div>
                    
                    {/* Show Admin Panel for admins, Dashboard for others */}
                    {isAdmin() ? (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="font-medium">Admin Panel</span>
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-text-primary hover:bg-surface-light transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Panel użytkownika</span>
                      </Link>
                    )}
                    
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-text-primary hover:bg-surface-light transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Ustawienia</span>
                    </Link>
                    
                    <hr className="my-2 border-border" />
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-2 text-error-red hover:bg-error-red/10 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Wyloguj się</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Unauthenticated user buttons
              <div className="hidden md:flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/auth/login')}
                >
                  {t('nav.login')}
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/auth/register')}
                >
                  {t('nav.signup')}
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="bg-surface p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-light focus:outline-none focus:ring-2 focus:ring-primary"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-surface">
          <Link
            to="/"
            className="text-text-primary hover:text-primary block px-3 py-2 text-base font-medium"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/contests"
            className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium"
          >
            {t('nav.contests')}
          </Link>
          <Link
            to="/education-hub"
            className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium"
          >
            {t('nav.education_hub')}
          </Link>
          <Link
            to="/rewards"
            className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium"
          >
            {t('nav.rewards')}
          </Link>
          <Link
            to="/brands"
            className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium"
          >
            {t('nav.brands')}
          </Link>
          <div className="flex space-x-2 px-3 py-2">
            <Button variant="ghost" size="sm" className="flex-1">
              {t('nav.login')}
            </Button>
            <Button size="sm" className="flex-1">
              {t('nav.signup')}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}