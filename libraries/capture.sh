#!/bin/bash
# capture.sh — Run after each rally to harvest student choices into libraries
# Usage: ./libraries/capture.sh [team-directory]
# 
# Reads rally.config.json and DOMAIN.md from the team's build directory
# and appends new entries to the appropriate library files.

set -euo pipefail

TEAM_DIR="${1:-.}"
LIB_DIR="$(dirname "$0")"

if [ "$1" = "--help" ]; then
  echo "Usage: ./libraries/capture.sh [team-directory]"
  echo ""
  echo "Harvests student design choices from a completed rally into the shared libraries."
  echo "Reads rally.config.json and DOMAIN.md from the team directory."
  echo ""
  echo "Options:"
  echo "  --help    Show this help"
  echo "  --json    Output captured data as JSON (no library writes)"
  echo ""
  echo "Examples:"
  echo "  ./libraries/capture.sh                    # Current directory"
  echo "  ./libraries/capture.sh /tmp/rally-team3   # Specific team"
  exit 0
fi

JSON_MODE=false
if [ "$1" = "--json" ]; then
  JSON_MODE=true
  TEAM_DIR="${2:-.}"
fi

CONFIG="$TEAM_DIR/rally.config.json"
DOMAIN="$TEAM_DIR/DOMAIN.md"

if [ ! -f "$CONFIG" ]; then
  echo "Error: No rally.config.json found in $TEAM_DIR" >&2
  exit 1
fi

# Extract key fields
BUSINESS_NAME=$(jq -r '.businessName // empty' "$CONFIG" 2>/dev/null || echo "")
BUSINESS_TYPE=$(jq -r '.businessType // empty' "$CONFIG" 2>/dev/null || echo "")
NICHE=$(jq -r '.niche // empty' "$CONFIG" 2>/dev/null || echo "")
SHELL=$(jq -r '.shell // empty' "$CONFIG" 2>/dev/null || echo "")
THEME=$(jq -r '.theme // empty' "$CONFIG" 2>/dev/null || echo "")
TRACK=$(jq -r '.track // empty' "$CONFIG" 2>/dev/null || echo "")
TEAM_NAME=$(cat "$TEAM_DIR/.team-name" 2>/dev/null || echo "unknown")

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

CAPTURED=$(cat <<JSON
{
  "teamName": "$TEAM_NAME",
  "businessName": "$BUSINESS_NAME",
  "businessType": "$BUSINESS_TYPE",
  "niche": "$NICHE",
  "shell": "$SHELL",
  "theme": "$THEME",
  "track": "$TRACK",
  "capturedAt": "$TIMESTAMP"
}
JSON
)

if [ "$JSON_MODE" = true ]; then
  echo "$CAPTURED"
  exit 0
fi

# Append to rally history
HISTORY="$LIB_DIR/rally-history.jsonl"
echo "$CAPTURED" >> "$HISTORY"

# If the business name is non-empty and looks like a contributed name, add to naming library
if [ -n "$BUSINESS_NAME" ]; then
  NAMING_FILE="$LIB_DIR/naming-patterns.json"
  jq --arg name "$BUSINESS_NAME" --arg team "$TEAM_NAME" --arg ts "$TIMESTAMP" \
    '.contributed += [{"name": $name, "team": $team, "capturedAt": $ts}]' \
    "$NAMING_FILE" > "$NAMING_FILE.tmp" && mv "$NAMING_FILE.tmp" "$NAMING_FILE"
  echo "Added '$BUSINESS_NAME' to naming library"
fi

# Update rally count in all meta
for f in "$LIB_DIR"/*.json; do
  if jq -e '._meta' "$f" > /dev/null 2>&1; then
    jq '._meta.totalRallies += 1 | ._meta.lastUpdated = (now | strftime("%Y-%m-%d"))' \
      "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
done

echo "Rally captured from team '$TEAM_NAME'. Libraries updated."
exit 0
