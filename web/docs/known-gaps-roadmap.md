# Known Gaps + Roadmap

## Current gaps
1. No durable session store (browser `sessionStorage` only).
2. No durable telemetry (in-memory server map).
3. No auth/session trust boundary for teams.
4. No request validation/rate limiting on `/api/chat`.
5. No CI-enforced test gate for critical event path.
6. Documentation drift exists in older files that still describe WebContainer/file operations.

## Prioritized roadmap
### P0
1. Add request schema validation + safe parse in `/api/chat`.
2. Add rate limiting (per-IP and per-team).
3. Add durable session persistence for transcript/phase/app snapshot.
4. Add durable telemetry store + event-day dashboard.

### P1
1. Add command contract tests (`/build`, `/polish`, `/reset`).
2. Add E2E flow test for onboarding -> build -> polish.
3. Align old docs to current `writeApp/srcDoc` architecture.

### P2
1. Facilitator control surface for managing active teams.
2. Support UX improvements for error recovery and resume.
