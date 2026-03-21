import type { SandboxStatus } from '@/lib/rally/types'

const STATUS_LABELS: Record<SandboxStatus, string> = {
  idle: 'Design phase — sandbox starts when you build',
  booting: 'Booting sandbox...',
  mounting: 'Loading project files...',
  installing: 'Installing packages...',
  starting: 'Starting dev server...',
  ready: 'Connected',
  error: 'Error — try refreshing',
}

export function StatusBar({ status }: { status: SandboxStatus }) {
  const isReady = status === 'ready'
  const isIdle = status === 'idle'
  const isError = status === 'error'

  return (
    <div
      className="h-6 px-3 flex items-center gap-2 text-xs font-mono shrink-0"
      style={{
        backgroundColor: 'var(--bg-muted)',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-muted)',
      }}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isReady ? 'bg-green-500' : isIdle ? 'bg-blue-400' : isError ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
        }`}
      />
      <span>{STATUS_LABELS[status]}</span>
    </div>
  )
}
