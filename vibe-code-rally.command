#!/usr/bin/env bash

# ============================================================================
# VIBE CODE RALLY — Double-click installer
# ============================================================================

# Get ANTHROPIC_API_KEY from shell profiles (without sourcing — zshrc has
# zsh-only commands that crash in bash)
if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
  for f in "$HOME/.bash_profile" "$HOME/.bashrc" "$HOME/.profile" "$HOME/.zshrc"; do
    if [[ -f "$f" ]]; then
      _key=$(grep -m1 'ANTHROPIC_API_KEY=' "$f" 2>/dev/null | sed 's/.*ANTHROPIC_API_KEY=["]*//;s/["]*$//' | tr -d "'") || true
      if [[ -n "${_key:-}" ]]; then
        export ANTHROPIC_API_KEY="$_key"
        break
      fi
    fi
  done
fi

# Also check .env files
if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
  for envfile in "$HOME/Desktop/.env" "$HOME/Desktop/rally-kit/.env"; do
    if [[ -f "$envfile" ]]; then
      _key=$(grep -m1 'ANTHROPIC_API_KEY=' "$envfile" 2>/dev/null | sed 's/.*ANTHROPIC_API_KEY=["]*//;s/["]*$//' | tr -d "'") || true
      if [[ -n "${_key:-}" ]]; then
        export ANTHROPIC_API_KEY="$_key"
        break
      fi
    fi
  done
fi

# Set dark terminal — before any output
# Method 1: OSC escape sequences (works immediately, no permissions needed)
printf '\033]11;rgb:1a/1a/2e\007'    # background: dark navy
printf '\033]10;rgb:f3/f3/f3\007'    # foreground: light gray
printf '\033]12;rgb:00/d8/e6\007'    # cursor: cyan
printf '\033]4;0;rgb:1a/1a/2e\007'   # ANSI black
printf '\033]4;1;rgb:ff/57/50\007'   # ANSI red
printf '\033]4;2;rgb:2b/ee/2b\007'   # ANSI green
printf '\033]4;3;rgb:ff/cc/00\007'   # ANSI yellow
printf '\033]4;4;rgb:28/a4/ff\007'   # ANSI blue
printf '\033]4;5;rgb:bb/33/d8\007'   # ANSI magenta
printf '\033]4;6;rgb:00/d8/e6\007'   # ANSI cyan
printf '\033]4;7;rgb:d8/d8/d8\007'   # ANSI white

# Method 2: AppleScript for font/window size (Apple Terminal only)
if [[ "${TERM_PROGRAM:-}" == "Apple_Terminal" ]]; then
  osascript <<'APPLESCRIPT' 2>/dev/null || true
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
  echo -e "${RED}${BOLD}Fix the ${errors} issue(s) above, then double-click this file again.${NC}"
  echo ""
  echo -e "${DIM}Press any key to close...${NC}"
  read -n 1 -s
  exit 1
fi

# ---------------------------------------------------------------------------
# 2. Download rally-kit
# ---------------------------------------------------------------------------

cd ~/Desktop

DEST="rally-kit"

if [[ -d "$DEST" && -f "$DEST/start.sh" ]]; then
  pass "rally-kit folder found"
else
  info "Downloading Rally Kit..."
  pkill -f "next.*rally-kit" 2>/dev/null || true
  pkill -f "node.*rally-kit" 2>/dev/null || true
  sleep 1
  rm -rf "$DEST" 2>/dev/null || true
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
