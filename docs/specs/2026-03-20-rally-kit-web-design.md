# Rally Kit Web — Design Spec

> **Status:** Draft
> **Author:** Todd + Claude
> **Date:** 2026-03-20
> **Target:** Friday Mar 27 (3 teams, 9 students at GCU)
> **Scale target:** April 15 (60 students at GCU campus event)

---

## Problem

The Rally Kit currently requires local Node.js, Claude CLI, and an API key on each student laptop. Mac works, PC doesn't. Students bring their own devices (Mac, PC, Chromebook). Setup friction burns event time and fails unpredictably.

## Solution

A web app at `rally.aicoderally.com` where students open a URL and start building. Chat-first interface (text, not voice). AI writes code into an in-browser sandbox. Live preview updates in real-time. Zero install. Works on any device with a modern browser (Chrome, Edge, Safari 16.4+, Firefox).

---

## Architecture

```
Student's Browser                           Vercel
┌──────────────────────────┐    HTTPS    ┌──────────────────────┐
│                          │ ◄────────► │  Next.js App Router   │
│  React App               │            │                       │
│  ├── Chat UI             │            │  /api/chat            │
│  ├── WebContainer        │            │  ├── AI Gateway/BYOK  │
│  │   ├── Node.js (WASM)  │            │  ├── System prompt    │
│  │   ├── Rally Kit files │            │  ├── Tool definitions │
│  │   ├── next dev server │            │  └── Stream response  │
│  │   └── Hot reload      │            │                       │
│  └── Preview (iframe)    │            │  Env vars:            │
│      └── localhost:3000   │            │  ├── ANTHROPIC_API_KEY│
│         (inside WASM)    │            │  └── (or OIDC token)  │
└──────────────────────────┘            └──────────────────────┘
```

**Key principle:** The Vercel app is a thin relay. All code execution happens in the browser. The server only handles AI chat (keeping keys safe) and serves the static app.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) | Vercel-native, AI SDK integration |
| AI | AI SDK v6 + AI Gateway (OIDC) | Cost tracking per team, failover, no key management |
| AI Fallback | `ANTHROPIC_API_KEY` env var | If OIDC isn't set up in time |
| Sandbox | `@webcontainer/api` | In-browser Node.js, no server infra, free |
| UI | Tailwind CSS + Geist font | Fast, matches AICR design language |
| Chat rendering | AI Elements (`message` component) | Handles streaming markdown properly |
| State | In-memory (React state) | 3-hour event, no persistence needed |
| Deploy | Vercel | Zero-config, instant deploys |

### Dependencies

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "ai": "^6.0.0",
    "@ai-sdk/react": "^3.0.0",
    "@webcontainer/api": "^1.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

**AI Elements:** Install only `message` component for streaming markdown rendering.

---

## Pages & Routes

```
/                           → Landing: team setup (name, members, track)
/rally/[teamSlug]           → Main app: chat + preview
/api/chat                   → AI chat endpoint (POST, streaming)
```

That's it. Three routes.

---

## Screen Layout — Main App (`/rally/[teamSlug]`)

Optimized for maximum building space. Chat is the primary interaction; preview gets the most real estate.

```
┌─────────────────────────────────────────────────────────────────┐
│ ░ Vibe Code Rally    Phase 2: Build — 1h 42m    Thunder Squad  │  40px header
├───────────────────────────┬─────────────────────────────────────┤
│                           │                                     │
│  Chat (400px fixed)       │  Preview (remaining space)          │
│                           │                                     │
│  ┌─────────────────────┐  │  ┌─────────────────────────────┐   │
│  │ AI: Dashboard ready! │  │  │  🐾 Pawfect Grooming        │   │
│  │ What do you think?   │  │  │  ┌──────┬──────┬──────┐    │   │
│  └─────────────────────┘  │  │  │ 12   │$8.4k │ 247  │    │   │
│  ┌─────────────────────┐  │  │  │ appts│ rev  │ cust │    │   │
│  │ User: add a chart   │  │  │  └──────┴──────┴──────┘    │   │
│  └─────────────────────┘  │  │                              │   │
│  ┌─────────────────────┐  │  │  ┌──────────────────────┐   │   │
│  │ AI: On it! Building │  │  │  │  Revenue by Month     │   │   │
│  │ ✓ page.tsx          │  │  │  │  ▁▃▅▆▇█              │   │   │
│  │ ✓ mock.ts           │  │  │  └──────────────────────┘   │   │
│  └─────────────────────┘  │  │                              │   │
│                           │  └─────────────────────────────┘   │
│  ┌─────────────────────┐  │                                     │
│  │ /help /build /status │  │  [Preview] [Code ▾] tabs          │
│  ├─────────────────────┤  │                                     │
│  │ Type a message...  ▶│  │                                     │
│  └─────────────────────┘  │                                     │
├───────────────────────────┴─────────────────────────────────────┤
│ ░ Booting sandbox...  ● Connected  Port 3000                    │  24px status bar
└─────────────────────────────────────────────────────────────────┘
```

### Layout Rules

1. **Chat panel: 400px fixed width, left side.** Never wider. Students don't need a huge text area.
2. **Preview panel: all remaining space.** This is where the magic happens — the app they're building. It should feel big and impressive.
3. **Header: 40px.** Team name, phase indicator, timer. Minimal.
4. **Status bar: 24px.** WebContainer boot status, connection state, port.
5. **Slash command toolbar:** Compact row of clickable pills above the input. Always visible.
6. **Code tab:** Optional toggle on the preview panel. Shows a read-only diff of recent file changes. Off by default. For curious students and proctors.
7. **No sidebar.** The mockup sidebar with phase progress was nice but eats space. Move phase info to the header.

### Responsive Behavior

- **< 768px (phone/small tablet):** Stack vertically — chat on top, preview below (or tab toggle between them)
- **768px - 1024px:** Chat 350px, preview gets the rest
- **> 1024px:** Chat 400px, preview gets the rest

Most students will be on 13-15" laptops (1280-1440px wide), so the preview gets 880-1040px. Plenty of room.

---

## Landing Page (`/`)

Simple, fast, zero friction.

```
┌─────────────────────────────────────────┐
│                                         │
│        🏁 VIBE CODE RALLY              │
│        GCU · 3 Hours · Build Real       │
│                                         │
│   Team Name  [________________]         │
│                                         │
│   Members    [________________]         │
│              [________________]         │
│              [+ Add member]             │
│                                         │
│   Track      ○ Campus AI                │
│              ○ Startup AI               │
│              ○ Working Toward My Future  │
│                                         │
│         [ Start Building → ]            │
│                                         │
└─────────────────────────────────────────┘
```

- Generates a URL slug from team name (e.g., `thunder-squad`)
- Redirects to `/rally/thunder-squad`
- Stores team info in React state (passed via URL params or sessionStorage)
- No database, no login

---

## AI Chat System

### System Prompt

Adapted from the existing `CLAUDE.md` (477 lines). Key changes for web context:

1. **Remove all terminal references** — No "type Y", no file permission prompts, no "paste the error"
2. **Remove all CLI references** — No `claude` command, no `.rally-port`
3. **Add tool-calling instructions** — AI uses tools to write files, not raw file writes
4. **Keep the personality** — Encouraging, one question at a time, teachable moments, time nudges
5. **Keep the 3-phase flow** — Design (30 min) → Build (90 min) → Polish (30 min)
6. **Keep safety rules** — No external APIs, no database, mock data only
7. **Add component library reference** — Full list of available components and their props

### Tool Definitions

The AI gets these tools to interact with the WebContainer:

```typescript
tools: {
  writeFile: tool({
    description: "Write or update a file in the student's project",
    inputSchema: z.object({
      path: z.string().describe("File path relative to project root, e.g. 'src/app/dashboard/page.tsx'"),
      content: z.string().describe("Complete file content"),
    }),
    execute: async ({ path, content }) => {
      // Writes to WebContainer filesystem (handled client-side)
      return { success: true, path }
    },
  }),

  readFile: tool({
    description: "Read a file from the student's project",
    inputSchema: z.object({
      path: z.string().describe("File path relative to project root"),
    }),
    execute: async ({ path }) => {
      // Reads from WebContainer filesystem
      return { content: "..." }
    },
  }),

  listFiles: tool({
    description: "List files in a directory",
    inputSchema: z.object({
      path: z.string().describe("Directory path relative to project root"),
    }),
    execute: async ({ path }) => {
      return { files: ["..."] }
    },
  }),
}
```

**Key constraint:** Tools execute client-side (in the browser, against the WebContainer). The API route streams the AI response including tool calls. The client intercepts tool calls, executes them against the WebContainer, sends results back. This is the standard AI SDK tool approval / execution pattern.

### Chat Flow

```
1. Student types message
2. Client sends message to /api/chat (via useChat + DefaultChatTransport)
3. Server: convertToModelMessages → streamText with tools → toUIMessageStreamResponse
4. Client renders streaming response via AI Elements <Message>
5. When AI makes a tool call (writeFile, readFile):
   a. Client executes against WebContainer
   b. Tool result sent back to AI
   c. AI continues responding
6. WebContainer hot-reloads → preview iframe updates
```

### Model Selection

Default: `anthropic/claude-sonnet-4.6` via AI Gateway

Why Sonnet over Opus:
- Faster responses (students are waiting)
- Cheaper (9 students x 3 hours of continuous chat)
- More than capable for simple Next.js pages with pre-built components

---

## WebContainer Integration

### Boot Sequence

When `/rally/[teamSlug]` loads:

1. Import `@webcontainer/api` (lazy — it's ~5MB)
2. Call `WebContainer.boot()`
3. Mount the Rally Kit file tree (components, theme, utils, package.json)
4. Run `npm install` inside the container (~10-15 seconds)
5. Run `npm run dev` (Next.js dev server)
6. Wait for server ready on port 3000
7. Set iframe src to the WebContainer's dev server URL
8. Update status bar: "● Connected"

### Pre-loaded Files

The Rally Kit file tree is embedded in the app as a constant (or fetched from a static JSON file). This includes:

```
package.json
next.config.ts
tsconfig.json
postcss.config.mjs
tailwind.config.ts (if needed for v4)
src/
  app/
    layout.tsx          (root layout with theme)
    page.tsx            (blank — AI builds this)
    globals.css         (theme CSS variables)
  components/
    shells/
      MobileShell.tsx
      DashboardShell.tsx
      PortfolioShell.tsx
    ThemeInitializer.tsx
    StatCard.tsx
    ChartCard.tsx
    DataTable.tsx
    DetailCard.tsx
    FormCard.tsx
    ListItem.tsx
    EmptyState.tsx
    PageHeader.tsx
    MetricRow.tsx
    ActionMenu.tsx
  lib/
    utils.ts
    theme.ts
    navigation.ts
    mockData.ts
  data/
    mock.ts
```

These are the exact same components from the existing Rally Kit. No changes needed.

### WebContainer Gotchas

1. **Browser support** — Chrome/Edge have full support. Safari 16.4+ (macOS Ventura, 2023) and Firefox have beta support. Since students are on Macs, Safari should work fine — most university Macs run Ventura or newer. Detect very old browsers on the landing page and recommend Chrome/Edge as a fallback.
2. **COOP/COEP headers required** — WebContainers need cross-origin isolation. Add to `next.config.ts`:
   ```ts
   headers: [{ source: '/(.*)', headers: [
     { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
     { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
   ]}]
   ```
3. **Boot time: 10-20 seconds** — Show a loading animation during boot. Students should see "Setting up your workspace..." with a progress indicator.
4. **npm install takes 10-15 seconds** — Pre-bundle node_modules if possible, or accept the wait. Show progress.
5. **Memory: ~512MB per tab** — Fine for modern laptops. May struggle on very old machines.
6. **No `fs.watch`** — Hot reload works via WebContainer's built-in file watching, but behavior may differ from native. Test thoroughly.

---

## Component Architecture (React)

```
app/
  layout.tsx                    → Geist font, global styles
  page.tsx                      → Landing page (team setup form)
  rally/
    [teamSlug]/
      page.tsx                  → Main app shell (client component)

components/
  landing/
    TeamSetupForm.tsx           → Team name, members, track selection

  rally/
    RallyShell.tsx              → Main layout: header + chat + preview
    ChatPanel.tsx               → Chat messages + input + slash toolbar
    PreviewPanel.tsx            → Iframe + code tab toggle
    StatusBar.tsx               → WebContainer status, timer, connection
    SlashToolbar.tsx            → Clickable /help /build /status pills
    PhaseIndicator.tsx          → Current phase + time remaining
    BootScreen.tsx              → Loading animation during WebContainer boot

  chat/
    ChatMessage.tsx             → Wraps AI Elements <Message> with file change indicators
    FileChangeNotification.tsx  → "✓ Modified dashboard/page.tsx" inline card

lib/
  webcontainer/
    boot.ts                     → Boot WebContainer, mount files, start dev server
    files.ts                    → Rally Kit file tree as TypeScript constant
    operations.ts               → writeFile, readFile, listFiles helpers

  ai/
    system-prompt.ts            → System prompt (adapted from CLAUDE.md)
    tools.ts                    → Tool definitions for file operations

  rally/
    phases.ts                   → Phase definitions, timing, progression
    tracks.ts                   → Track-specific suggestions and examples

app/api/chat/
  route.ts                      → POST handler: streamText → toUIMessageStreamResponse
```

### State Management

All state lives in React (useState/useReducer). No external state store.

```typescript
interface RallyState {
  team: {
    name: string
    slug: string
    members: string[]
    track: 'campus' | 'startup' | 'future'
  }
  phase: 'setup' | 'design' | 'build' | 'polish'
  phaseStartedAt: number
  sandbox: {
    status: 'booting' | 'installing' | 'starting' | 'ready' | 'error'
    port: number | null
    previewUrl: string | null
  }
  files: {
    modified: string[]    // Recently modified file paths (for notifications)
  }
}
```

---

## Tool Execution Pattern

The tricky part: AI tools (writeFile, readFile) need to execute in the browser against the WebContainer, but the AI runs server-side.

### Solution: Client-side tool execution with AI SDK

AI SDK v6 supports this pattern natively. The server streams tool calls, the client executes them locally, and results flow back:

```typescript
// Server: /api/chat/route.ts
export async function POST(req: Request) {
  const { messages } = await req.json()
  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.6',
    system: rallySystemPrompt,
    messages: modelMessages,
    tools: {
      writeFile: tool({
        description: 'Write a file to the project',
        inputSchema: z.object({
          path: z.string(),
          content: z.string(),
        }),
        // No execute — client handles it
      }),
      readFile: tool({
        description: 'Read a file from the project',
        inputSchema: z.object({
          path: z.string(),
        }),
        // No execute — client handles it
      }),
    },
    stopWhen: stepCountIs(10),
  })

  return result.toUIMessageStreamResponse()
}
```

```typescript
// Client: handle tool calls against WebContainer
const { messages, sendMessage, addToolResult } = useChat()

// When a tool call comes in, execute against WebContainer
useEffect(() => {
  for (const msg of messages) {
    for (const part of msg.parts ?? []) {
      if (part.type === 'tool-writeFile' && part.state === 'call') {
        // Execute against WebContainer
        webcontainer.fs.writeFile(part.args.path, part.args.content)
        addToolResult({ toolCallId: part.toolCallId, result: { success: true } })
      }
    }
  }
}, [messages])
```

**Note:** The exact API for client-side tool execution needs to be verified against AI SDK v6 docs. The pattern exists but the specific hooks/methods may differ.

---

## Event Day Logistics

### Pre-event Setup (night before)

1. Deploy app to Vercel (`rally.aicoderally.com`)
2. Verify AI Gateway / API key is working
3. Test full flow: create team → chat → build a page → see preview
4. Prepare 3 team cards with URL: `rally.aicoderally.com`

### Student Experience (day of)

```
0:00  Student opens rally.aicoderally.com in their browser
0:01  Enters team name, members, track → clicks "Start Building"
0:02  Sees "Setting up your workspace..." (WebContainer boots)
0:03  Chat starts: "Welcome to the Vibe Code Rally, Team [name]!"
0:04  Phase 1 begins: business ideation
0:30  Phase 2: AI starts building pages
2:00  Phase 3: Polish + demo prep
2:30  AI generates demo script
3:00  Presentations
```

### Proctor Cheat Sheet Updates

- "Open Chrome and go to `rally.aicoderally.com`"
- "If screen is loading forever: refresh the page"
- "If preview is blank: click the Preview tab, wait 10 seconds"
- "If chat isn't responding: refresh and re-enter team info"
- "Chrome, Edge, or Safari all work. If issues arise, try Chrome."

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| WebContainer fails to boot on a student laptop | Medium | Detect failure, show clear error, have local Rally Kit zip as backup |
| Safari WebContainer instability | Low-Medium | Safari 16.4+ beta support works for most cases. Have Chrome ready as fallback. |
| AI hallucination — generates broken code | Medium | Component library constrains outputs. Error detection + auto-fix in system prompt. |
| WiFi drops mid-session | Low | Chat history and WebContainer state survive brief disconnects. Full outage = local backup. |
| 10-20s boot time feels slow | High | Engaging boot animation, "fun facts about vibe coding" during wait |
| AI costs spike unexpectedly | Low | Sonnet is cheap. 9 students x 3hrs ≈ $15-30 total. Set a spend cap in AI Gateway. |
| Student on very old browser | Low | Landing page detects browser version, recommends Chrome if too old |

### Backup Plan

Keep the local Rally Kit zip ready. If the web app fails for a station, fall back to local (Mac only, but most students have Macs). The existing `start.sh` + `CLAUDE.md` work unchanged.

---

## Scope for Mar 27 (MVP)

**In scope:**
- Landing page with team setup
- Chat UI with streaming responses
- WebContainer boot + file mounting
- AI tool calling (writeFile, readFile, listFiles)
- Live preview iframe
- System prompt (adapted CLAUDE.md)
- Slash command toolbar (clickable buttons)
- Phase indicator + timer in header
- File change notifications in chat
- Browser detection (warn if very old browser)
- Deploy to Vercel

**Out of scope (April 15 event):**
- Persistent state (resume after refresh)
- Proctor dashboard (see all teams' progress)
- Export/download project as zip
- Multiple simultaneous teams on one device
- Dark mode toggle
- Sound effects / animations
- Mobile-first layout (phone screens)

---

## Build Sequence

| Day | Focus | Deliverable |
|-----|-------|-------------|
| Sat Mar 21 | Project setup + WebContainer boot | Next.js app, WebContainer mounts files, dev server starts, preview renders |
| Sun Mar 22 | AI chat integration | Chat UI with AI SDK, tool calling writes files to WebContainer |
| Mon Mar 23 | System prompt + tool refinement | CLAUDE.md adapted, file tools working end-to-end, preview hot-reloads |
| Tue Mar 24 | Landing page + routing + polish | Team setup form, URL routing, phase indicator, slash toolbar |
| Wed Mar 25 | Testing + edge cases | Full 3-hour flow test, error handling, browser detection, boot reliability |
| Thu Mar 26 | Deploy + final testing | Vercel deploy, domain setup, end-to-end on multiple devices |
| Fri Mar 27 | **Event day** | 3 teams, 9 students |

---

## Open Questions

1. **WebContainer + Next.js 15 compatibility** — Need to verify that `next dev` runs inside WebContainer with Turbopack. If not, may need to use a simpler bundler (Vite) for the student project.
2. **Client-side tool execution pattern** — Need to verify the exact AI SDK v6 API for intercepting tool calls on the client. May need `addToolResult` or a custom transport.
3. **File tree size** — The Rally Kit components are ~15-20 files. Need to verify WebContainer can mount them all efficiently. May want to bundle as a single JSON blob.
4. **COOP/COEP headers + AI SDK** — Cross-origin isolation headers can break some third-party scripts. Need to verify AI SDK streaming works with these headers.
