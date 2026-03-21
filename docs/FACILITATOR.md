# Facilitator Guide — AICR Rally Kit

> For Todd, Joe, Paul, and event helpers.
> Updated for the **web version** — students use a browser, not a terminal.

---

## What Changed (CLI → Web)

| Before (CLI) | Now (Web) |
|---|---|
| Clone repo + `./start.sh` per station | Students open a URL |
| Claude Code in terminal | Chat panel in the browser |
| `localhost:PORT` in separate browser tab | Live preview iframe next to chat |
| Mac-only reliable | Any device with Chrome/Edge/Safari 16.4+ |
| Need Node.js, Claude CLI, API key | Need only Wi-Fi |
| Setup: 10-15 min per station | Setup: 0 min |

**Students no longer see a terminal.** Everything happens in the browser — chat on the left, app preview on the right. Slash commands are clickable buttons below the chat input.

---

## Pre-Event Checklist

### Infrastructure (do this days before)
- [ ] **Deploy web app** to `rally.aicoderally.com` (Vercel)
- [ ] **Verify ANTHROPIC_API_KEY** is set in Vercel env vars
- [ ] **Test the full flow** — open the URL, create a team, chat through Phase 1, trigger Phase 2, verify preview works
- [ ] **Test on multiple browsers** — Chrome, Edge, Safari. WebContainers require COOP/COEP headers.

### Venue (day before)
- [ ] Wi-Fi works and supports 60+ devices
- [ ] Each station has a laptop/Chromebook with a modern browser
- [ ] URL is written on a whiteboard or printed on table tents: `rally.aicoderally.com`
- [ ] Projector ready for kickoff demo and final presentations

### Day-of
- [ ] Verify the URL loads on one device
- [ ] Have the Event Cheat Sheet printed for helpers (see `EVENT_CHEAT_SHEET.md`)

---

## Student Quick Start

1. Open browser to `rally.aicoderally.com`
2. Enter team name, member names, and pick a track
3. Click **Start Rally**
4. Splash screen plays, then the AI greets the team and starts asking design questions
5. Students talk to the AI by typing in the chat — AI asks **one question at a time**
6. After 30 min of design, type `/build` or click the Build button to start coding
7. AI builds the app — preview appears on the right side of the screen
8. Students give feedback after each page is built

**That's it.** No terminal, no file permissions, no port numbers.

---

## Event Day Schedule (3 hours)

| Time | Duration | Phase | What's Happening |
|------|----------|-------|-----------------|
| 0:00 | 10 min | **Kickoff** | Welcome, show the URL, brief demo of a finished app |
| 0:10 | 30 min | **Phase 1: Design** | Teams chat with AI about their business idea |
| 0:40 | 5 min | **Check-in** | Walk the room — every team should have ideas on the board |
| 0:45 | 75 min | **Phase 2: Build** | AI builds the app, teams give feedback on each page |
| 2:00 | 5 min | **Check-in** | Walk the room — every team should have 2+ pages built |
| 2:05 | 25 min | **Phase 3: Polish** | Clean up visuals, generate demo script |
| 2:30 | 25 min | **Demos** | Each team presents (2-3 min each) |
| 2:55 | 5 min | **Wrap** | Awards, photos, celebration |

---

## What Helpers Need to Know

### The UI Layout

**Phase 1 (Design):** Full-width chat + idea board on the right. A stepper at the top shows progress through 5 design steps: Problem → Pages → Data → Shell → Theme.

**Phase 2 (Build):** Chat on the left (narrow), live preview on the right. When Phase 2 starts, a full-screen transition shows the WebContainer booting (~30 seconds). Students can click through to the chat while it finishes.

**Phase 3 (Polish):** Same layout as Build. AI walks through polish checklist.

### Slash Commands

Students can click these as buttons below the chat input, or type them:

| Command | When to suggest it |
|---------|-------------------|
| `/help` | Student seems lost — "click /help to see your options" |
| `/brainstorm` | Student can't think of an idea |
| `/build` | Design is done, time to start coding |
| `/status` | Student asks "where are we?" |
| `/fix` | Something looks wrong in the preview |
| `/polish` | App is built, time to clean up |
| `/demo` | Need the demo script for presentation |

### Header Controls

Top-right of the screen:
- **A button** — cycles font size (small → medium → large)
- **Moon/Sun icon** — toggles dark/light mode
- **Team name** — displayed for reference

---

## Common Issues & Fixes

### "The page won't load / blank screen"
- Check Wi-Fi connection
- Try a different browser (Chrome works best for WebContainers)
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### "The preview is stuck on 'Setting up your workspace'"
- WebContainer boot takes ~30 seconds — this is normal
- If stuck for over 2 minutes, refresh the whole page
- Safari 16.4+ is required — older Safari won't work

### "AI is saying weird things / not following the flow"
- Type `/rally` to restart the design conversation
- Type `/reset` to start completely over (confirms first)

### "We want to change our business idea"
- In Phase 1: just tell the AI "let's change direction"
- After Phase 2 started: type `/reset` to start fresh

### "The preview shows an error"
- Tell the student to type `/fix` and describe the error
- Or just tell the AI what's wrong — it will fix the code

### "How do we get back to where we were?"
- Type `/status` to see progress
- **Note:** The app does NOT persist conversations across refreshes yet. If a student refreshes, they will need to restart with `/rally`

### "It's taking too long to build"
- Tell the AI: "We have 30 minutes left, let's simplify and do fewer pages"
- Or type `/polish` to skip to cleanup mode

### "The chat is too small to read"
- Click the **A** button in the top-right to increase font size

---

## Key Phrases for Helpers

| Student Says | You Say |
|-------------|---------|
| "I'm stuck" | "Click **/brainstorm** — the AI will help you come up with ideas" |
| "Is this right?" | "There's no wrong answer — it's YOUR business" |
| "The preview broke" | "Click **/fix** and tell the AI what happened" |
| "What do I do?" | "Just talk to the AI like a person, or click one of the buttons below the chat" |
| "This is taking forever" | "Tell the AI you want fewer pages — or click **/polish** to wrap up" |
| "Where's my app?" | "It's the preview on the right side of the screen. If it's loading, wait 30 seconds." |
| "Where are we?" | "Click **/status** to see your progress" |

---

## Emergency Contacts

- **Tech Lead:** _______________
- **Event Organizer:** _______________
- **Wi-Fi Password:** _______________
- **App URL:** `rally.aicoderally.com`

---

## For Advanced Teams

If a team finishes early or wants to go deeper:
- Add more pages beyond the original 4
- Ask the AI to add interactivity (click handlers, modals)
- Ask for a custom color scheme
- Practice the demo multiple times with AI feedback
