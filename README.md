# AICR Rally Kit

> Students design a business and build a working app in 3 hours with AI.
> Zero coding experience required. Zero install required.

---

## Architecture: CLI vs Web

Rally Kit has **two delivery modes**. The web app is the primary mode going forward.

| | CLI Version (legacy) | Web Version (current) |
|---|---|---|
| **How students use it** | Clone repo, run `./start.sh`, talk to Claude in terminal | Open a URL in any browser |
| **Where code runs** | Local Node.js on student laptop | WebContainers (in-browser Node.js sandbox) |
| **AI interface** | Claude Code CLI in terminal | Chat panel in the web UI |
| **Preview** | `localhost:PORT` in browser tab | Live iframe next to chat |
| **Setup required** | Node.js 20+, Claude CLI, API key per station | None — just a URL |
| **Device support** | Mac (reliable), Windows (fragile) | Any modern browser |
| **System prompt** | `CLAUDE.md` (root) | `web/lib/ai/system-prompt.ts` |
| **Components** | `src/components/` (local files) | Mounted into WebContainer from `web/lib/webcontainer/files.ts` |

### Why the transition

The CLI version requires Node.js, Claude Code, and an API key on every student laptop. Mac works, Windows doesn't reliably. Setup burns 15+ minutes of event time. The web version eliminates all of that — students open a URL and start building.

---

## Web App (`web/`)

The active development target.

Canonical docs for current runtime behavior live in `web/docs/README.md` (with API, architecture, ops, setup, and roadmap docs).

Legacy architecture notes remain in `web/README.md` for historical context.

```
web/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx          # Root layout (Space Grotesk, ThemeProvider)
│   ├── page.tsx            # Landing page (team setup form)
│   ├── rally/[teamSlug]/   # Rally workspace (loads after team setup)
│   ├── api/chat/           # AI chat endpoint (AI SDK v6, streaming)
│   └── globals.css         # CSS custom properties (light/dark themes)
├── components/
│   ├── rally/              # Workspace components (see web/README.md)
│   ├── brand/              # AICR logo, GCU badge
│   ├── ai-elements/        # Markdown renderer for AI messages
│   ├── chat/               # File change notifications
│   └── landing/            # Team setup form
├── lib/
│   ├── ai/system-prompt.ts # AI coaching flow (3-phase structured prompt)
│   ├── rally/types.ts      # Phase, DesignIdea, TeamInfo types
│   ├── theme-context.tsx   # Dark/light mode + font size provider
│   └── webcontainer/       # WebContainer boot + file operations
└── package.json
```

### Run locally

```bash
cd web
npm install
npm run dev                  # → http://localhost:3000
```

Requires `ANTHROPIC_API_KEY` in `web/.env.local` (or OIDC via `vercel env pull`).

### Deploy

Deployed to Vercel at `rally.aicoderally.com`. Requires COOP/COEP headers for WebContainers (configured in `next.config.ts`).

---

## CLI Version (root files — legacy)

Still works for local events where stations are pre-configured. Not actively developed.

```
CLAUDE.md                   # AI instructions for CLI mode
start.sh / start.bat        # Launcher scripts
vibe-code-rally.command      # Mac double-click installer
src/                         # Component library (shells, content components)
EVENT_CHEAT_SHEET.md         # Proctor troubleshooting (CLI-specific)
docs/FACILITATOR.md          # Facilitator guide (CLI-specific)
DOMAIN_TEMPLATE.md           # Business design template (shared)
```

---

## The 3-Hour Flow (same for both modes)

```
Phase 1: DESIGN (30 min)     Phase 2: BUILD (90 min)     Phase 3: POLISH (30 min)
├── Business idea             ├── Dashboard page           ├── Realistic mock data
├── Domain model              ├── List/detail pages        ├── Visual consistency
├── Shell + theme             ├── Form pages               ├── Demo script
└── Confirm design            └── Feedback loops           └── Practice pitch
```

### Slash Commands

Students type these in the chat (web) or Claude terminal (CLI):

| Command | What it does |
|---------|-------------|
| `/help` | Show all available commands |
| `/rally` | Start fresh or resume where you left off |
| `/build` | Jump to building the app |
| `/brainstorm` | Stuck? Get 3 app ideas based on your interests |
| `/polish` | Clean up visuals, data, and formatting |
| `/demo` | Generate a 2-minute demo presentation script |
| `/fix` | Something broke — paste the error and get a fix |
| `/status` | See what you've built and what's next |
| `/reset` | Start completely over (with confirmation) |

## Component Library

### Shells (pick one)
- **MobileShell** — Bottom tabs, card-based (student tools, social apps)
- **DashboardShell** — Sidebar nav, stat cards (business dashboards)
- **PortfolioShell** — Top nav, hero section (career tools, portfolios)

### Content Components
`StatCard` · `ChartCard` · `DataTable` · `DetailCard` · `FormCard` · `ListItem` · `EmptyState` · `PageHeader` · `MetricRow` · `ActionMenu`

### Themes
Ocean · Sunset · Forest · Berry · Slate

## Tracks

| Track | Audience | Example Ideas |
|-------|----------|--------------|
| **Campus AI** | Student life tools | Study planner, budget tracker, club finder |
| **Startup AI** | Business builders | CRM, pricing engine, marketing dashboard |
| **Working Toward My Future** | Career prep | Job tracker, portfolio, skill gap analyzer |

## Tech Stack (LOCKED)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Charts | Recharts |
| Fonts | Space Grotesk + Space Mono |
| AI | AI SDK v6 (Anthropic via AI Gateway or BYOK) |
| Sandbox | WebContainers (@webcontainer/api) |

---

**AICodeRally** · [aicoderally.com](https://aicoderally.com)
