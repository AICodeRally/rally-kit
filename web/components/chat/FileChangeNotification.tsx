import { Check } from 'lucide-react'

export function FileChangeNotification({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded px-3 py-1.5 my-1.5 font-mono">
      <Check className="w-4 h-4" />
      <span>wrote {path}</span>
    </div>
  )
}
