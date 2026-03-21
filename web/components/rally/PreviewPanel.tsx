'use client'

import { useState } from 'react'

interface PreviewPanelProps {
  previewUrl: string | null
  modifiedFiles: string[]
}

export function PreviewPanel({ previewUrl, modifiedFiles }: PreviewPanelProps) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')

  if (!previewUrl) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
      >
        <span className="text-base">Preview will appear here once the sandbox is ready</span>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Tab bar */}
      <div
        className="flex gap-1 px-2 py-1"
        style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
      >
        <button
          onClick={() => setTab('preview')}
          className="px-3 py-1.5 min-h-[44px] text-sm rounded focus-visible:outline-none focus-visible:ring-2"
          style={
            tab === 'preview'
              ? { backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 500 }
              : { color: 'var(--text-muted)' }
          }
        >
          Preview
        </button>
        <button
          onClick={() => setTab('code')}
          className="px-3 py-1.5 min-h-[44px] text-sm rounded focus-visible:outline-none focus-visible:ring-2"
          style={
            tab === 'code'
              ? { backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 500 }
              : { color: 'var(--text-muted)' }
          }
        >
          File Activity {modifiedFiles.length > 0 && `(${modifiedFiles.length})`}
        </button>
      </div>

      {/* Content */}
      {tab === 'preview' ? (
        <div className="flex-1 relative">
          <iframe
            src={previewUrl}
            className="absolute inset-0 w-full h-full border-0"
            title="App Preview"
          />
        </div>
      ) : (
        <div
          className="flex-1 overflow-y-auto p-4 font-mono text-base"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
            Recently modified files
          </h3>
          {modifiedFiles.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No files modified yet</p>
          ) : (
            <ul className="space-y-1">
              {modifiedFiles.map((f) => (
                <li key={f} className="text-green-500">{f}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
