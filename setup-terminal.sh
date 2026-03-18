#!/usr/bin/env bash
# ============================================================================
# Rally Terminal Setup — configure Apple Terminal for readability
# Sets: font, size, colors, window bounds
# All ANSI colors are chosen for readability on a light background
# ============================================================================

# Only works in Apple Terminal
if [[ "${TERM_PROGRAM:-}" != "Apple_Terminal" ]]; then
  exit 0
fi

# AppleScript color values are 0-65535 (16-bit)
# Helper: convert 0-255 RGB to 0-65535
r() { echo $(( $1 * 257 )); }

osascript <<'APPLESCRIPT'
tell application "Terminal"
  -- Get the current window's settings (profile)
  set currentSettings to current settings of selected tab of front window

  -- Font: Menlo 18pt (ships with every Mac)
  set font name of currentSettings to "Menlo-Regular"
  set font size of currentSettings to 18

  -- Window size
  set number of columns of currentSettings to 120
  set number of rows of currentSettings to 36
  set bounds of front window to {50, 50, 1400, 900}

  -- Background: warm white (#FAF8F5 → warm, not harsh)
  set background color of currentSettings to {64250, 63479, 62708}

  -- Text: dark slate (#0F172A)
  set normal text color of currentSettings to {3855, 5911, 10794}

  -- Bold text: pure black for max contrast
  set bold text color of currentSettings to {0, 0, 0}

  -- Cursor: blue accent (#0284C7)
  set cursor color of currentSettings to {514, 33924, 51143}

  -- ANSI Normal Colors (0-7)
  -- These redefine what \033[30m through \033[37m look like

  -- 0 Black: dark slate
  set ANSI black color of currentSettings to {3855, 5911, 10794}

  -- 1 Red: readable red (#D32F2F)
  set ANSI red color of currentSettings to {54227, 12079, 12079}

  -- 2 Green: forest green (#137333)
  set ANSI green color of currentSettings to {4883, 29555, 13107}

  -- 3 Yellow: DARK AMBER (#B36B00) — readable on white!
  set ANSI yellow color of currentSettings to {45875, 27499, 0}

  -- 4 Blue: vivid blue (#0256C7)
  set ANSI blue color of currentSettings to {514, 22102, 51143}

  -- 5 Magenta: deep purple (#9513A6)
  set ANSI magenta color of currentSettings to {38293, 4883, 42662}

  -- 6 Cyan: teal (#008E98)
  set ANSI cyan color of currentSettings to {0, 36494, 39064}

  -- 7 White: light gray (#EEEEEE)
  set ANSI white color of currentSettings to {61166, 61166, 61166}

  -- ANSI Bright Colors (8-15)
  -- 8 Bright Black (dim text): medium gray (#556270)
  set ANSI bright black color of currentSettings to {21845, 25186, 28784}

  -- 9 Bright Red (#E74C3C)
  set ANSI bright red color of currentSettings to {59367, 19532, 15420}

  -- 10 Bright Green (#27AE60)
  set ANSI bright green color of currentSettings to {10023, 44718, 24672}

  -- 11 Bright Yellow: GOLD (#CC8400) — still readable on white!
  set ANSI bright yellow color of currentSettings to {52428, 33924, 0}

  -- 12 Bright Blue (#2980B9)
  set ANSI bright blue color of currentSettings to {10537, 32896, 47545}

  -- 13 Bright Magenta (#8E44AD)
  set ANSI bright magenta color of currentSettings to {36494, 17476, 44461}

  -- 14 Bright Cyan (#1ABC9C)
  set ANSI bright cyan color of currentSettings to {6682, 48316, 40092}

  -- 15 Bright White (#FFFFFF)
  set ANSI bright white color of currentSettings to {65535, 65535, 65535}

end tell
APPLESCRIPT
