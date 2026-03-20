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
      <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
        Preview will appear here once the sandbox is ready
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Tab bar */}
      <div className="flex gap-1 px-2 py-1 bg-gray-50 border-b border-gray-200">
        <button
          onClick={() => setTab('preview')}
          className={`px-3 py-1 text-xs rounded ${tab === 'preview' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}
        >
          Preview
        </button>
        <button
          onClick={() => setTab('code')}
          className={`px-3 py-1 text-xs rounded ${tab === 'code' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}
        >
          Code {modifiedFiles.length > 0 && `(${modifiedFiles.length})`}
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
        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-gray-50">
          <h3 className="text-xs font-medium text-gray-500 mb-2">Recently modified files</h3>
          {modifiedFiles.length === 0 ? (
            <p className="text-gray-400">No files modified yet</p>
          ) : (
            <ul className="space-y-1">
              {modifiedFiles.map((f) => (
                <li key={f} className="text-green-700">{f}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
