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
      <div className="flex items-center gap-2">
        <button
          onClick={cycleFontSize}
          className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
          style={{ color: 'var(--text-muted)' }}
          aria-label={`Font size: ${fontSize}`}
          title={`Font size: ${fontSize} (click to cycle)`}
        >
          <Type className="w-3.5 h-3.5" />
          <span className="text-xs font-mono" style={{ fontSize: FONT_SIZES[fontSize] }}>
            {FONT_LABELS[fontSize]}
          </span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md transition-colors"
          style={{ color: 'var(--text-muted)' }}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <span className="text-sm hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>
          {teamName}
        </span>
      </div>
    </header>
  )
}
