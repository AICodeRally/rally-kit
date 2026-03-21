'use client'

import {
  Play, HelpCircle, Hammer, Lightbulb, BarChart3,
  Sparkles, Presentation, Wrench, RotateCcw,
} from 'lucide-react'

const COMMANDS = [
  { label: '/rally', description: 'Start', icon: Play, phases: ['design', 'build', 'polish'] },
  { label: '/help', description: 'Help', icon: HelpCircle, phases: ['design', 'build', 'polish'] },
  { label: '/brainstorm', description: 'Ideas', icon: Lightbulb, phases: ['design'] },
  { label: '/build', description: 'Build', icon: Hammer, phases: ['design'] },
  { label: '/status', description: 'Progress', icon: BarChart3, phases: ['design', 'build', 'polish'] },
  { label: '/polish', description: 'Polish', icon: Sparkles, phases: ['build', 'polish'] },
  { label: '/demo', description: 'Demo script', icon: Presentation, phases: ['polish', 'build'] },
  { label: '/fix', description: 'Fix error', icon: Wrench, phases: ['build', 'polish'] },
  { label: '/reset', description: 'Start over', icon: RotateCcw, phases: ['design', 'build', 'polish'] },
]

export function SlashToolbar({
  onCommand,
  phase = 'design',
}: {
  onCommand: (command: string) => void
  phase?: string
}) {
  const visible = COMMANDS.filter((cmd) => cmd.phases.includes(phase as 'design'))

  return (
    <div className="py-1.5 px-2">
      <div className="flex gap-1.5 flex-wrap">
        {visible.map((cmd) => {
          const Icon = cmd.icon
          return (
            <button
              key={cmd.label}
              onClick={() => onCommand(cmd.label)}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 min-h-[48px] text-sm rounded-lg transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-secondary)',
              }}
            >
              <Icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span className="font-mono">{cmd.label}</span>
              <span className="hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
                {cmd.description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
