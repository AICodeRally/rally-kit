'use client'

import { useState } from 'react'
import type { WebContainer } from '@webcontainer/api'
import { ChatPanel } from './ChatPanel'
import { PreviewPanel } from './PreviewPanel'
import { BootScreen } from './BootScreen'
import { MessageSquare, Monitor } from 'lucide-react'
import type { TeamInfo, Phase, SandboxStatus, DesignIdea } from '@/lib/rally/types'

interface BuildWorkspaceProps {
  team: TeamInfo
  webcontainer: WebContainer | null
  sandboxStatus: SandboxStatus
  previewUrl: string | null
  modifiedFiles: string[]
  onFileWritten: (path: string) => void
  onBuildRequested: () => void
  onIdeaCaptured?: (idea: DesignIdea) => void
  onPhaseChange?: (phase: Phase) => void
}

export function BuildWorkspace({
  team,
  webcontainer,
  sandboxStatus,
  previewUrl,
  modifiedFiles,
  onFileWritten,
  onBuildRequested,
  onIdeaCaptured,
  onPhaseChange,
}: BuildWorkspaceProps) {
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview'>('chat')
  const isReady = sandboxStatus === 'ready'
  const isBooting =
    sandboxStatus !== 'idle' && sandboxStatus !== 'ready' && sandboxStatus !== 'error'

  const previewContent = isReady ? (
    <PreviewPanel previewUrl={previewUrl} modifiedFiles={modifiedFiles} />
  ) : isBooting ? (
    <BootScreen status={sandboxStatus} />
  ) : (
    <div
      className="flex items-center justify-center h-full text-sm"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-muted)',
      }}
    >
      Preview will appear when you start building
    </div>
  )

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Mobile tab switcher — only on small screens */}
      <div
        className="flex md:hidden"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <button
          onClick={() => setMobileTab('chat')}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors"
          style={{
            color: mobileTab === 'chat' ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: mobileTab === 'chat' ? '2px solid var(--accent)' : '2px solid transparent',
          }}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors"
          style={{
            color: mobileTab === 'preview' ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: mobileTab === 'preview' ? '2px solid var(--accent)' : '2px solid transparent',
          }}
        >
          <Monitor className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* Desktop: side-by-side. Mobile: tab content */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Chat — 400px on desktop, shown/hidden on mobile */}
        <div className={`${mobileTab === 'chat' ? 'flex' : 'hidden'} md:flex w-full md:w-[400px] shrink-0 flex-col`}>
          <ChatPanel
            team={team}
            webcontainer={webcontainer}
            phase="build"
            onFileWritten={onFileWritten}
            onBuildRequested={onBuildRequested}
            onIdeaCaptured={onIdeaCaptured}
            onPhaseChange={onPhaseChange}
          />
        </div>

        {/* Preview — remaining space */}
        <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
          {previewContent}
        </div>
      </div>
    </div>
  )
}
