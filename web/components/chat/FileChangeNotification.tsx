import { Check } from 'lucide-react'

export function FileChangeNotification({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 rounded px-2 py-1 my-1 font-mono">
      <Check className="w-3 h-3" />
      <span>wrote {path}</span>
    </div>
  )
}
