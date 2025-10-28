import { ReactNode } from 'react'
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthForm } from '../../lib/auth/hooks'
import { 
  LayoutDashboard,
  Trophy,
  Users,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Eye,
  FileText,
  Calendar
} from 'lucide-react'

export function AdminLayout() {
  const { signOut } = useAuthForm()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
      end: true
    },
    {
      path: '/admin/contests',
      icon: Trophy,
      label: 'Contests'
    },
    {
      path: '/admin/users',
      icon: Users,
      label: 'Users'
    },
    {
      path: '/admin/analytics',
      icon: BarChart3,
      label: 'Analytics'
    },
    {
      path: '/admin/content',
      icon: FileText,
      label: 'Content'
    },
    {
      path: '/admin/emails',
      icon: Bell,
      label: 'Emails'
    },
    {
      path: '/admin/settings',
      icon: Settings,
      label: 'Settings'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-surface/30 backdrop-blur-md border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ST</span>
              </div>
              <div>
                <h2 className="font-display font-bold text-white text-lg">SeeUTrending</h2>
                <p className="text-xs text-text-muted">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) => `
                        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-primary/20 text-primary border border-primary/30' 
                          : 'text-text-muted hover:text-white hover:bg-surface/50'
                        }
                      `}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-surface/20 backdrop-blur-sm border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Calendar className="w-5 h-5 text-text-muted" />
                <span className="text-text-muted text-sm">
                  {new Date().toLocaleDateString('pl-PL', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">System Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet key={location.pathname} />
          </main>
        </div>
      </div>
    </div>
  )
}