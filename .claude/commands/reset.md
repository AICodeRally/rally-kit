# Reset — Start Over

Erase all progress and start fresh. DESTRUCTIVE — confirm first.

## Instructions

### Step 1: Confirm

Ask the team:
> "Are you sure you want to start over? This will erase your business design, all the pages I built, and your progress. You'll pick a new idea from scratch. Type **yes** to confirm."

Wait for "yes" (or similar confirmation). If they say anything else, say:
> "OK, keeping everything! If something specific isn't working, tell me what to change instead of starting over."

### Step 2: Reset (only after confirmation)

Delete these files if they exist:
- `DOMAIN.md`
- `rally.config.json`
- `DEMO_SCRIPT.md`
- `.rally-progress`
- `.team-roles`
- All page folders in `src/app/` EXCEPT `layout.tsx`, `page.tsx`, and `globals.css`
- `src/data/mock.ts` — recreate with empty export: `export const data = {};`

Do NOT delete:
- `.team-name`, `.team-members`, `.team-track` (they're still the same team)
- `.rally-port` (server is still running)
- Any files in `src/components/` or `src/lib/` (those are the library)
- Any config files (package.json, tsconfig, etc.)

### Step 3: Fresh start

Say:
> "Clean slate! Your team info is saved, but everything else is fresh. Let's start with a new idea — **what kind of business or tool do you want to build this time?**"

Begin Phase 1: Design from CLAUDE.md.
