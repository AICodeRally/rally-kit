'use client'

import { Download, Mail, FileText, Layout, ShieldCheck, Grid3x3, Package } from 'lucide-react'
import type { DocType } from './DocPanel'

interface TakeHomePanelProps {
  appHtml: string | null
  docs: Record<DocType, string>
  teamName: string
}

function exportApp(appHtml: string, teamName: string) {
  const blob = new Blob([appHtml], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${teamName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`
  a.click()
  URL.revokeObjectURL(url)
}

function exportDocs(docs: Record<DocType, string>, teamName: string) {
  const docNames: Record<DocType, string> = {
    prd: 'Product Requirements Document',
    uid: 'UI Design Document',
    qad: 'QA Document',
    matrix: 'Requirements Traceability Matrix',
  }

  let content = `# ${teamName} — Rally Kit Product Package\n\n`
  content += `Generated at AI Code Rally · ${new Date().toLocaleDateString()}\n\n`

  for (const [key, label] of Object.entries(docNames)) {
    const docContent = docs[key as DocType]
    if (docContent?.trim()) {
      content += `---\n\n# ${label}\n\n${docContent}\n\n`
    }
  }

  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${teamName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-docs.md`
  a.click()
  URL.revokeObjectURL(url)
}

const DOC_META: { id: DocType; label: string; icon: typeof FileText }[] = [
  { id: 'prd', label: 'Product Requirements', icon: FileText },
  { id: 'uid', label: 'UI Design', icon: Layout },
  { id: 'qad', label: 'QA Document', icon: ShieldCheck },
  { id: 'matrix', label: 'Traceability Matrix', icon: Grid3x3 },
]

export function TakeHomePanel({ appHtml, docs, teamName }: TakeHomePanelProps) {
  const filledDocs = DOC_META.filter(d => !!docs[d.id]?.trim())

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div className="text-center space-y-2 pb-2">
        <Package className="w-10 h-10 mx-auto" style={{ color: 'var(--accent)' }} />
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Your Product Package
        </h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
          Everything you built today — your app and your product documents.
          This is a real deliverable, just like what product teams ship at work.
        </p>
      </div>

      {/* Package contents */}
      <div className="rounded-lg p-5 space-y-4" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          What&apos;s in your package
        </h3>

        {/* App */}
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-muted)' }}>
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
            <Download className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Your App (HTML)
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Runs in any browser — no install needed
            </p>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${appHtml ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {appHtml ? 'Ready' : 'Building...'}
          </span>
        </div>

        {/* Docs */}
        {DOC_META.map((doc) => {
          const Icon = doc.icon
          const filled = !!docs[doc.id]?.trim()
          return (
            <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-muted)' }}>
              <div
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{ backgroundColor: filled ? 'var(--accent)' : 'var(--border)', opacity: filled ? 1 : 0.5 }}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {doc.label}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {doc.id === 'prd' && 'What you\'re building and why'}
                  {doc.id === 'uid' && 'Layout, components, and design decisions'}
                  {doc.id === 'qad' && 'Test scenarios and quality checks'}
                  {doc.id === 'matrix' && 'Requirements vs. what was built'}
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${filled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {filled ? 'Ready' : 'Pending'}
              </span>
            </div>
          )
        })}
      </div>

      {/* What happens next */}
      <div className="rounded-lg p-5 space-y-3" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          What happens next
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Follow-up email from AICR
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                We&apos;ll send your complete package — app + all documents — to your registered email within 48 hours.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Keep building with any AI
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Your docs work with ChatGPT, Claude, Gemini, Copilot — any AI tool.
                Paste your PRD and say &quot;Help me prioritize and build this.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => appHtml && exportApp(appHtml, teamName)}
          disabled={!appHtml}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Download className="w-4 h-4" />
          Download App
        </button>
        <button
          onClick={() => exportDocs(docs, teamName)}
          disabled={filledDocs.length === 0}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--bg-muted)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          }}
        >
          <FileText className="w-4 h-4" />
          Download Docs
        </button>
      </div>
    </div>
  )
}
