# Operations Runbook

## Event-day health checks
1. Landing page loads and team form submits.
2. Rally workspace opens at `/rally/[teamSlug]`.
3. Chat starts and receives streamed response.
4. Build phase produces at least one `writeApp` update.
5. Preview renders non-empty `srcDoc` output.
6. `GET /api/telemetry` shows active teams.

## Fast incident triage
### Chat not responding
- Check server logs for `/api/chat` exceptions.
- Verify `ANTHROPIC_API_KEY` exists in runtime.
- Retry with a fresh team session.

### Preview blank
- Confirm build phase reached.
- Confirm assistant emitted `writeApp`.
- Ask assistant to regenerate complete HTML.

### Session lost
- Confirm whether same browser tab/session is in use.
- Current persistence is `sessionStorage`; cross-browser/device restore is not supported.

### Telemetry empty
- Check for deploy/cold start; in-memory store may have reset.
- Generate new team activity and refresh endpoint.

## Operator checklist before sessions
1. `npm run build` succeeds.
2. Open app and complete one full dry run (design -> build -> polish).
3. Confirm `/api/telemetry` updates during dry run.
4. Keep logs and telemetry endpoint visible during event.

## Known operational limitations
- No durable incident timeline.
- No automatic alerting.
- No per-team/IP traffic guardrails.
