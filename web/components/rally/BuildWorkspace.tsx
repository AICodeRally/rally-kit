'use client'

import type { WebContainer } from '@webcontainer/api'
import { ChatPanel } from './ChatPanel'
import { PreviewPanel } from './PreviewPanel'
import { BootScreen } from './BootScreen'
import { RefreshCw } from 'lucide-react'
import type { TeamInfo, Phase, SandboxStatus, DesignIdea } from '@/lib/rally/types'

interface BuildWorkspaceProps {
  team: TeamInfo
  webcontainer: WebContainer | null
  sandboxStatus: SandboxStatus
  sandboxDetail?: string
  previewUrl: string | null
  modifiedFiles: string[]
  onFileWritten: (path: string) => void
  onBuildRequested: () => void
  onIdeaCaptured?: (idea: DesignIdea) => void
  onPhaseChange?: (phase: Phase) => void
  onRetry?: () => void
}

export function BuildWorkspace({
  team,
  webcontainer,
  sandboxStatus,
  sandboxDetail,
  previewUrl,
  modifiedFiles,
  onFileWritten,
  onBuildRequested,
  onIdeaCaptured,
  onPhaseChange,
  onRetry,
}: BuildWorkspaceProps) {
  const isReady = sandboxStatus === 'ready'
  const isBooting =
    sandboxStatus !== 'idle' && sandboxStatus !== 'ready' && sandboxStatus !== 'error'

  return (
    <div className="flex-1 flex flex-row min-h-0">
      {/* Chat — 480px fixed */}
      <div className="w-[480px] shrink-0">
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
        ) : sandboxStatus === 'error' ? (
          <div
            className="flex-1 flex flex-col items-center justify-center h-full gap-4 p-8"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Sandbox failed to start
            </p>
            <p className="text-base text-center max-w-md" style={{ color: 'var(--text-secondary)' }}>
              This can happen if the browser blocked WebContainers. Try refreshing or clicking retry.
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-6 py-3 text-base font-medium text-white rounded-lg"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <RefreshCw className="w-5 h-5" />
                Retry
              </button>
            )}
          </div>
        ) : isBooting ? (
          <BootScreen status={sandboxStatus} detail={sandboxDetail} />
        ) : (
          <div
            className="flex items-center justify-center h-full text-base"
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
