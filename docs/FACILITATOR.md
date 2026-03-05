# Facilitator Guide — GCU Vibe Code Rally

> For Todd, Joe, Paul, and event helpers.

## Pre-Event Checklist (do this the day before)

### Student Machine Setup
Each team needs:
- [ ] **Node.js 20+** installed (`node -v` to verify)
- [ ] **Claude Code** installed (`npm install -g @anthropic-ai/claude-code`)
- [ ] **Anthropic API key** set (`export ANTHROPIC_API_KEY=sk-ant-...`)
- [ ] **Git** installed (for cloning)
- [ ] **VS Code** or any text editor (for viewing files — Claude does the coding)

### Clone the Repo
```bash
git clone https://github.com/AICodeRally/rally-kit.git team-[name]
cd team-[name]
npm install
npm run dev
```

Verify: `http://localhost:3000` shows the Rally Kit welcome page.

### Test Claude Code
```bash
# In the project directory:
claude
# Type: "What files are in this project?"
# Claude should respond with the file list and reference CLAUDE.md
```

---

## Event Day Schedule (3 hours)

| Time | Duration | Phase | What's Happening |
|------|----------|-------|-----------------|
| 0:00 | 15 min | **Kickoff** | Welcome, rules, team formation, hand out API keys |
| 0:15 | 5 min | **Demo** | Show a 60-second demo of what a finished app looks like |
| 0:20 | 30 min | **Phase 1: Design** | Teams create DOMAIN.md with Claude's help |
| 0:50 | 5 min | **Check-in** | Walk the room, make sure every team has a DOMAIN.md |
| 0:55 | 60 min | **Phase 2: Build** | Claude builds the app, teams give feedback |
| 1:55 | 5 min | **Check-in** | Walk the room, troubleshoot any stuck teams |
| 2:00 | 30 min | **Phase 3: Polish** | Finalize mock data, styling, prepare demo |
| 2:30 | 25 min | **Demos** | Each team presents (2-3 min each) |
| 2:55 | 5 min | **Judging & Awards** | Announce winners |

---

## Kickoff Script (15 min)

1. **Welcome** (2 min)
   - "You're going to build a real web app in 3 hours — with zero coding experience."
   - "AI does the coding. You do the thinking."

2. **Rules** (3 min)
   - Teams of 3-4
   - Build an app for ANY business — you pick the industry
   - Use Claude Code to build everything
   - Mock data only (no real databases)
   - Must use the dark theme (it's a rally, not a spreadsheet)

3. **How It Works** (5 min)
   - "Phase 1: You'll design your business. Claude helps you create a domain pack — think of it as the blueprint."
   - "Phase 2: You tell Claude 'build the app.' It reads your blueprint and builds pages one at a time. You give feedback."
   - "Phase 3: Polish it up for your demo."

4. **Demo** (5 min)
   - Show a finished example app (dashboard, list page, detail page)
   - "This is what you'll have in 3 hours."

---

## Troubleshooting

### "Claude isn't reading CLAUDE.md"
- Make sure they're running `claude` from the project root directory
- The file must be named exactly `CLAUDE.md` (case-sensitive)

### "npm install failed"
- Check Node.js version: `node -v` (needs 20+)
- Delete `node_modules` and `package-lock.json`, try again
- If on a network with restrictions, try mobile hotspot

### "The app won't start"
- Check if port 3000 is in use: `lsof -i :3000`
- Try: `npm run dev -- -p 3001`

### "Claude installed a new package"
- CLAUDE.md says not to, but if it happens: `npm install` and continue
- Gently remind the team: "You don't need extra packages — everything's included"

### "Claude went off-rails"
- Start a new Claude conversation: close and reopen `claude`
- The CLAUDE.md will reload and reset the guardrails

### "Team is stuck on domain design"
- Suggest industries: pet care, food trucks, campus services, fitness studio, event planning
- Ask: "What business do you wish existed? Build that."
- Help them with 3-4 page ideas to get momentum

---

## Judging Criteria

| Category | Points | What to Look For |
|----------|--------|-----------------|
| **Business Design** | 30 | Is the domain pack well-thought-out? Does the app solve a real problem? |
| **App Quality** | 30 | Does it work? Is the data realistic? Are all pages connected? |
| **Visual Polish** | 20 | Does it look professional? Consistent styling? Good use of charts? |
| **Presentation** | 20 | Can they explain their business? Demo flows smoothly? |
| **Total** | 100 | |

### Award Categories
- **Best Overall** — highest total score
- **Best Business Idea** — most creative/viable business concept
- **Best Looking** — most polished visual design
- **Best Presentation** — most engaging demo

---

## API Key Distribution

Options (pick one):
1. **Pre-loaded on machines** — set `ANTHROPIC_API_KEY` in shell profile before event
2. **Printed cards** — one API key per team, written on index cards
3. **Shared key** — one key for all teams (simpler but less isolation)

**Recommended:** Pre-load on machines. Less friction, fewer typos, faster start.

---

## Post-Event

- Collect screenshots/recordings of final apps
- Rotate API keys if using individual keys
- Ask teams to push their repos (optional — nice portfolio piece)
- Collect feedback: "What was the hardest part? What was the most fun?"
