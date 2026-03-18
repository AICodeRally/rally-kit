#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# VIBE CODE RALLY — One-line installer
# Usage: curl -fsSL https://aicoderally.com/rally | bash
# ============================================================================

# Load API key from .env if present and not already set
if [[ -z "${ANTHROPIC_API_KEY:-}" && -f ".env" ]]; then
  export $(grep -v '^#' ".env" | grep ANTHROPIC_API_KEY | xargs)
fi

# Set dark terminal FIRST — before any output
if [[ "${TERM_PROGRAM:-}" == "Apple_Terminal" ]]; then
  osascript <<'APPLESCRIPT' 2>/dev/null
tell application "Terminal"
  set currentSettings to current settings of selected tab of front window
  set font name of currentSettings to "Menlo-Regular"
  set font size of currentSettings to 18
  set number of columns of currentSettings to 120
  set number of rows of currentSettings to 36
  set bounds of front window to {50, 50, 1400, 900}
  set background color of currentSettings to {6682, 6682, 11822}
  set normal text color of currentSettings to {62258, 62258, 62258}
  set bold text color of currentSettings to {65535, 65535, 65535}
  set cursor color of currentSettings to {0, 55512, 58982}
  set ANSI black color of currentSettings to {6682, 6682, 11822}
  set ANSI red color of currentSettings to {65535, 22359, 20560}
  set ANSI green color of currentSettings to {11051, 61166, 11051}
  set ANSI yellow color of currentSettings to {65535, 52428, 0}
  set ANSI blue color of currentSettings to {10280, 42148, 65535}
  set ANSI magenta color of currentSettings to {48059, 13107, 55512}
  set ANSI cyan color of currentSettings to {0, 55512, 58982}
  set ANSI white color of currentSettings to {55512, 55512, 55512}
  set ANSI bright black color of currentSettings to {26214, 26214, 32896}
  set ANSI bright red color of currentSettings to {65535, 30069, 28270}
  set ANSI bright green color of currentSettings to {20560, 65535, 20560}
  set ANSI bright yellow color of currentSettings to {65535, 58982, 22359}
  set ANSI bright blue color of currentSettings to {22359, 50372, 65535}
  set ANSI bright magenta color of currentSettings to {55512, 22359, 65535}
  set ANSI bright cyan color of currentSettings to {22359, 65535, 65535}
  set ANSI bright white color of currentSettings to {65535, 65535, 65535}
end tell
APPLESCRIPT
fi

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}✔${NC} $1"; }
fail() { echo -e "  ${RED}✘${NC} $1"; }
info() { echo -e "  ${CYAN}→${NC} $1"; }

echo ""
echo -e "${YELLOW}${BOLD}"
echo '  ██╗   ██╗██╗██████╗ ███████╗   ██████╗ ██████╗ ██████╗ ███████╗'
echo '  ██║   ██║██║██╔══██╗██╔════╝  ██╔════╝██╔═══██╗██╔══██╗██╔════╝'
echo '  ██║   ██║██║██████╔╝█████╗    ██║     ██║   ██║██║  ██║█████╗  '
echo '  ╚██╗ ██╔╝██║██╔══██╗██╔══╝    ██║     ██║   ██║██║  ██║██╔══╝  '
echo '   ╚████╔╝ ██║██████╔╝███████╗  ╚██████╗╚██████╔╝██████╔╝███████╗'
echo '    ╚═══╝  ╚═╝╚═════╝ ╚══════╝   ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝'
echo -e "${NC}"
echo -e "  ${PURPLE}${BOLD}R A L L Y${NC}"
echo ""

# ---------------------------------------------------------------------------
# 1. Pre-flight: check what's installed
# ---------------------------------------------------------------------------

echo -e "${BOLD}Checking your setup...${NC}"
echo ""

errors=0

# Node.js
if ! command -v node &>/dev/null; then
  fail "Node.js not found"
  info "Install it: ${BOLD}https://nodejs.org${NC} (v20+)"
  errors=$((errors + 1))
else
  node_major=$(node -v | sed 's/^v//' | cut -d. -f1)
  if [[ "$node_major" -lt 20 ]]; then
    fail "Node.js v${node_major} — need v20+"
    info "Upgrade: ${BOLD}https://nodejs.org${NC}"
    errors=$((errors + 1))
  else
    pass "Node.js $(node -v)"
  fi
fi

# npm
if ! command -v npm &>/dev/null; then
  fail "npm not found (comes with Node.js)"
  errors=$((errors + 1))
else
  pass "npm $(npm -v)"
fi

# git
if ! command -v git &>/dev/null; then
  fail "git not found"
  info "Install: ${BOLD}xcode-select --install${NC} (Mac) or ${BOLD}https://git-scm.com${NC}"
  errors=$((errors + 1))
else
  pass "git $(git --version | awk '{print $3}')"
fi

# Claude CLI
if ! command -v claude &>/dev/null; then
  fail "Claude CLI not found"
  info "Install: ${BOLD}npm install -g @anthropic-ai/claude-code${NC}"
  errors=$((errors + 1))
else
  pass "Claude CLI"
fi

# API Key
if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
  fail "ANTHROPIC_API_KEY not set"
  info "Run: ${BOLD}export ANTHROPIC_API_KEY=sk-ant-...${NC}"
  info "Get a key: ${BOLD}https://console.anthropic.com/settings/keys${NC}"
  errors=$((errors + 1))
else
  masked="${ANTHROPIC_API_KEY:0:10}..."
  pass "API key (${DIM}${masked}${NC})"
fi

echo ""

if [[ $errors -gt 0 ]]; then
  echo -e "${RED}${BOLD}Fix the ${errors} issue(s) above, then re-run:${NC}"
  echo ""
  echo -e "  ${CYAN}curl -fsSL https://aicoderally.com/rally | bash${NC}"
  echo ""
  exit 1
fi

# ---------------------------------------------------------------------------
# 2. Download rally-kit
# ---------------------------------------------------------------------------

DEST="rally-kit"

if [[ -d "$DEST" ]]; then
  info "rally-kit folder exists — refreshing with latest code..."
  # Kill processes that lock the folder: dev server, Finder, antivirus
  pkill -f "next.*rally-kit" 2>/dev/null || true
  pkill -f "node.*rally-kit" 2>/dev/null || true
  osascript -e 'tell application "Finder" to close every window whose name contains "rally-kit"' 2>/dev/null || true
  sleep 2
  rm -rf "$DEST" 2>/dev/null
  if [[ -d "$DEST" ]]; then
    sleep 3
    rm -rf "$DEST" 2>/dev/null || true
  fi
  git clone --depth 1 https://github.com/AICodeRally/rally-kit.git "$DEST" 2>/dev/null
  rm -rf "$DEST/.git"
  pass "Refreshed with latest version"
else
  info "Downloading Rally Kit..."
  git clone --depth 1 https://github.com/AICodeRally/rally-kit.git "$DEST" 2>/dev/null
  rm -rf "$DEST/.git"
  pass "Downloaded"
fi

cd "$DEST"

# ---------------------------------------------------------------------------
# 3. Install dependencies
# ---------------------------------------------------------------------------

if [[ ! -d "node_modules" ]]; then
  info "Installing dependencies (this takes ~15 seconds)..."
  npm install --silent 2>/dev/null
  pass "Dependencies installed"
else
  pass "Dependencies already installed"
fi

echo ""

# ---------------------------------------------------------------------------
# 4. Hand off to start.sh
# ---------------------------------------------------------------------------

echo -e "${GREEN}${BOLD}You're all set!${NC}"
echo ""
echo -e "  ${CYAN}Starting your Rally Kit...${NC}"
echo ""

exec ./start.sh
