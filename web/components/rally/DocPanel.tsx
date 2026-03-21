'use client'

import { useState } from 'react'
import { FileText, Layout, ShieldCheck, Grid3x3 } from 'lucide-react'

export type DocType = 'prd' | 'uid' | 'qad' | 'matrix'

interface DocPanelProps {
  docs: Record<DocType, string>
  appHtml: string | null
}

const DOC_TABS: { id: DocType; label: string; icon: typeof FileText; desc: string }[] = [
  { id: 'prd', label: 'PRD', icon: FileText, desc: 'Product Requirements' },
  { id: 'uid', label: 'UID', icon: Layout, desc: 'UI Design' },
  { id: 'qad', label: 'QAD', icon: ShieldCheck, desc: 'QA Document' },
  { id: 'matrix', label: 'Matrix', icon: Grid3x3, desc: 'Requirements Traceability' },
]

function DocPlaceholder({ doc }: { doc: typeof DOC_TABS[number] }) {
  const Icon = doc.icon
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center space-y-3 max-w-sm">
        <Icon className="w-10 h-10 mx-auto opacity-30" style={{ color: 'var(--text-muted)' }} />
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {doc.desc}
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {doc.id === 'prd' && 'Your AI partner will generate this during the design phase. It captures what you\'re building and why.'}
          {doc.id === 'uid' && 'This will be generated as your app is built — covering layout decisions, component hierarchy, and accessibility notes.'}
          {doc.id === 'qad' && 'Your QA document will appear during polish — listing test scenarios, edge cases, and what to validate.'}
          {doc.id === 'matrix' && 'The traceability matrix maps every PRD requirement to what was actually built. It appears during polish.'}
        </p>
      </div>
    </div>
  )
}

function DocContent({ content }: { content: string }) {
  // Render markdown-ish content with checklist support
  const lines = content.split('\n')

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i} className="h-3" />

        // Headers
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={i} className="text-lg font-bold pt-4 pb-1" style={{ color: 'var(--text-primary)' }}>
              {trimmed.slice(3)}
            </h2>
          )
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={i} className="text-base font-semibold pt-3 pb-1" style={{ color: 'var(--text-primary)' }}>
              {trimmed.slice(4)}
            </h3>
          )
        }

        // Horizontal rule
        if (trimmed === '---') {
          return <hr key={i} className="my-3" style={{ borderColor: 'var(--border)' }} />
        }

        // Checklist items
        if (trimmed.startsWith('- [x] ') || trimmed.startsWith('- [X] ')) {
          return (
            <div key={i} className="flex items-start gap-2 py-0.5 pl-1">
              <span className="text-green-500 mt-0.5 shrink-0">✓</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {trimmed.slice(6)}
              </span>
            </div>
          )
        }
        if (trimmed.startsWith('- [ ] ')) {
          return (
            <div key={i} className="flex items-start gap-2 py-0.5 pl-1">
              <span className="text-sm mt-0.5 shrink-0 opacity-40" style={{ color: 'var(--text-muted)' }}>☐</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {trimmed.slice(6)}
              </span>
            </div>
          )
        }

        // Regular bullet
        if (trimmed.startsWith('- ')) {
          return (
            <div key={i} className="flex items-start gap-2 py-0.5 pl-1">
              <span className="text-sm mt-0.5 shrink-0" style={{ color: 'var(--accent)' }}>•</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {trimmed.slice(2)}
              </span>
            </div>
          )
        }

        // Table rows (simple pipe-delimited)
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          const cells = trimmed.split('|').filter(Boolean).map(c => c.trim())
          // Skip separator rows
          if (cells.every(c => /^[-:]+$/.test(c))) return null
          const isHeader = i > 0 && lines[i + 1]?.trim().startsWith('|') && lines[i + 1]?.includes('---')
          return (
            <div key={i} className="flex gap-1 py-0.5">
              {cells.map((cell, j) => (
                <span
                  key={j}
                  className={`text-sm flex-1 px-2 py-1 rounded ${isHeader ? 'font-semibold' : ''}`}
                  style={{
                    color: isHeader ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: isHeader ? 'var(--bg-muted)' : 'transparent',
                  }}
                >
                  {cell}
                </span>
              ))}
            </div>
          )
        }

        // Bold text lines (like **Key:** value)
        if (trimmed.startsWith('**')) {
          const parts = trimmed.split('**').filter(Boolean)
          return (
            <p key={i} className="text-sm py-0.5" style={{ color: 'var(--text-secondary)' }}>
              {parts.map((p, j) => (
                j % 2 === 0
                  ? <strong key={j} style={{ color: 'var(--text-primary)' }}>{p}</strong>
                  : <span key={j}>{p}</span>
              ))}
            </p>
          )
        }

        // Regular text
        return (
          <p key={i} className="text-sm py-0.5" style={{ color: 'var(--text-secondary)' }}>
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

export function DocPanel({ docs, appHtml }: DocPanelProps) {
  const [activeDoc, setActiveDoc] = useState<DocType>('prd')

  const hasContent = (id: DocType) => !!docs[id]?.trim()
  const filledCount = DOC_TABS.filter(t => hasContent(t.id)).length

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Doc sub-tabs */}
      <div
        className="flex items-center gap-1 px-3 py-2 shrink-0"
        style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)' }}
      >
        {DOC_TABS.map((tab) => {
          const Icon = tab.icon
          const filled = hasContent(tab.id)
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDoc(tab.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              style={{
                backgroundColor: activeDoc === tab.id ? 'var(--bg-muted)' : 'transparent',
                color: activeDoc === tab.id
                  ? 'var(--accent)'
                  : filled
                    ? 'var(--text-secondary)'
                    : 'var(--text-muted)',
                opacity: filled || activeDoc === tab.id ? 1 : 0.6,
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {filled && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              )}
            </button>
          )
        })}

        {/* Progress indicator */}
        <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
          {filledCount}/{DOC_TABS.length} docs
        </span>
      </div>

      {/* Content */}
      {hasContent(activeDoc) ? (
        <DocContent content={docs[activeDoc]} />
      ) : (
        <DocPlaceholder doc={DOC_TABS.find(t => t.id === activeDoc)!} />
      )}
    </div>
  )
}
