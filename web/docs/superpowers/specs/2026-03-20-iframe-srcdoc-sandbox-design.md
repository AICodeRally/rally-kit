# Rally Kit: iframe srcdoc Sandbox Design

> Replace WebContainers with direct iframe srcdoc rendering for instant, reliable student app previews.

**Date:** 2026-03-20
**Status:** Approved
**Deadline:** March 25, 2026 (GCU event — 3 teams, ~9 students, 3-hour session)

---

## Problem

WebContainer `npm install` takes 142-228 seconds inside the browser WASM sandbox and frequently fails entirely. Despite stripping dependencies from ~12 packages to 7 (removed recharts, tailwindcss, postcss, tailwind-merge), the sandbox still errors out. This is a fundamental limitation of running npm inside browser WASM on campus WiFi with student laptops.

## Solution

Kill WebContainers entirely. The AI generates **complete, self-contained HTML documents** and we render them via `iframe.srcdoc`. Zero npm install, zero dev server, zero boot time, zero failure modes.

## Architecture

### Current Flow (broken)
```
AI → writeFile tool → WebContainer fs → npm install → Vite dev server → iframe src=url
                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                       All of this fails
```

### New Flow
```
AI → writeApp tool → returns HTML string → iframe srcdoc=html
```

### CDN Dependencies (loaded in generated HTML `<head>`)
- **React 18** + **ReactDOM 18** — UMD from unpkg.com
- **Babel Standalone** — compiles `<script type="text/babel">` JSX in-browser
- **Tailwind CSS CDN** — `cdn.tailwindcss.com` with inline theme config
- **Lucide icons** — inline SVGs (no npm package)

### Routing
Hash-based routing (`#/dashboard`, `#/customers`) using `window.location.hash` listener. No react-router-dom, no npm package needed.

---

## Tool Design

### Before: 3 tools
```typescript
writeFile({ path: string, content: string })   // Write a file to sandbox
readFile({ path: string })                      // Read a file from sandbox
listFiles({ path: string })                     // List directory contents
```

### After: 1 tool
```typescript
writeApp({ html: string })   // Complete HTML document → iframe srcdoc
```

The AI generates the **entire app** as a single HTML document on every update. This sounds expensive but matches existing behavior — the AI already wrote complete file contents (never diffs). Now it's one file instead of 8.

The HTML document includes:
- CDN script tags in `<head>`
- Tailwind config block with CSS custom properties for theming
- One `<script type="text/babel">` block containing all React components, pages, mock data, and hash router
- Inline CSS for custom properties (theme colors, shadows)

---

## Component Library

Same conceptual components, defined inline instead of imported:

| Component | Props (unchanged) | Notes |
|-----------|-------------------|-------|
| StatCard | title, value, subtitle, icon, trend, accent | Icon becomes inline SVG |
| ChartCard | title, type, data, dataKey, xAxisKey, color | Pure CSS bars (no recharts) |
| DataTable | columns, data, onRowClick | Sortable table |
| DetailCard | title, fields, imageUrl | Key-value display |
| FormCard | title, fields[], onSubmit | Auto-generated form |
| ListItem | icon, title, subtitle, badge, onClick | List rows |
| EmptyState | icon, title, description, actionLabel | Placeholder |
| PageHeader | title, subtitle, actions | Page header |
| MetricRow | metrics[] | Horizontal stats |
| ActionMenu | items[] | Dropdown menu |

Shell components (MobileShell, DashboardShell, PortfolioShell) are also defined inline within the HTML.

---

## Files Changed

### Deleted
| File | Reason |
|------|--------|
| `lib/webcontainer/boot.ts` | Sandbox boot logic — no longer needed |
| `lib/webcontainer/files.ts` | 700-line filesystem tree — no longer needed |
| `lib/webcontainer/operations.ts` | writeFile/readFile/listFiles — replaced by writeApp |
| `components/rally/BootScreen.tsx` | Boot progress UI — no boot phase |
| `components/rally/BuildTransition.tsx` | Transition animation — instant now |

### Modified
| File | Changes |
|------|---------|
| `components/rally/RallyShell.tsx` | Remove WebContainer state (webcontainer, sandboxStatus, bootDetail, ensureWebContainer, retryWebContainer, eager boot useEffect). Add `appHtml: string \| null` state. |
| `components/rally/BuildWorkspace.tsx` | Simplified props: remove webcontainer, sandboxStatus, sandboxDetail, previewUrl, onRetry. Add appHtml. Remove BootScreen/error states. |
| `components/rally/PreviewPanel.tsx` | `<iframe srcdoc={html}>` instead of `<iframe src={url}>` |
| `components/rally/ChatPanel.tsx` | Replace writeFile/readFile/listFiles tool handlers with single writeApp handler. Remove tool queue logic (no async boot to wait for). |
| `components/rally/StatusBar.tsx` | Remove sandbox status display |
| `app/api/chat/route.ts` | Replace 3 rally tools with 1 writeApp tool |
| `lib/ai/system-prompt.ts` | Complete rewrite: new tech stack (CDN), new build instructions (single HTML), starter template, updated component docs |
| `lib/rally/types.ts` | Remove SandboxStatus type |
| `package.json` | Remove `@webcontainer/api` dependency |

### Created
None. Pure simplification.

### Net Effect
~1000 lines deleted, ~200 lines modified. Codebase becomes dramatically simpler.

---

## System Prompt Structure

The AI system prompt includes:

1. **Personality + formatting rules** (unchanged)
2. **Phase 1: Design flow** (unchanged — same sequential questioning)
3. **Phase 2: Build** — rewritten:
   - "When you build, call writeApp with a complete HTML document"
   - Starter template showing the HTML skeleton
   - Component patterns defined as inline React functions
   - Hash routing pattern
   - Theming via CSS custom properties
4. **Phase 3: Polish** (minor updates — same checklist)
5. **Tech stack** — CDN-based, no npm
6. **Safety rules** — simplified (no filesystem, no packages)

### Starter Template (included in prompt)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App Name</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { theme: { extend: { colors: { accent: '#0ea5e9' } } } }
  </script>
  <style>
    :root { --color-accent: #0ea5e9; /* ... theme vars */ }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect } = React;

    // Components defined here
    function StatCard({ title, value }) { /* ... */ }

    // Pages defined here
    function Dashboard() { /* ... */ }

    // Hash Router
    function App() {
      const [page, setPage] = useState(window.location.hash || '#/');
      useEffect(() => {
        const handler = () => setPage(window.location.hash || '#/');
        window.addEventListener('hashchange', handler);
        return () => window.removeEventListener('hashchange', handler);
      }, []);
      // Route matching
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
```

---

## Preview Panel Behavior

| State | What Shows |
|-------|-----------|
| `appHtml === null` | Placeholder: "Your app will appear here when we start building" |
| `appHtml !== null` | `<iframe srcdoc={appHtml} />` with the live app |

No boot screen, no progress bars, no spinners, no error states. The preview either shows a placeholder or the app. That's it.

---

## Phase Transition

When the AI's first `writeApp` tool call fires:
1. `appHtml` state updates with the HTML
2. Phase flips from `design` to `build` (same trigger as before — first tool call)
3. Preview shows the app immediately

No `BuildTransition` animation needed — the app just appears.

---

## Telemetry

Telemetry endpoint stays. Status events simplify:
- `phase:design` — design phase started
- `phase:build` — build phase started (first writeApp)
- `app:updated` — each writeApp call
- No more: booting, mounting, installing, starting, ready, error

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Babel Standalone adds ~1MB to each generated HTML | CDN-cached after first load; students on same WiFi share cache |
| AI generates invalid JSX → white screen | Wrap `<script type="text/babel">` output in try/catch; show error overlay in iframe |
| Single HTML grows large for complex apps | 3-hour prototype won't exceed ~2000 lines; Babel handles this fine |
| No hot reload — full page re-render on update | Sub-100ms render; students won't notice vs HMR |
| Lucide icons as inline SVGs bloats HTML | Only include icons actually used; typical app uses 5-10 |

---

## Verification

1. `npm run build` — clean compile (no WebContainer imports remaining)
2. Landing page → team form → splash → design workspace works unchanged
3. AI chat works, design flow completes
4. AI calls writeApp → preview shows app instantly (no boot delay)
5. AI updates app → preview re-renders immediately
6. Hash navigation works between pages
7. Theme colors apply correctly
8. Tailwind classes render (CDN working)
9. Works on campus WiFi equivalent (throttled network)
10. 3 concurrent teams don't interfere with each other
