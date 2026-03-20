import { TeamSetupForm } from '@/components/landing/TeamSetupForm'
import { BrowserCheck } from '@/components/landing/BrowserCheck'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2">Vibe Code Rally</h1>
        <p className="text-xl text-gray-500">
          GCU · 3 Hours · Build a Real App with AI
        </p>
      </div>
      <BrowserCheck />
      <TeamSetupForm />
    </div>
  )
}
