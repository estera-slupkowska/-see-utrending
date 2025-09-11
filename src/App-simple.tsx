import './lib/i18n/config'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/auth/context'
import { Navbar } from './components/layout/Navbar'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { BrandPage } from './pages/BrandPage'
import { EducationHubPage } from './pages/EducationHubPage'
import { RewardsPage } from './pages/RewardsPage'
import { ContestsPage } from './pages/ContestsPage'
import { UserInfo } from './components/debug/UserInfo'

function App() {
  return (
    <AuthProvider>
      <UserInfo />
      <Router>
        <Routes>
          {/* Admin routes temporarily disabled - will work after database setup */}
          <Route 
            path="/admin/*" 
            element={
              <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                  <h1 className="text-2xl font-bold text-white">Admin Panel Setup Required</h1>
                  <p className="text-text-muted">Please run the SQL script in Supabase first</p>
                  <p className="text-sm text-purple-400">Check SETUP_INSTRUCTIONS.md for details</p>
                </div>
              </div>
            }
          />

          {/* Public routes with navbar */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen bg-background">
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/brands" element={<BrandPage />} />
                    <Route path="/education-hub" element={<EducationHubPage />} />
                    <Route path="/rewards" element={<RewardsPage />} />
                    <Route path="/contests" element={<ContestsPage />} />
                    <Route path="/auth/login" element={<AuthPage mode="login" />} />
                    <Route path="/auth/register" element={<AuthPage mode="register" />} />
                    
                    {/* Protected routes */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App