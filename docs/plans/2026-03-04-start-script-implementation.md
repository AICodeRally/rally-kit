# Start Script Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a single `./start.sh` that automates the entire rally setup: pre-flight checks, npm install, ASCII banner, team name prompt, dev server launch, browser open, and Claude launch — with macOS split-pane detection.

**Architecture:** One bash script with helper functions. No external dependencies. Cross-platform core (bash) with macOS-specific enhancements via `$TERM_PROGRAM` detection. Two dotfiles (`.team-name`, `.rally-status`) bridge the script to CLAUDE.md.

**Tech Stack:** Bash, AppleScript (macOS only), ANSI escape codes for colors.

---

### Task 1: Create `start.sh` — Pre-flight Checks

**Files:**
- Create: `start.sh`

**Step 1: Create the script with pre-flight check functions**

```bash
#!/usr/bin/env bash
set -euo pipefail

# ─── Colors ───────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
ORANGE='\033[0;33m'
PURPLE='\033[0;35m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m' # No Color

pass() { echo -e "  ${GREEN}✔${NC} $1"; }
fail() { echo -e "  ${RED}✘${NC} $1"; }
info() { echo -e "  ${CYAN}→${NC} $1"; }

# ─── Pre-flight Checks ───────────────────────────────
preflight_ok=true
status_lines=()

check_node() {
  if ! command -v node &> /dev/null; then
    fail "Node.js not found"
    info "Install: ${BOLD}https://nodejs.org${NC} (v20 or later)"
    status_lines+=("node: FAIL - not installed")
    preflight_ok=false
    return
  fi
  local ver
  ver=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$ver" -lt 20 ]; then
    fail "Node.js v${ver} found — need v20+"
    info "Update: ${BOLD}https://nodejs.org${NC}"
    status_lines+=("node: FAIL - v${ver} (need 20+)")
    preflight_ok=false
  else
    pass "Node.js $(node -v)"
    status_lines+=("node: OK - $(node -v)")
  fi
}

check_npm() {
  if command -v npm &> /dev/null; then
    pass "npm $(npm -v)"
    status_lines+=("npm: OK - $(npm -v)")
  else
    fail "npm not found"
    info "npm comes with Node.js — reinstall Node"
    status_lines+=("npm: FAIL - not installed")
    preflight_ok=false
  fi
}

check_claude() {
  if command -v claude &> /dev/null; then
    pass "Claude Code installed"
    status_lines+=("claude: OK")
  else
    fail "Claude Code not found"
    info "Install: ${BOLD}npm install -g @anthropic-ai/claude-code${NC}"
    status_lines+=("claude: FAIL - not installed")
    preflight_ok=false
  fi
}

check_api_key() {
  if [ -n "${ANTHROPIC_API_KEY:-}" ]; then
    local masked="${ANTHROPIC_API_KEY:0:10}..."
    pass "API key set (${masked})"
    status_lines+=("api_key: OK")
  else
    fail "ANTHROPIC_API_KEY not set"
    info "Run: ${BOLD}export ANTHROPIC_API_KEY=sk-ant-your-key-here${NC}"
    status_lines+=("api_key: FAIL - not set")
    preflight_ok=false
  fi
}

echo ""
echo -e "${BOLD}Pre-flight checks${NC}"
echo ""
check_node
check_npm
check_claude
check_api_key
echo ""

# Write status file for Claude to read
printf '%s\n' "${status_lines[@]}" > .rally-status

if [ "$preflight_ok" = false ]; then
  echo -e "${RED}${BOLD}Fix the issues above and run ./start.sh again.${NC}"
  echo ""
  exit 1
fi
```

**Step 2: Make it executable and test pre-flight**

Run: `chmod +x start.sh && ./start.sh`
Expected: Four green checkmarks (assuming prereqs are met), `.rally-status` file created.

**Step 3: Commit**

```bash
git add start.sh
git commit -m "feat(start): pre-flight checks for Node, npm, Claude, API key"
```

---

### Task 2: Add npm Install + ASCII Banner + Team Name Prompt

**Files:**
- Modify: `start.sh` (append after pre-flight section)

**Step 1: Add install, banner, and team name sections**

Append to `start.sh` after the pre-flight exit check:

```bash
# ─── Install ──────────────────────────────────────────
if [ ! -d "node_modules" ]; then
  info "Installing dependencies..."
  npm install --silent
  pass "Dependencies installed"
else
  pass "Dependencies already installed"
fi
echo ""

# ─── Banner ───────────────────────────────────────────
echo -e "${ORANGE}${BOLD}"
cat << 'BANNER'
 ██╗   ██╗██╗██████╗ ███████╗
 ██║   ██║██║██╔══██╗██╔════╝
 ██║   ██║██║██████╔╝█████╗
 ╚██╗ ██╔╝██║██╔══██╗██╔══╝
  ╚████╔╝ ██║██████╔╝███████╗
   ╚═══╝  ╚═╝╚═════╝ ╚══════╝
BANNER
echo -e "${CYAN}"
cat << 'BANNER'
  ██████╗ ██████╗ ██████╗ ███████╗
 ██╔════╝██╔═══██╗██╔══██╗██╔════╝
 ██║     ██║   ██║██║  ██║█████╗
 ██║     ██║   ██║██║  ██║██╔══╝
 ╚██████╗╚██████╔╝██████╔╝███████╗
  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
BANNER
echo -e "${PURPLE}"
cat << 'BANNER'
 ██████╗  █████╗ ██╗     ██╗  ██╗   ██╗
 ██╔══██╗██╔══██╗██║     ██║  ╚██╗ ██╔╝
 ██████╔╝███████║██║     ██║   ╚████╔╝
 ██╔══██╗██╔══██║██║     ██║    ╚██╔╝
 ██║  ██║██║  ██║███████╗███████╗██║
 ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝
BANNER
echo -e "${NC}"

echo -e "${DIM}─────────────────────────────────────────${NC}"
echo -e "  ${ORANGE}1.${NC} Design your business  ${DIM}(30 min)${NC}"
echo -e "  ${CYAN}2.${NC} Build the app         ${DIM}(2 hours)${NC}"
echo -e "  ${PURPLE}3.${NC} Polish & present      ${DIM}(30 min)${NC}"
echo -e "${DIM}─────────────────────────────────────────${NC}"
echo ""

# ─── Team Name ────────────────────────────────────────
if [ -f ".team-name" ]; then
  team_name=$(cat .team-name)
  echo -e "  Welcome back, ${BOLD}${ORANGE}${team_name}${NC}!"
else
  echo -ne "  ${BOLD}What's your team name?${NC} "
  read -r team_name
  if [ -z "$team_name" ]; then
    team_name="Team Rally"
  fi
  echo "$team_name" > .team-name
  echo -e "  Let's go, ${BOLD}${ORANGE}${team_name}${NC}! 🚀"
fi
echo ""
```

**Step 2: Test the banner and team name**

Run: `./start.sh`
Expected: Pre-flight checks, "Dependencies already installed", ASCII art banner in orange/cyan/purple, team name prompt, `.team-name` file created.

**Step 3: Commit**

```bash
git add start.sh
git commit -m "feat(start): ASCII banner, npm install, team name prompt"
```

---

### Task 3: Add Dev Server Launch + Browser Open + Claude Launch + Cleanup

**Files:**
- Modify: `start.sh` (append after team name section)

**Step 1: Add launch logic**

Append to `start.sh`:

```bash
# ─── Dev Server ───────────────────────────────────────
DEV_PID=""

cleanup() {
  if [ -n "$DEV_PID" ] && kill -0 "$DEV_PID" 2>/dev/null; then
    kill "$DEV_PID" 2>/dev/null
    wait "$DEV_PID" 2>/dev/null
  fi
  echo ""
  echo -e "  ${DIM}Dev server stopped. See you next rally!${NC}"
  echo ""
}
trap cleanup EXIT

launch_simple() {
  # Background dev server, Claude in foreground
  info "Starting dev server..."
  npm run dev --silent &> /dev/null &
  DEV_PID=$!

  # Wait for port 3000
  local tries=0
  while ! curl -s http://localhost:3000 > /dev/null 2>&1; do
    tries=$((tries + 1))
    if [ $tries -gt 30 ]; then
      fail "Dev server didn't start in 30 seconds"
      exit 1
    fi
    sleep 1
  done
  pass "Dev server running at ${BOLD}http://localhost:3000${NC}"

  # Open browser
  open_browser

  echo ""
  echo -e "${DIM}─────────────────────────────────────────${NC}"
  echo -e "  ${BOLD}Claude is starting...${NC}"
  echo -e "  ${DIM}Tell Claude about your business idea!${NC}"
  echo -e "${DIM}─────────────────────────────────────────${NC}"
  echo ""

  # Launch Claude in foreground
  claude
}

open_browser() {
  local url="http://localhost:3000"
  if command -v open &> /dev/null; then
    open "$url" 2>/dev/null
  elif command -v xdg-open &> /dev/null; then
    xdg-open "$url" 2>/dev/null
  elif command -v start &> /dev/null; then
    start "$url" 2>/dev/null
  fi
}
```

**Step 2: Add macOS split-pane detection and main launcher**

Append to `start.sh`:

```bash
# ─── macOS Split-Pane Detection ──────────────────────
launch_iterm_split() {
  local project_dir
  project_dir=$(pwd)

  osascript <<APPLE
    tell application "iTerm"
      tell current session of current tab of current window
        -- Left pane: dev server
        write text "cd '${project_dir}' && npm run dev"
      end tell
      tell current session of current tab of current window
        -- Right pane: Claude
        set newSession to (split horizontally with default profile)
        tell newSession
          write text "cd '${project_dir}' && sleep 3 && claude"
        end tell
      end tell
    end tell
APPLE

  # Don't run cleanup — iTerm manages its own sessions
  trap - EXIT
  echo -e "  ${DIM}Split pane opened in iTerm2${NC}"
  echo -e "  ${DIM}Left: dev server  |  Right: Claude${NC}"
  echo ""
}

launch_terminal_tab() {
  local project_dir
  project_dir=$(pwd)

  # Open new tab for dev server
  osascript <<APPLE
    tell application "Terminal"
      activate
      do script "cd '${project_dir}' && npm run dev"
    end tell
APPLE

  pass "Dev server started in new Terminal tab"

  # Wait for port 3000
  local tries=0
  while ! curl -s http://localhost:3000 > /dev/null 2>&1; do
    tries=$((tries + 1))
    if [ $tries -gt 30 ]; then
      fail "Dev server didn't start in 30 seconds"
      exit 1
    fi
    sleep 1
  done
  pass "Dev server running at ${BOLD}http://localhost:3000${NC}"

  open_browser

  echo ""
  echo -e "${DIM}─────────────────────────────────────────${NC}"
  echo -e "  ${BOLD}Claude is starting...${NC}"
  echo -e "  ${DIM}Tell Claude about your business idea!${NC}"
  echo -e "${DIM}─────────────────────────────────────────${NC}"
  echo ""

  # Claude in this tab — no cleanup trap needed, dev server is in another tab
  trap - EXIT
  claude
}

# ─── Main Launch ──────────────────────────────────────
case "${TERM_PROGRAM:-}" in
  iTerm.app)
    info "iTerm2 detected — opening split panes"
    launch_iterm_split
    ;;
  Apple_Terminal)
    info "Terminal.app detected — opening new tab for dev server"
    launch_terminal_tab
    ;;
  *)
    launch_simple
    ;;
esac
```

**Step 2: Test the full script**

Run: `./start.sh`
Expected: Pre-flight → install → banner → team name → dev server starts → browser opens → Claude launches.

**Step 3: Commit**

```bash
git add start.sh
git commit -m "feat(start): dev server launch, browser open, Claude launch, split-pane detection"
```

---

### Task 4: Update `.gitignore`

**Files:**
- Modify: `.gitignore`

**Step 1: Add rally dotfiles**

Add these lines to `.gitignore`:

```
.team-name
.rally-status
```

**Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore .team-name and .rally-status"
```

---

### Task 5: Update CLAUDE.md — First Message + Team Name + Status Awareness

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add new section after the header block and before "The Three Phases"**

Insert this section between the header quote and "## The Three Phases":

```markdown
---

## First Message

When the conversation starts, do these checks:

1. **Check `.rally-status`** — if it exists, scan for any `FAIL` lines. If there are failures, help the team fix them before continuing. If all lines say `OK`, skip this step silently.

2. **Check `.team-name`** — if it exists, read the team name and use it. Greet them warmly:
   > "Welcome to the Vibe Code Rally, **Team [name]**! You've got 3 hours to design a business and build a working app. I'll do all the coding — you do the thinking."

3. **Check `DOMAIN.md`** — if it does NOT exist, proceed to Phase 1 (Domain Pack Creation). If it already exists, ask: "I see you already have a domain pack. Want to jump straight to building, or revise the design first?"

If none of the dotfiles exist (student ran `claude` directly without `./start.sh`), that's fine — just proceed with the standard Phase 1 flow.
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "feat(claude): add First Message section with team name and status awareness"
```

---

### Task 6: Update `docs/FACILITATOR.md` — Simplify Setup to `./start.sh`

**Files:**
- Modify: `docs/FACILITATOR.md`

**Step 1: Replace the "Clone the Repo" and "Two Terminals" sections**

Replace lines 16-36 (the clone + two terminals sections) with:

```markdown
### Clone & Start
```bash
git clone https://github.com/AICodeRally/rally-kit.git team-[name]
cd team-[name]
./start.sh
```

The start script handles everything:
- Checks prerequisites (Node, npm, Claude Code, API key)
- Installs dependencies
- Asks for team name
- Starts the dev server (in a split pane on macOS, backgrounded on other OS)
- Opens the browser to localhost:3000
- Launches Claude Code

**If `./start.sh` doesn't work** (Windows without Git Bash, permissions issues):
```bash
npm install
npm run dev          # Terminal 1 — keep running
claude               # Terminal 2 — in same folder
```
```

**Step 2: Commit**

```bash
git add docs/FACILITATOR.md
git commit -m "docs(facilitator): simplify setup to ./start.sh with manual fallback"
```

---

### Task 7: End-to-End Test

**Step 1: Clean test**

```bash
# Simulate fresh clone
rm -rf /tmp/rally-kit-test
cp -r /tmp/campus-rally/rally-kit /tmp/rally-kit-test
cd /tmp/rally-kit-test
rm -rf node_modules .next .team-name .rally-status
```

**Step 2: Run `./start.sh`**

Expected flow:
1. Four green checkmarks for pre-flight
2. "Installing dependencies..." then success
3. ASCII banner in orange/cyan/purple
4. "What's your team name?" prompt → type "Test Team"
5. Dev server starts, browser opens to localhost:3000
6. Claude launches in foreground
7. Type "What files are in this project?" — Claude should reference CLAUDE.md and mention the team name

**Step 3: Verify `.team-name` and `.rally-status` exist**

```bash
cat .team-name    # Should show "Test Team"
cat .rally-status # Should show OK lines
```

**Step 4: Push**

```bash
cd /tmp/campus-rally/rally-kit
git push
```
