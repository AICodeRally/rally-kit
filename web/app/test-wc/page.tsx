'use client'

import { useEffect, useState } from 'react'
import { bootWebContainer, type BootStatus } from '@/lib/webcontainer/boot'

export default function TestWC() {
  const [status, setStatus] = useState<BootStatus>('booting')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    bootWebContainer((s) => setStatus(s)).then((result) => {
      setPreviewUrl(result.previewUrl)
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">WebContainer Test</h1>
      <p>Status: {status}</p>
      {previewUrl && (
        <iframe src={previewUrl} className="w-full h-[600px] border mt-4" />
      )}
    </div>
  )
}
