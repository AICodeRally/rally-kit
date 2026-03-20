# Vibe Code Rally — Event Cheat Sheet

> **Print this for every proctor/helper at the event.**
> Quick-reference for the most common student issues.

---

## Setup (Before Students Arrive)

- [ ] Each station has a MacBook with power adapter
- [ ] Node.js 20+ installed (`node -v`)
- [ ] Claude CLI installed (`claude --version`)
- [ ] API key set (`echo $ANTHROPIC_API_KEY` — should show `sk-ant-...`)
- [ ] `vibe-code-rally.command` on each Desktop
- [ ] Wi-Fi connected and working
- [ ] Browser open (Safari or Chrome)

---

## Student Quick Start

1. **Double-click** `vibe-code-rally.command` on the Desktop
2. Terminal opens with dark background, large font
3. Answer setup questions: team name, members, track
4. Dev server starts automatically, browser opens
5. **Claude asks "Select login method" — type `2` and press Enter**
6. Claude launches — students start talking about their business idea

---

## Common Issues & Fixes

### "I see a red error in my browser"
**Tell them:** Copy the error text, paste it into the Claude terminal, press Enter. Claude will fix it.

### "It says Interrupted"
**Tell them:** Type `continue` or `keep going` and press Enter. Claude will pick up where it left off.

### "It's asking me Allow Write / y/n"
**Tell them:** Type `Y` and press Enter. That's approving Claude to create/edit a file. It's safe.

### "It's asking for an API key"
Something is wrong with the environment. Run this in a new terminal:
```bash
echo $ANTHROPIC_API_KEY
```
If empty, set it: `export ANTHROPIC_API_KEY=sk-ant-...` (get key from event organizer)

### "The page is blank / not loading"
1. Check the minimized Terminal window — is the server running?
2. Try refreshing the browser
3. If server crashed, run in the rally-kit folder: `npm run dev`

### "Port 3000 is already in use"
The kit auto-detects a free port (3000-3009). If it still fails:
```bash
lsof -i :3000
kill -9 <PID from above>
```

### "It says Module not found"
Claude imported a component that doesn't exist yet. Tell student to paste the error into Claude chat. Claude will create the missing file.

### "The terminal is white / hard to read"
Close the terminal, double-click `vibe-code-rally.command` again. The dark theme applies on launch.

### "I accidentally closed the terminal"
1. Open Terminal app
2. `cd ~/Desktop/rally-kit`
3. `npm run dev &`
4. `claude`

### "Claude is doing something weird / wrong"
Tell student: "Just tell Claude what you want instead. Say: 'Stop, let's try something different.'"

### "We're running out of time"
Tell student to say to Claude: "We have 20 minutes left. Let's skip to polish and demo prep."

---

## Timeline

| Time | Phase | What's Happening |
|------|-------|-----------------|
| 0:00 | Setup | Students arrive, double-click installer |
| 0:10 | Design | Claude asks about their business idea |
| 0:30 | Build | Claude starts writing code |
| 2:00 | Polish | Replace mock data, prep demo |
| 2:30 | Demo Prep | Talking points, practice pitch |
| 3:00 | Demos | 2-minute presentations |

---

## Emergency Contacts

- **Tech Lead:** _______________
- **Event Organizer:** _______________
- **Wi-Fi Password:** _______________
- **API Key:** _______________

---

## Slash Commands (Shortcuts)

Students can type these anytime in the Claude terminal:

| Command | What it does |
|---------|-------------|
| `/help` | Shows all available commands |
| `/rally` | Start fresh or resume where they left off |
| `/build` | Jump to building the app |
| `/brainstorm` | Help with ideas if stuck |
| `/polish` | Clean up visuals and data |
| `/demo` | Generate a 2-minute demo script |
| `/fix` | Troubleshoot errors |
| `/status` | See progress and what's next |
| `/reset` | Start completely over |

**If a student seems lost**, tell them: "Type **/help** to see your options."

---

## Key Phrases for Helpers

| Student Says | You Say |
|-------------|---------|
| "I'm stuck" | "Type **/brainstorm** — Claude will help you come up with ideas" |
| "Is this right?" | "There's no wrong answer — it's YOUR business" |
| "It broke!" | "Type **/fix** and paste the error — Claude will fix it" |
| "What do I type?" | "Just talk to Claude like a person — or type **/help** for shortcuts" |
| "This is taking forever" | "Tell Claude to simplify — 'let's do fewer pages'" |
| "Can I change my idea?" | "Type **/reset** to start over, or just tell Claude your new direction" |
| "Where are we?" | "Type **/status** to see your progress" |
