'use client'

import { useState, useCallback, useMemo } from 'react'
import { DocPanel, type DocType } from './DocPanel'
import { TakeHomePanel } from './TakeHomePanel'

type PreviewTab = 'product' | 'code' | 'docs' | 'takehome'

interface PreviewPanelProps {
  appHtml: string | null
  shell?: 'mobile' | 'dashboard' | 'portfolio'
  teamName?: string
  building?: boolean
  phase?: string
  docs?: Record<DocType, string>
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div
        className="relative mx-auto"
        style={{
          width: 375,
          height: 740,
          backgroundColor: '#1a1a1a',
          borderRadius: '3rem',
          padding: '12px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4), inset 0 0 0 2px #333',
        }}
      >
        {/* Notch / Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 28,
            backgroundColor: '#000',
            borderRadius: 20,
            zIndex: 10,
          }}
        />
        {/* Screen */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '2.25rem',
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
        >
          {children}
        </div>
        {/* Home bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 134,
            height: 5,
            backgroundColor: '#666',
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  )
}

function BrowserFrame({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Title bar */}
      <div
        className="flex items-center gap-3 px-4 py-2 shrink-0"
        style={{ backgroundColor: '#e8e8e8', borderBottom: '1px solid #d1d1d1' }}
      >
        {/* Traffic lights */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#febc2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28c840' }} />
        </div>
        {/* URL bar */}
        <div
          className="flex-1 px-3 py-1 rounded text-xs text-center"
          style={{ backgroundColor: '#fff', color: '#666', border: '1px solid #d1d1d1' }}
        >
          {title || 'My App'}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 relative">
        {children}
      </div>
    </div>
  )
}

// Injected before any app code runs inside the preview iframe.
// 1. Storage shim: Safari private mode / sandboxed iframes throw SecurityError on storage access
// 2. Navigation guard: Block full-page navigations so iframe stays on srcdoc
const PREVIEW_SHIM = `<script>
(function(){
// Storage shim — no-op fallback when storage is blocked
try{localStorage.getItem('_test')}catch(e){
var m=Object.create(null);var s={getItem:function(k){return m[k]||null},setItem:function(k,v){m[k]=String(v)},removeItem:function(k){delete m[k]},clear:function(){m=Object.create(null)},get length(){return Object.keys(m).length},key:function(i){return Object.keys(m)[i]||null}};
try{Object.defineProperty(window,'localStorage',{value:s,writable:false})}catch(x){}
try{Object.defineProperty(window,'sessionStorage',{value:s,writable:false})}catch(x){}
}
// Navigation guard — block full-page navigations
document.addEventListener('click',function(e){
var a=e.target;while(a&&a.tagName!=='A')a=a.parentElement;
if(!a||!a.href)return;
var href=a.getAttribute('href');
if(!href||href.startsWith('#')||href.startsWith('javascript:')||href.startsWith('mailto:')||href.startsWith('tel:'))return;
// Non-hash link — keep the user in preview
e.preventDefault();
e.stopPropagation();
return false;
},true);
try {
var origAssign=window.location.assign.bind(window.location);
var origReplace=window.location.replace.bind(window.location);
window.location.assign=function(url){if(typeof url==='string'&&url.startsWith('#'))origAssign(url)};
window.location.replace=function(url){if(typeof url==='string'&&url.startsWith('#'))origReplace(url)};
} catch(e) {}
})();
</script>`

function injectShim(html: string): string {
  // Insert shim right after <head> so it runs before any app code
  const headIdx = html.indexOf('<head>')
  if (headIdx !== -1) {
    return html.slice(0, headIdx + 6) + PREVIEW_SHIM + html.slice(headIdx + 6)
  }
  // Fallback: prepend to entire document
  return PREVIEW_SHIM + html
}

// Extract a pseudo file-system tree from the HTML source
function extractFileTree(html: string): string[] {
  const files: string[] = ['index.html']
  // Count components defined in the code
  const componentMatches = html.match(/(?:function|const)\s+([A-Z][a-zA-Z0-9]+)\s*(?:\(|=)/g) || []
  const components = componentMatches
    .map((m) => m.replace(/^(?:function|const)\s+/, '').replace(/\s*[=(]$/, ''))
    .filter((name) => !['React', 'ReactDOM', 'ErrorBoundary'].includes(name))

  if (components.length > 0) {
    files.push('src/')
    files.push('  App.jsx')
    // Group into pages and components
    const pages = components.filter((c) => c.endsWith('Page') || c === 'Dashboard' || c === 'App')
    const comps = components.filter((c) => !pages.includes(c))
    if (pages.length > 0) {
      files.push('  pages/')
      pages.forEach((p) => files.push(`    ${p}.jsx`))
    }
    if (comps.length > 0) {
      files.push('  components/')
      comps.forEach((c) => files.push(`    ${c}.jsx`))
    }
  }

  // Check for mock data
  if (html.includes('MOCK_') || html.includes('mockData') || html.includes('sampleData') || html.match(/const\s+\w+Data\s*=/)) {
    files.push('  data/')
    files.push('    mockData.js')
  }

  // Check for icons
  if (html.includes('ICONS') || html.includes('Icon')) {
    files.push('  assets/')
    files.push('    icons.js')
  }

  files.push('package.json')
  files.push('tailwind.config.js')

  return files
}

// Format HTML with basic indentation for display
function formatCode(html: string): string {
  // Extract just the JSX/component code (the <script type="text/babel"> block)
  const babelMatch = html.match(/<script\s+type="text\/babel"[^>]*>([\s\S]*?)<\/script>/i)
  if (babelMatch) {
    return babelMatch[1].trim()
  }
  return html
}

function TabBar({ activeTab, onTabChange, hasApp, phase }: { activeTab: PreviewTab; onTabChange: (t: PreviewTab) => void; hasApp: boolean; phase?: string }) {
  const tabs: { id: PreviewTab; label: string; showWhen?: string }[] = [
    { id: 'product', label: 'App Preview' },
    { id: 'code', label: 'Code' },
    { id: 'docs', label: 'Documents' },
    { id: 'takehome', label: 'Take Home', showWhen: 'polish' },
  ]

  return (
    <div
      className="flex shrink-0"
      style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)' }}
    >
      {tabs
        .filter((tab) => !tab.showWhen || tab.showWhen === phase)
        .map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          disabled={!hasApp && tab.id !== 'product' && tab.id !== 'docs'}
          className="px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function CodeView({ html }: { html: string }) {
  const code = useMemo(() => formatCode(html), [html])
  const lineCount = code.split('\n').length

  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: '#1e1e1e' }}>
      <div className="flex">
        {/* Line numbers */}
        <div className="shrink-0 py-3 px-3 text-right select-none" style={{ color: '#858585', minWidth: '3rem' }}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="text-xs leading-5 font-mono">{i + 1}</div>
          ))}
        </div>
        {/* Code */}
        <pre className="flex-1 py-3 pr-4 overflow-x-auto">
          <code className="text-xs leading-5 font-mono" style={{ color: '#d4d4d4' }}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  )
}

function FileTreeView({ html }: { html: string }) {
  const files = useMemo(() => extractFileTree(html), [html])

  return (
    <div className="p-4 space-y-1">
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Project Structure
      </h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        If this were a real project, here is how the files would be organized.
        Your entire app is actually one HTML file — but in production, you would split it up like this.
      </p>
      {files.map((file, i) => {
        const indent = file.length - file.trimStart().length
        const name = file.trim()
        const isDir = name.endsWith('/')
        return (
          <div
            key={i}
            className="flex items-center gap-2 text-sm font-mono"
            style={{ paddingLeft: indent * 8, color: isDir ? 'var(--accent)' : 'var(--text-secondary)' }}
          >
            <span style={{ color: isDir ? 'var(--accent)' : 'var(--text-muted)' }}>
              {isDir ? '📁' : '📄'}
            </span>
            {name}
          </div>
        )
      })}
    </div>
  )
}

// DocsView replaced by DocPanel component

export function PreviewPanel({ appHtml, shell, teamName, building, phase, docs }: PreviewPanelProps) {
  const safeDocState: Record<DocType, string> = docs || { prd: '', uid: '', qad: '', matrix: '' }
  const [activeTab, setActiveTab] = useState<PreviewTab>('product')

  // Safety net: if the iframe navigates away from srcdoc, force it back
  const handleIframeLoad = useCallback((e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const iframe = e.currentTarget
      const iframeUrl = iframe.contentWindow?.location?.href
      if (iframeUrl && iframeUrl !== 'about:srcdoc' && iframeUrl !== 'about:blank') {
        const src = iframe.getAttribute('srcdoc')
        if (src) {
          iframe.removeAttribute('srcdoc')
          iframe.setAttribute('srcdoc', src)
        }
      }
    } catch {
      // Cross-origin access blocked — iframe is still on srcdoc, nothing to do
    }
  }, [])

  if (!appHtml) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
      >
        {building ? (
          <div className="text-center space-y-6 max-w-xs">
            <div className="space-y-3 w-64">
              <div className="h-4 rounded" style={{ backgroundColor: 'var(--border)', animation: 'shimmer 1.5s infinite' }} />
              <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--border)', animation: 'shimmer 1.5s infinite', animationDelay: '0.2s' }} />
              <div className="h-20 rounded" style={{ backgroundColor: 'var(--border)', animation: 'shimmer 1.5s infinite', animationDelay: '0.4s' }} />
              <div className="flex gap-2">
                <div className="h-12 flex-1 rounded" style={{ backgroundColor: 'var(--border)', animation: 'shimmer 1.5s infinite', animationDelay: '0.6s' }} />
                <div className="h-12 flex-1 rounded" style={{ backgroundColor: 'var(--border)', animation: 'shimmer 1.5s infinite', animationDelay: '0.8s' }} />
              </div>
            </div>
            <p className="text-base font-medium" style={{ color: 'var(--accent)' }}>Building your app...</p>
            <p className="text-sm opacity-60">This usually takes 15-30 seconds</p>
            <style>{`@keyframes shimmer { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }`}</style>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-base">Your app will appear here when we start building</p>
            <p className="text-sm opacity-60">Chat with your AI partner to design your app first</p>
          </div>
        )}
      </div>
    )
  }

  const safeHtml = injectShim(appHtml)

  const iframe = (
    <iframe
      srcDoc={safeHtml}
      sandbox="allow-scripts"
      className="absolute inset-0 w-full h-full border-0"
      title="App Preview"
      onLoad={handleIframeLoad}
    />
  )

  // Render the product view based on shell type
  function renderProductView() {
    if (shell === 'mobile') {
      return (
        <div className="relative flex-1 flex">
          {/* Export moved to Take Home tab */}
          <PhoneFrame>{iframe}</PhoneFrame>
        </div>
      )
    }

    if (shell === 'dashboard' || shell === 'portfolio') {
      return (
        <div className="relative flex-1 flex flex-col">
          {/* Export moved to Take Home tab */}
          <BrowserFrame>{iframe}</BrowserFrame>
        </div>
      )
    }

    // No shell selected — plain iframe
    return (
      <div className="flex-1 relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        {/* Export moved to Take Home tab */}
        {iframe}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} hasApp={!!appHtml} phase={phase} />
      {activeTab === 'product' && renderProductView()}
      {activeTab === 'code' && <CodeView html={appHtml} />}
      {activeTab === 'docs' && <DocPanel docs={safeDocState} appHtml={appHtml} />}
      {activeTab === 'takehome' && <TakeHomePanel appHtml={appHtml} docs={safeDocState} teamName={teamName || 'My Team'} />}
    </div>
  )
}
