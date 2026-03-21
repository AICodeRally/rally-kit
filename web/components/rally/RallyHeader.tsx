'use client'

import { AICRLogo } from '@/components/brand/AICRLogo'
import { PhaseIndicator } from './PhaseIndicator'
import { useTheme } from '@/lib/theme-context'
import { Sun, Moon, Type, Link2, Check } from 'lucide-react'
import { useState, useCallback } from 'react'
import type { Phase, TeamInfo } from '@/lib/rally/types'

const FONT_LABELS = { sm: 'A', md: 'A', lg: 'A' } as const
const FONT_SIZES = { sm: '14px', md: '16px', lg: '18px' } as const

interface RallyHeaderProps {
  phase: Phase
  phaseStartedAt: number
  teamName: string
  team?: TeamInfo
}

export function RallyHeader({ phase, phaseStartedAt, teamName, team }: RallyHeaderProps) {
  const { theme, toggleTheme, fontSize, cycleFontSize } = useTheme()
  const [copied, setCopied] = useState(false)

  const handleCopyLink = useCallback(() => {
    if (!team) return
    const params = new URLSearchParams()
    if (team.members.length > 0) params.set('m', team.members.join(','))
    params.set('t', team.track)
    params.set('n', team.name)
    if (team.roles && Object.keys(team.roles).length > 0) params.set('r', JSON.stringify(team.roles))
    const url = `${window.location.origin}/rally/${team.slug}?${params.toString()}`
    try {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }, [team])

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

        {team && (
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2"
            style={{ color: copied ? 'var(--accent)' : 'var(--text-muted)' }}
            aria-label="Copy team link"
            title={copied ? 'Link copied!' : 'Copy link for teammates'}
          >
            {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          </button>
        )}

        <span className="text-base font-medium ml-1" style={{ color: 'var(--text-secondary)' }}>
          {teamName}
        </span>
      </div>
    </header>
  )
}
