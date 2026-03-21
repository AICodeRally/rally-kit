'use client'

import { useState } from 'react'
import { TeamSetupForm } from '@/components/landing/TeamSetupForm'
import { PasscodeGate } from '@/components/landing/PasscodeGate'
import { AICRLogo } from '@/components/brand/AICRLogo'
import { GCUBadge } from '@/components/brand/GCUBadge'
import { useRouter } from 'next/navigation'
import { Users, Trophy } from 'lucide-react'

function StudentSetup({ onBack }: { onBack: () => void }) {
  return (
    <PasscodeGate passcode="GCUAICR032526" storageKey="rally-passcode" label="Student Passcode">
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
          <p className="text-xl mb-1" style={{ color: 'var(--text-secondary)' }}>
            Stop Planning. Start Building.
          </p>
          <p className="text-base mb-4" style={{ color: 'var(--text-muted)' }}>
            3 hours to design, build, and ship a real app with AI
          </p>
          <GCUBadge />
        </div>
        <TeamSetupForm />
        <button
          onClick={onBack}
          className="mt-6 text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          &larr; Back
        </button>
      </div>
    </PasscodeGate>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'pick' | 'student'>('pick')

  if (mode === 'student') {
    return <StudentSetup onBack={() => setMode('pick')} />
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <AICRLogo size="lg" />
        </div>
        <h1
          className="text-5xl font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Rally Kit
        </h1>
        <p className="text-xl mb-1" style={{ color: 'var(--text-secondary)' }}>
          Stop Planning. Start Building.
        </p>
        <p className="text-base mb-4" style={{ color: 'var(--text-muted)' }}>
          Your team. Your idea. Your app. 3 hours. Go.
        </p>
        <GCUBadge />
      </div>

      {/* 3-step explainer */}
      <div className="flex gap-8 mb-10 w-full max-w-lg justify-center">
        {[
          { step: '1', label: 'Design', desc: '30 min', color: '#3b82f6' },
          { step: '2', label: 'Build', desc: '90 min', color: '#10b981' },
          { step: '3', label: 'Polish', desc: '30 min', color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={s.step} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: s.color }}
            >
              {s.step}
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.label}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.desc}</div>
            </div>
            {i < 2 && (
              <span className="ml-2 text-lg" style={{ color: 'var(--text-muted)' }}>&rarr;</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-6 w-full max-w-lg">
        <button
          onClick={() => setMode('student')}
          className="flex-1 flex flex-col items-center gap-4 p-8 rounded-2xl transition-all hover:scale-[1.02]"
          style={{
            backgroundColor: 'var(--bg-muted)',
            border: '2px solid var(--border)',
          }}
        >
          <Users className="w-12 h-12" style={{ color: 'var(--accent)' }} />
          <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Students
          </span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Set up your team and start building
          </span>
        </button>

        <button
          onClick={() => router.push('/showcase')}
          className="flex-1 flex flex-col items-center gap-4 p-8 rounded-2xl transition-all hover:scale-[1.02]"
          style={{
            backgroundColor: 'var(--bg-muted)',
            border: '2px solid var(--border)',
          }}
        >
          <Trophy className="w-12 h-12" style={{ color: 'var(--accent)' }} />
          <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Judges
          </span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Watch all teams build in real time
          </span>
        </button>
      </div>

      <p className="mt-8 text-xs" style={{ color: 'var(--text-muted)' }}>
        Powered by <span className="font-semibold">AI Code Rally</span> &middot; aicoderally.com
      </p>
    </div>
  )
}
