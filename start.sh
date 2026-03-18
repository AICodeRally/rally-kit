#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# VIBE CODE RALLY — Single-command launcher
# Usage: ./start.sh
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ---------------------------------------------------------------------------
# Colors — no yellow (unreadable on light terminals)
# ---------------------------------------------------------------------------

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
ORANGE='\033[0;33m'
PURPLE='\033[0;35m'
WHITE='\033[1;37m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}✔${NC} $1"; }
fail() { echo -e "  ${RED}✘${NC} $1"; }
info() { echo -e "  ${CYAN}→${NC} $1"; }

# ---------------------------------------------------------------------------
# 1. Pre-flight Checks
# ---------------------------------------------------------------------------

checks_passed=true
declare -a status_lines

check_node() {
  if ! command -v node &>/dev/null; then
    fail "Node.js not found"
    info "Install it: ${BOLD}https://nodejs.org${NC} (v20+)"
    status_lines+=("node: MISSING")
    checks_passed=false
    return
  fi
  local node_major
  node_major=$(node -v | sed 's/^v//' | cut -d. -f1)
  if [[ "$node_major" -lt 20 ]]; then
    fail "Node.js v${node_major} found — need v20+"
    info "Upgrade: ${BOLD}https://nodejs.org${NC}"
    status_lines+=("node: v${node_major} (too old)")
    checks_passed=false
  else
    pass "Node.js $(node -v)"
    status_lines+=("node: $(node -v)")
  fi
}

check_npm() {
  if ! command -v npm &>/dev/null; then
    fail "npm not found"
    status_lines+=("npm: MISSING")
    checks_passed=false
  else
    pass "npm $(npm -v)"
    status_lines+=("npm: $(npm -v)")
  fi
}

check_claude() {
  if ! command -v claude &>/dev/null; then
    fail "Claude CLI not found"
    info "Install it: ${BOLD}npm install -g @anthropic-ai/claude-code${NC}"
    status_lines+=("claude: MISSING")
    checks_passed=false
  else
    pass "Claude CLI found"
    status_lines+=("claude: OK")
  fi
}

check_api_key() {
  if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
    fail "ANTHROPIC_API_KEY not set"
    info "Run: ${BOLD}export ANTHROPIC_API_KEY=sk-ant-...${NC}"
    status_lines+=("api_key: MISSING")
    checks_passed=false
  else
    local masked="${ANTHROPIC_API_KEY:0:10}..."
    pass "API key set (${DIM}${masked}${NC})"
    status_lines+=("api_key: SET")
  fi
}

echo ""
echo -e "  ${WHITE}Pre-flight checks${NC}"
echo ""

check_node
check_npm
check_claude
check_api_key

printf '%s\n' "${status_lines[@]}" > "$SCRIPT_DIR/.rally-status"

if [[ "$checks_passed" != "true" ]]; then
  echo ""
  echo -e "  ${RED}${BOLD}Pre-flight failed.${NC} Fix the issues above and re-run ${BOLD}./start.sh${NC}"
  exit 1
fi

echo ""

# ---------------------------------------------------------------------------
# 2. npm Install
# ---------------------------------------------------------------------------

if [[ ! -d "$SCRIPT_DIR/node_modules" ]]; then
  info "Installing dependencies..."
  (cd "$SCRIPT_DIR" && npm install --silent)
  pass "Dependencies installed"
else
  pass "Dependencies already installed"
fi

# ---------------------------------------------------------------------------
# 3. Welcome Screen
# ---------------------------------------------------------------------------

clear

echo ""
echo ""
echo -e "${ORANGE}${BOLD}"
echo '    ██╗   ██╗██╗██████╗ ███████╗   ██████╗ ██████╗ ██████╗ ███████╗'
echo '    ██║   ██║██║██╔══██╗██╔════╝  ██╔════╝██╔═══██╗██╔══██╗██╔════╝'
echo '    ██║   ██║██║██████╔╝█████╗    ██║     ██║   ██║██║  ██║█████╗  '
echo '    ╚██╗ ██╔╝██║██╔══██╗██╔══╝    ██║     ██║   ██║██║  ██║██╔══╝  '
echo '     ╚████╔╝ ██║██████╔╝███████╗  ╚██████╗╚██████╔╝██████╔╝███████╗'
echo '      ╚═══╝  ╚═╝╚═════╝ ╚══════╝   ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝'
echo -e "${NC}"
echo -e "    ${PURPLE}${BOLD}R  A  L  L  Y${NC}"
echo ""
echo -e "    ${WHITE}GCU  |  3 Hours  |  Build Something Real${NC}"
echo ""
echo ""

# ---------------------------------------------------------------------------
# 4. Team Setup (interactive)
# ---------------------------------------------------------------------------

TEAM_FILE="$SCRIPT_DIR/.team-name"
TEAM_MEMBERS_FILE="$SCRIPT_DIR/.team-members"
TEAM_TRACK_FILE="$SCRIPT_DIR/.team-track"

if [[ -f "$TEAM_FILE" && -f "$TEAM_TRACK_FILE" ]]; then
  # Returning team
  TEAM_NAME=$(cat "$TEAM_FILE")
  TEAM_TRACK=$(cat "$TEAM_TRACK_FILE")
  echo -e "    ${GREEN}${BOLD}Welcome back, ${TEAM_NAME}!${NC}"
  echo -e "    ${WHITE}Track: ${CYAN}${TEAM_TRACK}${NC}"
  if [[ -f "$TEAM_MEMBERS_FILE" ]]; then
    echo -e "    ${WHITE}Members: ${DIM}$(cat "$TEAM_MEMBERS_FILE" | tr '\n' ', ' | sed 's/,$//')${NC}"
  fi
  echo ""
else
  # ── Team Name ──────────────────────────────────────
  echo -e "    ${WHITE}${BOLD}What's your team name?${NC}"
  echo ""
  echo -ne "    ${CYAN}>${NC} "
  read -r TEAM_NAME
  TEAM_NAME="${TEAM_NAME:-Team Rally}"
  echo "$TEAM_NAME" > "$TEAM_FILE"
  echo ""

  # ── Team Members ───────────────────────────────────
  echo -e "    ${WHITE}${BOLD}How many team members?${NC}"
  echo ""
  echo -ne "    ${CYAN}>${NC} "
  read -r MEMBER_COUNT
  MEMBER_COUNT="${MEMBER_COUNT:-1}"

  # Validate it's a number
  if ! [[ "$MEMBER_COUNT" =~ ^[0-9]+$ ]]; then
    MEMBER_COUNT=1
  fi

  echo "" > "$TEAM_MEMBERS_FILE"
  echo ""

  for i in $(seq 1 "$MEMBER_COUNT"); do
    echo -e "    ${WHITE}Team member ${BOLD}${i}${NC}${WHITE} name:${NC}"
    echo -ne "    ${CYAN}>${NC} "
    read -r MEMBER_NAME
    if [[ -n "$MEMBER_NAME" ]]; then
      echo "$MEMBER_NAME" >> "$TEAM_MEMBERS_FILE"
    fi
  done

  echo ""

  # ── Track Selection ────────────────────────────────
  echo -e "    ${WHITE}${BOLD}Choose your track:${NC}"
  echo ""
  echo -e "    ${ORANGE}${BOLD}  1  ${NC}${WHITE}${BOLD}Campus AI${NC}"
  echo -e "         ${WHITE}Build a tool to solve a student's pain points${NC}"
  echo -e "         ${DIM}Study planner, resume builder, email assistant,${NC}"
  echo -e "         ${DIM}personal organizer for homework/projects/life tasks${NC}"
  echo ""
  echo -e "    ${CYAN}${BOLD}  2  ${NC}${WHITE}${BOLD}Startup AI${NC}"
  echo -e "         ${WHITE}Build something to kick start your business${NC}"
  echo -e "         ${DIM}Marketing tool, content generator, pricing engine,${NC}"
  echo -e "         ${DIM}90-day ideation tool for startup activities${NC}"
  echo ""
  echo -e "    ${PURPLE}${BOLD}  3  ${NC}${WHITE}${BOLD}Working Toward My Future${NC}"
  echo -e "         ${WHITE}Build a tool to help you get hired${NC}"
  echo -e "         ${DIM}AI-powered job finder, career path evaluator,${NC}"
  echo -e "         ${DIM}personal CRM, AI proficiency demo app${NC}"
  echo ""
  echo -ne "    ${WHITE}Enter ${BOLD}1${NC}${WHITE}, ${BOLD}2${NC}${WHITE}, or ${BOLD}3${NC}${WHITE}:${NC} "
  read -r TRACK_CHOICE

  case "${TRACK_CHOICE}" in
    1) TEAM_TRACK="Campus AI" ;;
    2) TEAM_TRACK="Startup AI" ;;
    3) TEAM_TRACK="Working Toward My Future" ;;
    *) TEAM_TRACK="Campus AI" ;;
  esac

  echo "$TEAM_TRACK" > "$TEAM_TRACK_FILE"

  echo ""
  echo ""
  echo -e "    ${GREEN}${BOLD}Let's go, ${TEAM_NAME}!${NC}"
  echo -e "    ${WHITE}Track: ${CYAN}${BOLD}${TEAM_TRACK}${NC}"
  echo ""
fi

# ---------------------------------------------------------------------------
# 5. The Phases
# ---------------------------------------------------------------------------

echo -e "    ${WHITE}${BOLD}The Phases${NC}"
echo ""
echo -e "    ${ORANGE}${BOLD}  1 ${NC} ${WHITE}Design your business${NC}         ${DIM}30 min${NC}"
echo -e "    ${CYAN}${BOLD}  2 ${NC} ${WHITE}Build the app${NC}                ${DIM}2 hours${NC}"
echo -e "    ${PURPLE}${BOLD}  3 ${NC} ${WHITE}Polish & present${NC}             ${DIM}30 min${NC}"
echo ""
echo ""

sleep 2

# ---------------------------------------------------------------------------
# 6. Dev Server + Browser + Claude Launch
# ---------------------------------------------------------------------------

DEV_SERVER_PID=""

cleanup() {
  echo ""
  if [[ -n "${DEV_SERVER_PID:-}" ]] && kill -0 "$DEV_SERVER_PID" 2>/dev/null; then
    kill "$DEV_SERVER_PID" 2>/dev/null || true
    wait "$DEV_SERVER_PID" 2>/dev/null || true
  fi
  echo -e "    ${PURPLE}${BOLD}Thanks for vibing, ${TEAM_NAME}!${NC}"
  echo ""
}

open_browser() {
  local url="$1"
  if command -v open &>/dev/null; then
    open "$url"
  elif command -v xdg-open &>/dev/null; then
    xdg-open "$url"
  elif command -v start &>/dev/null; then
    start "$url"
  else
    info "Open ${BOLD}${url}${NC} in your browser"
  fi
}

wait_for_port() {
  local port="$1"
  local tries=0
  local max_tries=30
  while [[ $tries -lt $max_tries ]]; do
    if curl -s "http://localhost:${port}" >/dev/null 2>&1; then
      return 0
    fi
    tries=$((tries + 1))
    sleep 1
  done
  fail "Dev server didn't start within ${max_tries}s"
  return 1
}

# Detect terminal and launch accordingly
case "${TERM_PROGRAM:-}" in
  iTerm.app)
    info "Detected ${BOLD}iTerm2${NC} — splitting panes"
    echo ""

    osascript -e "
      tell application \"iTerm\"
        tell current session of current window
          split horizontally with default profile
        end tell
        tell first session of current tab of current window
          write text \"cd '$SCRIPT_DIR' && npm run dev\"
        end tell
        tell second session of current tab of current window
          write text \"cd '$SCRIPT_DIR' && sleep 3 && claude\"
        end tell
      end tell
    "

    trap - EXIT
    ;;

  Apple_Terminal)
    info "Starting dev server in new window..."
    echo ""

    osascript -e "
      tell application \"Terminal\"
        do script \"cd '$SCRIPT_DIR' && npm run dev\"
        activate
      end tell
    "

    info "Waiting for dev server on port 3000..."
    wait_for_port 3000
    pass "Dev server ready"

    open_browser "http://localhost:3000"

    # macOS popup so students know what's happening
    osascript -e "
      display dialog \"Two windows opened:

• APP SERVER window — runs your app. DO NOT CLOSE IT.
• THIS window — where you talk to Claude.

Your app is live at localhost:3000 in your browser.

Tell Claude about your business idea!\" buttons {\"Got it!\"} default button 1 with title \"Vibe Code Rally\" with icon note
    " &

    # Resize Terminal window for readability
    osascript -e '
tell application "Terminal"
  set bounds of front window to {50, 50, 1400, 900}
  set font size of front window to 16
end tell
' 2>/dev/null || true

    trap - EXIT
    echo ""
    echo -e "  ┌─────────────────────────────────────────────────┐"
    echo -e "  │                                                 │"
    echo -e "  │  ${WHITE}${BOLD}Two Terminal windows are now open:${NC}             │"
    echo -e "  │                                                 │"
    echo -e "  │  ${ORANGE}${BOLD}Window 1${NC} ${WHITE}= App Server${NC}                          │"
    echo -e "  │    ${DIM}Shows scrolling text. DO NOT CLOSE IT.${NC}       │"
    echo -e "  │    ${DIM}It keeps your app running at localhost:3000${NC} │"
    echo -e "  │                                                 │"
    echo -e "  │  ${CYAN}${BOLD}Window 2${NC} ${WHITE}= Claude (THIS window)${NC}                │"
    echo -e "  │    ${DIM}This is where you talk to Claude.${NC}            │"
    echo -e "  │    ${DIM}Tell it about your business idea!${NC}            │"
    echo -e "  │                                                 │"
    echo -e "  └─────────────────────────────────────────────────┘"
    echo ""
    exec claude
    ;;

  *)
    trap cleanup EXIT

    info "Starting dev server..."
    (cd "$SCRIPT_DIR" && npm run dev) &
    DEV_SERVER_PID=$!

    info "Waiting for port 3000..."
    wait_for_port 3000
    pass "Dev server ready at ${BOLD}http://localhost:3000${NC}"

    open_browser "http://localhost:3000"

    echo ""
    echo -e "  ┌─────────────────────────────────────────────────┐"
    echo -e "  │                                                 │"
    echo -e "  │  ${WHITE}${BOLD}App server is running in the background.${NC}       │"
    echo -e "  │  ${DIM}Your app is live at localhost:3000${NC}              │"
    echo -e "  │                                                 │"
    echo -e "  │  ${CYAN}${BOLD}Claude is starting below.${NC}                      │"
    echo -e "  │  ${DIM}Tell it about your business idea!${NC}              │"
    echo -e "  │                                                 │"
    echo -e "  └─────────────────────────────────────────────────┘"
    echo ""

    claude
    ;;
esac
