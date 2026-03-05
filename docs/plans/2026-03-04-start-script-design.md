# Rally Kit — Start Script Design

> Date: 2026-03-04
> Status: Approved
> Author: Todd + Claude

## Problem

Students need to run two terminals (dev server + Claude) and ensure prerequisites are met. Too many manual steps = wasted rally time.

## Solution

A single `./start.sh` that handles everything: pre-flight checks, install, ASCII banner, team name, dev server, browser, and Claude launch.

## Design

### 1. `start.sh` — Single Entry Point

```
./start.sh
```

**Flow:**

1. **Pre-flight checks** — Node 20+, npm, Claude Code, ANTHROPIC_API_KEY
   - Green checkmarks / red X's with fix commands
   - Stops on failure

2. **Install** — `npm install` if `node_modules/` missing

3. **ASCII banner** — ANSI-colored "VIBE CODE RALLY" + 3-step instructions

4. **Team name prompt** — "What's your team name?" → saved to `.team-name`

5. **Launch dev server** — `npm run dev` backgrounded, wait for port 3000

6. **Open browser** — `open` (macOS) / `start` (Windows) / `xdg-open` (Linux)

7. **Launch Claude** — `claude` in foreground

8. **Cleanup** — On exit, kill background dev server

### 2. macOS Split-Pane Enhancement

Detected via `$TERM_PROGRAM`:

- **iTerm2** → AppleScript split: left pane = dev server, right pane = Claude
- **Terminal.app** → New tab for dev server, Claude stays in original tab
- **Other/Windows** → Fallback to backgrounded dev server + Claude in foreground

### 3. Claude Startup UX

**`.team-name` file** — CLAUDE.md reads it, personalizes greeting ("Welcome, Team Phoenix!")

**CLAUDE.md "First Message" section:**
- If no DOMAIN.md + `.team-name` exists → warm welcome + phase recap + first question
- Structured opening replaces generic instructions

**`.rally-status` file** — Pre-flight results. CLAUDE.md tells Claude to check it and help resolve any flagged issues.

## Files Changed

| File | Change |
|------|--------|
| `start.sh` (new) | Main launcher script |
| `CLAUDE.md` | Add First Message section, .team-name awareness, .rally-status check |
| `.gitignore` | Add `.team-name`, `.rally-status` |
| `docs/FACILITATOR.md` | Update setup instructions to use `./start.sh` |

## Non-Goals

- No tmux dependency
- No VS Code integration
- No Windows-specific `.bat` file (bash works via Git Bash / WSL)
