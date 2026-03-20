import type { SandboxStatus } from '@/lib/rally/types'

const STATUS_LABELS: Record<SandboxStatus, string> = {
  booting: 'Booting sandbox...',
  mounting: 'Loading project files...',
  installing: 'Installing packages...',
  starting: 'Starting dev server...',
  ready: 'Connected',
  error: 'Error — try refreshing',
}

export function StatusBar({ status }: { status: SandboxStatus }) {
  const isReady = status === 'ready'
  const isError = status === 'error'

  return (
    <div className="h-6 px-3 flex items-center gap-2 bg-gray-100 border-t border-gray-200 text-xs text-gray-500 font-mono">
      <span
        className={`w-2 h-2 rounded-full ${
          isReady ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
        }`}
      />
      <span>{STATUS_LABELS[status]}</span>
    </div>
  )
}
