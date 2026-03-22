'use client'

import { useState } from 'react'
import {
  Play, HelpCircle, Hammer, Lightbulb, BarChart3,
  Sparkles, Presentation, Wrench, RotateCcw, ChevronUp,
} from 'lucide-react'

const COMMANDS = [
  { label: '/rally', description: 'Start over', icon: Play, phases: ['design', 'build', 'polish'] },
  { label: '/help', description: 'Show help', icon: HelpCircle, phases: ['design', 'build', 'polish'] },
  { label: '/brainstorm', description: 'Get ideas', icon: Lightbulb, phases: ['design'] },
  { label: '/build', description: 'Start building', icon: Hammer, phases: ['design'] },
  { label: '/status', description: 'See progress', icon: BarChart3, phases: ['design', 'build', 'polish'] },
  { label: '/polish', description: 'Polish mode', icon: Sparkles, phases: ['build', 'polish'] },
  { label: '/demo', description: 'Demo script', icon: Presentation, phases: ['polish', 'build'] },
  { label: '/fix', description: 'Fix an error', icon: Wrench, phases: ['build', 'polish'] },
  { label: '/score', description: 'Score your project', icon: BarChart3, phases: ['polish'] },
  { label: '/reset', description: 'Start completely over', icon: RotateCcw, phases: ['design', 'build', 'polish'] },
]

// One promoted CTA per phase — always visible outside the panel
// Design has NO CTA — /build is in commands only so students don't rush past design
const PHASE_CTA: Record<string, string> = {
  build: '/polish',
  polish: '/demo',
}

export function SlashToolbar({
  onCommand,
  phase = 'design',
}: {
  onCommand: (command: string) => void
  phase?: string
}) {
  const [open, setOpen] = useState(false)
  const visible = COMMANDS.filter((cmd) => cmd.phases.includes(phase as 'design'))
  const ctaLabel = PHASE_CTA[phase]
  const ctaCmd = visible.find((cmd) => cmd.label === ctaLabel)

  return (
    <div className="relative">
      {/* Slide-up command panel */}
      {open && (
        <div
          className="absolute bottom-full left-0 right-0 rounded-t-lg shadow-lg border border-b-0 py-2 px-2 z-20"
          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
        >
          <div className="grid grid-cols-2 gap-1.5">
            {visible.map((cmd) => {
              const Icon = cmd.icon
              return (
                <button
                  key={cmd.label}
                  onClick={() => { onCommand(cmd.label); setOpen(false) }}
                  className="flex items-center gap-2 px-3 py-2.5 min-h-[44px] text-sm rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
                >
                  <Icon className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
                  <div className="text-left min-w-0">
                    <span className="font-mono text-xs block">{cmd.label}</span>
                    <span className="text-xs block truncate" style={{ color: 'var(--text-muted)' }}>{cmd.description}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Always-visible bar: toggle + CTA */}
      <div className="py-1.5 px-2 flex items-center gap-2">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-sm rounded-lg transition-colors hover:opacity-80"
          style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }}
        >
          <ChevronUp className={`w-4 h-4 transition-transform ${open ? '' : 'rotate-180'}`} />
          <span className="text-xs">Commands</span>
        </button>

        {ctaCmd && (
          <button
            onClick={() => onCommand(ctaCmd.label)}
            className="flex items-center gap-1.5 px-4 py-2 min-h-[44px] text-sm rounded-lg transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
            style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
          >
            <ctaCmd.icon className="w-4 h-4 shrink-0" />
            <span className="font-mono text-xs">{ctaCmd.label}</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{ctaCmd.description}</span>
          </button>
        )}
      </div>
    </div>
  )
}
