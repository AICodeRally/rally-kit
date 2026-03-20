'use client'

const COMMANDS = [
  { label: '/rally', description: 'Start or resume' },
  { label: '/help', description: 'Show commands' },
  { label: '/build', description: 'Start building' },
  { label: '/brainstorm', description: 'Get ideas' },
  { label: '/status', description: 'See progress' },
  { label: '/polish', description: 'Clean up' },
  { label: '/demo', description: 'Demo script' },
  { label: '/fix', description: 'Fix an error' },
  { label: '/reset', description: 'Start over' },
]

export function SlashToolbar({
  onCommand,
}: {
  onCommand: (command: string) => void
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto py-1.5 px-2">
      {COMMANDS.map((cmd) => (
        <button
          key={cmd.label}
          onClick={() => onCommand(cmd.label)}
          className="shrink-0 px-2.5 py-1 text-xs font-mono bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
          title={cmd.description}
        >
          {cmd.label}
        </button>
      ))}
    </div>
  )
}
