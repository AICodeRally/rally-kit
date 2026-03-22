# AICR Rally Kit

> Students design a business and build a working app in 3 hours with AI.
> Zero coding experience required.

---

## How It Works

Students open a URL, chat with AI, and build a real web app — no terminal, no installs, no API keys.

```
Phase 1: DESIGN (30 min)     Phase 2: BUILD (90 min)     Phase 3: POLISH (30 min)
├── Business idea             ├── Dashboard page           ├── Realistic mock data
├── Domain model              ├── List/detail pages        ├── Visual consistency
├── Shell + theme             ├── Form pages               ├── Demo script
└── Confirm design            └── Feedback loops           └── Practice pitch
```

---

## Project Structure

```
src/
├── app/
│   ├── design/          # 9-step design wizard pages
│   │   ├── team/        # Step 1: Team setup
│   │   ├── idea/        # Step 2: Business type
│   │   ├── niche/       # Step 3: Sub-category
│   │   ├── users/       # Step 4: User model
│   │   ├── features/    # Step 5: Feature picker
│   │   ├── name/        # Step 6: App naming
│   │   ├── layout/      # Step 7: Shell selection
│   │   ├── theme/       # Step 8: Color theme (14 + custom)
│   │   └── review/      # Step 9: Domain review
│   └── preview/         # Live shell previews (dashboard, mobile, portfolio)
├── components/          # 10 content components + 3 shells + DesignProgress
└── lib/                 # Theme system, mock data generators

libraries/               # 13 JSON library files (Design + Build + Polish phases)
├── business-types.json  # Step 2 options by track
├── niches.json          # Step 3 sub-categories
├── user-models.json     # Step 4 patterns
├── features.json        # Step 5 catalog
├── naming-patterns.json # Step 6 patterns + examples
├── layouts.json         # Step 7 shell options
├── themes.json          # Step 8 color themes
├── domain-patterns.json # Step 9 domain skeletons
├── page-templates.json  # Build phase page skeletons
├── mock-data-sets.json  # Build phase mock data
├── navigation-templates.json  # Build phase nav configs
├── polish-recipes.json  # Polish phase options
├── demo-scripts.json    # Demo script template + judging criteria
└── capture.sh           # Post-rally library harvester

CLAUDE.md                # AI instructions (9-step library-driven flow)
DOMAIN_TEMPLATE.md       # Structured output template for domain design
event.config.json        # Event config (date, tracks, schedule)
EVENT_CHEAT_SHEET.md     # Proctor troubleshooting guide
docs/FACILITATOR.md      # Facilitator guide
```

## Slash Commands

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
- **DashboardShell** — Sidebar nav, stat cards (business dashboards)
- **MobileShell** — Bottom tabs, card-based (student tools, social apps)
- **PortfolioShell** — Top nav, hero section (career tools, portfolios)

### Content Components
`StatCard` · `ChartCard` · `DataTable` · `DetailCard` · `FormCard` · `ListItem` · `EmptyState` · `PageHeader` · `MetricRow` · `ActionMenu`

### Themes (14 + Custom)
Ocean · Sunset · Forest · Berry · Slate · Neon · Lava · Midnight · Rose · Arctic · Gold · Mocha · Coral · Mono

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

---

**AICodeRally** · [aicoderally.com](https://aicoderally.com)
