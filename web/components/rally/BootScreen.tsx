import type { SandboxStatus } from '@/lib/rally/types'

const STEPS: { status: SandboxStatus; label: string }[] = [
  { status: 'booting', label: 'Starting sandbox...' },
  { status: 'mounting', label: 'Loading components...' },
  { status: 'installing', label: 'Installing packages...' },
  { status: 'starting', label: 'Starting dev server...' },
]

const FUN_FACTS = [
  'Every great app starts with a conversation',
  'Your AI partner has built hundreds of apps',
  'The best demos tell a story',
  'Mock data makes everything feel real',
]

export function BootScreen({ status }: { status: SandboxStatus }) {
  const randomFact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <h2
        className="text-2xl font-bold mb-8"
        style={{ color: 'var(--text-primary)' }}
      >
        Setting up your workspace...
      </h2>

      <div className="space-y-3 mb-8 w-64">
        {STEPS.map((step) => {
          const currentIdx = STEPS.findIndex((s) => s.status === status)
          const stepIdx = STEPS.findIndex((s) => s.status === step.status)
          const isDone = stepIdx < currentIdx
          const isCurrent = step.status === status

          return (
            <div key={step.status} className="flex items-center gap-3">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  isDone
                    ? 'bg-green-500 text-white'
                    : isCurrent
                      ? 'bg-blue-500 text-white animate-pulse'
                      : ''
                }`}
                style={
                  !isDone && !isCurrent
                    ? { backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }
                    : undefined
                }
              >
                {isDone ? '\u2713' : stepIdx + 1}
              </span>
              <span
                style={{
                  color: isDone || !isCurrent ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontWeight: isCurrent ? 500 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>{randomFact}</p>
    </div>
  )
}
