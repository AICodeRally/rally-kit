# Rally Kit Web — Architecture Guide

> The web version of AICR Rally Kit. Students open a URL, chat with AI, and build a working Next.js app in an in-browser sandbox. Zero install.

---

## How It Works

```
Student's Browser                            Vercel
┌─────────────────────────────┐   HTTPS   ┌──────────────────────┐
│  Next.js React App          │ ◄───────► │  /api/chat           │
│  ├── RallyShell (phase mgr) │           │  ├── AI SDK v6       │
│  ├── ChatPanel (useChat)    │           │  ├── System prompt    │
│  ├── WebContainer           │           │  └── Tool definitions │
│  │   ├── Node.js (WASM)     │           └──────────────────────┘
│  │   ├── Student's app      │
│  │   └── Dev server :3000   │    AI chat streams tool calls (writeFile, readFile, listFiles).
│  └── Preview iframe         │    Client executes them against the local WebContainer.
└─────────────────────────────┘    Preview iframe shows the student's running app.
```

**Key insight:** The AI model never touches the student's code directly. It streams `writeFile` tool calls over the chat. The client-side ChatPanel intercepts these, writes files into the WebContainer, and returns results back through the chat protocol. This means the entire sandbox runs in the browser — Vercel only handles chat streaming.

---

## Phase-Aware Layout

The app has three phases. The UI adapts to each:

### Phase 1: Design (30 min)
```
┌─────────────────────────────────────────────────┐
│  Header: AICR Logo | Phase Indicator | Controls │
├──────────────────┬──────────────────────────────┤
│  Design Stepper  │  (5 steps across top)        │
├──────────────────┼──────────────────────────────┤
│                  │                              │
│   Chat Panel     │     Idea Board               │
│   (full width)   │     (300px sidebar)           │
│                  │                              │
├──────────────────┴──────────────────────────────┤
│  Slash Commands  │  Status Bar                  │
└─────────────────────────────────────────────────┘
```

- AI asks sequential design questions (one at a time)
- AI emits `[IDEA:category:title]description[/IDEA]` markers
- ChatPanel extracts markers via regex, feeds to IdeaBoard
- DesignStepper auto-advances based on idea categories captured
- No WebContainer boots during this phase (lazy initialization)

### Phase 2: Build (90 min)
```
┌─────────────────────────────────────────────────┐
│  Header: AICR Logo | Phase Indicator | Controls │
├───────────────┬─────────────────────────────────┤
│               │                                 │
│  Chat Panel   │     Preview (iframe)            │
│  (400px)      │     or BootScreen               │
│               │                                 │
├───────────────┴─────────────────────────────────┤
│  Slash Commands  │  Status Bar                  │
└─────────────────────────────────────────────────┘
```

- Transition triggered by `/build` command or first `writeFile` tool call
- **BuildTransition overlay** shows during WebContainer boot (~30s)
- Preview iframe shows the student's running Next.js app
- AI builds pages one at a time, asks for feedback after each

### Phase 3: Polish (30 min)
Same layout as Build. AI walks through polish checklist and generates demo script.

---

## Component Tree

```
app/rally/[teamSlug]/page.tsx
  └── RallyShell                    # Phase router + state manager
      ├── SplashScreen              # Branded intro (auto-dismisses 2.5s)
      ├── RallyHeader               # Logo + PhaseIndicator + controls
      ├── BuildTransition           # Full-screen overlay during phase switch
      │
      ├── DesignWorkspace           # Phase 1 layout
      │   ├── DesignStepper         # 5-step horizontal progress
      │   ├── ChatPanel             # AI chat (full width)
      │   └── IdeaBoard             # Right sidebar with idea cards
      │
      └── BuildWorkspace            # Phase 2/3 layout
          ├── ChatPanel             # AI chat (400px)
          └── PreviewPanel / BootScreen
```

### State Flow

```
RallyShell manages:
  phase: 'design' | 'build' | 'polish'
  ideas: DesignIdea[]
  webcontainer: WebContainer | null
  sandboxStatus: SandboxStatus
  previewUrl: string | null
  showSplash / showBuildTransition: boolean

Phase transition:
  /build command → handlePhaseChange('build') → setShowBuildTransition(true) + ensureWebContainer()
  First writeFile → handleFileWritten() → auto-transition to 'build'

Idea flow:
  AI emits [IDEA:...] → ChatPanel regex extracts → onIdeaCaptured → RallyShell.ideas → IdeaBoard
```

---

## Key Files

| File | Purpose |
|------|---------|
| `lib/ai/system-prompt.ts` | The AI coaching prompt — 3-phase structured flow, sequential questioning, teachable moments, engagement rules. This is the heart of the experience. |
| `lib/rally/types.ts` | Core types: `Phase`, `DesignIdea`, `TeamInfo`, `SandboxStatus` |
| `lib/theme-context.tsx` | Dark/light mode + font size (sm/md/lg), persisted to localStorage |
| `lib/webcontainer/boot.ts` | WebContainer initialization, npm install, dev server start |
| `lib/webcontainer/files.ts` | File tree mounted into WebContainer (component library, shells, theme) |
| `lib/webcontainer/operations.ts` | `writeFile`, `readFile`, `listFiles` — called from ChatPanel on tool calls |
| `app/api/chat/route.ts` | AI SDK v6 streaming endpoint with tool definitions |
| `app/globals.css` | CSS custom properties for light/dark themes + animations |
| `components/ai-elements/message.tsx` | Zero-dependency markdown renderer for AI messages |
| `components/rally/ChatPanel.tsx` | Chat UI + idea extraction + tool execution + slash commands |
| `components/rally/SlashToolbar.tsx` | Phase-aware clickable command buttons |

---

## AI System Prompt

The system prompt (`lib/ai/system-prompt.ts`) is a function that takes team info and returns a structured coaching flow:

- **Personality:** Warm, confident, one question at a time, no emojis, celebratory
- **Phase 1:** 5-step sequential design (Welcome → Domain → Shell → Theme → Confirm)
- **Phase 2:** Build order (layout → dashboard → list pages → forms), feedback after every page, time nudges
- **Phase 3:** Polish checklist + 2-minute demo script generation
- **Idea markers:** `[IDEA:category:title]description[/IDEA]` — extracted by ChatPanel, shown on IdeaBoard
- **Slash commands:** `/rally`, `/build`, `/brainstorm`, `/polish`, `/demo`, `/fix`, `/status`, `/reset`

---

## Theming

Two theme modes via CSS custom properties on `[data-theme]`:

| Variable | Light | Dark |
|----------|-------|------|
| `--bg-primary` | `#ffffff` | `#030712` |
| `--bg-secondary` | `#f9fafb` | `#111827` |
| `--text-primary` | `#111827` | `#f3f4f6` |
| `--accent` | `#2563eb` | `#3b82f6` |

Font sizes cycle via header button: sm (14px) → md (16px) → lg (18px). Both persist to localStorage.

---

## WebContainer Lifecycle

1. **Idle** — No WebContainer until Phase 2
2. **Booting** — `@webcontainer/api` loads, WASM boots
3. **Mounting** — File tree from `files.ts` written to virtual filesystem
4. **Installing** — `npm install` runs inside the sandbox
5. **Starting** — `npm run dev` starts Next.js inside the sandbox
6. **Ready** — Preview URL available, iframe shows the student's app

Requires COOP/COEP headers (configured in `next.config.ts`):
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

---

## Running Locally

```bash
cd web
npm install
cp .env.example .env.local   # Add ANTHROPIC_API_KEY
npm run dev                   # http://localhost:3000
```

Or with Vercel OIDC:
```bash
vercel link
vercel env pull
npm run dev
```

---

## Deploying

Target: `rally.aicoderally.com` on Vercel.

Requirements:
- COOP/COEP headers (in `next.config.ts`)
- `ANTHROPIC_API_KEY` env var (or OIDC)
- Node.js 20+ runtime

---

## Relationship to CLI Version

The CLI version (root `CLAUDE.md`, `src/`, `start.sh`) is the original Rally Kit — students clone the repo, run a shell script, and talk to Claude Code in a terminal. It works well on pre-configured Macs but fails on Windows and requires per-station setup.

The web version replaces all of that with a URL. The component library (`src/components/`) is reused — it's mounted into the WebContainer from `lib/webcontainer/files.ts`. The system prompt was ported from `CLAUDE.md` to `lib/ai/system-prompt.ts` with web-specific adaptations (tool calls instead of file system access, idea markers for the UI).

**The CLI files at root are not dead** — they're still used for the WebContainer file tree and as reference. But all new development happens in `web/`.
