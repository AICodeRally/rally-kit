import type { SandboxStatus } from '@/lib/rally/types'

const STATUS_LABELS: Record<SandboxStatus, string> = {
  idle: 'Design phase — sandbox starts when you build',
  booting: 'Booting sandbox...',
  mounting: 'Loading project files...',
  installing: 'Installing packages...',
  starting: 'Starting dev server...',
  ready: 'Connected — preview is live',
  error: 'Sandbox error — click retry in the preview panel',
}

export function StatusBar({ status }: { status: SandboxStatus }) {
  const isReady = status === 'ready'
  const isIdle = status === 'idle'
  const isError = status === 'error'

  return (
    <div
      className="h-7 px-3 flex items-center gap-2 text-sm font-mono shrink-0"
      style={{
        backgroundColor: isError ? '#fef2f2' : 'var(--bg-muted)',
        borderTop: '1px solid var(--border)',
        color: isError ? '#dc2626' : 'var(--text-muted)',
      }}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          isReady ? 'bg-green-500' : isIdle ? 'bg-blue-400' : isError ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
        }`}
      />
      <span>{STATUS_LABELS[status]}</span>
    </div>
  )
}
