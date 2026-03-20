# Rally — Start or Resume

Boot up the rally experience. Handles both new teams and returning teams.

## Instructions

Run the full boot sequence from CLAUDE.md:

1. Read `.rally-port` — use this port for ALL localhost links. If missing, default to `3000`.
2. Read `.team-name` — if exists, this is a returning team
3. Read `.team-members` — greet by name
4. Read `.team-track` — tailor suggestions
5. Read `rally.config.json` — if exists, skip design config questions
6. Read `DOMAIN.md` — if exists, offer to jump to building or revise
7. Read `.rally-progress` — if exists, resume from last milestone

### If NEW team (no dot files):
- Welcome them with the format from CLAUDE.md
- Teach them the 5 important things (errors, interrupted, file permissions, app link, don't close terminal)
- Tell them: **"Type /help anytime to see what commands are available."**
- Start Phase 1: Design

### If RETURNING team:
- Greet them by team name and member names
- Show what they've already built (from `.rally-progress`)
- Tell them: **"Type /help if you need a reminder of available commands."**
- Ask: "Ready to pick up where we left off, or want to change direction?"
- Resume from their last phase/page

Always end with a clear next step — never leave them hanging.
