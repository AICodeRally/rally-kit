'use client'

import { AICRLogo } from '@/components/brand/AICRLogo'
import { PhaseIndicator } from './PhaseIndicator'
import { useTheme } from '@/lib/theme-context'
import { Sun, Moon, Type } from 'lucide-react'
import type { Phase } from '@/lib/rally/types'

const FONT_LABELS = { sm: 'A', md: 'A', lg: 'A' } as const
const FONT_SIZES = { sm: '12px', md: '14px', lg: '16px' } as const

interface RallyHeaderProps {
  phase: Phase
  phaseStartedAt: number
  teamName: string
}

export function RallyHeader({ phase, phaseStartedAt, teamName }: RallyHeaderProps) {
  const { theme, toggleTheme, fontSize, cycleFontSize } = useTheme()

  return (
    <header
      className="h-12 px-4 flex items-center justify-between shrink-0"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Left: logo + label */}
      <div className="flex items-center gap-2">
        <AICRLogo size="sm" />
        <span
          className="text-xs font-medium hidden sm:inline"
          style={{ color: 'var(--text-muted)' }}
        >
          Rally Kit
        </span>
      </div>

      {/* Center: phase indicator */}
      <PhaseIndicator phase={phase} startedAt={phaseStartedAt} />

      {/* Right: font size + theme toggle + team name */}
      <div className="flex items-center gap-1">
        <button
          onClick={cycleFontSize}
          className="flex items-center justify-center gap-1 min-w-[44px] min-h-[44px] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2"
          style={{ color: 'var(--text-muted)' }}
          aria-label={`Font size: ${fontSize}`}
          title={`Font size: ${fontSize} (click to cycle)`}
        >
          <Type className="w-4 h-4" />
          <span className="text-xs font-mono" style={{ fontSize: FONT_SIZES[fontSize] }}>
            {FONT_LABELS[fontSize]}
          </span>
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2"
          style={{ color: 'var(--text-muted)' }}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Full name on desktop, initials on mobile */}
        <span className="text-sm hidden sm:inline ml-1" style={{ color: 'var(--text-secondary)' }}>
          {teamName}
        </span>
        <span
          className="sm:hidden text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full ml-1"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
          title={teamName}
        >
          {teamName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
        </span>
      </div>
    </header>
  )
}
