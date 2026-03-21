import type { Phase } from '@/lib/rally/types'

const PHASE_LABELS: Record<Phase, string> = {
  design: 'Design phase — brainstorming your app',
  build: 'Build phase — creating your app',
  polish: 'Polish phase — refining your app',
}

export function StatusBar({ phase }: { phase: Phase }) {
  return (
    <div
      className="h-7 px-3 flex items-center gap-2 text-sm font-mono shrink-0"
      style={{
        backgroundColor: 'var(--bg-muted)',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-muted)',
      }}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          phase === 'build' ? 'bg-green-500' : phase === 'polish' ? 'bg-purple-500' : 'bg-blue-400'
        }`}
      />
      <span>{PHASE_LABELS[phase]}</span>
    </div>
  )
}
