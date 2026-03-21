# Rally Kit Web — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a web app at `rally.aicoderally.com` where students open a URL, chat with AI, and build a working Next.js app in a browser sandbox — zero install required.

**Architecture:** Next.js 16 on Vercel (thin server for AI chat) + WebContainers in the browser (Node.js sandbox for student code). Chat-first UI: 400px chat panel + live preview iframe. AI SDK v6 with client-side tool execution — server streams tool calls, client executes against WebContainer, results flow back.

**Tech Stack:** Next.js 16, React 19, AI SDK v6 (`ai@^6`, `@ai-sdk/react@^3`), `@webcontainer/api`, Tailwind CSS 4, Geist font, AI Elements (message component).

**AI Auth:** OIDC via `vercel link` + `vercel env pull` (preferred). Fallback: `ANTHROPIC_API_KEY` env var if OIDC setup isn't ready by event day.

**Spec:** `docs/specs/2026-03-20-rally-kit-web-design.md`

**Existing code:** `~/Development/rally-kit/` — 10 content components, 3 shells, CLAUDE.md system prompt, theme system, mock data generators. All reused as WebContainer file tree.

---

## File Structure

```
rally-kit-web/                          # NEW Next.js 16 app (inside rally-kit repo at web/)
├── package.json                        # Next.js 16, AI SDK v6, @webcontainer/api
├── next.config.ts                      # COOP/COEP headers for WebContainers
├── tsconfig.json
├── postcss.config.mjs
├── tailwind.config.ts                  # Content paths
├── .env.local                          # OIDC token via vercel env pull (or ANTHROPIC_API_KEY fallback)
│
├── app/
│   ├── layout.tsx                      # Root layout: Geist font, global styles
│   ├── globals.css                     # Tailwind imports, app-level styles
│   ├── page.tsx                        # Landing page (team setup form)
│   │
│   ├── rally/
│   │   └── [teamSlug]/
│   │       └── page.tsx                # Main app: client component, orchestrates everything
│   │
│   └── api/
│       └── chat/
│           └── route.ts                # POST: streamText → toUIMessageStreamResponse
│
├── components/
│   ├── landing/
│   │   └── TeamSetupForm.tsx           # Team name, members, track → redirect
│   │
│   ├── rally/
│   │   ├── RallyShell.tsx              # Main layout: header + chat + preview + status bar
│   │   ├── ChatPanel.tsx               # Messages list + input + slash toolbar
│   │   ├── PreviewPanel.tsx            # Iframe wrapping WebContainer dev server
│   │   ├── StatusBar.tsx               # Boot status, connection, port
│   │   ├── SlashToolbar.tsx            # Clickable /help /build /status /brainstorm pills
│   │   ├── PhaseIndicator.tsx          # Current phase + countdown timer
│   │   └── BootScreen.tsx              # Loading animation during WebContainer boot
│   │
│   └── chat/
│       └── FileChangeNotification.tsx     # "✓ wrote src/app/page.tsx" inline badge
│
├── lib/
│   ├── webcontainer/
│   │   ├── boot.ts                     # bootWebContainer(): boot → mount → install → dev server
│   │   ├── files.ts                    # RALLY_KIT_FILES: FileSystemTree constant (all components)
│   │   └── operations.ts              # writeFile, readFile, listFiles wrappers
│   │
│   ├── ai/
│   │   ├── system-prompt.ts            # System prompt adapted from CLAUDE.md
│   │   └── tools.ts                    # Tool definitions (writeFile, readFile, listFiles)
│   │
│   └── rally/
│       ├── phases.ts                   # Phase definitions, timing logic
│       ├── tracks.ts                   # Track metadata (campus, startup, future)
│       └── types.ts                    # RallyState, TeamInfo, Phase types
│
└── components/ai-elements/             # Installed via npx ai-elements (message component)
    └── message.tsx                     # AI Elements MessageResponse
```

---

## Task 1: Project Scaffold + COOP/COEP Headers

**Files:**
- Create: `web/package.json`
- Create: `web/next.config.ts`
- Create: `web/tsconfig.json`
- Create: `web/postcss.config.mjs`
- Create: `web/app/layout.tsx`
- Create: `web/app/globals.css`
- Create: `web/app/page.tsx`

- [ ] **Step 1: Create the web/ directory and package.json**

```bash
mkdir -p ~/Development/rally-kit/web
```

```json
{
  "name": "rally-kit-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "ai": "^6.0.0",
    "@ai-sdk/react": "^3.0.0",
    "@webcontainer/api": "^1.0.0",
    "@ai-sdk/anthropic": "^3.0.0",
    "zod": "^3.23.0",
    "lucide-react": "^0.469.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.0",
    "geist": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

Write to `web/package.json`.

- [ ] **Step 2: Create next.config.ts with COOP/COEP headers**

WebContainers require cross-origin isolation headers on every response.

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

Write to `web/next.config.ts`.

- [ ] **Step 3: Create tsconfig.json, postcss.config.mjs**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

```javascript
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
export default config
```

- [ ] **Step 4: Create root layout with Geist font**

```tsx
// web/app/layout.tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vibe Code Rally',
  description: 'Build a real app in 3 hours with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Create globals.css**

```css
/* web/app/globals.css */
@import 'tailwindcss';

body {
  margin: 0;
  min-height: 100vh;
}
```

- [ ] **Step 6: Create placeholder landing page**

```tsx
// web/app/page.tsx
export default function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Vibe Code Rally</h1>
    </div>
  )
}
```

- [ ] **Step 7: Install dependencies and verify dev server starts**

```bash
cd ~/Development/rally-kit/web
npm install
npm run dev
```

Expected: Next.js dev server on port 3000, page renders "Vibe Code Rally".

- [ ] **Step 8: Install AI Elements message component**

```bash
cd ~/Development/rally-kit/web
npx ai-elements@latest add message
```

This installs the `MessageResponse` component for rendering AI markdown.

- [ ] **Step 9: Commit**

```bash
git add web/
git commit -m "feat(web): scaffold Next.js 16 app with COOP/COEP headers for WebContainers"
```

---

## Task 2: WebContainer Boot + File Tree

**Files:**
- Create: `web/lib/webcontainer/files.ts`
- Create: `web/lib/webcontainer/boot.ts`
- Create: `web/lib/webcontainer/operations.ts`

This is the core infrastructure. The WebContainer boots in the browser, mounts all Rally Kit files, runs `npm install`, starts `next dev`, and exposes a preview URL.

- [ ] **Step 1: Create the Rally Kit file tree constant**

This embeds all 10 components, 3 shells, lib files, and config into a `FileSystemTree` object that WebContainer can mount. This file will be large (~600-800 lines) since it contains all source code as string literals.

Create `web/lib/webcontainer/files.ts`:

```typescript
import type { FileSystemTree } from '@webcontainer/api'

// The complete Rally Kit starter project, embedded as a WebContainer file tree.
// Components, shells, theme, utils — everything a student needs to build an app.
export const RALLY_KIT_FILES: FileSystemTree = {
  'package.json': {
    file: {
      contents: JSON.stringify({
        name: 'rally-app',
        version: '0.1.0',
        private: true,
        scripts: {
          dev: 'next dev --turbopack',
          build: 'next build',
          start: 'next start',
        },
        dependencies: {
          next: '^15.3.0',
          react: '^19.0.0',
          'react-dom': '^19.0.0',
          recharts: '^2.15.0',
          'lucide-react': '^0.469.0',
          clsx: '^2.1.1',
          'tailwind-merge': '^3.0.0',
        },
        devDependencies: {
          '@types/node': '^22.0.0',
          '@types/react': '^19.0.0',
          '@types/react-dom': '^19.0.0',
          typescript: '^5.7.0',
          '@tailwindcss/postcss': '^4.0.0',
          tailwindcss: '^4.0.0',
        },
      }, null, 2),
    },
  },
  'next.config.ts': {
    file: {
      contents: `import type { NextConfig } from 'next'\nconst nextConfig: NextConfig = {}\nexport default nextConfig`,
    },
  },
  'tsconfig.json': {
    file: {
      contents: JSON.stringify({
        compilerOptions: {
          target: 'ES2017',
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [{ name: 'next' }],
          paths: { '@/*': ['./src/*'] },
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules'],
      }, null, 2),
    },
  },
  'postcss.config.mjs': {
    file: {
      contents: `const config = { plugins: { '@tailwindcss/postcss': {} } }\nexport default config`,
    },
  },
  src: {
    directory: {
      app: {
        directory: {
          'layout.tsx': {
            file: {
              contents: `/* PASTE FROM existing rally-kit/src/app/layout.tsx */`,
            },
          },
          'page.tsx': {
            file: {
              contents: `// This page will be built by the AI during the rally\nexport default function Home() {\n  return <div className="p-8"><h1 className="text-2xl font-bold">Welcome! Tell the AI what to build.</h1></div>\n}`,
            },
          },
          'globals.css': {
            file: {
              contents: `/* PASTE FROM existing rally-kit/src/app/globals.css */`,
            },
          },
        },
      },
      components: {
        directory: {
          // Each component: 'StatCard.tsx': { file: { contents: `...` } }
          // PASTE contents from each existing component file
          // ThemeInitializer, StatCard, ChartCard, DataTable, DetailCard,
          // FormCard, ListItem, EmptyState, PageHeader, MetricRow, ActionMenu
          shells: {
            directory: {
              // MobileShell.tsx, DashboardShell.tsx, PortfolioShell.tsx
            },
          },
        },
      },
      lib: {
        directory: {
          // utils.ts, theme.ts, navigation.ts, mockData.ts
        },
      },
      data: {
        directory: {
          // mock.ts
        },
      },
    },
  },
}
```

**IMPORTANT:** The actual implementation must read every file from `~/Development/rally-kit/src/` and embed its contents as a string literal. The placeholder comments above (`/* PASTE FROM ... */`) must be replaced with the real file contents. This will be a ~800-line file.

- [ ] **Step 2: Create the boot module**

Create `web/lib/webcontainer/boot.ts`:

```typescript
import { WebContainer } from '@webcontainer/api'
import { RALLY_KIT_FILES } from './files'

export interface BootResult {
  webcontainer: WebContainer
  previewUrl: string
  port: number
}

export type BootStatus =
  | 'booting'
  | 'mounting'
  | 'installing'
  | 'starting'
  | 'ready'
  | 'error'

export async function bootWebContainer(
  onStatus: (status: BootStatus, detail?: string) => void,
): Promise<BootResult> {
  onStatus('booting')
  const wc = await WebContainer.boot()

  onStatus('mounting')
  await wc.mount(RALLY_KIT_FILES)

  onStatus('installing', 'Running npm install...')
  const installProcess = await wc.spawn('npm', ['install'])

  // Pipe install output for debugging
  installProcess.output.pipeTo(
    new WritableStream({
      write(chunk) {
        console.log('[npm install]', chunk)
      },
    }),
  )

  const installExitCode = await installProcess.exit
  if (installExitCode !== 0) {
    onStatus('error', 'npm install failed')
    throw new Error('npm install failed')
  }

  onStatus('starting', 'Starting dev server...')
  await wc.spawn('npm', ['run', 'dev'])

  // Wait for the dev server to be ready
  return new Promise((resolve) => {
    wc.on('server-ready', (port, url) => {
      onStatus('ready')
      resolve({ webcontainer: wc, previewUrl: url, port })
    })
  })
}
```

- [ ] **Step 3: Create file operation wrappers**

Create `web/lib/webcontainer/operations.ts`:

```typescript
import type { WebContainer } from '@webcontainer/api'

export async function writeFile(
  wc: WebContainer,
  path: string,
  content: string,
): Promise<{ success: boolean; path: string }> {
  // Ensure parent directory exists
  const dir = path.substring(0, path.lastIndexOf('/'))
  if (dir) {
    await wc.fs.mkdir(dir, { recursive: true })
  }
  await wc.fs.writeFile(path, content)
  return { success: true, path }
}

export async function readFile(
  wc: WebContainer,
  path: string,
): Promise<{ content: string }> {
  const content = await wc.fs.readFile(path, 'utf-8')
  return { content }
}

export async function listFiles(
  wc: WebContainer,
  path: string,
): Promise<{ files: string[] }> {
  const entries = await wc.fs.readdir(path, { withFileTypes: true })
  const files = entries.map((e) => {
    const name = typeof e === 'string' ? e : e.name
    const isDir = typeof e === 'string' ? false : e.isDirectory()
    return isDir ? `${name}/` : name
  })
  return { files }
}
```

- [ ] **Step 4: Verify WebContainer boots locally**

Create a minimal test page at `web/app/test-wc/page.tsx` (temporary):

```tsx
'use client'

import { useEffect, useState } from 'react'
import { bootWebContainer, type BootStatus } from '@/lib/webcontainer/boot'

export default function TestWC() {
  const [status, setStatus] = useState<BootStatus>('booting')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    bootWebContainer((s) => setStatus(s)).then((result) => {
      setPreviewUrl(result.previewUrl)
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">WebContainer Test</h1>
      <p>Status: {status}</p>
      {previewUrl && (
        <iframe src={previewUrl} className="w-full h-[600px] border mt-4" />
      )}
    </div>
  )
}
```

```bash
cd ~/Development/rally-kit/web && npm run dev
```

Open `http://localhost:3000/test-wc`. Expected: Status goes booting → mounting → installing → starting → ready, then iframe shows the Rally Kit starter page.

- [ ] **Step 5: Commit**

```bash
git add web/lib/webcontainer/ web/app/test-wc/
git commit -m "feat(web): WebContainer boot + mount Rally Kit file tree"
```

---

## Task 3: AI Chat API Route

**Files:**
- Create: `web/lib/ai/system-prompt.ts`
- Create: `web/lib/ai/tools.ts`
- Create: `web/app/api/chat/route.ts`

- [ ] **Step 1: Create the system prompt**

Adapt the existing CLAUDE.md (477 lines) for the web context. Remove terminal/CLI references, add tool-calling instructions, keep personality and 3-phase flow.

Create `web/lib/ai/system-prompt.ts`:

```typescript
// Adapted from rally-kit/CLAUDE.md for web context.
// Key changes: removed terminal refs, added tool-calling, kept personality + phases.

export function buildSystemPrompt(team: {
  name: string
  members: string[]
  track: 'campus' | 'startup' | 'future'
}): string {
  return `You are the AI coding partner for the Vibe Code Rally.

## Your Personality
- Warm, encouraging, never condescending
- Use the team's name naturally ("Nice work, ${team.name}!")
- One question at a time — never overwhelm
- Brief teachable moments when students discover something cool
- Celebrate every milestone, no matter how small

## The Team
- Team: ${team.name}
- Members: ${team.members.join(', ')}
- Track: ${team.track === 'campus' ? 'Campus AI' : team.track === 'startup' ? 'Startup AI' : 'Working Toward My Future'}

## The 3-Phase Flow

### Phase 1: Design (first 30 minutes)
Walk them through defining their business:
1. What problem does your app solve? Who uses it?
2. What are the 3-4 main pages?
3. What data does each page show?
4. Pick a shell: MobileShell (student tools, social), DashboardShell (business), PortfolioShell (career)
5. Pick a theme: ocean, sunset, forest, berry, slate

### Phase 2: Build (next 90 minutes)
Build their app page by page:
1. Set up the shell and theme (layout.tsx)
2. Build the dashboard/home page first — it's the wow moment
3. Build list pages, detail pages, form pages
4. Populate with realistic mock data
5. Update navigation as pages are added

### Phase 3: Polish (last 30 minutes)
- Replace placeholder data with domain-specific mock data
- Ensure visual consistency across pages
- Add empty states where needed
- Prepare a 2-minute demo script

## Building Code
When you need to create or modify files, use your tools:
- Use writeFile to create or update any file
- Use readFile to check current file contents
- Use listFiles to see what exists in a directory
- Always write COMPLETE file contents (never partial updates)
- After writing files, the student's preview will auto-update

## Component Library
Available pre-built components (import from '@/components/'):

**Shells** (pick one, used in layout):
- MobileShell — Bottom tabs, card-based, max 5 nav items
- DashboardShell — Sidebar nav with search, stat cards
- PortfolioShell — Top nav with optional hero section

**Content Components:**
- StatCard — Big number + trend arrow (props: title, value, subtitle, icon, trend, accent)
- ChartCard — Bar/line/area/pie chart via Recharts (props: title, type, data, dataKey, xAxisKey, color)
- DataTable — Sortable table with click rows (props: columns, data, onRowClick)
- DetailCard — Key-value display with optional image (props: title, fields, image)
- FormCard — Auto-generated form (props: title, fields[], onSubmit)
- ListItem — Icon + title + subtitle + badge (props: icon, title, subtitle, badge, onClick)
- EmptyState — Placeholder with action button (props: icon, title, description, actionLabel)
- PageHeader — Title + subtitle + action buttons (props: title, subtitle, actions)
- MetricRow — Horizontal row of mini stats (props: metrics[])
- ActionMenu — Dropdown menu with options (props: items[])

**Utilities:**
- cn() from '@/lib/utils' — className helper (clsx + tailwind-merge)
- applyTheme(themeName) from '@/lib/theme' — applies theme colors
- Mock data generators from '@/lib/mockData'

## Tech Stack (LOCKED — do not deviate)
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS 4
- Lucide React for icons
- Recharts for charts
- clsx + tailwind-merge for className merging

## Safety Rules
- NEVER use npm install, fetch(), or external APIs
- NEVER access files outside src/
- ONLY use the components and libraries listed above
- Use mock data for everything — no real databases
- If a student asks for something off-limits, warmly redirect to building

## Slash Commands
Students may type these — respond appropriately:
- /help — Show available commands
- /rally — Start or resume the flow
- /build — Jump to building
- /brainstorm — Help generate 3 app ideas
- /polish — Jump to polish phase
- /demo — Generate a 2-minute demo script
- /fix — Help fix an error
- /status — Show progress summary
- /reset — Start over (confirm first)
`
}
```

- [ ] **Step 2: Create tool definitions**

Create `web/lib/ai/tools.ts`:

```typescript
import { tool } from 'ai'
import { z } from 'zod'

// Tools defined WITHOUT execute functions — client handles execution
// via onToolCall + addToolOutput against the WebContainer.

export const rallyTools = {
  writeFile: tool({
    description:
      "Write or update a file in the student's project. Always provide complete file contents.",
    inputSchema: z.object({
      path: z
        .string()
        .describe(
          "File path relative to project root, e.g. 'src/app/dashboard/page.tsx'",
        ),
      content: z.string().describe('Complete file content'),
    }),
    // No execute — client-side execution
  }),

  readFile: tool({
    description: "Read the current contents of a file in the student's project",
    inputSchema: z.object({
      path: z
        .string()
        .describe('File path relative to project root'),
    }),
    // No execute — client-side execution
  }),

  listFiles: tool({
    description: "List files and directories in a path in the student's project",
    inputSchema: z.object({
      path: z
        .string()
        .describe(
          "Directory path relative to project root, e.g. 'src/app' or 'src/components'",
        ),
    }),
    // No execute — client-side execution
  }),
}
```

- [ ] **Step 3: Create the chat API route**

Create `web/app/api/chat/route.ts`:

```typescript
import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import type { UIMessage } from 'ai'
import { buildSystemPrompt } from '@/lib/ai/system-prompt'
import { rallyTools } from '@/lib/ai/tools'

export async function POST(req: Request) {
  const {
    messages,
    team,
  }: {
    messages: UIMessage[]
    team: { name: string; members: string[]; track: 'campus' | 'startup' | 'future' }
  } = await req.json()

  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.6',
    system: buildSystemPrompt(team),
    messages: modelMessages,
    tools: rallyTools,
    stopWhen: stepCountIs(10),
  })

  return result.toUIMessageStreamResponse()
}
```

**Note:** Using `anthropic/claude-sonnet-4-6` as the AI Gateway model string (hyphens in model ID, dots in display name). If AI Gateway isn't configured, fall back to direct `@ai-sdk/anthropic` with `ANTHROPIC_API_KEY`.

- [ ] **Step 4: Verify the API route responds**

```bash
cd ~/Development/rally-kit/web
echo 'ANTHROPIC_API_KEY=your-key-here' > .env.local
npm run dev
```

Test with curl:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"id":"1","role":"user","parts":[{"type":"text","text":"Hello!"}]}],"team":{"name":"Test","members":["Alice"],"track":"campus"}}'
```

Expected: Streaming response with AI greeting.

- [ ] **Step 5: Commit**

```bash
git add web/lib/ai/ web/app/api/chat/
git commit -m "feat(web): AI chat API route with system prompt and client-side tools"
```

---

## Task 4: Chat UI + Client-Side Tool Execution

**Files:**
- Create: `web/lib/rally/types.ts`
- Create: `web/components/rally/ChatPanel.tsx`
- Create: `web/components/chat/FileChangeNotification.tsx`
- Create: `web/components/rally/SlashToolbar.tsx`

This is the critical integration: `useChat` streams AI responses, `onToolCall` intercepts tool calls and executes them against the WebContainer, `addToolOutput` sends results back.

- [ ] **Step 1: Create shared types**

Create `web/lib/rally/types.ts`:

```typescript
export interface TeamInfo {
  name: string
  slug: string
  members: string[]
  track: 'campus' | 'startup' | 'future'
}

export type Phase = 'design' | 'build' | 'polish'

export type SandboxStatus =
  | 'booting'
  | 'mounting'
  | 'installing'
  | 'starting'
  | 'ready'
  | 'error'

export interface RallyState {
  team: TeamInfo
  phase: Phase
  phaseStartedAt: number
  sandbox: {
    status: SandboxStatus
    previewUrl: string | null
  }
  modifiedFiles: string[]
}
```

- [ ] **Step 2: Create the SlashToolbar**

Create `web/components/rally/SlashToolbar.tsx`:

```tsx
'use client'

const COMMANDS = [
  { label: '/rally', description: 'Start or resume' },
  { label: '/help', description: 'Show commands' },
  { label: '/build', description: 'Start building' },
  { label: '/brainstorm', description: 'Get ideas' },
  { label: '/status', description: 'See progress' },
  { label: '/polish', description: 'Clean up' },
  { label: '/demo', description: 'Demo script' },
  { label: '/fix', description: 'Fix an error' },
  { label: '/reset', description: 'Start over' },
]

export function SlashToolbar({
  onCommand,
}: {
  onCommand: (command: string) => void
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto py-1.5 px-2">
      {COMMANDS.map((cmd) => (
        <button
          key={cmd.label}
          onClick={() => onCommand(cmd.label)}
          className="shrink-0 px-2.5 py-1 text-xs font-mono bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
          title={cmd.description}
        >
          {cmd.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create the FileChangeNotification**

Create `web/components/chat/FileChangeNotification.tsx`:

```tsx
import { Check } from 'lucide-react'

export function FileChangeNotification({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 rounded px-2 py-1 my-1 font-mono">
      <Check className="w-3 h-3" />
      <span>wrote {path}</span>
    </div>
  )
}
```

- [ ] **Step 4: Create ChatPanel with client-side tool execution**

This is the core integration. Key patterns from AI SDK v6 docs:
- `onToolCall` callback handles tool execution
- `addToolOutput()` sends results back (do NOT await it)
- `sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls` auto-resubmits

Create `web/components/rally/ChatPanel.tsx`:

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai'
import type { WebContainer } from '@webcontainer/api'
import { MessageResponse } from '@/components/ai-elements/message'
import { SlashToolbar } from './SlashToolbar'
import { FileChangeNotification } from '@/components/chat/FileChangeNotification'
import { writeFile, readFile, listFiles } from '@/lib/webcontainer/operations'
import type { TeamInfo } from '@/lib/rally/types'
import { Send } from 'lucide-react'

interface ChatPanelProps {
  team: TeamInfo
  webcontainer: WebContainer | null
  onFileWritten: (path: string) => void
}

export function ChatPanel({ team, webcontainer, onFileWritten }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, addToolOutput, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),

    body: { team },

    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    async onToolCall({ toolCall }) {
      if (!webcontainer || toolCall.dynamic) return

      try {
        if (toolCall.toolName === 'writeFile') {
          const { path, content } = toolCall.input as { path: string; content: string }
          const result = await writeFile(webcontainer, path, content)
          onFileWritten(path)
          addToolOutput({
            tool: 'writeFile',
            toolCallId: toolCall.toolCallId,
            output: result,
          })
        } else if (toolCall.toolName === 'readFile') {
          const { path } = toolCall.input as { path: string }
          const result = await readFile(webcontainer, path)
          addToolOutput({
            tool: 'readFile',
            toolCallId: toolCall.toolCallId,
            output: result,
          })
        } else if (toolCall.toolName === 'listFiles') {
          const { path } = toolCall.input as { path: string }
          const result = await listFiles(webcontainer, path)
          addToolOutput({
            tool: 'listFiles',
            toolCallId: toolCall.toolCallId,
            output: result,
          })
        }
      } catch (err) {
        addToolOutput({
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          state: 'output-error',
          errorText: err instanceof Error ? err.message : 'Tool execution failed',
        })
      }
    },
  })

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    if (!input.trim()) return
    sendMessage({ text: input })
    setInput('')
  }

  function handleCommand(command: string) {
    sendMessage({ text: command })
  }

  const isStreaming = status === 'streaming' || status === 'submitted'

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'ml-8' : 'mr-4'}>
            <div
              className={
                message.role === 'user'
                  ? 'bg-blue-50 rounded-lg p-3 text-sm'
                  : 'text-sm'
              }
            >
              {message.parts.map((part, i) => {
                if (part.type === 'text') {
                  return message.role === 'assistant' ? (
                    <MessageResponse key={i}>{part.text}</MessageResponse>
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                }
                // Show file change indicators for writeFile tool calls
                if (
                  part.type === 'tool-writeFile' &&
                  (part.state === 'output-available' || part.state === 'input-available')
                ) {
                  return (
                    <FileChangeNotification
                      key={i}
                      path={(part.input as { path: string })?.path ?? 'unknown'}
                    />
                  )
                }
                return null
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Slash command toolbar */}
      <SlashToolbar onCommand={handleCommand} />

      {/* Input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={isStreaming ? 'AI is working...' : 'Type a message...'}
            disabled={isStreaming}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add web/lib/rally/ web/components/
git commit -m "feat(web): chat panel with client-side WebContainer tool execution"
```

---

## Task 5: Preview Panel + Rally Shell

**Files:**
- Create: `web/components/rally/PreviewPanel.tsx`
- Create: `web/components/rally/StatusBar.tsx`
- Create: `web/components/rally/PhaseIndicator.tsx`
- Create: `web/components/rally/BootScreen.tsx`
- Create: `web/components/rally/RallyShell.tsx`

- [ ] **Step 1: Create PreviewPanel with code tab toggle**

The spec calls for a `[Preview] [Code]` tab toggle. The Code tab shows recently modified files (read-only). Off by default.

Create `web/components/rally/PreviewPanel.tsx`:

```tsx
'use client'

import { useState } from 'react'

interface PreviewPanelProps {
  previewUrl: string | null
  modifiedFiles: string[]
}

export function PreviewPanel({ previewUrl, modifiedFiles }: PreviewPanelProps) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')

  if (!previewUrl) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
        Preview will appear here once the sandbox is ready
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Tab bar */}
      <div className="flex gap-1 px-2 py-1 bg-gray-50 border-b border-gray-200">
        <button
          onClick={() => setTab('preview')}
          className={`px-3 py-1 text-xs rounded ${tab === 'preview' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}
        >
          Preview
        </button>
        <button
          onClick={() => setTab('code')}
          className={`px-3 py-1 text-xs rounded ${tab === 'code' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}
        >
          Code {modifiedFiles.length > 0 && `(${modifiedFiles.length})`}
        </button>
      </div>

      {/* Content */}
      {tab === 'preview' ? (
        <div className="flex-1 relative">
          <iframe
            src={previewUrl}
            className="absolute inset-0 w-full h-full border-0"
            title="App Preview"
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-gray-50">
          <h3 className="text-xs font-medium text-gray-500 mb-2">Recently modified files</h3>
          {modifiedFiles.length === 0 ? (
            <p className="text-gray-400">No files modified yet</p>
          ) : (
            <ul className="space-y-1">
              {modifiedFiles.map((f) => (
                <li key={f} className="text-green-700">{f}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create StatusBar**

Create `web/components/rally/StatusBar.tsx`:

```tsx
import type { SandboxStatus } from '@/lib/rally/types'

const STATUS_LABELS: Record<SandboxStatus, string> = {
  booting: 'Booting sandbox...',
  mounting: 'Loading project files...',
  installing: 'Installing packages...',
  starting: 'Starting dev server...',
  ready: 'Connected',
  error: 'Error — try refreshing',
}

export function StatusBar({ status }: { status: SandboxStatus }) {
  const isReady = status === 'ready'
  const isError = status === 'error'

  return (
    <div className="h-6 px-3 flex items-center gap-2 bg-gray-100 border-t border-gray-200 text-xs text-gray-500 font-mono">
      <span
        className={`w-2 h-2 rounded-full ${
          isReady ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
        }`}
      />
      <span>{STATUS_LABELS[status]}</span>
    </div>
  )
}
```

- [ ] **Step 3: Create PhaseIndicator**

Create `web/components/rally/PhaseIndicator.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import type { Phase } from '@/lib/rally/types'

const PHASE_CONFIG: Record<Phase, { label: string; durationMin: number }> = {
  design: { label: 'Phase 1: Design', durationMin: 30 },
  build: { label: 'Phase 2: Build', durationMin: 90 },
  polish: { label: 'Phase 3: Polish', durationMin: 30 },
}

export function PhaseIndicator({
  phase,
  startedAt,
}: {
  phase: Phase
  startedAt: number
}) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt])

  const config = PHASE_CONFIG[phase]
  const totalSeconds = config.durationMin * 60
  const remaining = Math.max(0, totalSeconds - elapsed)
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  return (
    <span className="text-sm text-gray-600">
      {config.label}
      <span className="ml-2 font-mono tabular-nums">
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
    </span>
  )
}
```

- [ ] **Step 4: Create BootScreen**

Create `web/components/rally/BootScreen.tsx`:

```tsx
import type { SandboxStatus } from '@/lib/rally/types'

const STEPS: { status: SandboxStatus; label: string }[] = [
  { status: 'booting', label: 'Starting sandbox...' },
  { status: 'mounting', label: 'Loading components...' },
  { status: 'installing', label: 'Installing packages...' },
  { status: 'starting', label: 'Starting dev server...' },
]

const FUN_FACTS = [
  'Every great app starts with a conversation',
  'Your AI partner has built hundreds of apps',
  'The best demos tell a story',
  'Mock data makes everything feel real',
]

export function BootScreen({ status }: { status: SandboxStatus }) {
  const randomFact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
      <h2 className="text-2xl font-bold mb-8">Setting up your workspace...</h2>

      <div className="space-y-3 mb-8 w-64">
        {STEPS.map((step) => {
          const currentIdx = STEPS.findIndex((s) => s.status === status)
          const stepIdx = STEPS.findIndex((s) => s.status === step.status)
          const isDone = stepIdx < currentIdx
          const isCurrent = step.status === status

          return (
            <div key={step.status} className="flex items-center gap-3">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  isDone
                    ? 'bg-green-500 text-white'
                    : isCurrent
                      ? 'bg-blue-500 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isDone ? '✓' : stepIdx + 1}
              </span>
              <span
                className={
                  isDone ? 'text-gray-400' : isCurrent ? 'font-medium' : 'text-gray-400'
                }
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-sm text-gray-400 italic">{randomFact}</p>
    </div>
  )
}
```

- [ ] **Step 5: Create RallyShell — the main orchestrating layout**

Create `web/components/rally/RallyShell.tsx`:

```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import type { WebContainer } from '@webcontainer/api'
import { bootWebContainer } from '@/lib/webcontainer/boot'
import { ChatPanel } from './ChatPanel'
import { PreviewPanel } from './PreviewPanel'
import { StatusBar } from './StatusBar'
import { PhaseIndicator } from './PhaseIndicator'
import { BootScreen } from './BootScreen'
import type { TeamInfo, Phase, SandboxStatus } from '@/lib/rally/types'

export function RallyShell({ team }: { team: TeamInfo }) {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null)
  const [sandboxStatus, setSandboxStatus] = useState<SandboxStatus>('booting')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [phase] = useState<Phase>('design')
  const [phaseStartedAt] = useState(Date.now())
  const [modifiedFiles, setModifiedFiles] = useState<string[]>([])

  // Boot WebContainer on mount
  useEffect(() => {
    let cancelled = false
    bootWebContainer((status) => {
      if (!cancelled) setSandboxStatus(status)
    }).then((result) => {
      if (!cancelled) {
        setWebcontainer(result.webcontainer)
        setPreviewUrl(result.previewUrl)
      }
    }).catch(() => {
      if (!cancelled) setSandboxStatus('error')
    })
    return () => { cancelled = true }
  }, [])

  const handleFileWritten = useCallback((path: string) => {
    setModifiedFiles((prev) => [path, ...prev.filter((p) => p !== path)])
  }, [])

  const isReady = sandboxStatus === 'ready'

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="h-10 px-4 flex items-center justify-between bg-white border-b border-gray-200">
        <span className="text-sm font-semibold">Vibe Code Rally</span>
        <PhaseIndicator phase={phase} startedAt={phaseStartedAt} />
        <span className="text-sm text-gray-500">{team.name}</span>
      </header>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Chat — 400px fixed */}
        <div className="w-[400px] shrink-0">
          <ChatPanel
            team={team}
            webcontainer={webcontainer}
            onFileWritten={handleFileWritten}
          />
        </div>

        {/* Preview — remaining space */}
        {isReady ? (
          <PreviewPanel previewUrl={previewUrl} modifiedFiles={modifiedFiles} />
        ) : (
          <BootScreen status={sandboxStatus} />
        )}
      </div>

      {/* Status bar */}
      <StatusBar status={sandboxStatus} />
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add web/components/rally/
git commit -m "feat(web): rally shell with preview panel, status bar, phase indicator, boot screen"
```

---

## Task 6: Landing Page + Routing

**Files:**
- Create: `web/components/landing/TeamSetupForm.tsx`
- Modify: `web/app/page.tsx`
- Create: `web/app/rally/[teamSlug]/page.tsx`

- [ ] **Step 1: Create TeamSetupForm**

Create `web/components/landing/TeamSetupForm.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function TeamSetupForm() {
  const router = useRouter()
  const [teamName, setTeamName] = useState('')
  const [members, setMembers] = useState(['', '', ''])
  const [track, setTrack] = useState<'campus' | 'startup' | 'future'>('campus')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!teamName.trim()) return

    const slug = teamName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const filledMembers = members.filter((m) => m.trim())

    // Store team info in sessionStorage (simplest approach, no DB needed)
    sessionStorage.setItem(
      `rally-${slug}`,
      JSON.stringify({ name: teamName, slug, members: filledMembers, track }),
    )

    router.push(`/rally/${slug}`)
  }

  function updateMember(index: number, value: string) {
    const updated = [...members]
    updated[index] = value
    setMembers(updated)
  }

  function addMember() {
    if (members.length < 5) setMembers([...members, ''])
  }

  const TRACKS = [
    { value: 'campus' as const, label: 'Campus AI', desc: 'Student life tools' },
    { value: 'startup' as const, label: 'Startup AI', desc: 'Business builders' },
    { value: 'future' as const, label: 'Working Toward My Future', desc: 'Career prep' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Team Name
        </label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="e.g. Thunder Squad"
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Team Members
        </label>
        <div className="space-y-2">
          {members.map((member, i) => (
            <input
              key={i}
              type="text"
              value={member}
              onChange={(e) => updateMember(i, e.target.value)}
              placeholder={`Member ${i + 1}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
          {members.length < 5 && (
            <button
              type="button"
              onClick={addMember}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add member
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Track
        </label>
        <div className="space-y-2">
          {TRACKS.map((t) => (
            <label
              key={t.value}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                track === t.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="track"
                value={t.value}
                checked={track === t.value}
                onChange={() => setTrack(t.value)}
                className="accent-blue-600"
              />
              <div>
                <div className="font-medium">{t.label}</div>
                <div className="text-sm text-gray-500">{t.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-6 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Start Building →
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Update landing page**

Update `web/app/page.tsx`:

```tsx
import { TeamSetupForm } from '@/components/landing/TeamSetupForm'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2">Vibe Code Rally</h1>
        <p className="text-xl text-gray-500">
          GCU · 3 Hours · Build a Real App with AI
        </p>
      </div>
      <TeamSetupForm />
    </div>
  )
}
```

- [ ] **Step 3: Create the rally page**

Create `web/app/rally/[teamSlug]/page.tsx`:

```tsx
'use client'

import { use, useEffect, useState } from 'react'
import { RallyShell } from '@/components/rally/RallyShell'
import type { TeamInfo } from '@/lib/rally/types'

export default function RallyPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>
}) {
  const { teamSlug } = use(params)
  const [team, setTeam] = useState<TeamInfo | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem(`rally-${teamSlug}`)
    if (stored) {
      setTeam(JSON.parse(stored))
    } else {
      // Fallback: create team from slug
      setTeam({
        name: teamSlug.replace(/-/g, ' '),
        slug: teamSlug,
        members: [],
        track: 'campus',
      })
    }
  }, [teamSlug])

  if (!team) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return <RallyShell team={team} />
}
```

- [ ] **Step 4: Test the full flow locally**

```bash
cd ~/Development/rally-kit/web && npm run dev
```

1. Open `http://localhost:3000`
2. Enter team name, members, track
3. Click "Start Building →"
4. Verify redirect to `/rally/team-slug`
5. Verify WebContainer boots (status bar shows progress)
6. Verify chat works — type "hello", get AI response
7. Verify AI can write files and preview updates

- [ ] **Step 5: Commit**

```bash
git add web/components/landing/ web/app/
git commit -m "feat(web): landing page, team setup, rally routing — full flow works"
```

---

## Task 7: Populate WebContainer File Tree

**Files:**
- Modify: `web/lib/webcontainer/files.ts`

This task converts all existing Rally Kit source files into the `FileSystemTree` constant. It's mechanical but critical — every component must be embedded correctly.

- [ ] **Step 1: Read every source file from the existing Rally Kit**

Read all files from `~/Development/rally-kit/src/`:
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- `src/components/ThemeInitializer.tsx`, `StatCard.tsx`, `ChartCard.tsx`, `DataTable.tsx`, `DetailCard.tsx`, `FormCard.tsx`, `ListItem.tsx`, `EmptyState.tsx`, `PageHeader.tsx`, `MetricRow.tsx`, `ActionMenu.tsx`
- `src/components/shells/MobileShell.tsx`, `DashboardShell.tsx`, `PortfolioShell.tsx`
- `src/lib/utils.ts`, `theme.ts`, `navigation.ts`, `mockData.ts`
- `src/data/mock.ts`

- [ ] **Step 2: Embed each file as a string literal in files.ts**

For each file, replace the placeholder in the `RALLY_KIT_FILES` constant with the actual content, properly escaped for TypeScript template literals (backtick-escape any backticks in the source).

Verify:
- No import path changes needed (components use `@/` paths which resolve inside the WebContainer)
- `rally.config.json` reference in layout.tsx should be removed or handled
- The landing page (`src/app/page.tsx`) should be a simple welcome message (AI builds the real pages)

- [ ] **Step 3: Test the populated file tree**

```bash
cd ~/Development/rally-kit/web && npm run dev
```

Open `/rally/test-team`. The WebContainer should:
1. Boot and install dependencies (may take 15-30s first time)
2. Start `next dev`
3. Show the Rally Kit starter page in the preview iframe

- [ ] **Step 4: Commit**

```bash
git add web/lib/webcontainer/files.ts
git commit -m "feat(web): embed all Rally Kit components in WebContainer file tree"
```

---

## Task 8: End-to-End Polish + Browser Detection

**Files:**
- Modify: `web/app/page.tsx` (add browser warning)
- Modify: `web/components/rally/RallyShell.tsx` (responsive layout)
- Modify: `web/components/rally/ChatPanel.tsx` (auto-welcome message)

- [ ] **Step 1: Add browser detection to landing page**

Add a banner at the top of the landing page if the user is on a very old browser:

```tsx
// In the landing page, add this client component:
'use client'
function BrowserCheck() {
  const [warning, setWarning] = useState('')
  useEffect(() => {
    // Check for SharedArrayBuffer support (required for WebContainers)
    if (typeof SharedArrayBuffer === 'undefined') {
      setWarning('Your browser may not support this app. For the best experience, use Chrome, Edge, or Safari 16.4+.')
    }
  }, [])
  if (!warning) return null
  return (
    <div className="w-full max-w-md mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
      {warning}
    </div>
  )
}
```

- [ ] **Step 2: Add responsive layout for smaller screens**

Update `RallyShell.tsx` to stack vertically on narrow screens:

```tsx
// Change the main content flex container:
<div className="flex-1 flex flex-col md:flex-row min-h-0">
  <div className="w-full md:w-[400px] shrink-0 h-1/2 md:h-auto">
    <ChatPanel ... />
  </div>
  <div className="flex-1 h-1/2 md:h-auto">
    {isReady ? <PreviewPanel ... /> : <BootScreen ... />}
  </div>
</div>
```

- [ ] **Step 3: Send auto-welcome message when sandbox is ready**

In `RallyShell.tsx`, after the WebContainer reaches `ready` status, automatically send the first message to kick off the conversation:

```typescript
// In RallyShell, after boot completes:
useEffect(() => {
  if (sandboxStatus === 'ready' && messages.length === 0) {
    // Auto-trigger the rally start
    sendMessage({ text: '/rally' })
  }
}, [sandboxStatus])
```

This requires lifting `sendMessage` from ChatPanel to RallyShell, or using a ref/callback pattern.

- [ ] **Step 4: Test full flow end-to-end**

1. Landing page → team setup → redirect
2. WebContainer boots → progress shown
3. Auto-welcome message from AI
4. Type messages → AI responds with tool calls
5. Files written → preview updates
6. Slash command pills work
7. Phase indicator counts down

- [ ] **Step 5: Commit**

```bash
git add web/
git commit -m "feat(web): browser detection, responsive layout, auto-welcome on boot"
```

---

## Task 9: Deploy to Vercel

**Files:**
- Create: `web/.env.local` (local only — never committed)
- Vercel project configuration

- [ ] **Step 1: Create Vercel project**

```bash
cd ~/Development/rally-kit/web
vercel link
```

Set the root directory to `web/` (or link from within the `web/` directory). The project name should be `rally-kit-web` or similar.

- [ ] **Step 2: Set environment variables**

```bash
vercel env add ANTHROPIC_API_KEY
```

Enter the API key when prompted. Set for Production and Preview.

- [ ] **Step 3: Deploy to preview**

```bash
cd ~/Development/rally-kit/web
vercel
```

Test the preview URL. Verify:
- COOP/COEP headers are present (check network tab)
- WebContainer boots in the deployed version
- AI chat works (API key is set)
- Full flow: landing → setup → chat → build → preview

- [ ] **Step 4: Configure domain**

```bash
vercel domains add rally.aicoderally.com
```

Or configure in the Vercel dashboard.

- [ ] **Step 5: Deploy to production**

```bash
vercel --prod
```

- [ ] **Step 6: Final verification**

Open `rally.aicoderally.com` on:
- Chrome (Mac)
- Safari (Mac)
- Edge (if available)

Run the full 3-hour flow in compressed time (10 minutes):
1. Create team
2. Chat with AI about a business idea
3. AI builds 2-3 pages
4. Preview updates in real-time
5. Slash commands work

- [ ] **Step 7: Commit any final tweaks**

```bash
git add -A
git commit -m "chore(web): deploy configuration and final polish"
```

---

## Task 10: Delete Test Page + Cleanup

**Files:**
- Delete: `web/app/test-wc/page.tsx` (from Task 2)

- [ ] **Step 1: Remove the test WebContainer page**

```bash
rm -rf ~/Development/rally-kit/web/app/test-wc
```

- [ ] **Step 2: Final commit**

```bash
git add -A
git commit -m "chore(web): remove test page, clean up for event day"
```

---

## Summary

| Task | What | Est. Time |
|------|------|-----------|
| 1 | Project scaffold + COOP/COEP | 30 min |
| 2 | WebContainer boot + file tree skeleton | 1 hr |
| 3 | AI chat API route + system prompt | 45 min |
| 4 | Chat UI + client-side tool execution | 1.5 hr |
| 5 | Preview panel + rally shell layout | 1 hr |
| 6 | Landing page + routing | 45 min |
| 7 | Populate full WebContainer file tree | 1.5 hr |
| 8 | E2E polish + browser detection | 1 hr |
| 9 | Deploy to Vercel | 30 min |
| 10 | Cleanup | 5 min |
| **Total** | | **~8.5 hr** |

**Critical path:** Tasks 1 → 2 → 3 → 4 (must be sequential). Tasks 5 and 6 can be partially parallelized. Task 7 is independent and can be done anytime after Task 2. Tasks 8-10 are final polish.

**Highest risk:** Task 2 (WebContainer boot) — if `next dev` doesn't run inside WebContainer, we may need to switch the student project to Vite. Test this early on Day 1.
