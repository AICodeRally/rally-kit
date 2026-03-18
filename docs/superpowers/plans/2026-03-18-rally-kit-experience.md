# Rally Kit Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the rally-kit from a single dark-themed dashboard shell into a multi-shell, theme-selectable, Claude-guided student experience for the GCU Vibe Code Rally.

**Architecture:** Replace the current hardcoded dark theme CSS variables with a dynamic theme system driven by `rally.config.json`. Add three shell layouts (Mobile, Dashboard, Portfolio) as wrapper components. Add ~7 new shared content components. Rewrite CLAUDE.md with full phase-aware guidance, track awareness, and progress tracking.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Recharts, Lucide React, clsx + tailwind-merge (all already installed — NO new packages).

**Spec:** `docs/superpowers/specs/2026-03-18-rally-kit-experience-design.md`

---

## File Structure

### Files to Create

| File | Responsibility |
|------|---------------|
| `src/lib/theme.ts` | Theme definitions (6 presets + custom), CSS variable generator, `applyTheme()` function |
| `src/lib/navigation.ts` | Route config type, active route helper, shared across shells |
| `src/lib/mockData.ts` | Generators: `randomName()`, `randomDate()`, `randomDollars()`, `randomPercent()`, `randomStatus()`, `randomId()` |
| `src/components/shells/MobileShell.tsx` | Bottom tab nav, header bar, scrollable card content |
| `src/components/shells/DashboardShell.tsx` | Collapsible sidebar, header with search, main content (refactored from `AppShell.tsx`) |
| `src/components/shells/PortfolioShell.tsx` | Top nav bar, hero section slot, content grid |
| `src/components/DataTable.tsx` | Sortable table with column headers, row click handler |
| `src/components/DetailCard.tsx` | Key-value pairs with optional image |
| `src/components/FormCard.tsx` | Styled form: inputs, selects, textarea, submit |
| `src/components/ListItem.tsx` | Clickable row with icon, title, subtitle, badge |
| `src/components/EmptyState.tsx` | Friendly message + CTA button |
| `src/components/PageHeader.tsx` | Title + subtitle + optional action buttons |
| `src/components/MetricRow.tsx` | Horizontal row of 3-4 mini stat items |
| `src/components/ActionMenu.tsx` | Dropdown menu with edit/delete/archive actions |

### Files to Modify

| File | Change |
|------|--------|
| `src/app/globals.css` | Replace hardcoded dark theme with CSS variable structure that supports light themes. Default to light (readability-first). |
| `src/app/layout.tsx` | Remove `className="dark"`, add theme initialization from `rally.config.json` |
| `src/components/StatCard.tsx` | Replace hardcoded dark colors with CSS variable references |
| `src/components/ChartCard.tsx` | Replace hardcoded dark tooltip/grid colors with CSS variable references |
| `src/components/AppShell.tsx` | Keep as-is but add deprecation comment — `DashboardShell` supersedes it |
| `CLAUDE.md` | Complete rewrite: phase guidance, track awareness, shell/theme instructions, component library docs, progress tracking |
| `DOMAIN_TEMPLATE.md` | Add track-aware examples section |
| `.gitignore` | Add `.rally-progress`, `.team-roles`. Remove stale `.rally-status`. |
| `start.sh` | Add AppleScript to resize Terminal window larger |

---

## Task Dependency Graph

```
Task 1 (theme.ts) ──────────────────────┐
                                         ├── Task 3 (globals.css + layout.tsx)
Task 2 (navigation.ts) ─────────────────┤
                                         ├── Task 4 (DashboardShell)
                                         ├── Task 5 (MobileShell)
                                         ├── Task 6 (PortfolioShell)
                                         │
Task 3 (theme system) ──────────────────┤
                                         ├── Task 7 (StatCard + ChartCard theme)
                                         │
Task 7 (existing component updates) ────┤
                                         ├── Task 8 (PageHeader + EmptyState + MetricRow)
                                         ├── Task 9 (DataTable + ListItem + ActionMenu)
                                         ├── Task 10 (DetailCard + FormCard)
                                         │
Task 11 (mockData.ts) ── independent ───┤
                                         │
Task 12 (CLAUDE.md rewrite) ── depends on all components being defined
Task 13 (DOMAIN_TEMPLATE + .gitignore + start.sh)
```

**Parallelizable:** Tasks 1+2+11 can run in parallel. Tasks 4+5+6 can run in parallel. Tasks 8+9+10 can run in parallel.

---

### Task 1: Theme System

**Files:**
- Create: `src/lib/theme.ts`

- [ ] **Step 1: Create theme type definitions and 6 preset themes**

```typescript
// src/lib/theme.ts

export type ThemeName = 'ocean' | 'sunset' | 'forest' | 'berry' | 'slate' | 'custom';

export interface ThemeColors {
  /** Primary accent color (buttons, active nav, highlights) */
  accent: string;
  /** Lighter shade of accent */
  accentLight: string;
  /** Darker shade of accent */
  accentDark: string;
  /** Secondary accent for charts and variety */
  secondary: string;
  /** Tertiary accent for charts */
  tertiary: string;
}

export interface Theme {
  name: ThemeName;
  label: string;
  colors: ThemeColors;
}

export const themes: Record<ThemeName, Theme> = {
  ocean: {
    name: 'ocean',
    label: 'Ocean',
    colors: {
      accent: '#0ea5e9',
      accentLight: '#38bdf8',
      accentDark: '#0284c7',
      secondary: '#06b6d4',
      tertiary: '#8b5cf6',
    },
  },
  sunset: {
    name: 'sunset',
    label: 'Sunset',
    colors: {
      accent: '#f97316',
      accentLight: '#fb923c',
      accentDark: '#ea580c',
      secondary: '#eab308',
      tertiary: '#ef4444',
    },
  },
  forest: {
    name: 'forest',
    label: 'Forest',
    colors: {
      accent: '#22c55e',
      accentLight: '#4ade80',
      accentDark: '#16a34a',
      secondary: '#14b8a6',
      tertiary: '#84cc16',
    },
  },
  berry: {
    name: 'berry',
    label: 'Berry',
    colors: {
      accent: '#a855f7',
      accentLight: '#c084fc',
      accentDark: '#9333ea',
      secondary: '#ec4899',
      tertiary: '#6366f1',
    },
  },
  slate: {
    name: 'slate',
    label: 'Slate',
    colors: {
      accent: '#64748b',
      accentLight: '#94a3b8',
      accentDark: '#475569',
      secondary: '#0ea5e9',
      tertiary: '#8b5cf6',
    },
  },
  custom: {
    name: 'custom',
    label: 'Custom',
    colors: {
      accent: '#0ea5e9',
      accentLight: '#38bdf8',
      accentDark: '#0284c7',
      secondary: '#06b6d4',
      tertiary: '#8b5cf6',
    },
  },
};

/**
 * Apply a theme by setting CSS variables on the document root.
 * Called once at app startup from layout.tsx.
 */
export function applyTheme(themeName: ThemeName, customAccent?: string): void {
  const theme = themes[themeName];
  const colors = themeName === 'custom' && customAccent
    ? { ...theme.colors, accent: customAccent }
    : theme.colors;

  const root = document.documentElement;
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-accent-light', colors.accentLight);
  root.style.setProperty('--color-accent-dark', colors.accentDark);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-tertiary', colors.tertiary);
}

/**
 * Read the theme config passed from the server.
 * layout.tsx reads rally.config.json from disk and passes the theme name
 * as a prop to ThemeInitializer, which calls this function.
 * Falls back to 'ocean' if no theme is provided.
 */
export function initThemeFromConfig(themeName?: string, customAccent?: string): void {
  const name = (themeName as ThemeName) || 'ocean';
  applyTheme(name, customAccent);
}
```

- [ ] **Step 2: Verify theme.ts compiles**

Run: `cd /Users/toddlebaron/Development/rally-kit && npx tsc --noEmit src/lib/theme.ts 2>&1 | head -20`
Expected: No errors (or only errors about missing DOM types which are fine since this runs in browser)

- [ ] **Step 3: Commit**

```bash
git add src/lib/theme.ts
git commit -m "feat: add theme system with 6 presets"
```

---

### Task 2: Navigation Config

**Files:**
- Create: `src/lib/navigation.ts`

- [ ] **Step 1: Create navigation type and helper**

```typescript
// src/lib/navigation.ts

import { type LucideIcon } from 'lucide-react';

export interface NavRoute {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Claude adds routes here as pages are built.
 * Students never edit this file directly.
 *
 * Example:
 *   import { LayoutDashboard, Users } from 'lucide-react';
 *   export const routes: NavRoute[] = [
 *     { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
 *     { label: 'Customers', href: '/customers', icon: Users },
 *   ];
 */
export const routes: NavRoute[] = [];

/** Check if a path matches a route (exact or prefix for nested routes) */
export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/navigation.ts
git commit -m "feat: add navigation route config"
```

---

### Task 3: Theme System — CSS + Layout Integration

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite globals.css with light-first theme using CSS variables**

Replace the entire `globals.css` with a light-background, high-contrast theme that uses CSS variables for accent colors. The accent variables (`--color-accent`, etc.) are set at runtime by `applyTheme()` from theme.ts. The structural colors (backgrounds, text, borders) are hardcoded light.

```css
/* src/app/globals.css */
@import 'tailwindcss';

/*
 * Rally Kit — Vibe Code Rally Design System
 * LIGHT theme — readability first (16px+ body, high contrast)
 * Accent colors set dynamically via theme.ts
 */

@theme {
  /* Accent colors — set by theme.ts at runtime, defaults to Ocean */
  --color-accent: #0ea5e9;
  --color-accent-light: #38bdf8;
  --color-accent-dark: #0284c7;
  --color-secondary: #06b6d4;
  --color-tertiary: #8b5cf6;

  /* Light Backgrounds */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-card: #ffffff;
  --color-bg-card-hover: #f1f5f9;
  --color-bg-sidebar: #f8fafc;
  --color-bg-nav: #ffffff;

  /* Borders */
  --color-border-default: #e2e8f0;
  --color-border-subtle: #f1f5f9;

  /* Text — dark on light for maximum readability */
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;

  /* Status */
  --color-success: #16a34a;
  --color-warning: #ca8a04;
  --color-danger: #dc2626;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
}

/* Smooth rendering */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  font-size: 16px;
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  line-height: 1.6;
}

/* Sidebar scrollbar */
.sidebar-scroll::-webkit-scrollbar {
  width: 4px;
}
.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}
```

- [ ] **Step 2: Update layout.tsx to remove dark class and init theme**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import './globals.css';
import { ThemeInitializer } from '@/components/ThemeInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rally Kit — Vibe Code Rally',
  description: 'Built with AI at the GCU Vibe Code Rally',
};

/** Read rally.config.json from disk (server-side only) */
function readRallyConfig(): { theme?: string; customAccent?: string } {
  try {
    const configPath = join(process.cwd(), 'rally.config.json');
    if (existsSync(configPath)) {
      return JSON.parse(readFileSync(configPath, 'utf-8'));
    }
  } catch {
    // Config doesn't exist yet — use defaults
  }
  return {};
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = readRallyConfig();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-bg-primary text-text-primary min-h-screen`}>
        <ThemeInitializer theme={config.theme} customAccent={config.customAccent} />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create ThemeInitializer client component**

```typescript
// src/components/ThemeInitializer.tsx
'use client';

import { useEffect } from 'react';
import { initThemeFromConfig } from '@/lib/theme';

interface ThemeInitializerProps {
  theme?: string;
  customAccent?: string;
}

export function ThemeInitializer({ theme, customAccent }: ThemeInitializerProps) {
  useEffect(() => {
    initThemeFromConfig(theme, customAccent);
  }, [theme, customAccent]);
  return null;
}
```

- [ ] **Step 4: Verify app still builds**

Run: `cd /Users/toddlebaron/Development/rally-kit && npx next build 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/ThemeInitializer.tsx
git commit -m "feat: light theme system with CSS variables and runtime init"
```

---

### Task 4: Dashboard Shell

**Files:**
- Create: `src/components/shells/DashboardShell.tsx`
- Modify: `src/components/AppShell.tsx` (add deprecation comment)

- [ ] **Step 1: Create DashboardShell (refactored from AppShell)**

Refactored from existing `AppShell.tsx` but uses CSS variables instead of hardcoded dark colors, and references `NavRoute` from navigation.ts.

```typescript
// src/components/shells/DashboardShell.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type NavRoute, isActiveRoute } from '@/lib/navigation';

interface DashboardShellProps {
  appName: string;
  navItems: NavRoute[];
  children: React.ReactNode;
}

export default function DashboardShell({ appName, navItems, children }: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-bg-primary">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-bg-sidebar border-r border-border-default',
          'transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border-default">
          <h1 className="text-lg font-bold text-accent">{appName}</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 sidebar-scroll overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-card-hover'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border-default bg-bg-nav">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="lg:hidden ml-3 text-sm font-medium text-text-secondary">
              {appName}
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-text-muted">
            <Search className="w-4 h-4" />
            <span className="text-sm">Search...</span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add deprecation comment to AppShell.tsx**

Add to top of `src/components/AppShell.tsx`:
```typescript
/**
 * @deprecated Use DashboardShell from '@/components/shells/DashboardShell' instead.
 * This file is kept for backward compatibility during the transition.
 */
```

- [ ] **Step 3: Commit**

```bash
git add src/components/shells/DashboardShell.tsx src/components/AppShell.tsx
git commit -m "feat: add DashboardShell with theme-aware styling"
```

---

### Task 5: Mobile Shell

**Files:**
- Create: `src/components/shells/MobileShell.tsx`

- [ ] **Step 1: Create MobileShell component**

```typescript
// src/components/shells/MobileShell.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { type NavRoute, isActiveRoute } from '@/lib/navigation';

interface MobileShellProps {
  appName: string;
  navItems: NavRoute[];  // Max 4-5 tabs recommended
  children: React.ReactNode;
}

export default function MobileShell({ appName, navItems, children }: MobileShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary max-w-md mx-auto border-x border-border-default">
      {/* Header bar */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-border-default bg-bg-nav sticky top-0 z-10">
        <h1 className="text-lg font-bold text-accent">{appName}</h1>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-auto p-4 pb-20">
        {children}
      </main>

      {/* Bottom tab navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-bg-nav border-t border-border-default z-10">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.slice(0, 5).map((item) => {
            const active = isActiveRoute(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0',
                  active
                    ? 'text-accent'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className={cn(
                  'text-xs truncate',
                  active ? 'font-semibold' : 'font-medium'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/shells/MobileShell.tsx
git commit -m "feat: add MobileShell with bottom tab navigation"
```

---

### Task 6: Portfolio Shell

**Files:**
- Create: `src/components/shells/PortfolioShell.tsx`

- [ ] **Step 1: Create PortfolioShell component**

```typescript
// src/components/shells/PortfolioShell.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type NavRoute, isActiveRoute } from '@/lib/navigation';

interface PortfolioShellProps {
  appName: string;
  navItems: NavRoute[];
  heroContent?: React.ReactNode;
  children: React.ReactNode;
}

export default function PortfolioShell({ appName, navItems, heroContent, children }: PortfolioShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-10 bg-bg-nav border-b border-border-default">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-accent">{appName}</h1>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    active
                      ? 'text-accent'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-border-default bg-bg-nav">
            <nav className="px-6 py-4 space-y-2">
              {navItems.map((item) => {
                const active = isActiveRoute(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'text-accent bg-accent/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-card-hover'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Hero section (optional) */}
      {heroContent && (
        <section className="border-b border-border-default bg-bg-secondary">
          <div className="max-w-6xl mx-auto px-6 py-12">
            {heroContent}
          </div>
        </section>
      )}

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/shells/PortfolioShell.tsx
git commit -m "feat: add PortfolioShell with top nav and hero section"
```

---

### Task 7: Update Existing Components for Theme System

**Files:**
- Modify: `src/components/StatCard.tsx`
- Modify: `src/components/ChartCard.tsx`

- [ ] **Step 1: Update StatCard to use CSS variable accent color**

Replace the hardcoded `accentStyles` map with a simpler approach using CSS variable `--color-accent`. The component still accepts an `accent` prop for variety on dashboards, but the colors reference the theme.

Replace `StatCard.tsx` entirely:

```typescript
// src/components/StatCard.tsx
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  accent?: 'primary' | 'secondary' | 'tertiary' | 'success';
}

const accentClasses = {
  primary: {
    icon: 'bg-accent/10 text-accent',
  },
  secondary: {
    icon: 'bg-secondary/10 text-secondary',
  },
  tertiary: {
    icon: 'bg-tertiary/10 text-tertiary',
  },
  success: {
    icon: 'bg-success/10 text-success',
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent = 'primary',
}: StatCardProps) {
  const styles = accentClasses[accent];

  return (
    <div
      className={cn(
        'bg-bg-card border border-border-default rounded-xl p-6',
        'shadow-card hover:shadow-card-hover transition-all duration-200'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
          {title}
        </h3>
        {Icon && (
          <div className={cn('p-2 rounded-lg', styles.icon)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="text-3xl font-bold text-text-primary mb-1">
        {value}
      </div>

      <div className="flex items-center gap-2">
        {subtitle && (
          <span className="text-sm text-text-muted">{subtitle}</span>
        )}
        {trend && (
          <span
            className={cn(
              'text-sm font-medium',
              trend.positive ? 'text-success' : 'text-danger'
            )}
          >
            {trend.positive ? '\u2191' : '\u2193'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update ChartCard to use CSS variables for tooltip and grid colors**

Replace the hardcoded dark tooltip styles with light-theme-appropriate colors. Replace the hardcoded `COLORS` map with CSS variable references read at render time.

Key changes in `ChartCard.tsx`:
- Tooltip `contentStyle`: `backgroundColor: '#ffffff'`, `border: '1px solid #e2e8f0'`, `color: '#0f172a'`
- CartesianGrid `stroke`: `'#e2e8f0'`
- XAxis/YAxis `stroke`: `'#94a3b8'`
- The `COLORS` map: read from CSS variables via `getComputedStyle` or pass as prop. Simplest approach: keep a static map but use the theme-aware accent as default.

```typescript
// Key changes in ChartCard.tsx — replace the COLORS constant and tooltip styles:

const TOOLTIP_STYLE = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  color: '#0f172a',
  fontSize: '14px',
};

const GRID_COLOR = '#e2e8f0';
const AXIS_COLOR = '#94a3b8';

// Replace color prop type to use theme-aware names:
// color?: 'accent' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'
// And read the actual color from a map that references the CSS variable values.
```

Full replacement file provided — see spec for exact ChartCard.tsx content.

- [ ] **Step 3: Verify build**

Run: `cd /Users/toddlebaron/Development/rally-kit && npx next build 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/StatCard.tsx src/components/ChartCard.tsx
git commit -m "feat: update StatCard and ChartCard for light theme system"
```

---

### Task 8: PageHeader, EmptyState, MetricRow Components

**Files:**
- Create: `src/components/PageHeader.tsx`
- Create: `src/components/EmptyState.tsx`
- Create: `src/components/MetricRow.tsx`

- [ ] **Step 1: Create PageHeader**

```typescript
// src/components/PageHeader.tsx
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-8', className)}>
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {subtitle && (
          <p className="text-base text-text-secondary mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
```

- [ ] **Step 2: Create EmptyState**

```typescript
// src/components/EmptyState.tsx
import { type LucideIcon, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="p-4 rounded-full bg-bg-secondary mb-4">
        <Icon className="w-8 h-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-base text-text-secondary max-w-sm">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create MetricRow**

```typescript
// src/components/MetricRow.tsx
import { cn } from '@/lib/utils';

interface MetricItem {
  label: string;
  value: string | number;
}

interface MetricRowProps {
  metrics: MetricItem[];
  className?: string;
}

export default function MetricRow({ metrics, className }: MetricRowProps) {
  return (
    <div className={cn(
      'flex items-center gap-6 px-6 py-4 bg-bg-card border border-border-default rounded-xl',
      className
    )}>
      {metrics.map((metric, i) => (
        <div key={i} className={cn(
          'flex-1 text-center',
          i < metrics.length - 1 && 'border-r border-border-default'
        )}>
          <div className="text-xl font-bold text-text-primary">{metric.value}</div>
          <div className="text-sm text-text-secondary">{metric.label}</div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/PageHeader.tsx src/components/EmptyState.tsx src/components/MetricRow.tsx
git commit -m "feat: add PageHeader, EmptyState, MetricRow components"
```

---

### Task 9: DataTable, ListItem, ActionMenu Components

**Files:**
- Create: `src/components/DataTable.tsx`
- Create: `src/components/ListItem.tsx`
- Create: `src/components/ActionMenu.tsx`

- [ ] **Step 1: Create DataTable**

```typescript
// src/components/DataTable.tsx
'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  className?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sortAsc ? cmp : -cmp;
      })
    : data;

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div className={cn('bg-bg-card border border-border-default rounded-xl overflow-hidden', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-default bg-bg-secondary">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                className={cn(
                  'text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide',
                  col.sortable && 'cursor-pointer select-none hover:text-text-primary'
                )}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr
              key={i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'border-b border-border-subtle transition-colors',
                onRowClick && 'cursor-pointer hover:bg-bg-card-hover'
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-text-primary">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Create ListItem**

```typescript
// src/components/ListItem.tsx
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListItemProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: { label: string; color?: string };
  onClick?: () => void;
  className?: string;
}

export default function ListItem({ icon: Icon, title, subtitle, badge, onClick, className }: ListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 px-4 py-3 border-b border-border-subtle transition-colors',
        onClick && 'cursor-pointer hover:bg-bg-card-hover',
        className
      )}
    >
      {Icon && (
        <div className="p-2 rounded-lg bg-bg-secondary">
          <Icon className="w-5 h-5 text-accent" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary truncate">{title}</div>
        {subtitle && (
          <div className="text-sm text-text-secondary truncate">{subtitle}</div>
        )}
      </div>
      {badge && (
        <span className={cn(
          'px-2 py-1 text-xs font-medium rounded-full',
          badge.color || 'bg-accent/10 text-accent'
        )}>
          {badge.label}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create ActionMenu**

```typescript
// src/components/ActionMenu.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  danger?: boolean;
}

interface ActionMenuProps {
  items: ActionItem[];
  className?: string;
}

export default function ActionMenu({ items, className }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="p-1.5 rounded-lg hover:bg-bg-card-hover text-text-muted hover:text-text-primary transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-bg-card border border-border-default rounded-lg shadow-card-hover z-20 py-1">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); item.onClick(); setOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                  item.danger
                    ? 'text-danger hover:bg-danger/10'
                    : 'text-text-primary hover:bg-bg-card-hover'
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/DataTable.tsx src/components/ListItem.tsx src/components/ActionMenu.tsx
git commit -m "feat: add DataTable, ListItem, ActionMenu components"
```

---

### Task 10: DetailCard and FormCard Components

**Files:**
- Create: `src/components/DetailCard.tsx`
- Create: `src/components/FormCard.tsx`

- [ ] **Step 1: Create DetailCard**

```typescript
// src/components/DetailCard.tsx
import { cn } from '@/lib/utils';

interface DetailField {
  label: string;
  value: string | number | React.ReactNode;
}

interface DetailCardProps {
  title?: string;
  fields: DetailField[];
  imageUrl?: string;
  className?: string;
}

export default function DetailCard({ title, fields, imageUrl, className }: DetailCardProps) {
  return (
    <div className={cn('bg-bg-card border border-border-default rounded-xl p-6', className)}>
      {imageUrl && (
        <div className="w-full h-40 rounded-lg bg-bg-secondary mb-4 overflow-hidden">
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>
      )}
      <dl className="space-y-3">
        {fields.map((field, i) => (
          <div key={i} className="flex justify-between items-start">
            <dt className="text-sm text-text-secondary">{field.label}</dt>
            <dd className="text-sm font-medium text-text-primary text-right">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
```

- [ ] **Step 2: Create FormCard**

```typescript
// src/components/FormCard.tsx
'use client';

import { cn } from '@/lib/utils';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];  // For select type
  required?: boolean;
}

interface FormCardProps {
  title?: string;
  fields: FormField[];
  submitLabel?: string;
  onSubmit?: (data: Record<string, string>) => void;
  className?: string;
}

export default function FormCard({ title, fields, submitLabel = 'Submit', onSubmit, className }: FormCardProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!onSubmit) return;
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => { data[key] = String(value); });
    onSubmit(data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('bg-bg-card border border-border-default rounded-xl p-6', className)}
    >
      {title && (
        <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>
      )}
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {field.label}
              {field.required && <span className="text-danger ml-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                rows={3}
                className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                required={field.required}
                className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              >
                <option value="">{field.placeholder || 'Select...'}</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            )}
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="mt-6 w-full py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        {submitLabel}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/DetailCard.tsx src/components/FormCard.tsx
git commit -m "feat: add DetailCard and FormCard components"
```

---

### Task 11: Mock Data Utilities

**Files:**
- Create: `src/lib/mockData.ts`

- [ ] **Step 1: Create mock data generator functions**

```typescript
// src/lib/mockData.ts

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
  'Parker', 'Sage', 'Dakota', 'Reese', 'Finley', 'Hayden', 'Emerson', 'Blake',
  'Charlie', 'Drew', 'Jamie', 'Skyler', 'Robin', 'Peyton', 'Logan', 'Cameron',
];

const LAST_NAMES = [
  'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson',
];

const COMPANIES = [
  'Acme Corp', 'Globex Inc', 'Initech', 'Hooli', 'Stark Industries',
  'Wayne Enterprises', 'Umbrella Corp', 'Weyland Corp', 'Cyberdyne',
  'Soylent Corp', 'Aperture Labs', 'Massive Dynamic', 'Pied Piper',
  'Prestige Worldwide', 'TechFlow', 'BrightEdge', 'CloudNine', 'DataVault',
];

const STATUSES = ['Active', 'Pending', 'Completed', 'Cancelled', 'In Progress', 'On Hold'];

/** Random integer between min and max (inclusive) */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random element from an array */
export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Random full name */
export function randomName(): string {
  return `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`;
}

/** Random company name */
export function randomCompany(): string {
  return randomFrom(COMPANIES);
}

/** Random dollar amount formatted as string */
export function randomDollars(min = 100, max = 100000): string {
  const amount = randomInt(min, max);
  return `$${amount.toLocaleString()}`;
}

/** Random dollar amount as number */
export function randomDollarAmount(min = 100, max = 100000): number {
  return randomInt(min, max);
}

/** Random percentage formatted as string */
export function randomPercent(min = 1, max = 100): string {
  return `${randomInt(min, max)}%`;
}

/** Random status */
export function randomStatus(): string {
  return randomFrom(STATUSES);
}

/** Random date string within the last N days */
export function randomDate(daysBack = 90): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Random ISO date string within the last N days */
export function randomISODate(daysBack = 90): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  return date.toISOString().split('T')[0];
}

/** Random email from a name */
export function randomEmail(name?: string): string {
  const n = name || randomName();
  const [first, last] = n.toLowerCase().split(' ');
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'company.com'];
  return `${first}.${last}@${randomFrom(domains)}`;
}

/** Random phone number */
export function randomPhone(): string {
  return `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`;
}

/** Random UUID-like ID */
export function randomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/** Generate an array of N items using a factory function */
export function generateMany<T>(count: number, factory: (index: number) => T): T[] {
  return Array.from({ length: count }, (_, i) => factory(i));
}

/** Generate monthly data for charts */
export function generateMonthlyData(
  months = 6,
  valueKey = 'value',
  minVal = 1000,
  maxVal = 10000
): Record<string, unknown>[] {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  return Array.from({ length: months }, (_, i) => {
    const monthIndex = (now.getMonth() - months + 1 + i + 12) % 12;
    return {
      month: monthNames[monthIndex],
      [valueKey]: randomInt(minVal, maxVal),
    };
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/mockData.ts
git commit -m "feat: add mock data generator utilities"
```

---

### Task 12: CLAUDE.md Complete Rewrite

**Files:**
- Modify: `CLAUDE.md`

This is the most critical task. The rewrite adds phase awareness, track-specific guidance, shell/theme instructions, component library documentation, progress tracking, and educational tone guidance.

- [ ] **Step 1: Rewrite CLAUDE.md**

Replace the entire file with comprehensive phase-guided instructions. The new CLAUDE.md covers:

1. **Identity & Tone** — friendly coding partner, uses team/member names, one question at a time, light educational moments
2. **Boot Sequence** — read `.team-name`, `.team-members`, `.team-track`, `rally.config.json`, `DOMAIN.md`, `.rally-progress`
3. **Phase 1: Design (30 min)** — track-aware ideation, shell selection, theme selection, optional roles, generate DOMAIN.md and rally.config.json
4. **Phase 2: Build (90 min)** — read config, activate shell, compose pages from component library, track progress, time nudges
5. **Phase 3: Polish (30 min)** — realistic data, consistency, demo prep, presenter coaching
6. **Component Library Reference** — usage examples for all 13 components (3 shells + 10 content components)
7. **Default Rules** — light backgrounds, library components, no new packages, realistic mock data, readability-first
8. **Progress Tracking** — `.rally-progress` JSON format
9. **Track-Specific Suggestions** — tailored idea lists per track
10. **Advanced Team Overrides** — Claude judges based on skill + time remaining

Full content is approximately 300 lines. Key sections:

```markdown
# Rally Kit — AI Instructions

> You are a friendly AI coding partner helping a team of business students build a web app
> in 3 hours at the GCU Vibe Code Rally. They have NO coding experience — you do ALL the
> coding. They describe what they want, you build it.

---

## Your Personality

- Encouraging, conversational, never condescending
- Use the team name and member names throughout
- Ask ONE question at a time — never dump multiple questions
- Drop light teachable moments as you build (one-liners, not lectures)
  - "This is called a KPI — a number that tells you if things are going well"
  - "What you just did is called domain modeling — mapping a business into data"
  - "Polish is what separates a prototype from a product"
- Reference roles when assigned (e.g., "Designer — what do you think of this layout?")

---

## Boot Sequence (Run on First Message)

1. Read `.team-name` — use throughout
2. Read `.team-members` — greet by name
3. Read `.team-track` — tailor suggestions (see Track Suggestions below)
4. Read `rally.config.json` — if exists, skip design phase config questions
5. Read `DOMAIN.md` — if exists, ask: "You already have a domain design. Jump to building, or revise first?"
6. Read `.rally-progress` — if exists, resume from where they left off

If no dotfiles exist (student ran `claude` directly), start Phase 1 from scratch.

Welcome message format:
> "Welcome to the Vibe Code Rally, **Team [name]**! Hey [member1], [member2], [member3] —
> you've got 3 hours to design a business and build a working app. I'll do all the coding —
> you do the thinking. Your track is **[track]** — let's go!"

---

## Phase 1: Design (30 minutes)

### 1.1 Business Ideation
- Ask what business/tool they want to build (give 3-4 examples from their track)
- Ask who uses the app and what their day looks like
- Ask what 4-5 pages the app needs — suggest defaults

### 1.2 Shell Selection
Describe the 3 shell options and let them choose:

| Shell | Best For | Layout |
|-------|----------|--------|
| **Mobile** | Personal tools, social apps, student tools | Bottom tabs, card-based, scrollable |
| **Dashboard** | Business dashboards, analytics, management | Sidebar nav, stat cards, data tables |
| **Portfolio** | Career tools, portfolios, professional sites | Top nav, hero section, content grid |

Suggest based on track: Campus AI → Mobile, Startup AI → Dashboard, Future → Portfolio.
But the team can pick ANY shell for ANY track.

### 1.3 Theme Selection
Ask what color theme they want:
- **Ocean** — blues and teals
- **Sunset** — oranges and ambers
- **Forest** — greens
- **Berry** — purples and pinks
- **Slate** — neutral grays
- **Custom** — pick your own accent color

### 1.4 Role Assignment (Optional)
For teams of 3+, offer roles:
- **CEO** — final decisions on features and priorities
- **Designer** — feedback on layout, colors, UX
- **Presenter** — prepares demo pitch, takes notes

Save roles to `.team-roles` if assigned.

### 1.5 Save Configuration
Generate these files:
- `DOMAIN.md` — business design document (use DOMAIN_TEMPLATE.md as structure)
- `rally.config.json`:
```json
{
  "shell": "dashboard",
  "theme": "ocean",
  "customAccent": null,
  "roles": { "ceo": "Alex", "designer": "Jordan", "presenter": "Taylor" }
}
```

Teachable moment: "What you just did is called domain modeling — mapping a real business into a data structure an app can work with."

---

## Phase 2: Build (90 minutes)

### Setup
1. Read `DOMAIN.md` and `rally.config.json`
2. Import the chosen shell and set up navigation in `src/lib/navigation.ts`
3. Update `src/app/page.tsx` to redirect to the first page

### Build Order
1. Set up shell layout with navigation for all planned pages
2. Build Dashboard page first (sets the tone, uses StatCard + ChartCard)
3. Build list/detail pages (uses DataTable, ListItem, DetailCard)
4. Build form pages if needed (uses FormCard)
5. Add mock data to `src/data/mock.ts` using generators from `src/lib/mockData.ts`

### After Each Page
- Show what was built, describe the UI
- Ask: "Does this look right? Any changes?"
- Wait for feedback before moving on
- Track progress in `.rally-progress`

### Progress Tracking
Update `.rally-progress` after each major milestone:
```json
{
  "startedAt": "2026-04-15T14:00:00Z",
  "phase": "build",
  "shell": "dashboard",
  "theme": "ocean",
  "domainComplete": true,
  "pagesBuilt": ["dashboard", "customers"],
  "pagesPlanned": ["dashboard", "customers", "orders", "analytics"],
  "lastNudge": "2026-04-15T15:15:00Z"
}
```

### Time Nudges
Every 20-30 minutes, give a gentle status update:
> "Quick check-in: we've built 2 of 4 pages with about an hour left. We're on track! Ready for the orders page?"

If running behind:
> "Heads up — we have 40 minutes left and 2 pages to go. Want to simplify these or combine them?"

---

## Phase 3: Polish (30 minutes)

1. Replace placeholder data with realistic mock data
2. Ensure consistent styling across all pages
3. Add empty states where appropriate
4. Help prepare demo talking points
5. If a Presenter role is assigned, address them specifically:
   > "Presenter — here are the key things to mention in your 2-minute demo..."

Teachable moment: "Polish is what separates a prototype from a product."

---

## Component Library

Use these pre-built components. Do NOT build UI primitives from scratch unless the team is advanced and has time.

### Shell Components (choose one)
- `import MobileShell from '@/components/shells/MobileShell'`
- `import DashboardShell from '@/components/shells/DashboardShell'`
- `import PortfolioShell from '@/components/shells/PortfolioShell'`

All shells accept: `appName: string`, `navItems: NavRoute[]`, `children: ReactNode`
PortfolioShell also accepts: `heroContent?: ReactNode`

### Content Components
| Component | Import | Purpose |
|-----------|--------|---------|
| StatCard | `@/components/StatCard` | Big number + label + trend |
| ChartCard | `@/components/ChartCard` | Recharts wrapper (bar, line, area, pie) |
| DataTable | `@/components/DataTable` | Sortable table with columns |
| DetailCard | `@/components/DetailCard` | Key-value pairs with optional image |
| FormCard | `@/components/FormCard` | Styled form with inputs, selects, textarea |
| ListItem | `@/components/ListItem` | Clickable row with icon, title, subtitle, badge |
| EmptyState | `@/components/EmptyState` | Friendly "nothing here yet" message |
| PageHeader | `@/components/PageHeader` | Title + subtitle + action buttons |
| MetricRow | `@/components/MetricRow` | Horizontal row of mini stats |
| ActionMenu | `@/components/ActionMenu` | Dropdown with edit/delete/archive |

### Utilities
- `@/lib/mockData` — randomName(), randomDollars(), randomDate(), generateMonthlyData(), etc.
- `@/lib/theme` — applyTheme(), themes, ThemeName
- `@/lib/navigation` — NavRoute type, routes array, isActiveRoute()

---

## Multi-Laptop Teams

If the team has extra laptops, those are research stations — NOT code stations:
- Browse competitor apps for inspiration
- Draft copy/content in Google Docs
- Sketch wireframes on paper
- Look up domain knowledge (industry terms, pricing, workflows)

Only ONE laptop runs Claude and builds the app.

---

## Default Rules

These are defaults — Claude can override for advanced teams with time remaining.

- **READABILITY FIRST** — Light backgrounds, dark text, 16px+ fonts, high contrast
- **Use library components** — Don't build from scratch what the library provides
- **NEVER install new npm packages** — Everything needed is already installed
- **Keep mock data realistic** — Real names, plausible numbers, proper dates
- **If stuck, ask ONE question** — Don't dump multiple questions
- **No dark mode** — Light theme only (override only if advanced team explicitly wants it)

---

## Track-Specific Suggestions

### Campus AI
Ideas: Study planner, campus event finder, resume builder, email assistant, personal budget tracker, club management tool, meal planner, roommate chore tracker

### Startup AI
Ideas: Marketing campaign tracker, content calendar, pricing engine, customer CRM, 90-day launch planner, competitor analysis tool, invoice generator, pitch deck organizer

### Working Toward My Future
Ideas: Job application tracker, career path evaluator, personal CRM, portfolio builder, networking tracker, skill gap analyzer, interview prep tool, salary comparison dashboard

---

## Tech Stack (LOCKED)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Charts | Recharts |
| Utilities | clsx + tailwind-merge |

**DO NOT use or install:** databases, auth, external APIs, additional npm packages, Framer Motion, Radix, Shadcn.

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx          ← Root layout (theme initialization)
│   ├── page.tsx            ← Landing or redirect
│   ├── globals.css         ← Theme CSS variables
│   └── [page-name]/page.tsx
├── components/
│   ├── shells/
│   │   ├── MobileShell.tsx
│   │   ├── DashboardShell.tsx
│   │   └── PortfolioShell.tsx
│   ├── ThemeInitializer.tsx
│   ├── StatCard.tsx
│   ├── ChartCard.tsx
│   ├── DataTable.tsx
│   ├── DetailCard.tsx
│   ├── FormCard.tsx
│   ├── ListItem.tsx
│   ├── EmptyState.tsx
│   ├── PageHeader.tsx
│   ├── MetricRow.tsx
│   └── ActionMenu.tsx
├── data/
│   └── mock.ts             ← Domain-specific mock data
└── lib/
    ├── utils.ts             ← cn() helper
    ├── theme.ts             ← Theme definitions + applyTheme()
    ├── navigation.ts        ← Route config
    └── mockData.ts          ← Generator functions
```
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "feat: complete CLAUDE.md rewrite with phase guidance, shells, themes, components"
```

---

### Task 13: Supporting Files

**Files:**
- Modify: `DOMAIN_TEMPLATE.md`
- Modify: `.gitignore`
- Modify: `start.sh`

- [ ] **Step 1: Add track-aware hints to DOMAIN_TEMPLATE.md**

Add a section at the top after the title:

```markdown
> **Track:** Check `.team-track` for your team's chosen track.
> - **Campus AI** — Think about student pain points (scheduling, studying, organizing)
> - **Startup AI** — Think about business operations (customers, revenue, marketing)
> - **Working Toward My Future** — Think about career growth (jobs, skills, networking)
```

- [ ] **Step 2: Update .gitignore**

Remove the stale `.rally-status` entry and add new entries:

```
.rally-progress
.team-roles
```

- [ ] **Step 3: Add Terminal resize to start.sh**

After the existing `osascript` popup dialog, add a second `osascript` block to resize Terminal:

```bash
# Resize Terminal window for readability
osascript -e '
tell application "Terminal"
  set bounds of front window to {50, 50, 1400, 900}
  set font size of front window to 16
end tell
' 2>/dev/null || true
```

- [ ] **Step 4: Commit**

```bash
git add DOMAIN_TEMPLATE.md .gitignore start.sh
git commit -m "feat: track hints, gitignore updates, terminal resize"
```

---

## Execution Summary

| Task | Files | Dependencies | Est. Steps |
|------|-------|-------------|-----------|
| 1. Theme system | 1 new | None | 3 |
| 2. Navigation config | 1 new | None | 2 |
| 3. CSS + Layout integration | 2 modify + 1 new | Task 1 | 5 |
| 4. DashboardShell | 1 new + 1 modify | Tasks 1, 2 | 3 |
| 5. MobileShell | 1 new | Tasks 1, 2 | 2 |
| 6. PortfolioShell | 1 new | Tasks 1, 2 | 2 |
| 7. StatCard + ChartCard updates | 2 modify | Task 3 | 4 |
| 8. PageHeader + EmptyState + MetricRow | 3 new | Task 3 | 4 |
| 9. DataTable + ListItem + ActionMenu | 3 new | Task 3 | 4 |
| 10. DetailCard + FormCard | 2 new | Task 3 | 3 |
| 11. Mock data utilities | 1 new | None | 2 |
| 12. CLAUDE.md rewrite | 1 modify | All components | 2 |
| 13. Supporting files | 3 modify | None | 4 |
| **Total** | **14 new + 8 modify** | | **40 steps** |
