'use client'

import { useEffect, useState } from 'react'
import type { Phase } from '@/lib/rally/types'

const PHASE_CONFIG: Record<Phase, { label: string; durationMin: number }> = {
  design: { label: 'Phase 1: Design', durationMin: 30 },
  build: { label: 'Phase 2: Build', durationMin: 90 },
  polish: { label: 'Phase 3: Polish', durationMin: 30 },
}

export function PhaseIndicator({
  phase,
  startedAt,
}: {
  phase: Phase
  startedAt: number
}) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt])

  const config = PHASE_CONFIG[phase]
  const totalSeconds = config.durationMin * 60
  const remaining = Math.max(0, totalSeconds - elapsed)
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  return (
    <span className="text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
      {config.label}
      <span className="ml-2 font-mono tabular-nums">
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
    </span>
  )
}
