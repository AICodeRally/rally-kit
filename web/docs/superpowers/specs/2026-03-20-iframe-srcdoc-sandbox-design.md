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

## iframe Security

The iframe uses `sandbox="allow-scripts"` with `srcdoc`. This means:
- JavaScript executes (React/Babel need this)
- The iframe gets a unique opaque origin — it **cannot** access the parent frame's DOM, cookies, localStorage, or session tokens
- No `allow-same-origin` — this is intentional. Student-generated code is untrusted.
- No `allow-forms`, `allow-popups`, `allow-top-navigation` — students can't submit forms to external URLs or navigate the parent

---

## Error Handling

When the AI generates invalid JSX or runtime errors occur, students must see a helpful error message — not a white screen.

**Two error layers:**

1. **Babel compile errors** — the system prompt instructs the AI to wrap the main `<script type="text/babel">` in a pattern that catches Babel parse failures and shows an error div. Additionally, a global `window.onerror` handler in a separate `<script>` (not `type="text/babel"`) catches anything Babel misses.

2. **React runtime errors** — an `ErrorBoundary` component defined at the top of the Babel script wraps `<App />`. It catches render errors and shows "Something went wrong — tell your AI partner to fix it."

**Error overlay design:**
```html
<div style="padding:2rem;background:#fef2f2;border:2px solid #fca5a5;border-radius:12px;margin:2rem;font-family:system-ui">
  <h2 style="color:#dc2626;margin-bottom:0.5rem">Something went wrong</h2>
  <p style="color:#7f1d1d">Tell your AI partner: "Hey, the preview broke — can you fix it?"</p>
  <pre style="margin-top:1rem;padding:1rem;background:#fff;border-radius:8px;overflow:auto;font-size:13px;color:#374151">[error message here]</pre>
</div>
```

**Recovery:** The AI sees the error in the tool output ("writeApp succeeded but preview shows error: [message]") — actually, the AI doesn't see iframe errors. But students can paste the error message into chat, and the AI will fix the JSX. The system prompt tells the AI about `/fix` command for this scenario.

---

## Device Frames

The preview iframe is wrapped in a **device frame** that matches the chosen shell:

| Shell | Frame | Description |
|-------|-------|-------------|
| MobileShell | Phone bezel | Rounded corners (3rem), notch/dynamic island at top, home bar at bottom, centered at max-w-[375px], dark bezel color |
| DashboardShell | Browser chrome | Title bar with traffic light dots (red/yellow/green), URL bar showing app name, full-width |
| PortfolioShell | Browser chrome | Same as DashboardShell |
| (none selected) | No frame | Plain iframe filling the panel |

**Shell detection:** The `selectedShell` is extracted from the ideas array when an `[IDEA:shell:ShellName]` marker is captured. RallyShell passes it down to BuildWorkspace → PreviewPanel.

**Frames are CSS-only** — pure divs with border-radius, background colors, and nested elements. No images, no SVGs, no external assets.

---

## CDN Reliability

Campus WiFi may block or throttle CDN domains. Mitigation:

1. **Pin CDN versions** — use versioned URLs to avoid breaking changes:
   - `https://unpkg.com/react@18.3.1/umd/react.development.js`
   - `https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js`
   - `https://unpkg.com/@babel/standalone@7.26.5/babel.min.js`
   - `https://cdn.tailwindcss.com/3.4.17` (pinned v3)
2. **Use development React** — better error messages for students (extra ~200KB is negligible, CDN-cached)
3. **Pre-event test** — load rally.aicoderally.com on campus WiFi and verify CDN scripts load. If blocked, fall back to serving bundled copies from `/public/vendor/`.
4. **Fallback plan** — if CDN is unreachable, the AI generates HTML with `<script>` tags pointing to local `/vendor/*.js` routes that proxy the scripts from the Next.js app.

---

## State on Re-render

Each `writeApp` call replaces the entire iframe content, which resets all React state (form inputs, scroll position, hash route). This is a known and accepted limitation:

- The AI is instructed to set `window.location.hash` to the current page when regenerating, so navigation state is preserved
- Mock data is hardcoded in the HTML, so it's always present
- Form state loss is acceptable — students aren't entering real data, they're looking at the preview
- The AI can restore to any page by setting the default hash in the generated code

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Babel Standalone adds ~1MB to generated HTML | CDN-cached after first load; students on same WiFi share cache |
| AI generates invalid JSX → white screen | ErrorBoundary + window.onerror + friendly error overlay (see Error Handling section) |
| Single HTML grows large for complex apps | 3-hour prototype won't exceed ~2000 lines; Babel handles this fine |
| No hot reload — full page re-render on update | Sub-100ms render; students won't notice vs HMR |
| Lucide icons as inline SVGs bloats HTML | Only include icons actually used; typical app uses 5-10 |
| CDN blocked on campus WiFi | Pin versions, pre-event test, local fallback ready (see CDN Reliability) |
| State loss on re-render | AI preserves hash route, mock data is static (see State on Re-render) |

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
9. Error overlay appears on invalid JSX (not white screen)
10. Device frames render correctly for each shell type
11. iframe sandbox attribute blocks parent frame access
12. Works on campus WiFi equivalent (throttled network)
13. 3 concurrent teams each render independently in their own browser tabs
