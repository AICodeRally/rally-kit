# Vibe Code Rally — Rally Kit

> Students design a business and build a working app in 3 hours with AI.
> Zero coding experience required.

---

## What's in the Box

- **Next.js 15** app with 10 pre-built components and 3 shell layouts
- **Claude Code** as the AI coding partner — guided by `CLAUDE.md`
- **9 slash commands** (`/help`, `/rally`, `/build`, `/brainstorm`, `/polish`, `/demo`, `/fix`, `/status`, `/reset`)
- **One-click installer** — double-click `vibe-code-rally.command` on Mac

## Quick Setup (Per Station)

### Prerequisites

| Requirement | Check | Install |
|-------------|-------|---------|
| Node.js 20+ | `node -v` | [nodejs.org](https://nodejs.org) |
| Claude CLI | `claude --version` | `npm install -g @anthropic-ai/claude-code` |
| API Key | `echo $ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/settings/keys) |

### Option A: Double-Click Installer (Recommended)

1. Put `vibe-code-rally.command` on the Desktop
2. Set the API key in the shell profile or in `~/Desktop/rally-kit/.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Double-click `vibe-code-rally.command`
4. Follow the on-screen prompts

### Option B: Manual

```bash
cd ~/Desktop
git clone https://github.com/AICodeRally/rally-kit.git
cd rally-kit
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
npm install
npm run dev &
claude
```

## The 3-Hour Flow

```
Phase 1: DESIGN (30 min)     Phase 2: BUILD (90 min)     Phase 3: POLISH (30 min)
├── Business idea             ├── Dashboard page           ├── Realistic mock data
├── Domain model              ├── List/detail pages        ├── Visual consistency
├── Shell + theme             ├── Form pages               ├── Demo script
└── Role assignment           └── Mock data                └── Practice pitch
```

## Slash Commands

Students type these in the Claude terminal:

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
- `MobileShell` — Bottom tabs, card-based (student tools, social apps)
- `DashboardShell` — Sidebar nav, stat cards (business dashboards)
- `PortfolioShell` — Top nav, hero section (career tools, portfolios)

### Content Components
`StatCard` · `ChartCard` · `DataTable` · `DetailCard` · `FormCard` · `ListItem` · `EmptyState` · `PageHeader` · `MetricRow` · `ActionMenu`

### Themes
Ocean · Sunset · Forest · Berry · Slate · Custom

## Tracks

| Track | Audience | Example Ideas |
|-------|----------|--------------|
| **Campus AI** | Student life tools | Study planner, budget tracker, club finder |
| **Startup AI** | Business builders | CRM, pricing engine, marketing dashboard |
| **Working Toward My Future** | Career prep | Job tracker, portfolio, skill gap analyzer |

## Security

- Claude is sandboxed — cannot install packages, access the internet, or read files outside the project
- Prompt injection is handled gracefully (warm redirect to building)
- API key is in `.env` (gitignored, never committed)
- All system files are protected from modification

## Files

```
vibe-code-rally.command   ← Double-click to start (Mac)
install.sh                ← One-line web installer
start.sh                  ← Launcher (preflight → team setup → dev server → Claude)
CLAUDE.md                 ← AI instructions (3-phase flow, safety, components)
EVENT_CHEAT_SHEET.md      ← Print for proctors (troubleshooting guide)
DOMAIN_TEMPLATE.md        ← Template for business design document
docs/FACILITATOR.md       ← Detailed facilitator guide
.claude/settings.json     ← Permission lockdown
.claude/commands/*.md     ← 9 slash commands
src/components/           ← 10 content components + 3 shells
src/lib/                  ← Theme, navigation, mock data utilities
src/data/mock.ts          ← Domain-specific mock data (generated per team)
```

## For Event Organizers

See `EVENT_CHEAT_SHEET.md` for:
- Pre-event setup checklist
- Common student issues and fixes
- Timeline breakdown
- Slash command reference for proctors

---

**AICodeRally** · [aicoderally.com](https://aicoderally.com)
