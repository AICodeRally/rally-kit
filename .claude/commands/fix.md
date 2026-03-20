# Fix — Troubleshoot Issues

Something broke. Fix it fast.

## Instructions

### Step 1: Identify the problem

Check these in order:

1. **Did the student paste an error?** Look at their last message for error text (red text, stack traces, "Module not found", "TypeError", etc.)

2. **Is the dev server running?** Read `.rally-port`, then try to understand if the server might be down based on what the student described.

3. **Is it a blank page?** Could be a missing component, broken import, or render error.

### Step 2: Fix it

**For code errors (most common):**
- Read the file mentioned in the error
- Fix the issue (missing import, typo, wrong prop, etc.)
- Tell them: "Fixed! Refresh your browser at **http://localhost:[PORT]** — should be working now."
- ONE-LINE explanation: "That was a [type of error] — [what happened]. Fixed!"

**For "Module not found":**
- The component or file doesn't exist yet. Create it.
- Don't try to install packages — everything needed is already installed.
- If it's a component import, create the component in `src/components/`.

**For blank page / nothing renders:**
- Check `src/app/page.tsx` — is it redirecting correctly?
- Check the page component — does it have proper exports?
- Check for `'use client'` if using hooks

**For "Interrupted" message:**
- Just say: "No worries, picking up where I left off!"
- Continue the last operation

**For server crash:**
- Tell them: "Your server stopped. Let me restart it."
- Note: You cannot run `npm run dev` yourself (it's a long-running process). Instead say:
  > "Click on the small minimized Terminal window at the bottom of your screen. If it shows an error, close that window, then in THIS terminal type: **npm run dev** and press Enter. Then come back here and tell me when it's running."

### Step 3: Confirm the fix

Always end with:
> "Try refreshing **http://localhost:[PORT]** now. Working?"
