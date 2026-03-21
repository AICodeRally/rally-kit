'use client'

import { useState, useCallback, useRef } from 'react'
import type { WebContainer } from '@webcontainer/api'
import { bootWebContainer } from '@/lib/webcontainer/boot'
import { RallyHeader } from './RallyHeader'
import { DesignWorkspace } from './DesignWorkspace'
import { BuildWorkspace } from './BuildWorkspace'
import { BuildTransition } from './BuildTransition'
import { StatusBar } from './StatusBar'
import { SplashScreen } from './SplashScreen'
import type { TeamInfo, Phase, SandboxStatus, DesignIdea } from '@/lib/rally/types'

function sendTelemetry(teamName: string, status: string, detail?: string) {
  fetch('/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team: teamName, status, detail }),
  }).catch(() => {})  // fire-and-forget — never block UI
}

export function RallyShell({ team }: { team: TeamInfo }) {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null)
  const [sandboxStatus, setSandboxStatus] = useState<SandboxStatus>('idle')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('design')
  const [phaseStartedAt, setPhaseStartedAt] = useState(Date.now())
  const [modifiedFiles, setModifiedFiles] = useState<string[]>([])
  const [ideas, setIdeas] = useState<DesignIdea[]>([])
  const [showSplash, setShowSplash] = useState(true)
  const [showBuildTransition, setShowBuildTransition] = useState(false)
  const [bootDetail, setBootDetail] = useState<string | undefined>()
  const bootStarted = useRef(false)

  const ensureWebContainer = useCallback(() => {
    if (bootStarted.current) return
    bootStarted.current = true
    setSandboxStatus('booting')

    sendTelemetry(team.name, 'booting')

    bootWebContainer((status, detail) => {
      setSandboxStatus(status)
      sendTelemetry(team.name, status, detail)
      if (detail) {
        setBootDetail(detail)
        console.log('[WebContainer]', status, detail)
      }
    }).then((result) => {
      setWebcontainer(result.webcontainer)
      setPreviewUrl(result.previewUrl)
      sendTelemetry(team.name, 'ready')
    }).catch((err) => {
      console.error('[WebContainer] Boot failed:', err)
      setSandboxStatus('error')
      sendTelemetry(team.name, 'error', err instanceof Error ? err.message : 'Boot failed')
    })
  }, [])

  const retryWebContainer = useCallback(() => {
    // WebContainer.boot() can only be called once per page —
    // the only reliable retry is a full page reload
    window.location.reload()
  }, [])

  const handleFileWritten = useCallback((path: string) => {
    setModifiedFiles((prev) => [path, ...prev.filter((p) => p !== path)])
    // First file write triggers auto-transition to build phase
    setPhase((p) => {
      if (p === 'design') {
        setPhaseStartedAt(Date.now())
        setShowBuildTransition(true)
        return 'build'
      }
      return p
    })
  }, [])

  const handlePhaseChange = useCallback((newPhase: Phase) => {
    setPhase((prev) => {
      if (prev === newPhase) return prev
      setPhaseStartedAt(Date.now())
      sendTelemetry(team.name, `phase:${newPhase}`)
      return newPhase
    })
    if (newPhase === 'build') {
      setShowBuildTransition(true)
      ensureWebContainer()
    }
  }, [ensureWebContainer])

  const handleAddIdea = useCallback((idea: DesignIdea) => {
    setIdeas((prev) => {
      if (prev.some((i) => i.title === idea.title)) return prev
      return [...prev, idea]
    })
  }, [])

  if (showSplash) {
    return <SplashScreen teamName={team.name} onComplete={() => setShowSplash(false)} />
  }

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <RallyHeader phase={phase} phaseStartedAt={phaseStartedAt} teamName={team.name} />

      {showBuildTransition && (
        <BuildTransition
          teamName={team.name}
          sandboxStatus={sandboxStatus}
          onComplete={() => setShowBuildTransition(false)}
        />
      )}

      {phase === 'design' ? (
        <DesignWorkspace
          team={team}
          webcontainer={webcontainer}
          ideas={ideas}
          onAddIdea={handleAddIdea}
          onFileWritten={handleFileWritten}
          onBuildRequested={ensureWebContainer}
          onIdeaCaptured={handleAddIdea}
          onPhaseChange={handlePhaseChange}
        />
      ) : (
        <BuildWorkspace
          team={team}
          webcontainer={webcontainer}
          sandboxStatus={sandboxStatus}
          sandboxDetail={bootDetail}
          previewUrl={previewUrl}
          modifiedFiles={modifiedFiles}
          onFileWritten={handleFileWritten}
          onBuildRequested={ensureWebContainer}
          onIdeaCaptured={handleAddIdea}
          onPhaseChange={handlePhaseChange}
          onRetry={retryWebContainer}
        />
      )}

      <StatusBar status={sandboxStatus} />
    </div>
  )
}
