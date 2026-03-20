@echo off
REM ============================================================================
REM VIBE CODE RALLY — Windows launcher
REM Usage: Double-click this file, or run from Command Prompt
REM ============================================================================

title Vibe Code Rally

REM Load API key from .env if present
if exist "%~dp0.env" (
    for /f "usebackq tokens=1,* delims==" %%a in ("%~dp0.env") do (
        if "%%a"=="ANTHROPIC_API_KEY" set "ANTHROPIC_API_KEY=%%b"
    )
)

echo.
echo   ██╗   ██╗██╗██████╗ ███████╗   ██████╗ ██████╗ ██████╗ ███████╗
echo   ██║   ██║██║██╔══██╗██╔════╝  ██╔════╝██╔═══██╗██╔══██╗██╔════╝
echo   ██║   ██║██║██████╔╝█████╗    ██║     ██║   ██║██║  ██║█████╗
echo   ╚██╗ ██╔╝██║██╔══██╗██╔══╝    ██║     ██║   ██║██║  ██║██╔══╝
echo    ╚████╔╝ ██║██████╔╝███████╗  ╚██████╗╚██████╔╝██████╔╝███████╗
echo     ╚═══╝  ╚═╝╚═════╝ ╚══════╝   ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
echo.
echo   R A L L Y
echo.

REM ── Pre-flight checks ──────────────────────────────────────

echo   Checking your setup...
echo.

set errors=0

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo   X  Node.js not found
    echo      Install it: https://nodejs.org ^(v20+^)
    set /a errors+=1
) else (
    for /f "tokens=1 delims=v" %%v in ('node -v') do echo   OK Node.js v%%v
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo   X  npm not found
    set /a errors+=1
) else (
    echo   OK npm found
)

where claude >nul 2>&1
if %errorlevel% neq 0 (
    echo   X  Claude CLI not found
    echo      Install: npm install -g @anthropic-ai/claude-code
    set /a errors+=1
) else (
    echo   OK Claude CLI found
)

if not defined ANTHROPIC_API_KEY (
    echo   X  ANTHROPIC_API_KEY not set
    echo      Create a .env file with: ANTHROPIC_API_KEY=sk-ant-...
    set /a errors+=1
) else (
    echo   OK API key set
)

echo.

if %errors% gtr 0 (
    echo   Fix the %errors% issue^(s^) above, then run this file again.
    echo.
    pause
    exit /b 1
)

REM ── Install dependencies ───────────────────────────────────

cd /d "%~dp0"

if not exist "node_modules" (
    echo   Installing dependencies...
    npm install --silent 2>nul
    echo   OK Dependencies installed
) else (
    echo   OK Dependencies already installed
)

REM ── Team Setup ─────────────────────────────────────────────

if exist ".team-name" (
    set /p TEAM_NAME=<.team-name
    echo.
    echo   Welcome back, %TEAM_NAME%!
    echo.
) else (
    echo.
    echo   What's your team name?
    echo.
    set /p TEAM_NAME="  > "
    if not defined TEAM_NAME set TEAM_NAME=Team Rally
    echo %TEAM_NAME%>.team-name

    echo.
    echo   How many team members?
    set /p MEMBER_COUNT="  > "
    if not defined MEMBER_COUNT set MEMBER_COUNT=1

    echo.>.team-members
    for /l %%i in (1,1,%MEMBER_COUNT%) do (
        echo   Team member %%i name:
        set /p MEMBER_NAME="  > "
        call echo %%MEMBER_NAME%%>>.team-members
    )

    echo.
    echo   Choose your track:
    echo.
    echo     1  Campus AI
    echo     2  Startup AI
    echo     3  Working Toward My Future
    echo.
    set /p TRACK_CHOICE="  Enter 1, 2, or 3: "

    if "%TRACK_CHOICE%"=="1" echo Campus AI>.team-track
    if "%TRACK_CHOICE%"=="2" echo Startup AI>.team-track
    if "%TRACK_CHOICE%"=="3" echo Working Toward My Future>.team-track
    if not "%TRACK_CHOICE%"=="1" if not "%TRACK_CHOICE%"=="2" if not "%TRACK_CHOICE%"=="3" echo Campus AI>.team-track

    set /p TEAM_TRACK=<.team-track
    echo.
    echo   Let's go, %TEAM_NAME%!  Track: %TEAM_TRACK%
    echo.
)

REM ── Save port ──────────────────────────────────────────────

echo 3000>.rally-port

REM ── Clear stale cache ──────────────────────────────────────

if exist ".next" rmdir /s /q ".next" 2>nul

REM ── Start dev server in separate window ────────────────────

echo   Starting dev server...
start "Rally Dev Server" /min cmd /c "cd /d %~dp0 && npm run dev"

REM ── Wait for server ────────────────────────────────────────

echo   Waiting for dev server on port 3000...
:waitloop
timeout /t 1 /nobreak >nul
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 goto waitloop
echo   OK Dev server ready

REM ── Open browser ───────────────────────────────────────────

start http://localhost:3000

echo.
echo   ┌──────────────────────────────────────────────────┐
echo   │                                                  │
echo   │  Your app is running at localhost:3000            │
echo   │  (open in your browser — it updates live!)       │
echo   │                                                  │
echo   │  Claude is starting below.                       │
echo   │  Tell it about your business idea!               │
echo   │                                                  │
echo   │  A minimized window runs the server.             │
echo   │  Leave it alone — it keeps your app alive.       │
echo   │                                                  │
echo   └──────────────────────────────────────────────────┘
echo.

REM ── Launch Claude ──────────────────────────────────────────

claude
