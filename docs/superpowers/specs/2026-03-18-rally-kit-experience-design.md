# Rally Kit App Experience Design

> Date: 2026-03-18
> Status: Draft
> Author: Todd + Claude

## Overview

The rally-kit is the app students use at the GCU Vibe Code Rally. In 3 hours, teams of 3-4 students (with zero coding experience) design a business, build a working web app with Claude's help, and present it.

This spec defines the full student experience: the component library, shell layouts, CLAUDE.md guidance system, progress tracking, and team setup flow.

## Philosophy

**Claude-first with smart scaffolding.** Claude guides everything conversationally. The kit ships with pre-built components and shell layouts so students spend time on their business idea, not boilerplate. No browser wizard — Claude handles ideation, shell selection, building, pacing, and polish through natural conversation.

**Educational but not forceful.** Claude drops light one-liner teachable moments as it builds ("This is called a KPI — a number that tells you if things are going well"). No lectures, no quizzes. Just quick context about real-world concepts.

**Readability first.** All UI defaults to light backgrounds, dark text, large fonts (16px+ body). Components use high-contrast colors. This can be overridden by advanced teams with time, but Claude defaults to the readable path.

## The Flow (3 Hours)

```
start.sh
  → Team setup in terminal (name, members, track)
  → Terminal resized larger via AppleScript
  → Claude launches

Phase 1: Design (30 min)
  → Claude conversation: business idea, shell choice, theme, roles
  → DOMAIN.md generated from conversation
  → rally.config.json written (shell, theme)

Phase 2: Build (90 min)
  → Claude composes pages from component library into chosen shell
  → Progress tracked in .rally-progress
  → Gentle time nudges every 20-30 min
  → Advanced students can move faster, no hard gates

Phase 3: Polish (30 min)
  → Realistic mock data, styling consistency, empty states
  → Demo prep, talking points
  → Presenter role addressed specifically

Demo Time
  → Each team presents 2-3 minutes
```

## Three Tracks

Students choose a track during `start.sh`. Track and shell are independent choices.

| Track | Focus | Example Ideas |
|-------|-------|---------------|
| **Campus AI** | Solve a student's pain points | Study planner, resume builder, email assistant, personal organizer |
| **Startup AI** | Kick start a business | Marketing tool, content generator, pricing engine, 90-day ideation tool |
| **Working Toward My Future** | Help you get hired | AI job finder, career path evaluator, personal CRM, AI proficiency demo |

## Three Shells

Students choose a shell layout during the design conversation with Claude.

### Mobile Shell
- Bottom tab navigation (4 tabs)
- Header bar with app name
- Scrollable card-based content area
- Best for personal tools, social apps, on-the-go experiences

### Dashboard Shell
- Collapsible sidebar navigation
- Header with search + user avatar area
- Main content area with stat cards + data tables
- Best for business dashboards, analytics, management tools

### Portfolio Shell
- Top navigation bar with links
- Hero section slot
- Content grid area
- Best for portfolios, career tools, professional sites

## Theme Selection

Claude asks the team what color theme they want. Options:

- **Ocean** — blues and teals
- **Sunset** — oranges and ambers
- **Forest** — greens
- **Berry** — purples and pinks
- **Slate** — neutral grays
- **Custom** — pick your own accent color

Theme is stored in `rally.config.json` and applied via CSS variables across all components.

## Team Roles (Optional)

Claude offers role assignment for teams of 3+:

| Role | Responsibility |
|------|---------------|
| **CEO** | Final decisions on business direction, features, priorities |
| **Designer** | Feedback on layout, colors, mock data, UX |
| **Presenter** | Prepares demo pitch, takes notes on what's built |

Claude references roles throughout: "Designer — what do you think of this layout?" Completely optional — teams can skip and just collaborate.

Roles stored in `.team-roles`.

## Component Library

All components respect the chosen theme via CSS variables. Claude composes pages from these — it does not build UI primitives from scratch (unless team is advanced and has time).

### Layout Components (one per shell)

| Component | Shell | Provides |
|-----------|-------|----------|
| `MobileShell` | Mobile | Bottom tab nav, header bar, scrollable content |
| `DashboardShell` | Dashboard | Collapsible sidebar, header with search, main content |
| `PortfolioShell` | Portfolio | Top nav, hero section slot, content grid |

### Shared Content Components

| Component | Purpose | Example |
|-----------|---------|---------|
| `StatCard` | Big number + label + trend arrow | Revenue: $12.4k (+8%) |
| `DataTable` | Sortable rows with column headers | Customer list, inventory |
| `ChartCard` | Recharts wrapper (bar, line, pie, area) | Monthly sales chart |
| `DetailCard` | Key-value pairs with optional image | Customer profile |
| `FormCard` | Styled form: inputs, selects, textarea, submit | New order form |
| `ListItem` | Clickable row with icon, title, subtitle, badge | Task list item |
| `EmptyState` | Friendly message + CTA button | "No orders yet" |
| `PageHeader` | Title + subtitle + action buttons | Page top bar |
| `MetricRow` | Horizontal row of 3-4 mini stats | Quick summary row |
| `ActionMenu` | Dropdown with edit/delete/archive | Row actions |

### Utilities

| Utility | Purpose |
|---------|---------|
| `mockData.ts` | Generators for names, dates, dollars, percentages, statuses |
| `theme.ts` | CSS variable config based on theme choice |
| `navigation.ts` | Route config — Claude adds pages here as they're built |

## CLAUDE.md Structure

### Identity & Tone
- Friendly AI coding partner, conversational, encouraging, never condescending
- Uses team name and member names throughout
- References roles when assigned
- One question at a time — never dumps 5 questions

### Phase 1: Design (30 min)
1. Read `.team-track` — tailor suggestions to track
2. Ask what business they want to build (give 3-4 examples from track)
3. Ask who uses the app and what their day looks like
4. Ask what 4-5 pages the app needs — suggest defaults
5. Describe the 3 shells — student picks
6. Ask what theme they want
7. Offer role assignment (optional)
8. Generate `DOMAIN.md`
9. Write config to `rally.config.json`
10. Teachable moment: "What you just did is called domain modeling"

### Phase 2: Build (90 min)
1. Read `DOMAIN.md` and `rally.config.json`
2. Activate chosen shell layout
3. Build pages one at a time using component library
4. After each page: show what was built, ask for feedback
5. Track progress in `.rally-progress`
6. Every 20-30 min: gentle status update
7. Light teachable moments (KPIs, UX, mock vs real data)
8. Advanced students who finish early: suggest stretch goals

### Phase 3: Polish (30 min)
1. Suggest: realistic mock data, consistent styling, empty states
2. Help prepare demo talking points
3. Address Presenter role if assigned
4. Teachable moment: "Polish is what separates a prototype from a product"

### Default Rules (Claude can override for advanced teams with time)
- Default to light backgrounds, dark text, high contrast
- Default to library components over building from scratch
- NEVER install new npm packages
- Keep mock data realistic
- If stuck, ask ONE question

### Progress Tracking (.rally-progress)
```json
{
  "startedAt": "2026-04-15T14:00:00Z",
  "phase": "build",
  "shell": "dashboard",
  "theme": "ocean",
  "domainComplete": true,
  "pagesBuilt": ["dashboard", "customers", "orders"],
  "pagesPlanned": ["dashboard", "customers", "orders", "analytics", "settings"],
  "lastNudge": "2026-04-15T15:15:00Z"
}
```

## Terminal Experience

- `.command` file / `start.sh` resizes Terminal window larger via AppleScript
- Claude terminal font should be readable from across a table
- macOS popup dialog explains the two Terminal windows
- Clear box instructions: DO NOT CLOSE the app server window

## Multi-Laptop Teams

Extra laptops are research stations, not code stations:
- Browse competitor apps for inspiration
- Draft copy/content in Google Docs
- Sketch wireframes on paper
- Look up domain knowledge

CLAUDE.md mentions this approach.

## Files Created/Modified

| File | Change |
|------|--------|
| `CLAUDE.md` | Complete rewrite with phase guidance, track awareness, component instructions |
| `rally.config.json` | New — shell choice, theme, roles |
| `.rally-progress` | New — progress tracking |
| `.team-roles` | New — optional role assignments |
| `src/components/shells/MobileShell.tsx` | New — mobile layout |
| `src/components/shells/DashboardShell.tsx` | New — dashboard layout |
| `src/components/shells/PortfolioShell.tsx` | New — portfolio layout |
| `src/components/StatCard.tsx` | Exists — may need theme support |
| `src/components/ChartCard.tsx` | Exists — may need theme support |
| `src/components/DataTable.tsx` | New |
| `src/components/DetailCard.tsx` | New |
| `src/components/FormCard.tsx` | New |
| `src/components/ListItem.tsx` | New |
| `src/components/EmptyState.tsx` | New |
| `src/components/PageHeader.tsx` | New |
| `src/components/MetricRow.tsx` | New |
| `src/components/ActionMenu.tsx` | New |
| `src/lib/mockData.ts` | New — mock data generators |
| `src/lib/theme.ts` | New — CSS variable config |
| `src/lib/navigation.ts` | New — route config |
| `start.sh` | Already updated — team setup, track selection |
| `install.sh` | Already updated — one-click installer |
| `.gitignore` | Add `.team-roles`, `.rally-progress`, `.superpowers/` |
| `DOMAIN_TEMPLATE.md` | Review and update for track awareness |

## Non-Goals

- No browser-based wizard — Claude handles everything conversationally
- No multi-laptop code sync — too complex for 3-hour event
- No real database — all mock data
- No deployment — apps run locally only
- No authentication or user accounts
- No AI features in the student apps (unless advanced team wants it)
