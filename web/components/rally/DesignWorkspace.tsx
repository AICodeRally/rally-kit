'use client'

import type { WebContainer } from '@webcontainer/api'
import { ChatPanel } from './ChatPanel'
import { IdeaBoard } from './IdeaBoard'
import { DesignStepper } from './DesignStepper'
import type { TeamInfo, DesignIdea } from '@/lib/rally/types'

interface DesignWorkspaceProps {
  team: TeamInfo
  webcontainer: WebContainer | null
  ideas: DesignIdea[]
  onAddIdea: (idea: DesignIdea) => void
  onFileWritten: (path: string) => void
  onBuildRequested: () => void
  onIdeaCaptured: (idea: DesignIdea) => void
  onPhaseChange: (phase: 'build') => void
}

export function DesignWorkspace({
  team,
  webcontainer,
  ideas,
  onAddIdea,
  onFileWritten,
  onBuildRequested,
  onIdeaCaptured,
  onPhaseChange,
}: DesignWorkspaceProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Stepper */}
      <DesignStepper ideas={ideas} />

      {/* Chat + Ideas board */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Chat — full width (no 400px constraint in design phase) */}
        <div className="flex-[2] min-w-0 h-1/2 md:h-auto">
          <ChatPanel
            team={team}
            webcontainer={webcontainer}
            phase="design"
            onFileWritten={onFileWritten}
            onBuildRequested={onBuildRequested}
            onIdeaCaptured={onIdeaCaptured}
            onPhaseChange={onPhaseChange}
          />
        </div>

        {/* Ideas board — right sidebar */}
        <div className="w-full md:w-[300px] shrink-0 h-1/2 md:h-auto">
          <IdeaBoard ideas={ideas} onAddIdea={onAddIdea} />
        </div>
      </div>
    </div>
  )
}
