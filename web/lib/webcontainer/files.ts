import type { FileSystemTree } from '@webcontainer/api'

export const RALLY_KIT_FILES: FileSystemTree = {
  'package.json': {
    file: {
      contents: JSON.stringify(
        {
          name: 'rally-app',
          version: '0.1.0',
          private: true,
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
          },
          dependencies: {
            react: '18.3.1',
            'react-dom': '18.3.1',
            'react-router-dom': '6.28.0',
            'lucide-react': '0.469.0',
            clsx: '2.1.1',
          },
          devDependencies: {
            '@vitejs/plugin-react': '4.3.4',
            vite: '6.0.7',
          },
        },
        null,
        2,
      ),
    },
  },

  'vite.config.ts': {
    file: {
      contents: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})`,
    },
  },

  'tsconfig.json': {
    file: {
      contents: JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2020',
            useDefineForClassFields: true,
            lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'bundler',
            allowImportingTsExtensions: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: 'react-jsx',
            strict: true,
            noUnusedLocals: false,
            noUnusedParameters: false,
            paths: { '@/*': ['./src/*'] },
          },
          include: ['src'],
        },
        null,
        2,
      ),
    },
  },

  'index.html': {
    file: {
      contents: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rally Kit — AICR Rally</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              accent: 'var(--color-accent)',
              'accent-light': 'var(--color-accent-light)',
              'accent-dark': 'var(--color-accent-dark)',
              secondary: 'var(--color-secondary)',
              tertiary: 'var(--color-tertiary)',
              success: 'var(--color-success)',
              warning: 'var(--color-warning)',
              danger: 'var(--color-danger)',
              'bg-primary': 'var(--color-bg-primary)',
              'bg-secondary': 'var(--color-bg-secondary)',
              'bg-card': 'var(--color-bg-card)',
              'bg-card-hover': 'var(--color-bg-card-hover)',
              'bg-sidebar': 'var(--color-bg-sidebar)',
              'bg-nav': 'var(--color-bg-nav)',
              'border-default': 'var(--color-border-default)',
              'border-subtle': 'var(--color-border-subtle)',
              'text-primary': 'var(--color-text-primary)',
              'text-secondary': 'var(--color-text-secondary)',
              'text-muted': 'var(--color-text-muted)',
            },
            boxShadow: {
              card: 'var(--shadow-card)',
              'card-hover': 'var(--shadow-card-hover)',
            },
            fontFamily: {
              sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
              mono: ['Space Mono', 'monospace'],
            },
          },
        },
      }
    </script>
  </head>
  <body class="font-sans bg-bg-primary text-text-primary min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
  },

  src: {
    directory: {
      'main.tsx': {
        file: {
          contents: `import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './globals.css'
import { initThemeFromConfig } from './lib/theme'

initThemeFromConfig()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)`,
        },
      },

      'App.tsx': {
        file: {
          contents: `import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}`,
        },
      },

      pages: {
        directory: {
          'Home.tsx': {
            file: {
              contents: `import { Rocket, MessageCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
      <div className="text-center max-w-lg px-8">
        <div className="flex items-center justify-center mb-8">
          <div className="p-4 rounded-2xl" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <Rocket className="w-12 h-12" style={{ color: '#0284c7' }} />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-3" style={{ color: '#0f172a' }}>
          Vibe Code Rally
        </h1>

        <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <MessageCircle className="w-5 h-5" style={{ color: '#0284c7' }} />
            <p className="text-lg font-semibold" style={{ color: '#0f172a' }}>
              Your App is Loading
            </p>
          </div>
          <p className="text-base" style={{ color: '#475569' }}>
            Claude is your AI coding partner. Tell it about your
            business idea and watch this page transform into your app.
          </p>
        </div>

        <p className="text-sm" style={{ color: '#94a3b8' }}>
          This page updates live as Claude builds your app.
        </p>
      </div>
    </div>
  )
}`,
            },
          },
        },
      },

      'globals.css': {
        file: {
          contents: `:root {
  --color-accent: #0ea5e9;
  --color-accent-light: #38bdf8;
  --color-accent-dark: #0284c7;
  --color-secondary: #06b6d4;
  --color-tertiary: #8b5cf6;

  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-card: #ffffff;
  --color-bg-card-hover: #f1f5f9;
  --color-bg-sidebar: #f8fafc;
  --color-bg-nav: #ffffff;

  --color-border-default: #e2e8f0;
  --color-border-subtle: #f1f5f9;

  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;

  --color-success: #16a34a;
  --color-warning: #ca8a04;
  --color-danger: #dc2626;

  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
}

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html { font-size: 16px; }

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  line-height: 1.6;
}

.sidebar-scroll::-webkit-scrollbar { width: 4px; }
.sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
.sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); border-radius: 2px; }
.sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.25); }`,
        },
      },

      components: {
        directory: {
          'StatCard.tsx': {
            file: {
              contents: `import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: { value: string; positive: boolean }
  accent?: 'primary' | 'secondary' | 'tertiary' | 'success'
}

const accentClasses = {
  primary: { icon: 'bg-accent/10 text-accent' },
  secondary: { icon: 'bg-secondary/10 text-secondary' },
  tertiary: { icon: 'bg-tertiary/10 text-tertiary' },
  success: { icon: 'bg-success/10 text-success' },
}

export default function StatCard({ title, value, subtitle, icon: Icon, trend, accent = 'primary' }: StatCardProps) {
  const styles = accentClasses[accent]
  return (
    <div className={cn('bg-bg-card border border-border-default rounded-xl p-6', 'shadow-card hover:shadow-card-hover transition-all duration-200')}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">{title}</h3>
        {Icon && <div className={cn('p-2 rounded-lg', styles.icon)}><Icon className="w-5 h-5" /></div>}
      </div>
      <div className="text-3xl font-bold text-text-primary mb-1">{value}</div>
      <div className="flex items-center gap-2">
        {subtitle && <span className="text-sm text-text-muted">{subtitle}</span>}
        {trend && <span className={cn('text-sm font-medium', trend.positive ? 'text-success' : 'text-danger')}>{trend.positive ? '\\u2191' : '\\u2193'} {trend.value}</span>}
      </div>
    </div>
  )
}`,
            },
          },

          'ChartCard.tsx': {
            file: {
              contents: `import { cn } from '@/lib/utils'

const COLORS: Record<string, string> = { orange: '#f97316', cyan: '#06b6d4', purple: '#a855f7', green: '#22c55e', yellow: '#eab308', red: '#ef4444' }

interface ChartCardProps {
  title: string; subtitle?: string; type: 'bar' | 'line' | 'area' | 'pie'
  data: Record<string, unknown>[]; dataKey: string; xAxisKey?: string
  color?: string; height?: number
}

export default function ChartCard({ title, subtitle, type, data, dataKey, xAxisKey = 'name', color = 'orange', height = 300 }: ChartCardProps) {
  const c = COLORS[color] || color
  const values = data.map(d => Number(d[dataKey]) || 0)
  const maxVal = Math.max(...values, 1)

  return (
    <div className="bg-bg-card border border-border-default rounded-xl p-6 shadow-card">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">{title}</h3>
        {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
      </div>
      <div style={{ height }} className="flex items-end gap-2">
        {type === 'pie' ? (
          <div className="w-full h-full flex items-center justify-center gap-4 flex-wrap">
            {data.map((d, i) => {
              const val = Number(d[dataKey]) || 0
              const total = values.reduce((a, b) => a + b, 0) || 1
              const pct = Math.round((val / total) * 100)
              const barColor = Object.values(COLORS)[i % 6]
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: barColor }} />
                  <span className="text-sm text-text-primary">{String(d[xAxisKey])}: {pct}%</span>
                </div>
              )
            })}
          </div>
        ) : (
          data.map((d, i) => {
            const val = Number(d[dataKey]) || 0
            const pct = (val / maxVal) * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                <span className="text-xs text-text-muted font-medium">{val.toLocaleString()}</span>
                <div
                  className={cn('w-full rounded-t-md transition-all duration-300', type === 'line' ? 'rounded-b-md' : '')}
                  style={{ height: pct + '%', backgroundColor: c, minHeight: '4px' }}
                />
                <span className="text-xs text-text-muted truncate max-w-full">{String(d[xAxisKey])}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}`,
            },
          },

          'DataTable.tsx': {
            file: {
              contents: `import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Column<T> { key: keyof T & string; label: string; sortable?: boolean; render?: (value: T[keyof T], row: T) => React.ReactNode }
interface DataTableProps<T> { columns: Column<T>[]; data: T[]; onRowClick?: (row: T) => void; className?: string }

export default function DataTable<T extends Record<string, unknown>>({ columns, data, onRowClick, className }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const sorted = sortKey ? [...data].sort((a, b) => { const cmp = String(a[sortKey]).localeCompare(String(b[sortKey]), undefined, { numeric: true }); return sortAsc ? cmp : -cmp }) : data
  function toggleSort(key: string) { if (sortKey === key) setSortAsc(!sortAsc); else { setSortKey(key); setSortAsc(true) } }

  return (
    <div className={cn('bg-bg-card border border-border-default rounded-xl overflow-hidden', className)}>
      <table className="w-full">
        <thead><tr className="border-b border-border-default bg-bg-secondary">
          {columns.map(col => <th key={col.key} onClick={col.sortable ? () => toggleSort(col.key) : undefined} className={cn('text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide', col.sortable && 'cursor-pointer select-none hover:text-text-primary')}><span className="flex items-center gap-1">{col.label}{col.sortable && sortKey === col.key && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}</span></th>)}
        </tr></thead>
        <tbody>{sorted.map((row, i) => <tr key={i} onClick={onRowClick ? () => onRowClick(row) : undefined} className={cn('border-b border-border-subtle transition-colors', onRowClick && 'cursor-pointer hover:bg-bg-card-hover')}>
          {columns.map(col => <td key={col.key} className="px-6 py-4 text-sm text-text-primary">{col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
  )
}`,
            },
          },

          'DetailCard.tsx': {
            file: {
              contents: `import { cn } from '@/lib/utils'
interface DetailField { label: string; value: string | number | React.ReactNode }
interface DetailCardProps { title?: string; fields: DetailField[]; imageUrl?: string; className?: string }

export default function DetailCard({ title, fields, imageUrl, className }: DetailCardProps) {
  return (
    <div className={cn('bg-bg-card border border-border-default rounded-xl p-6', className)}>
      {imageUrl && <div className="w-full h-40 rounded-lg bg-bg-secondary mb-4 overflow-hidden"><img src={imageUrl} alt="" className="w-full h-full object-cover" /></div>}
      {title && <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>}
      <dl className="space-y-3">{fields.map((f, i) => <div key={i} className="flex justify-between items-start"><dt className="text-sm text-text-secondary">{f.label}</dt><dd className="text-sm font-medium text-text-primary text-right">{f.value}</dd></div>)}</dl>
    </div>
  )
}`,
            },
          },

          'FormCard.tsx': {
            file: {
              contents: `import { cn } from '@/lib/utils'
interface FormField { name: string; label: string; type: 'text' | 'number' | 'email' | 'select' | 'textarea'; placeholder?: string; options?: string[]; required?: boolean }
interface FormCardProps { title?: string; fields: FormField[]; submitLabel?: string; onSubmit?: (data: Record<string, string>) => void; className?: string }

export default function FormCard({ title, fields, submitLabel = 'Submit', onSubmit, className }: FormCardProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!onSubmit) return
    const fd = new FormData(e.currentTarget); const data: Record<string, string> = {}
    fd.forEach((v, k) => { data[k] = String(v) }); onSubmit(data)
  }
  return (
    <form onSubmit={handleSubmit} className={cn('bg-bg-card border border-border-default rounded-xl p-6', className)}>
      {title && <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>}
      <div className="space-y-4">{fields.map(f => <div key={f.name}>
        <label className="block text-sm font-medium text-text-secondary mb-1">{f.label}{f.required && <span className="text-danger ml-1">*</span>}</label>
        {f.type === 'textarea' ? <textarea name={f.name} placeholder={f.placeholder} required={f.required} rows={3} className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
        : f.type === 'select' ? <select name={f.name} required={f.required} className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"><option value="">{f.placeholder || 'Select...'}</option>{f.options?.map(o => <option key={o} value={o}>{o}</option>)}</select>
        : <input type={f.type} name={f.name} placeholder={f.placeholder} required={f.required} className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />}
      </div>)}</div>
      <button type="submit" className="mt-6 w-full py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">{submitLabel}</button>
    </form>
  )
}`,
            },
          },

          'ListItem.tsx': {
            file: {
              contents: `import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
interface ListItemProps { icon?: LucideIcon; title: string; subtitle?: string; badge?: { label: string; color?: string }; onClick?: () => void; className?: string }

export default function ListItem({ icon: Icon, title, subtitle, badge, onClick, className }: ListItemProps) {
  return (
    <div onClick={onClick} className={cn('flex items-center gap-4 px-4 py-3 border-b border-border-subtle transition-colors', onClick && 'cursor-pointer hover:bg-bg-card-hover', className)}>
      {Icon && <div className="p-2 rounded-lg bg-bg-secondary"><Icon className="w-5 h-5 text-accent" /></div>}
      <div className="flex-1 min-w-0"><div className="text-sm font-medium text-text-primary truncate">{title}</div>{subtitle && <div className="text-sm text-text-secondary truncate">{subtitle}</div>}</div>
      {badge && <span className={cn('px-2 py-1 text-xs font-medium rounded-full', badge.color || 'bg-accent/10 text-accent')}>{badge.label}</span>}
    </div>
  )
}`,
            },
          },

          'EmptyState.tsx': {
            file: {
              contents: `import { type LucideIcon, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
interface EmptyStateProps { icon?: LucideIcon; title: string; description?: string; actionLabel?: string; onAction?: () => void; className?: string }

export default function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="p-4 rounded-full bg-bg-secondary mb-4"><Icon className="w-8 h-8 text-text-muted" /></div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      {description && <p className="text-base text-text-secondary max-w-sm">{description}</p>}
      {actionLabel && onAction && <button onClick={onAction} className="mt-4 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">{actionLabel}</button>}
    </div>
  )
}`,
            },
          },

          'PageHeader.tsx': {
            file: {
              contents: `import { cn } from '@/lib/utils'
interface PageHeaderProps { title: string; subtitle?: string; actions?: React.ReactNode; className?: string }

export default function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-8', className)}>
      <div><h1 className="text-2xl font-bold text-text-primary">{title}</h1>{subtitle && <p className="text-base text-text-secondary mt-1">{subtitle}</p>}</div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}`,
            },
          },

          'MetricRow.tsx': {
            file: {
              contents: `import { cn } from '@/lib/utils'
interface MetricItem { label: string; value: string | number }
interface MetricRowProps { metrics: MetricItem[]; className?: string }

export default function MetricRow({ metrics, className }: MetricRowProps) {
  return (
    <div className={cn('flex items-center gap-6 px-6 py-4 bg-bg-card border border-border-default rounded-xl', className)}>
      {metrics.map((m, i) => <div key={i} className={cn('flex-1 text-center', i < metrics.length - 1 && 'border-r border-border-default')}><div className="text-xl font-bold text-text-primary">{m.value}</div><div className="text-sm text-text-secondary">{m.label}</div></div>)}
    </div>
  )
}`,
            },
          },

          'ActionMenu.tsx': {
            file: {
              contents: `import { useState, useRef, useEffect } from 'react'
import { MoreVertical, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
interface ActionItem { label: string; icon?: LucideIcon; onClick: () => void; danger?: boolean }

export default function ActionMenu({ items, className }: { items: ActionItem[]; className?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }; if (open) document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [open])
  return (
    <div ref={ref} className={cn('relative', className)}>
      <button onClick={e => { e.stopPropagation(); setOpen(!open) }} className="p-1.5 rounded-lg hover:bg-bg-card-hover text-text-muted hover:text-text-primary transition-colors"><MoreVertical className="w-4 h-4" /></button>
      {open && <div className="absolute right-0 top-full mt-1 w-44 bg-bg-card border border-border-default rounded-lg shadow-card-hover z-20 py-1">
        {items.map((item, i) => { const Icon = item.icon; return <button key={i} onClick={e => { e.stopPropagation(); item.onClick(); setOpen(false) }} className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors', item.danger ? 'text-danger hover:bg-danger/10' : 'text-text-primary hover:bg-bg-card-hover')}>{Icon && <Icon className="w-4 h-4" />}{item.label}</button> })}
      </div>}
    </div>
  )
}`,
            },
          },

          shells: {
            directory: {
              'MobileShell.tsx': {
                file: {
                  contents: `import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { NavRoute } from '@/lib/navigation'

interface MobileShellProps { appName: string; navItems: NavRoute[]; children: React.ReactNode }

export default function MobileShell({ appName, navItems, children }: MobileShellProps) {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary max-w-md mx-auto border-x border-border-default">
      <header className="h-14 flex items-center justify-between px-4 border-b border-border-default bg-bg-nav sticky top-0 z-10">
        <h1 className="text-lg font-bold text-accent">{appName}</h1>
      </header>
      <main className="flex-1 overflow-auto p-4 pb-20">{children}</main>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-bg-nav border-t border-border-default z-10">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.slice(0, 5).map(item => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            const Icon = item.icon
            return <Link key={item.href} to={item.href} className={cn('flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0', active ? 'text-accent' : 'text-text-muted hover:text-text-secondary')}><Icon className="w-5 h-5" /><span className={cn('text-xs truncate', active ? 'font-semibold' : 'font-medium')}>{item.label}</span></Link>
          })}
        </div>
      </nav>
    </div>
  )
}`,
                },
              },

              'DashboardShell.tsx': {
                file: {
                  contents: `import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavRoute } from '@/lib/navigation'

interface DashboardShellProps { appName: string; navItems: NavRoute[]; children: React.ReactNode }

export default function DashboardShell({ appName, navItems, children }: DashboardShellProps) {
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="min-h-screen flex bg-bg-primary">
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={cn('fixed inset-y-0 left-0 z-50 w-64 bg-bg-sidebar border-r border-border-default transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border-default">
          <h1 className="text-lg font-bold text-accent">{appName}</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-text-secondary hover:text-text-primary"><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-4 space-y-1 sidebar-scroll overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map(item => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            const Icon = item.icon
            return <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', active ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-secondary hover:text-text-primary hover:bg-bg-card-hover')}><Icon className="w-5 h-5 flex-shrink-0" />{item.label}</Link>
          })}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border-default bg-bg-nav">
          <div className="flex items-center"><button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary"><Menu className="w-5 h-5" /></button><span className="lg:hidden ml-3 text-sm font-medium text-text-secondary">{appName}</span></div>
          <div className="hidden lg:flex items-center gap-2 text-text-muted"><Search className="w-4 h-4" /><span className="text-sm">Search...</span></div>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}`,
                },
              },

              'PortfolioShell.tsx': {
                file: {
                  contents: `import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavRoute } from '@/lib/navigation'

interface PortfolioShellProps { appName: string; navItems: NavRoute[]; heroContent?: React.ReactNode; children: React.ReactNode }

export default function PortfolioShell({ appName, navItems, heroContent, children }: PortfolioShellProps) {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="sticky top-0 z-10 bg-bg-nav border-b border-border-default">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-accent">{appName}</h1>
          <nav className="hidden md:flex items-center gap-6">{navItems.map(item => { const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)); return <Link key={item.href} to={item.href} className={cn('text-sm font-medium transition-colors', active ? 'text-accent' : 'text-text-secondary hover:text-text-primary')}>{item.label}</Link> })}</nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-text-secondary hover:text-text-primary">{menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
        {menuOpen && <div className="md:hidden border-t border-border-default bg-bg-nav"><nav className="px-6 py-4 space-y-2">{navItems.map(item => { const active = pathname === item.href; const Icon = item.icon; return <Link key={item.href} to={item.href} onClick={() => setMenuOpen(false)} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', active ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary hover:bg-bg-card-hover')}><Icon className="w-5 h-5" />{item.label}</Link> })}</nav></div>}
      </header>
      {heroContent && <section className="border-b border-border-default bg-bg-secondary"><div className="max-w-6xl mx-auto px-6 py-12">{heroContent}</div></section>}
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}`,
                },
              },
            },
          },
        },
      },

      lib: {
        directory: {
          'utils.ts': {
            file: {
              contents: `import { clsx, type ClassValue } from 'clsx'
export function cn(...inputs: ClassValue[]) { return clsx(inputs) }`,
            },
          },

          'theme.ts': {
            file: {
              contents: `export type ThemeName = 'ocean' | 'sunset' | 'forest' | 'berry' | 'slate' | 'custom'

export interface ThemeColors { accent: string; accentLight: string; accentDark: string; secondary: string; tertiary: string }

export const themes: Record<ThemeName, { name: ThemeName; label: string; colors: ThemeColors }> = {
  ocean: { name: 'ocean', label: 'Ocean', colors: { accent: '#0ea5e9', accentLight: '#38bdf8', accentDark: '#0284c7', secondary: '#06b6d4', tertiary: '#8b5cf6' } },
  sunset: { name: 'sunset', label: 'Sunset', colors: { accent: '#f97316', accentLight: '#fb923c', accentDark: '#ea580c', secondary: '#eab308', tertiary: '#ef4444' } },
  forest: { name: 'forest', label: 'Forest', colors: { accent: '#22c55e', accentLight: '#4ade80', accentDark: '#16a34a', secondary: '#14b8a6', tertiary: '#84cc16' } },
  berry: { name: 'berry', label: 'Berry', colors: { accent: '#a855f7', accentLight: '#c084fc', accentDark: '#9333ea', secondary: '#ec4899', tertiary: '#6366f1' } },
  slate: { name: 'slate', label: 'Slate', colors: { accent: '#64748b', accentLight: '#94a3b8', accentDark: '#475569', secondary: '#0ea5e9', tertiary: '#8b5cf6' } },
  custom: { name: 'custom', label: 'Custom', colors: { accent: '#0ea5e9', accentLight: '#38bdf8', accentDark: '#0284c7', secondary: '#06b6d4', tertiary: '#8b5cf6' } },
}

export function applyTheme(themeName: ThemeName, customAccent?: string): void {
  const theme = themes[themeName]
  const colors = themeName === 'custom' && customAccent ? { ...theme.colors, accent: customAccent } : theme.colors
  const root = document.documentElement
  root.style.setProperty('--color-accent', colors.accent)
  root.style.setProperty('--color-accent-light', colors.accentLight)
  root.style.setProperty('--color-accent-dark', colors.accentDark)
  root.style.setProperty('--color-secondary', colors.secondary)
  root.style.setProperty('--color-tertiary', colors.tertiary)
}

export function initThemeFromConfig(themeName?: string, customAccent?: string): void {
  applyTheme((themeName as ThemeName) || 'ocean', customAccent)
}`,
            },
          },

          'navigation.ts': {
            file: {
              contents: `import { type LucideIcon } from 'lucide-react'

export interface NavRoute { label: string; href: string; icon: LucideIcon }

/** Claude adds routes here as pages are built. */
export const routes: NavRoute[] = []`,
            },
          },

          'mockData.ts': {
            file: {
              contents: `const FIRST_NAMES = ['Alex','Jordan','Taylor','Morgan','Casey','Riley','Avery','Quinn','Parker','Sage','Dakota','Reese','Finley','Hayden','Emerson','Blake','Charlie','Drew','Jamie','Skyler','Robin','Peyton','Logan','Cameron']
const LAST_NAMES = ['Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Thompson']
const COMPANIES = ['Acme Corp','Globex Inc','Initech','Hooli','Stark Industries','Wayne Enterprises','Umbrella Corp','Weyland Corp','Cyberdyne','Soylent Corp','Aperture Labs','Massive Dynamic','Pied Piper','Prestige Worldwide','TechFlow','BrightEdge','CloudNine','DataVault']
const STATUSES = ['Active','Pending','Completed','Cancelled','In Progress','On Hold']

export function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
export function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
export function randomName() { return \`\${randomFrom(FIRST_NAMES)} \${randomFrom(LAST_NAMES)}\` }
export function randomCompany() { return randomFrom(COMPANIES) }
export function randomDollars(min = 100, max = 100000) { return \`$\${randomInt(min, max).toLocaleString()}\` }
export function randomDollarAmount(min = 100, max = 100000) { return randomInt(min, max) }
export function randomPercent(min = 1, max = 100) { return \`\${randomInt(min, max)}%\` }
export function randomStatus() { return randomFrom(STATUSES) }
export function randomDate(daysBack = 90) { const d = new Date(); d.setDate(d.getDate() - randomInt(0, daysBack)); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
export function randomISODate(daysBack = 90) { const d = new Date(); d.setDate(d.getDate() - randomInt(0, daysBack)); return d.toISOString().split('T')[0] }
export function randomEmail(name?: string) { const n = name || randomName(); const [first, last] = n.toLowerCase().split(' '); return \`\${first}.\${last}@\${randomFrom(['gmail.com','outlook.com','yahoo.com','company.com'])}\` }
export function randomPhone() { return \`(\${randomInt(200, 999)}) \${randomInt(200, 999)}-\${randomInt(1000, 9999)}\` }
export function randomId() { return Math.random().toString(36).substring(2, 10) }
export function generateMany<T>(count: number, factory: (i: number) => T): T[] { return Array.from({ length: count }, (_, i) => factory(i)) }
export function generateMonthlyData(months = 6, valueKey = 'value', minVal = 1000, maxVal = 10000) {
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const now = new Date()
  return Array.from({ length: months }, (_, i) => ({ month: names[(now.getMonth() - months + 1 + i + 12) % 12], [valueKey]: randomInt(minVal, maxVal) }))
}`,
            },
          },
        },
      },

      data: {
        directory: {
          'mock.ts': {
            file: {
              contents: `/**
 * Mock Data — Rally Kit
 * Add your mock data here. Claude will create realistic data based on your business idea.
 */

// Your mock data goes here!`,
            },
          },
        },
      },
    },
  },
}
