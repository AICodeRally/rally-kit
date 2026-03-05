#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# VIBE CODE RALLY — Single-command launcher
# Usage: ./start.sh
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ---------------------------------------------------------------------------
# 1. Pre-flight Checks
# ---------------------------------------------------------------------------

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
ORANGE='\033[0;33m'
PURPLE='\033[0;35m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# Helpers
pass() { echo -e "  ${GREEN}✔${NC} $1"; }
fail() { echo -e "  ${RED}✘${NC} $1"; }
info() { echo -e "  ${CYAN}→${NC} $1"; }

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
    status_lines+=("api_key: SET (${masked})")
  fi
}

echo ""
echo -e "${BOLD}Pre-flight checks${NC}"
echo ""

check_node
check_npm
check_claude
check_api_key

# Write status file
printf '%s\n' "${status_lines[@]}" > "$SCRIPT_DIR/.rally-status"

if [[ "$checks_passed" != "true" ]]; then
  echo ""
  echo -e "${RED}${BOLD}Pre-flight failed.${NC} Fix the issues above and re-run ${BOLD}./start.sh${NC}"
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

echo ""

# ---------------------------------------------------------------------------
# 3. ASCII Banner
# ---------------------------------------------------------------------------

echo -e "${ORANGE}${BOLD}"
echo '  ██╗   ██╗██╗██████╗ ███████╗'
echo '  ██║   ██║██║██╔══██╗██╔════╝'
echo '  ██║   ██║██║██████╔╝█████╗  '
echo '  ╚██╗ ██╔╝██║██╔══██╗██╔══╝  '
echo '   ╚████╔╝ ██║██████╔╝███████╗'
echo '    ╚═══╝  ╚═╝╚═════╝ ╚══════╝'
echo -ne "${NC}"
echo -e "${CYAN}${BOLD}"
echo '   ██████╗ ██████╗ ██████╗ ███████╗'
echo '  ██╔════╝██╔═══██╗██╔══██╗██╔════╝'
echo '  ██║     ██║   ██║██║  ██║█████╗  '
echo '  ██║     ██║   ██║██║  ██║██╔══╝  '
echo '  ╚██████╗╚██████╔╝██████╔╝███████╗'
echo '   ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝'
echo -ne "${NC}"
echo -e "${PURPLE}${BOLD}"
echo '  ██████╗  █████╗ ██╗     ██╗  ██╗   ██╗'
echo '  ██╔══██╗██╔══██╗██║     ██║  ╚██╗ ██╔╝'
echo '  ██████╔╝███████║██║     ██║   ╚████╔╝ '
echo '  ██╔══██╗██╔══██║██║     ██║    ╚██╔╝  '
echo '  ██║  ██║██║  ██║███████╗███████╗██║   '
echo '  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝   '
echo -e "${NC}"

echo -e "  ${BOLD}The Phases${NC}"
echo -e "  ${YELLOW}1.${NC} Design your business ${DIM}(30 min)${NC}"
echo -e "  ${YELLOW}2.${NC} Build the app        ${DIM}(2 hours)${NC}"
echo -e "  ${YELLOW}3.${NC} Polish & present     ${DIM}(30 min)${NC}"
echo ""

# ---------------------------------------------------------------------------
# 4. Team Name Prompt
# ---------------------------------------------------------------------------

TEAM_FILE="$SCRIPT_DIR/.team-name"

if [[ -f "$TEAM_FILE" ]]; then
  TEAM_NAME=$(cat "$TEAM_FILE")
  echo -e "  ${GREEN}Welcome back, ${BOLD}${TEAM_NAME}${NC}${GREEN}!${NC}"
else
  echo -ne "  ${CYAN}What's your team name?${NC} ${DIM}(default: Team Rally)${NC} "
  read -r TEAM_NAME
  TEAM_NAME="${TEAM_NAME:-Team Rally}"
  echo "$TEAM_NAME" > "$TEAM_FILE"
  echo -e "  ${GREEN}Let's go, ${BOLD}${TEAM_NAME}${NC}${GREEN}!${NC}"
fi

echo ""

# ---------------------------------------------------------------------------
# 5. Dev Server + Browser + Claude Launch
# ---------------------------------------------------------------------------

DEV_SERVER_PID=""

cleanup() {
  echo ""
  echo -e "${DIM}Shutting down dev server...${NC}"
  if [[ -n "${DEV_SERVER_PID:-}" ]] && kill -0 "$DEV_SERVER_PID" 2>/dev/null; then
    kill "$DEV_SERVER_PID" 2>/dev/null || true
    wait "$DEV_SERVER_PID" 2>/dev/null || true
  fi
  echo -e "${PURPLE}${BOLD}Thanks for vibing, ${TEAM_NAME}!${NC} ${DIM}See you next rally.${NC}"
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

    # Left pane: dev server
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

    # iTerm manages sessions — no cleanup trap needed
    trap - EXIT
    ;;

  Apple_Terminal)
    info "Detected ${BOLD}Terminal.app${NC} — opening new window"
    echo ""

    # Open dev server in a new Terminal window
    osascript -e "
      tell application \"Terminal\"
        do script \"cd '$SCRIPT_DIR' && npm run dev\"
        activate
      end tell
    "

    # Wait for dev server
    info "Waiting for dev server on port 3000..."
    wait_for_port 3000
    pass "Dev server ready"

    # Open browser
    open_browser "http://localhost:3000"

    # Launch claude in this terminal
    trap - EXIT
    info "Starting Claude..."
    echo ""
    exec claude
    ;;

  *)
    # Default: background dev server + foreground claude
    trap cleanup EXIT

    info "Starting dev server..."
    (cd "$SCRIPT_DIR" && npm run dev) &
    DEV_SERVER_PID=$!

    # Wait for dev server
    info "Waiting for port 3000..."
    wait_for_port 3000
    pass "Dev server ready at ${BOLD}http://localhost:3000${NC}"

    # Open browser
    open_browser "http://localhost:3000"

    echo ""
    info "Claude is starting..."
    echo ""

    # Launch claude in foreground
    claude
    ;;
esac
