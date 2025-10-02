import { useState } from 'react'
import { AccountSettings } from '../components/account/AccountSettings'
import { CosmicBackground } from '../components/ui'

export function ProfilePage() {
  const [showAccountSettings] = useState(true)

  return (
    <div className="min-h-screen bg-slate-950 main-content-area relative overflow-hidden">
      <CosmicBackground />

      <div className="relative z-10 py-12">
        {showAccountSettings && (
          <AccountSettings onClose={() => window.history.back()} />
        )}
      </div>
    </div>
  )
}
