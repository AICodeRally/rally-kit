'use client'

import { useEffect, useState, useCallback } from 'react'
import type { WebContainer } from '@webcontainer/api'
import { bootWebContainer } from '@/lib/webcontainer/boot'
import { ChatPanel } from './ChatPanel'
import { PreviewPanel } from './PreviewPanel'
import { StatusBar } from './StatusBar'
import { PhaseIndicator } from './PhaseIndicator'
import { BootScreen } from './BootScreen'
import type { TeamInfo, Phase, SandboxStatus } from '@/lib/rally/types'

export function RallyShell({ team }: { team: TeamInfo }) {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null)
  const [sandboxStatus, setSandboxStatus] = useState<SandboxStatus>('booting')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [phase] = useState<Phase>('design')
  const [phaseStartedAt] = useState(Date.now())
  const [modifiedFiles, setModifiedFiles] = useState<string[]>([])

  // Boot WebContainer on mount
  useEffect(() => {
    let cancelled = false
    bootWebContainer((status) => {
      if (!cancelled) setSandboxStatus(status)
    }).then((result) => {
      if (!cancelled) {
        setWebcontainer(result.webcontainer)
        setPreviewUrl(result.previewUrl)
      }
    }).catch(() => {
      if (!cancelled) setSandboxStatus('error')
    })
    return () => { cancelled = true }
  }, [])

  const handleFileWritten = useCallback((path: string) => {
    setModifiedFiles((prev) => [path, ...prev.filter((p) => p !== path)])
  }, [])

  const isReady = sandboxStatus === 'ready'

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="h-10 px-4 flex items-center justify-between bg-white border-b border-gray-200">
        <span className="text-sm font-semibold">Vibe Code Rally</span>
        <PhaseIndicator phase={phase} startedAt={phaseStartedAt} />
        <span className="text-sm text-gray-500">{team.name}</span>
      </header>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Chat — 400px fixed */}
        <div className="w-[400px] shrink-0">
          <ChatPanel
            team={team}
            webcontainer={webcontainer}
            onFileWritten={handleFileWritten}
          />
        </div>

        {/* Preview — remaining space */}
        {isReady ? (
          <PreviewPanel previewUrl={previewUrl} modifiedFiles={modifiedFiles} />
        ) : (
          <BootScreen status={sandboxStatus} />
        )}
      </div>

      {/* Status bar */}
      <StatusBar status={sandboxStatus} />
    </div>
  )
}
