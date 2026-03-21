# Implementation Plan: iframe srcdoc Sandbox

> Spec: `docs/superpowers/specs/2026-03-20-iframe-srcdoc-sandbox-design.md`
> Deadline: March 25, 2026

---

## Step 1: Remove WebContainer dependency and COOP/COEP headers

**Files:**
- `package.json` — remove `@webcontainer/api`
- `next.config.ts` — remove COOP/COEP headers (they were only for WebContainers and can break CDN loading)

**Verify:** `npm run build` still compiles (will fail on imports — that's expected, fixed in later steps)

---

## Step 2: Replace tools (API layer)

**Files:**
- `lib/ai/tools.ts` — replace 3 tools (writeFile, readFile, listFiles) with 1 tool (writeApp)

**New tool definition:**
```typescript
export const rallyTools = {
  writeApp: tool({
    description: "Write or update the student's app. Provide a complete, self-contained HTML document with React components, Tailwind styling, and all pages. The HTML will render immediately in the preview.",
    inputSchema: z.object({
      html: z.string().describe('Complete HTML document including CDN scripts, styles, and all React components'),
    }),
  }),
}
```

**Verify:** TypeScript compiles, no other files reference old tool names yet (they will be fixed in step 4)

---

## Step 3: Rewrite system prompt

**Files:**
- `lib/ai/system-prompt.ts` — major rewrite of build instructions

**Key changes:**
- Tech stack → CDN-based (React UMD, Babel Standalone, Tailwind CDN)
- Build instructions → "Call writeApp with a complete HTML document"
- Include full starter template HTML in the prompt
- Component library docs → inline function definitions (same props)
- Shell docs → inline layout patterns using hash routing
- Remove all file system references (src/, pages/, etc.)
- Safety rules → no packages to install, no filesystem
- Icons → inline SVG helper functions instead of lucide-react imports

**The starter template in the prompt shows:**
1. HTML skeleton with all CDN `<script>` tags
2. Tailwind config with theme color CSS variables
3. Hash-based router pattern
4. One example page component
5. Shell layout pattern (DashboardShell example)
6. StatCard component example

---

## Step 4: Simplify ChatPanel

**Files:**
- `components/rally/ChatPanel.tsx`

**Changes:**
- Remove `import type { WebContainer }` and `import { writeFile, readFile, listFiles }`
- Remove `webcontainer` from props interface → add `onAppUpdate: (html: string) => void`
- Remove `pendingToolCalls` ref and entire queue logic
- Remove `executePendingToolCall` and `executeToolCall` callbacks
- Remove `useEffect` for pending tool calls
- Simplify `onToolCall` handler:
  ```typescript
  async onToolCall({ toolCall }) {
    if (toolCall.dynamic) return
    onPhaseChange?.('build')
    if (toolCall.toolName === 'writeApp') {
      const { html } = toolCall.input as { html: string }
      onAppUpdate(html)
      onFileWritten('app')
      addToolOutput({
        tool: 'writeApp',
        toolCallId: toolCall.toolCallId,
        output: 'App updated — preview refreshed.',
      })
    }
  }
  ```
- Update FileChangeNotification rendering to match `tool-writeApp` part type
- Remove `onBuildRequested` from props (no sandbox to boot)

---

## Step 5: Rewrite PreviewPanel with device frames

**Files:**
- `components/rally/PreviewPanel.tsx`

**Changes:**
- Props: `{ appHtml: string | null; shell?: 'mobile' | 'dashboard' | 'portfolio' }` (remove previewUrl, modifiedFiles)
- When `appHtml === null`: show placeholder text
- When `appHtml !== null`: show iframe with device frame
- **Device frames:**
  - `mobile` → Phone bezel: rounded corners, notch at top, home bar at bottom, max-w-[375px] centered
  - `dashboard` → Browser chrome: title bar with dots (red/yellow/green), URL bar, full width
  - `portfolio` → Same browser chrome as dashboard
  - Default (no shell selected yet) → plain iframe, no frame
- iframe uses `srcdoc={appHtml}` with `sandbox="allow-scripts"` for security
- Remove tab bar (preview/code tabs) — code tab was for file activity which no longer exists

---

## Step 6: Simplify RallyShell (state management)

**Files:**
- `components/rally/RallyShell.tsx`

**Remove:**
- `import type { WebContainer }` and `import { bootWebContainer }`
- `webcontainer` state
- `sandboxStatus` state
- `bootDetail` state
- `bootStarted` ref
- `ensureWebContainer` callback
- `retryWebContainer` callback
- `sendTelemetry` calls for boot phases
- `useEffect` for eager boot
- `showBuildTransition` state and `<BuildTransition>` render

**Add:**
- `appHtml: string | null` state (initialized to `null`)
- `handleAppUpdate` callback: `setAppHtml(html)` + send telemetry `app:updated`
- `selectedShell` state (extracted from ideas when shell is chosen)

**Update DesignWorkspace props:** remove `webcontainer`, `onBuildRequested`
**Update BuildWorkspace props:** remove `webcontainer`, `sandboxStatus`, `sandboxDetail`, `previewUrl`, `onRetry`. Add `appHtml`, `selectedShell`.

---

## Step 7: Simplify BuildWorkspace

**Files:**
- `components/rally/BuildWorkspace.tsx`

**Changes:**
- Remove all WebContainer/sandbox props
- New props: `appHtml: string | null`, `selectedShell?: string`, plus existing team/callbacks
- Remove BootScreen, error state, and idle state renders
- Layout: Chat (480px) + PreviewPanel (remaining)
- Pass `appHtml` and `shell` to PreviewPanel

---

## Step 8: Simplify DesignWorkspace

**Files:**
- `components/rally/DesignWorkspace.tsx`

**Changes:**
- Remove `import type { WebContainer }`
- Remove `webcontainer` from props
- Remove `onBuildRequested` from props
- Update ChatPanel call to not pass webcontainer/onBuildRequested

---

## Step 9: Clean up types and StatusBar

**Files:**
- `lib/rally/types.ts` — remove `SandboxStatus` type and `sandbox` from `RallyState`
- `components/rally/StatusBar.tsx` — simplify to show phase only (no sandbox status)

---

## Step 10: Remove BrowserCheck and COOP/COEP requirement

**Files:**
- `components/landing/BrowserCheck.tsx` — delete or simplify (SharedArrayBuffer no longer needed)
- Check if BrowserCheck is used on the landing page and remove the import

---

## Step 11: Delete WebContainer files

**Files to delete:**
- `lib/webcontainer/boot.ts`
- `lib/webcontainer/files.ts`
- `lib/webcontainer/operations.ts`
- `components/rally/BootScreen.tsx`
- `components/rally/BuildTransition.tsx`

---

## Step 12: Build, test, deploy

1. `npm run build` — must compile clean
2. Manual test: landing page → team form → splash → design phase works
3. Manual test: AI chat generates writeApp → preview renders instantly
4. Manual test: hash routing works between pages
5. Manual test: theme colors apply
6. Manual test: device frames render correctly
7. `vercel --prod` to deploy
8. Test on rally.aicoderally.com

---

## Parallelization

Steps 1-3 can be done in sequence (foundation).
Steps 4-10 are independent and can be parallelized.
Step 11 is cleanup after everything else.
Step 12 is verification.

## Estimated Effort

~200 lines of new/modified code. ~1000 lines deleted. Most of the work is in steps 3 (system prompt) and 5 (device frames). The rest are simplifications — removing code is fast.
