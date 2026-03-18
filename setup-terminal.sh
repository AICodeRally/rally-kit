#!/usr/bin/env bash
# ============================================================================
# Rally Terminal Setup — dark theme, big font, readable
# Sets: font 18pt, dark background, white text, window size
# ============================================================================

# Only works in Apple Terminal
if [[ "${TERM_PROGRAM:-}" != "Apple_Terminal" ]]; then
  exit 0
fi

osascript <<'APPLESCRIPT'
tell application "Terminal"
  set currentSettings to current settings of selected tab of front window

  -- Font: Menlo 18pt
  set font name of currentSettings to "Menlo-Regular"
  set font size of currentSettings to 18

  -- Window size
  set number of columns of currentSettings to 120
  set number of rows of currentSettings to 36
  set bounds of front window to {50, 50, 1400, 900}

  -- Dark background (#1a1a2e)
  set background color of currentSettings to {6682, 6682, 11822}

  -- White text
  set normal text color of currentSettings to {62258, 62258, 62258}

  -- Bold text: bright white
  set bold text color of currentSettings to {65535, 65535, 65535}

  -- Cursor: cyan accent
  set cursor color of currentSettings to {0, 55512, 58982}

  -- ANSI colors tuned for dark background
  -- 0 Black
  set ANSI black color of currentSettings to {6682, 6682, 11822}
  -- 1 Red
  set ANSI red color of currentSettings to {65535, 22359, 20560}
  -- 2 Green
  set ANSI green color of currentSettings to {11051, 61166, 11051}
  -- 3 Yellow: bright gold (readable on dark!)
  set ANSI yellow color of currentSettings to {65535, 52428, 0}
  -- 4 Blue
  set ANSI blue color of currentSettings to {10280, 42148, 65535}
  -- 5 Magenta
  set ANSI magenta color of currentSettings to {48059, 13107, 55512}
  -- 6 Cyan
  set ANSI cyan color of currentSettings to {0, 55512, 58982}
  -- 7 White
  set ANSI white color of currentSettings to {55512, 55512, 55512}

  -- Bright variants
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
