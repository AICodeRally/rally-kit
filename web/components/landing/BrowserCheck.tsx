'use client'

import { useEffect, useState } from 'react'

export function BrowserCheck() {
  const [warning, setWarning] = useState('')
  useEffect(() => {
    if (typeof SharedArrayBuffer === 'undefined') {
      setWarning('Your browser may not support this app. For the best experience, use Chrome, Edge, or Safari 16.4+.')
    }
  }, [])
  if (!warning) return null
  return (
    <div className="w-full max-w-md mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
      {warning}
    </div>
  )
}
