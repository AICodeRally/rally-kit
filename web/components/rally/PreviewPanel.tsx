'use client'

import { useCallback } from 'react'
import { Download } from 'lucide-react'

interface PreviewPanelProps {
  appHtml: string | null
  shell?: 'mobile' | 'dashboard' | 'portfolio'
  teamName?: string
  building?: boolean
  phase?: string
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

function ExportButton({ appHtml, teamName }: { appHtml: string; teamName?: string }) {
  function handleExport() {
    const blob = new Blob([appHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(teamName ?? 'my-app').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
      style={{
        backgroundColor: 'var(--accent)',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
      title="Download your app as HTML"
    >
      <Download className="w-4 h-4" />
      Take It Home
    </button>
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

export function PreviewPanel({ appHtml, shell, teamName, building, phase }: PreviewPanelProps) {
  // Safety net: if the iframe navigates away from srcdoc (e.g., AI generated <a href="/page">),
  // force it back by re-setting srcdoc. This fires on the iframe's load event.
  const handleIframeLoad = useCallback((e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const iframe = e.currentTarget
      const iframeUrl = iframe.contentWindow?.location?.href
      // srcdoc iframes report "about:srcdoc" — anything else means navigation happened
      if (iframeUrl && iframeUrl !== 'about:srcdoc' && iframeUrl !== 'about:blank') {
        // Force back to srcdoc by removing and re-adding the attribute
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
            {/* Skeleton shimmer while AI builds */}
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

  if (shell === 'mobile') {
    return (
      <div className="relative flex-1 flex">
        {phase === 'polish' && <ExportButton appHtml={appHtml} teamName={teamName} />}
        <PhoneFrame>{iframe}</PhoneFrame>
      </div>
    )
  }

  if (shell === 'dashboard' || shell === 'portfolio') {
    return (
      <div className="relative flex-1 flex flex-col">
        {phase === 'polish' && <ExportButton appHtml={appHtml} teamName={teamName} />}
        <BrowserFrame>{iframe}</BrowserFrame>
      </div>
    )
  }

  // No shell selected — plain iframe
  return (
    <div className="flex-1 relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {phase === 'polish' && <ExportButton appHtml={appHtml} teamName={teamName} />}
      {iframe}
    </div>
  )
}
