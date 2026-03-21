'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { RallyHeader } from './RallyHeader'
import { ChatPanel } from './ChatPanel'
import { PreviewPanel } from './PreviewPanel'
import { IdeaBoard } from './IdeaBoard'
import { DesignStepper } from './DesignStepper'
import { StatusBar } from './StatusBar'
import { SplashScreen } from './SplashScreen'
import type { TeamInfo, Phase, DesignIdea } from '@/lib/rally/types'
import type { DocType } from './DocPanel'

class RallyErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen p-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="text-center max-w-md space-y-4">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Something went wrong</h1>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              Don&apos;t worry — your app is saved. Try refreshing the page.
            </p>
            <pre className="text-xs text-left p-3 rounded-lg overflow-auto" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }}>
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 text-white rounded-lg font-medium"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function sendTelemetry(teamSlug: string, status: string, detail?: string, track?: string) {
  fetch('/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-rally-key': 'gcu2526' },
    body: JSON.stringify({ team: teamSlug, status, detail, track }),
  }).catch(() => {})  // fire-and-forget
}

function sendShowcaseSnapshot(payload: {
  teamId: string
  teamName: string
  track: TeamInfo['track']
  phase: Phase
  shell?: 'mobile' | 'dashboard' | 'portfolio'
  appHtml: string
}) {
  fetch('/api/showcase/snapshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-rally-key': 'gcu2526' },
    body: JSON.stringify(payload),
  }).catch(() => {}) // fire-and-forget
}

function storageKey(slug: string, key: string) {
  return `rally-${slug}-${key}`
}

function ConfettiBurst({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000)
    return () => clearTimeout(timer)
  }, [onDone])

  // 40 random confetti pieces with CSS animation
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1.5,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][i % 6],
    size: 6 + Math.random() * 6,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.size > 9 ? '50%' : '2px',
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export function RallyShell({ team }: { team: TeamInfo }) {
  // Server-safe defaults — sessionStorage restored in useEffect to avoid hydration mismatch
  const [appHtml, setAppHtml] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('design')
  const [phaseStartedAt, setPhaseStartedAt] = useState(Date.now())
  const [ideas, setIdeas] = useState<DesignIdea[]>([])
  const [showSplash, setShowSplash] = useState(true)
  const [selectedShell, setSelectedShell] = useState<'mobile' | 'dashboard' | 'portfolio' | undefined>(undefined)
  const [hydrated, setHydrated] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [chatCollapsed, setChatCollapsed] = useState(false)
  const [docs, setDocs] = useState<Record<DocType, string>>({ prd: '', uid: '', qad: '', matrix: '' })

  // Restore persisted state from sessionStorage after mount (client-only)
  useEffect(() => {
    try {
      const savedHtml = sessionStorage.getItem(storageKey(team.slug, 'appHtml'))
      const savedPhase = sessionStorage.getItem(storageKey(team.slug, 'phase')) as Phase | null
      const savedShell = sessionStorage.getItem(storageKey(team.slug, 'shell')) as 'mobile' | 'dashboard' | 'portfolio' | null

      if (savedHtml) {
        setAppHtml(savedHtml)
        setShowSplash(false)
      }
      if (savedPhase) setPhase(savedPhase)
      if (savedShell) setSelectedShell(savedShell)
    } catch {
      // Safari private browsing or strict policies block sessionStorage
    }
    setHydrated(true)
  }, [team.slug])

  // Persist critical state to sessionStorage (only after hydration to avoid overwriting with defaults)
  useEffect(() => {
    if (hydrated && appHtml) {
      try { sessionStorage.setItem(storageKey(team.slug, 'appHtml'), appHtml) } catch { /* quota exceeded — app still works, just won't survive refresh */ }
    }
  }, [appHtml, team.slug, hydrated])

  useEffect(() => {
    if (hydrated) {
      try { sessionStorage.setItem(storageKey(team.slug, 'phase'), phase) } catch {}
    }
  }, [phase, team.slug, hydrated])

  useEffect(() => {
    if (hydrated && selectedShell) {
      try { sessionStorage.setItem(storageKey(team.slug, 'shell'), selectedShell) } catch {}
    }
  }, [selectedShell, team.slug, hydrated])

  // Send initial telemetry with track info
  useEffect(() => {
    if (hydrated) {
      sendTelemetry(team.slug, 'session:start', team.name, team.track)
    }
  }, [hydrated, team.slug, team.name, team.track])

  const handleAppUpdate = useCallback((html: string) => {
    setAppHtml((prev) => {
      // First app write — show confetti!
      if (!prev) setShowConfetti(true)
      return html
    })
    sendTelemetry(team.slug, 'app:updated')
    sendShowcaseSnapshot({
      teamId: team.slug,
      teamName: team.name,
      track: team.track,
      phase,
      shell: selectedShell,
      appHtml: html,
    })
  }, [phase, selectedShell, team.slug, team.name, team.track])

  const handleFileWritten = useCallback(() => {
    setPhase((p) => {
      if (p === 'design') {
        setPhaseStartedAt(Date.now())
        return 'build'
      }
      return p
    })
  }, [])

  const handlePhaseChange = useCallback((newPhase: Phase) => {
    setPhase((prev) => {
      if (prev === newPhase) return prev
      setPhaseStartedAt(Date.now())
      sendTelemetry(team.slug, `phase:${newPhase}`)
      return newPhase
    })
  }, [team.slug])

  // Keep showcase cards alive even without new code writes.
  useEffect(() => {
    if (!hydrated || !appHtml) return
    const interval = setInterval(() => {
      sendShowcaseSnapshot({
        teamId: team.slug,
        teamName: team.name,
        track: team.track,
        phase,
        shell: selectedShell,
        appHtml,
      })
    }, 15000)
    return () => clearInterval(interval)
  }, [hydrated, appHtml, phase, selectedShell, team.slug, team.name, team.track])

  // Publish metadata changes (phase/shell) to showcase even if code stayed the same.
  useEffect(() => {
    if (!hydrated || !appHtml) return
    sendShowcaseSnapshot({
      teamId: team.slug,
      teamName: team.name,
      track: team.track,
      phase,
      shell: selectedShell,
      appHtml,
    })
  }, [hydrated, appHtml, phase, selectedShell, team.slug, team.name, team.track])

  const handleDocUpdate = useCallback((type: DocType, content: string) => {
    setDocs((prev) => ({ ...prev, [type]: content }))
  }, [])

  const handleAddIdea = useCallback((idea: DesignIdea) => {
    setIdeas((prev) => {
      if (prev.some((i) => i.title === idea.title)) return prev
      if (idea.category === 'shell') {
        const lower = idea.title.toLowerCase()
        if (lower.includes('mobile')) setSelectedShell('mobile')
        else if (lower.includes('dashboard')) setSelectedShell('dashboard')
        else if (lower.includes('portfolio')) setSelectedShell('portfolio')
      }
      return [...prev, idea]
    })
  }, [])

  // Wait for hydration before rendering anything — prevents flash of wrong state
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="animate-pulse text-lg" style={{ color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    )
  }

  if (showSplash) {
    return <SplashScreen teamName={team.name} onComplete={() => setShowSplash(false)} />
  }

  // ChatPanel is ALWAYS mounted — never unmounted during phase transitions.
  // This preserves the entire chat conversation and useChat state across design → build → polish.
  // The layout changes around it based on phase.
  return (
    <RallyErrorBoundary>
      <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <RallyHeader phase={phase} phaseStartedAt={phaseStartedAt} teamName={team.name} team={team} />

        <div className="flex-1 flex flex-col min-h-0">
          {phase === 'design' && <DesignStepper ideas={ideas} />}

          <div className="flex-1 flex flex-row min-h-0">
            {/* Chat — width changes by phase but component stays mounted */}
            <div
              className={
                phase === 'design'
                  ? 'flex-[2] min-w-0'
                  : chatCollapsed
                    ? 'w-0 overflow-hidden'
                    : 'w-[480px] shrink-0'
              }
              style={{ transition: 'width 0.3s ease' }}
            >
              <ChatPanel
                team={team}
                phase={phase}
                onAppUpdate={handleAppUpdate}
                onFileWritten={handleFileWritten}
                onIdeaCaptured={handleAddIdea}
                onPhaseChange={handlePhaseChange}
                onDocUpdate={handleDocUpdate}
              />
            </div>

            {/* Right panel — IdeaBoard in design, PreviewPanel in build/polish */}
            {phase === 'design' ? (
              <div className="w-[300px] shrink-0">
                <IdeaBoard ideas={ideas} onAddIdea={handleAddIdea} />
              </div>
            ) : (
              <div className="flex-1 flex relative">
                {/* Toggle button to collapse/expand chat */}
                <button
                  onClick={() => setChatCollapsed((c) => !c)}
                  className="absolute top-3 left-3 z-10 flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                  }}
                  title={chatCollapsed ? 'Show chat' : 'Hide chat for more space'}
                  aria-label={chatCollapsed ? 'Show chat' : 'Hide chat'}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    {chatCollapsed ? (
                      <path d="M6 3l5 5-5 5" />
                    ) : (
                      <path d="M10 3l-5 5 5 5" />
                    )}
                  </svg>
                </button>
                <PreviewPanel appHtml={appHtml} shell={selectedShell} teamName={team.name} building={!appHtml} phase={phase} docs={docs} />
              </div>
            )}
          </div>
        </div>

        <StatusBar phase={phase} />

        {/* Confetti burst on first build */}
        {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}
      </div>
    </RallyErrorBoundary>
  )
}
