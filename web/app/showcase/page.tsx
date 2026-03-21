'use client'

import { useState, useEffect } from 'react'
import { AICRLogo } from '@/components/brand/AICRLogo'
import { GCUBadge } from '@/components/brand/GCUBadge'
import { PasscodeGate } from '@/components/landing/PasscodeGate'

interface TeamData {
  track?: string
  phase: string
  phaseStartedAt: string
  appIterations: number
  lastSeen: string
  eventCount: number
  phaseElapsedSec: number
}

const PHASE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  design: { label: 'Designing', color: '#3b82f6', bg: '#eff6ff' },
  build: { label: 'Building', color: '#10b981', bg: '#ecfdf5' },
  polish: { label: 'Polishing', color: '#8b5cf6', bg: '#f5f3ff' },
}

const TRACK_LABELS: Record<string, string> = {
  campus: 'Campus AI',
  startup: 'Startup AI',
  future: 'My Future',
}

function formatElapsed(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function TeamCard({ name, data }: { name: string; data: TeamData }) {
  const phase = PHASE_CONFIG[data.phase] ?? PHASE_CONFIG.design
  const stale = Date.now() - new Date(data.lastSeen).getTime() > 120_000 // 2min no activity

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 transition-all"
      style={{
        backgroundColor: '#fff',
        border: `2px solid ${stale ? '#e5e7eb' : phase.color}`,
        opacity: stale ? 0.5 : 1,
      }}
    >
      {/* Team name + track */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold truncate" style={{ color: '#111827' }}>
          {name}
        </h3>
        {data.track && (
          <span
            className="text-xs px-2 py-0.5 rounded-full shrink-0 font-medium"
            style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
          >
            {TRACK_LABELS[data.track] ?? data.track}
          </span>
        )}
      </div>

      {/* Phase indicator */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ backgroundColor: phase.bg }}
      >
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{
            backgroundColor: phase.color,
            animation: !stale ? 'pulse-dot 2s infinite' : 'none',
          }}
        />
        <span className="text-sm font-semibold" style={{ color: phase.color }}>
          {phase.label}
        </span>
        <span className="text-sm font-mono ml-auto" style={{ color: phase.color }}>
          {formatElapsed(data.phaseElapsedSec)}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-xs" style={{ color: '#9ca3af' }}>
        <span>
          {data.appIterations > 0
            ? `${data.appIterations} app update${data.appIterations === 1 ? '' : 's'}`
            : 'No app yet'}
        </span>
        <span>{data.eventCount} events</span>
      </div>
    </div>
  )
}

function ShowcaseContent() {
  const [teams, setTeams] = useState<Record<string, TeamData>>({})
  const [totalTeams, setTotalTeams] = useState(0)
  const [lastFetch, setLastFetch] = useState<string>('')

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch('/api/telemetry')
        if (res.ok) {
          const data = await res.json()
          setTeams(data.teams ?? {})
          setTotalTeams(data.totalTeams ?? 0)
          setLastFetch(new Date().toLocaleTimeString())
        }
      } catch { /* network error — keep showing last data */ }
    }

    poll()
    const interval = setInterval(poll, 5000)
    return () => clearInterval(interval)
  }, [])

  const teamEntries = Object.entries(teams)

  // Count by phase
  const phaseCounts = { design: 0, build: 0, polish: 0 }
  for (const [, data] of teamEntries) {
    if (data.phase in phaseCounts) {
      phaseCounts[data.phase as keyof typeof phaseCounts]++
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb' }}
      >
        <div className="flex items-center gap-4">
          <AICRLogo size="md" />
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#111827' }}>Rally Showcase</h1>
            <GCUBadge />
          </div>
        </div>

        {/* Phase summary pills */}
        <div className="flex items-center gap-3">
          {Object.entries(PHASE_CONFIG).map(([key, cfg]) => (
            <div
              key={key}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ backgroundColor: cfg.bg, color: cfg.color }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
              {cfg.label}: {phaseCounts[key as keyof typeof phaseCounts]}
            </div>
          ))}
          <span className="text-sm font-mono" style={{ color: '#9ca3af' }}>
            {totalTeams} team{totalTeams !== 1 ? 's' : ''} &middot; {lastFetch}
          </span>
        </div>
      </header>

      {/* Team grid */}
      <main className="p-6">
        {teamEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-6xl mb-4" style={{ color: '#d1d5db' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#374151' }}>
              Waiting for teams...
            </h2>
            <p className="text-base" style={{ color: '#9ca3af' }}>
              Teams will appear here as they start their rally sessions.
            </p>
            <p className="text-sm mt-4 font-mono" style={{ color: '#d1d5db' }}>
              Polling every 5 seconds
            </p>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${Math.min(5, Math.ceil(Math.sqrt(teamEntries.length + 1)))}, 1fr)`,
            }}
          >
            {teamEntries.map(([name, data]) => (
              <TeamCard key={name} name={name} data={data} />
            ))}
          </div>
        )}
      </main>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}

export default function ShowcasePage() {
  return (
    <PasscodeGate passcode="youshallnotpass" storageKey="rally-judges-passcode" label="Judges Passcode">
      <ShowcaseContent />
    </PasscodeGate>
  )
}
