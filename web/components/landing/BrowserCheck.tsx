'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

type BrowserStatus = 'checking' | 'supported' | 'unsupported'

export function BrowserCheck() {
  const [status, setStatus] = useState<BrowserStatus>('checking')

  useEffect(() => {
    const supported = typeof SharedArrayBuffer !== 'undefined'
    setStatus(supported ? 'supported' : 'unsupported')
  }, [])

  if (status !== 'unsupported') return null

  return (
    <div className="w-full max-w-md mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-800 mb-1">
            Browser Not Supported
          </p>
          <p className="text-sm text-red-700 mb-3">
            This app requires WebContainers, which need a modern browser with SharedArrayBuffer support.
          </p>
          <div className="text-sm text-red-700">
            <p className="font-medium mb-1">Please switch to one of these:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li><strong>Chrome</strong> (recommended)</li>
              <li><strong>Edge</strong></li>
              <li><strong>Safari 16.4+</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export function isBrowserSupported(): boolean {
  return typeof SharedArrayBuffer !== 'undefined'
}
