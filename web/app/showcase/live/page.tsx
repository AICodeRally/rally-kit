'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AICRLogo } from '@/components/brand/AICRLogo'
import { GCUBadge } from '@/components/brand/GCUBadge'
import { PasscodeGate } from '@/components/landing/PasscodeGate'
import { Maximize2, Minimize2, RotateCw, Users, X } from 'lucide-react'

interface LiveSnapshot {
  teamId: string
  teamName: string
  track: 'campus' | 'startup' | 'future'
  phase: 'design' | 'build' | 'polish'
  shell?: 'mobile' | 'dashboard' | 'portfolio'
  appHtml: string
  updatedAt: number
}

// ── Pre-registered teams from GCU signup ──
// Todd: paste team names from the signup sheet here before the event.
// These are the teams that SIGNED UP. We track who actually shows up.
const REGISTERED_TEAMS: string[] = [
  // 'Thunder Squad',
  // 'Code Monkeys',
  // ... paste from signup sheet
]

const PHASE_META: Record<LiveSnapshot['phase'], { label: string; border: string; bg: string; text: string }> = {
  design: { label: 'Design', border: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8' },
  build: { label: 'Build', border: '#10b981', bg: '#ecfdf5', text: '#047857' },
  polish: { label: 'Polish', border: '#8b5cf6', bg: '#f5f3ff', text: '#6d28d9' },
}

const TRACK_LABELS: Record<LiveSnapshot['track'], string> = {
  campus: 'Campus AI',
  startup: 'Startup AI',
  future: 'My Future',
}

function formatAge(ms: number): string {
  const sec = Math.max(0, Math.floor(ms / 1000))
  const min = Math.floor(sec / 60)
  const rem = sec % 60
  if (min <= 0) return `${rem}s ago`
  return `${min}m ${rem}s ago`
}

function teamGridColumns(count: number): number {
  if (count <= 1) return 1
  if (count <= 4) return 2
  if (count <= 9) return 3
  if (count <= 16) return 4
  return 5
}

// ── Team Preview Card ──
function TeamPreviewCard({
  snapshot,
  now,
  onClick,
}: {
  snapshot: LiveSnapshot
  now: number
  onClick: () => void
}) {
  const phaseMeta = PHASE_META[snapshot.phase]
  const ageMs = now - snapshot.updatedAt
  const stale = ageMs > 120_000

  return (
    <section
      className="rounded-xl overflow-hidden border shadow-sm cursor-pointer transition-transform hover:scale-[1.02]"
      style={{
        borderColor: stale ? '#d1d5db' : phaseMeta.border,
        backgroundColor: '#fff',
        opacity: stale ? 0.66 : 1,
      }}
      onClick={onClick}
    >
      <header className="px-3 py-2 flex items-center gap-2" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: stale ? '#9ca3af' : phaseMeta.border }}
        />
        <h2 className="text-sm font-semibold truncate" style={{ color: '#111827' }}>
          {snapshot.teamName}
        </h2>
        <span
          className="ml-auto text-[11px] px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: phaseMeta.bg, color: phaseMeta.text }}
        >
          {phaseMeta.label}
        </span>
      </header>

      <div className="relative w-full" style={{ backgroundColor: '#f3f4f6', aspectRatio: '16 / 10' }}>
        <iframe
          title={`${snapshot.teamName} preview`}
          srcDoc={snapshot.appHtml}
          sandbox="allow-scripts"
          className="absolute inset-0 w-full h-full border-0 pointer-events-none"
          loading="lazy"
        />
      </div>

      <footer
        className="px-3 py-2 text-[11px] flex items-center gap-2"
        style={{ color: '#6b7280', borderTop: '1px solid #e5e7eb' }}
      >
        <span>{TRACK_LABELS[snapshot.track]}</span>
        <span>&middot;</span>
        <span>{snapshot.shell ?? 'default shell'}</span>
        <span className="ml-auto">{formatAge(ageMs)}</span>
      </footer>
    </section>
  )
}

// ── Focus Mode (fullscreen single team) ──
function FocusView({
  snapshot,
  now,
  onClose,
}: {
  snapshot: LiveSnapshot
  now: number
  onClose: () => void
}) {
  const phaseMeta = PHASE_META[snapshot.phase]
  const ageMs = now - snapshot.updatedAt

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#000' }}>
      <header className="px-6 py-3 flex items-center gap-4" style={{ backgroundColor: '#111' }}>
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: phaseMeta.border }}
        />
        <h2 className="text-lg font-bold text-white truncate">{snapshot.teamName}</h2>
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ backgroundColor: phaseMeta.bg, color: phaseMeta.text }}
        >
          {phaseMeta.label}
        </span>
        <span className="text-xs text-gray-400">
          {TRACK_LABELS[snapshot.track]} &middot; {formatAge(ageMs)}
        </span>
        <button
          onClick={onClose}
          className="ml-auto p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </header>
      <div className="flex-1 relative">
        <iframe
          title={`${snapshot.teamName} focus`}
          srcDoc={snapshot.appHtml}
          sandbox="allow-scripts"
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    </div>
  )
}

// ── Attendance Panel ──
function AttendancePanel({
  snapshots,
  onClose,
}: {
  snapshots: LiveSnapshot[]
  onClose: () => void
}) {
  const checkedIn = new Set(snapshots.map((s) => s.teamName.toLowerCase().trim()))
  const registered = REGISTERED_TEAMS.filter(Boolean)
  const hasRoster = registered.length > 0

  return (
    <div
      className="fixed right-0 top-0 bottom-0 w-80 z-40 flex flex-col shadow-xl"
      style={{ backgroundColor: '#fff', borderLeft: '1px solid #e5e7eb' }}
    >
      <header className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <Users className="w-4 h-4" style={{ color: '#6b7280' }} />
        <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Attendance</h3>
        <span className="ml-auto text-xs font-mono" style={{ color: '#6b7280' }}>
          {snapshots.length} checked in
          {hasRoster && ` / ${registered.length} signed up`}
        </span>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
          <X className="w-4 h-4" style={{ color: '#6b7280' }} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Checked-in teams (from live snapshots) */}
        <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: '#10b981' }}>
          Checked In ({snapshots.length})
        </p>
        {snapshots.map((s) => {
          const phaseMeta = PHASE_META[s.phase]
          return (
            <div key={s.teamId} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: phaseMeta.border }} />
              <span className="text-sm font-medium truncate" style={{ color: '#111827' }}>{s.teamName}</span>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: phaseMeta.bg, color: phaseMeta.text }}>
                {phaseMeta.label}
              </span>
            </div>
          )
        })}

        {/* Not yet checked in (from roster) */}
        {hasRoster && (() => {
          const missing = registered.filter((name) => !checkedIn.has(name.toLowerCase().trim()))
          if (missing.length === 0) return null
          return (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wide mt-4 mb-2" style={{ color: '#ef4444' }}>
                Not Yet Here ({missing.length})
              </p>
              {missing.map((name) => (
                <div key={name} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ backgroundColor: '#fef2f2' }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#d1d5db' }} />
                  <span className="text-sm truncate" style={{ color: '#9ca3af' }}>{name}</span>
                </div>
              ))}
            </>
          )
        })()}
      </div>
    </div>
  )
}

// ── Main Showcase ──
function LiveShowcaseContent() {
  const [snapshots, setSnapshots] = useState<LiveSnapshot[]>([])
  const [lastPoll, setLastPoll] = useState('')
  const [now, setNow] = useState(Date.now())
  const [focusTeamId, setFocusTeamId] = useState<string | null>(null)
  const [autoRotate, setAutoRotate] = useState(false)
  const [showAttendance, setShowAttendance] = useState(false)

  // Poll for snapshots
  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch('/api/showcase/live', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as { snapshots?: LiveSnapshot[] }
        setSnapshots(Array.isArray(data.snapshots) ? data.snapshots : [])
        setLastPoll(new Date().toLocaleTimeString())
      } catch {}
    }

    poll()
    const pollInterval = setInterval(poll, 4000)
    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => { clearInterval(pollInterval); clearInterval(tick) }
  }, [])

  // Auto-rotate focus mode: cycle through teams every 12s
  useEffect(() => {
    if (!autoRotate || snapshots.length === 0) return

    // Start with first team if not focused
    if (!focusTeamId) setFocusTeamId(snapshots[0].teamId)

    const interval = setInterval(() => {
      setFocusTeamId((current) => {
        const idx = snapshots.findIndex((s) => s.teamId === current)
        const next = (idx + 1) % snapshots.length
        return snapshots[next].teamId
      })
    }, 12000)

    return () => clearInterval(interval)
  }, [autoRotate, snapshots, focusTeamId])

  const focusSnapshot = useMemo(
    () => snapshots.find((s) => s.teamId === focusTeamId),
    [snapshots, focusTeamId],
  )

  const handleCloseFocus = useCallback(() => {
    setFocusTeamId(null)
    setAutoRotate(false)
  }, [])

  const phaseCounts = useMemo(() => {
    const counts = { design: 0, build: 0, polish: 0 }
    for (const snap of snapshots) counts[snap.phase] += 1
    return counts
  }, [snapshots])

  const columns = teamGridColumns(snapshots.length)

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Focus overlay */}
      {focusSnapshot && (
        <FocusView snapshot={focusSnapshot} now={now} onClose={handleCloseFocus} />
      )}

      {/* Attendance panel */}
      {showAttendance && (
        <AttendancePanel snapshots={snapshots} onClose={() => setShowAttendance(false)} />
      )}

      {/* Header */}
      <header
        className="px-5 py-3 flex items-center justify-between gap-4 sticky top-0 z-10"
        style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb' }}
      >
        <div className="flex items-center gap-4">
          <AICRLogo size="sm" />
          <div>
            <h1 className="text-lg font-bold" style={{ color: '#111827' }}>Live App Showcase</h1>
            <GCUBadge />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-1 rounded-full" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
            Design {phaseCounts.design}
          </span>
          <span className="px-2 py-1 rounded-full" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
            Build {phaseCounts.build}
          </span>
          <span className="px-2 py-1 rounded-full" style={{ backgroundColor: '#f5f3ff', color: '#6d28d9' }}>
            Polish {phaseCounts.polish}
          </span>

          <span className="mx-1 text-gray-300">|</span>

          {/* Auto-rotate button */}
          <button
            onClick={() => {
              if (autoRotate) {
                setAutoRotate(false)
                setFocusTeamId(null)
              } else {
                setAutoRotate(true)
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: autoRotate ? '#dbeafe' : '#f3f4f6',
              color: autoRotate ? '#1d4ed8' : '#374151',
            }}
            title="Auto-rotate: fullscreen each team for 12 seconds"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={autoRotate ? { animationDuration: '3s' } : {}} />
            {autoRotate ? 'Rotating' : 'Auto-Rotate'}
          </button>

          {/* Attendance button */}
          <button
            onClick={() => setShowAttendance(!showAttendance)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: showAttendance ? '#dcfce7' : '#f3f4f6',
              color: showAttendance ? '#047857' : '#374151',
            }}
          >
            <Users className="w-3.5 h-3.5" />
            Attendance
          </button>

          <span className="ml-2 font-mono text-xs" style={{ color: '#6b7280' }}>
            {snapshots.length} teams &middot; {lastPoll || '...'}
          </span>
        </div>
      </header>

      {/* Grid */}
      <section className="p-4" style={{ marginRight: showAttendance ? '320px' : 0, transition: 'margin-right 0.3s ease' }}>
        {snapshots.length === 0 ? (
          <div className="h-[70vh] rounded-xl border flex items-center justify-center text-center p-8" style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
            <div>
              <p className="text-xl font-semibold" style={{ color: '#374151' }}>Waiting for team snapshots</p>
              <p className="text-sm mt-2">As teams build apps, their live previews appear here automatically.</p>
            </div>
          </div>
        ) : (
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {snapshots.map((snapshot) => (
              <TeamPreviewCard
                key={snapshot.teamId}
                snapshot={snapshot}
                now={now}
                onClick={() => { setAutoRotate(false); setFocusTeamId(snapshot.teamId) }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default function LiveShowcasePage() {
  return (
    <PasscodeGate passcode="youshallnotpass" storageKey="rally-live-showcase-passcode" label="Live Showcase Passcode">
      <LiveShowcaseContent />
    </PasscodeGate>
  )
}
