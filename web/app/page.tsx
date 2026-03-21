import { TeamSetupForm } from '@/components/landing/TeamSetupForm'
import { BrowserCheck } from '@/components/landing/BrowserCheck'
import { AICRLogo } from '@/components/brand/AICRLogo'
import { GCUBadge } from '@/components/brand/GCUBadge'

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <AICRLogo size="lg" />
        </div>
        <h1
          className="text-5xl font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Rally Kit
        </h1>
        <p className="text-xl mb-4" style={{ color: 'var(--text-secondary)' }}>
          3 Hours &middot; Build a Real App with AI
        </p>
        <GCUBadge />
      </div>
      <BrowserCheck />
      <TeamSetupForm />
    </div>
  )
}
