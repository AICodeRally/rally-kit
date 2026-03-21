# Rally Kit Web Product Overview

Rally Kit Web is a browser-based, 3-hour event product where student teams design and build a working app with AI.

## Core experience
1. Team setup on the landing page.
2. Guided design conversation in chat.
3. AI-generated app preview updates in real time.
4. Polish + demo-script preparation.

## Who it serves
- Students with little/no coding background
- Facilitators running workshops or classroom events
- Organizers who need zero-install event operations

## What is implemented now
- Chat streaming through `POST /api/chat`
- One AI tool: `writeApp({ html })`
- Full preview replacement via `iframe srcDoc`
- Phase-based UI (`design`, `build`, `polish`)
- Local session persistence in `sessionStorage`
- Lightweight telemetry via `POST/GET /api/telemetry`

## Deliberate constraints
- No durable backend session store
- No app filesystem editing model
- No user account/auth model
- No durable telemetry/analytics pipeline

## Key files
- `web/app/rally/[teamSlug]/page.tsx`
- `web/components/rally/RallyShell.tsx`
- `web/components/rally/ChatPanel.tsx`
- `web/components/rally/PreviewPanel.tsx`
- `web/app/api/chat/route.ts`
- `web/app/api/telemetry/route.ts`
- `web/lib/ai/system-prompt.ts`
- `web/lib/ai/tools.ts`
