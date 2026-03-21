# Rally Kit Web Architecture + Data Flow

## Runtime architecture
- Host app: Next.js App Router (`web/app/*`)
- Server routes: `/api/chat`, `/api/telemetry`
- Client rendering: React UI + preview iframe
- AI output model: complete HTML document per `writeApp` call

## End-to-end flow
1. User submits team data on `/`.
2. Team record is stored in `sessionStorage` under `rally-<slug>`.
3. User navigates to `/rally/[teamSlug]`.
4. Page hydrates team from `sessionStorage` (fallback derives from slug).
5. `RallyShell` restores persisted phase/html/shell state.
6. `ChatPanel` auto-sends `/rally` to start coaching flow.
7. Chat streams via `/api/chat`.
8. Assistant may emit `writeApp` tool call.
9. Client handles `writeApp`, stores HTML, refreshes preview.
10. Preview panel renders `iframe srcDoc={appHtml}`.
11. Telemetry events are posted on phase/app updates.

## State ownership
`RallyShell` owns:
- `phase`
- `phaseStartedAt`
- `ideas`
- `selectedShell`
- `appHtml`

Persisted in browser `sessionStorage`:
- `rally-<slug>-phase`
- `rally-<slug>-shell`
- `rally-<slug>-appHtml`

## Command behavior
Client-side routing in `ChatPanel` handles:
- `/build` -> phase to `build`
- `/polish` -> phase to `polish`
- `/reset` -> clears all `sessionStorage` keys prefixed with `rally-` and reloads

Phase auto-advances to `build` on first successful `writeApp` tool output.

## Preview security posture
Preview iframe currently uses:
- `sandbox="allow-scripts"`

This allows script execution in the preview document while keeping host/preview isolation boundaries stricter than an unsandboxed iframe.
