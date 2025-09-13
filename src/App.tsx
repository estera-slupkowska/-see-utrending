import './lib/i18n/config'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/auth/context'
import { Navbar } from './components/layout/Navbar'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminRoute } from './components/auth/AdminRoute'
import { AdminLayout } from './components/admin/AdminLayout'
import { LandingPage } from './pages/LandingPage'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { BrandPage } from './pages/BrandPage'
import { EducationHubPage } from './pages/EducationHubPage'
import { RewardsPage } from './pages/RewardsPage'
import { ContestsPage } from './pages/ContestsPage'
import { TermsOfService } from './pages/TermsOfService'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { AdminDashboard } from './pages/admin/AdminDashboard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin routes */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="contests" element={<div className="text-white p-6">Contest Management - Coming Soon</div>} />
            <Route path="users" element={<div className="text-white p-6">User Management - Coming Soon</div>} />
            <Route path="content" element={<div className="text-white p-6">Content Management - Coming Soon</div>} />
            <Route path="submissions" element={<div className="text-white p-6">Submissions - Coming Soon</div>} />
            <Route path="analytics" element={<div className="text-white p-6">Analytics - Coming Soon</div>} />
            <Route path="notifications" element={<div className="text-white p-6">Notifications - Coming Soon</div>} />
            <Route path="settings" element={<div className="text-white p-6">Settings - Coming Soon</div>} />
          </Route>

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
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/oauth/redirect" element={
                      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
                        <div className="max-w-md w-full mx-4">
                          <div className="bg-surface border border-border rounded-lg p-8 text-center">
                            <h1 className="text-2xl font-display font-bold text-white mb-4">
                              TikTok OAuth Callback
                            </h1>
                            <p className="text-gray-300 mb-4">
                              Processing your TikTok authentication...
                            </p>
                            <p className="text-sm text-gray-400">
                              URL: {window.location.href}
                            </p>
                            <div className="mt-6">
                              <button 
                                onClick={() => window.location.href = '/dashboard'} 
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                              >
                                Return to Dashboard
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    } />
                    
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
