#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# VIBE CODE RALLY — One-line installer
# Usage: curl -fsSL https://aicoderally.com/rally | bash
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}✔${NC} $1"; }
fail() { echo -e "  ${RED}✘${NC} $1"; }
info() { echo -e "  ${CYAN}→${NC} $1"; }

echo ""
echo -e "${BLUE}${BOLD}"
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
  # Kill any running dev server that might lock files
  pkill -f "next dev.*rally-kit" 2>/dev/null || true
  pkill -f "node.*rally-kit" 2>/dev/null || true
  sleep 1
  rm -rf "$DEST"
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
