import './lib/i18n/config'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/auth/context'
import { ErrorBoundary } from './components/ui'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminRoute } from './components/auth/AdminRoute'
import { AdminLayout } from './components/admin/AdminLayout'
import { LandingPage } from './pages/LandingPage'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { TestDashboard } from './pages/TestDashboard'
import { BrandPage } from './pages/BrandPage'
import { EducationHubPage } from './pages/EducationHubPage'
import { RewardsPage } from './pages/RewardsPage'
import { ContestsPage } from './pages/ContestsPage'
import { UsersPage } from './pages/UsersPage'
import { ProfilePage } from './pages/ProfilePage'
import { OAuthRedirect } from './pages/OAuthRedirect'
import { TermsOfService } from './pages/TermsOfService'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminUsers } from './pages/admin/AdminUsers'
import { ContestManagement } from './pages/admin/ContestManagement'
import { ContentManagement } from './pages/admin/ContentManagement'
import { EmailsPage } from './pages/admin/EmailsPage'
import { TikTokCallback } from './components/auth/TikTokCallback'

function App() {
  return (
    <ErrorBoundary>
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
            <Route path="contests" element={<ContestManagement />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="emails" element={<EmailsPage />} />
            <Route path="analytics" element={<div className="text-white p-6">Analytics - Coming Soon</div>} />
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
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/auth/login" element={<AuthPage mode="login" />} />
                    <Route path="/auth/register" element={<AuthPage mode="register" />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/oauth/redirect" element={<OAuthRedirect />} />
                    
                    {/* Protected routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
