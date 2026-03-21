'use client'

import { useState } from 'react'
import type { WebContainer } from '@webcontainer/api'
import { ChatPanel } from './ChatPanel'
import { IdeaBoard } from './IdeaBoard'
import { DesignStepper } from './DesignStepper'
import { MessageSquare, Lightbulb } from 'lucide-react'
import type { TeamInfo, Phase, DesignIdea } from '@/lib/rally/types'

interface DesignWorkspaceProps {
  team: TeamInfo
  webcontainer: WebContainer | null
  ideas: DesignIdea[]
  onAddIdea: (idea: DesignIdea) => void
  onFileWritten: (path: string) => void
  onBuildRequested: () => void
  onIdeaCaptured: (idea: DesignIdea) => void
  onPhaseChange: (phase: Phase) => void
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
  const [mobileTab, setMobileTab] = useState<'chat' | 'ideas'>('chat')

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Stepper */}
      <DesignStepper ideas={ideas} />

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
          onClick={() => setMobileTab('ideas')}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors"
          style={{
            color: mobileTab === 'ideas' ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: mobileTab === 'ideas' ? '2px solid var(--accent)' : '2px solid transparent',
          }}
        >
          <Lightbulb className="w-4 h-4" />
          Ideas {ideas.length > 0 && `(${ideas.length})`}
        </button>
      </div>

      {/* Chat + Ideas board */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Chat — full width (no 400px constraint in design phase) */}
        <div className={`${mobileTab === 'chat' ? 'flex' : 'hidden'} md:flex flex-[2] min-w-0 flex-col`}>
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
        <div className={`${mobileTab === 'ideas' ? 'flex' : 'hidden'} md:flex w-full md:w-[300px] shrink-0 flex-col`}>
          <IdeaBoard ideas={ideas} onAddIdea={onAddIdea} />
        </div>
      </div>
    </div>
  )
}
