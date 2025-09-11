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
import { AdminDashboard } from './pages/admin/AdminDashboard-working'
import { AdminRedirect } from './components/auth/AdminRedirect'
import { AdminDebug } from './components/debug/AdminDebug'

function App() {
  return (
    <AuthProvider>
      <AdminDebug />
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
                    
                    {/* Protected routes */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <AdminRedirect>
                            <DashboardPage />
                          </AdminRedirect>
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