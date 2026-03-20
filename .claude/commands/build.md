# Build — Jump to Building

Skip or finish the design phase and start coding.

## Instructions

1. Read `.rally-port` — use this port for ALL localhost links
2. Read `rally.config.json` — get shell and theme choices
3. Read `DOMAIN.md` — get the business design

### If DOMAIN.md exists:
- Confirm: "I see your design for **[business name]**. Ready to start building?"
- If they say yes, start Phase 2 Build from CLAUDE.md
- Follow the build order: shell layout → dashboard → list pages → form pages → mock data

### If DOMAIN.md does NOT exist:
- Say: "We need a quick design first — what kind of business or tool do you want to build?"
- Run through the abbreviated design flow:
  1. Business idea (ONE question)
  2. What it tracks (3-4 things)
  3. Business name
  4. Shell choice (mobile/dashboard/portfolio)
  5. Theme choice
- Save `DOMAIN.md` and `rally.config.json`
- Then start building

### During build:
- Give status updates every 30-60 seconds during long operations
- After each page: show the localhost link, ask for feedback, wait before moving on
- Track progress in `.rally-progress`
- Always end with: "Your [page] is ready at **http://localhost:[PORT]**. Take a look — what do you think?"
