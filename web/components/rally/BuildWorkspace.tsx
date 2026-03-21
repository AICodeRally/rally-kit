'use client'

import type { WebContainer } from '@webcontainer/api'
import { ChatPanel } from './ChatPanel'
import { PreviewPanel } from './PreviewPanel'
import { BootScreen } from './BootScreen'
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
  const isReady = sandboxStatus === 'ready'
  const isBooting =
    sandboxStatus !== 'idle' && sandboxStatus !== 'ready' && sandboxStatus !== 'error'

  return (
    <div className="flex-1 flex flex-row min-h-0">
      {/* Chat — 400px fixed */}
      <div className="w-[400px] shrink-0">
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
      <div className="flex-1">
        {isReady ? (
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
        )}
      </div>
    </div>
  )
}
