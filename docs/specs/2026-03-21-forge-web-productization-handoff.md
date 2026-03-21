# Rally Kit Web Productization Handoff (Forge)

Date: March 21, 2026  
Owner: Forge Product + Engineering  
Source Repo: `rally-kit`  
Primary Target: `web/` app at `rally.aicoderally.com`

## Objective
Take Rally Kit Web from event-ready demo quality to production quality for repeatable student events, with strong usability, clear support flows, and operational reliability at scale.

## Success Criteria
1. Teams can complete Design -> Build -> Polish with no facilitator intervention in at least 85% of sessions.
2. Session resume works after refresh/navigation loss with less than 30 seconds recovery time.
3. API and sandbox failures are actionable in-UI (no dead ends).
4. Facilitator docs match actual app behavior (no workflow drift).

## Current State Summary
1. Web app is functional and builds in `web/`.
2. Core reliability and product controls are incomplete.
3. Important doc/product mismatches exist (persistence, phase behavior, support flow).

## Workstreams (Prioritized)

### WS1: Phase Engine + Command Contract (P0)
Owner: Frontend Engineer  
Support: Product Designer

Deliverables:
1. Explicit phase state machine: `design`, `build`, `polish`.
2. Deterministic handling for `/build`, `/polish`, `/status`, `/reset` (+ confirmation).
3. Per-phase timer reset on phase transition.

Acceptance Criteria:
1. `/polish` always moves app to polish phase and updates header/status UI.
2. `/reset` always requires explicit confirmation before destructive reset.
3. Timer reflects time remaining for current phase, not original start time.
4. Phase changes are captured in persisted session state.

### WS2: Durable Session + Resume (P0)
Owner: Full-Stack Engineer  
Support: Product

Deliverables:
1. Persisted session model for team metadata, chat transcript, phase, and progress.
2. Resume experience that restores full state after refresh/crash.
3. Clear session lifecycle: create, active, archived/reset.

Acceptance Criteria:
1. Refreshing rally route restores transcript, phase, ideas, modified files list, and preview state indicator.
2. Returning to `/rally/[teamSlug]` from another tab recovers the latest active session.
3. Facilitator runbook instructions match implemented persistence behavior.

### WS3: API Hardening + Cost/Abuse Controls (P0)
Owner: Backend Engineer  
Support: Platform/SRE

Deliverables:
1. Request schema validation and safe parsing in `/api/chat`.
2. Structured error responses and UI-readable error categories.
3. Per-team and per-IP rate limits.
4. Basic observability for request volume, failures, and token usage.

Acceptance Criteria:
1. Invalid team payloads do not throw unhandled 500s.
2. UI shows friendly recovery actions for validation/rate-limit/upstream errors.
3. Rate limits are enforced and logged with clear event metadata.
4. Dashboard or logs exist for event-day health checks.

### WS4: Tool Execution Guardrails (P1)
Owner: Frontend Engineer  
Support: Security Reviewer

Deliverables:
1. Enforce file path allowlist in WebContainer operations.
2. Block writes outside intended student workspace scope.
3. Add guardrail tests for path traversal and invalid tool inputs.

Acceptance Criteria:
1. Tool calls cannot modify blocked paths.
2. Violations return clear model-visible errors without crashing chat flow.
3. Regression tests cover allow/deny matrix.

### WS5: Student Support UX (P1)
Owner: Product Designer + Frontend Engineer  
Support: Facilitator Team

Deliverables:
1. In-product support panel: "what to do next", stuck states, error playbook.
2. Browser compatibility gate with deterministic fallback messaging.
3. Better recovery states for boot timeout, install failure, preview unavailable.

Acceptance Criteria:
1. Unsupported browsers are blocked with exact next steps.
2. Boot/install failures show retry + help options in under 1 second.
3. Students can self-recover common failures without facilitator help.

### WS6: Content + Template Drift Control (P1)
Owner: Frontend Engineer  
Support: Curriculum Owner

Deliverables:
1. Remove CLI wording from student starter template and generated app content.
2. Define a single source-of-truth process for WebContainer file templates.
3. Add CI drift check between reference templates and mounted files.

Acceptance Criteria:
1. No student-facing copy references terminal-based flow in web mode.
2. Template updates require one source change, not manual multi-file edits.
3. Drift check fails CI when template and mounted content diverge.

### WS7: Test Coverage + Release Gate (P1)
Owner: QA/Automation Engineer  
Support: Engineering Lead

Deliverables:
1. Smoke E2E for full event path: onboarding -> design -> build -> polish.
2. Integration tests for chat route and command transitions.
3. Release checklist for event-day go/no-go.

Acceptance Criteria:
1. CI blocks release on E2E critical path failure.
2. Command contract tests prevent regression of slash-command behavior.
3. Event checklist is versioned and used before each deployment.

## Rollout Sequence
1. Sprint 1 (P0): WS1 + WS2 + WS3.
2. Sprint 2 (P1): WS4 + WS5 + WS6.
3. Sprint 3 (P1 hardening): WS7 + load/reliability rehearsal with facilitator dry run.

## Dependencies
1. Decision on persistence backend (Vercel KV/Postgres/Firestore/other).
2. Decision on authentication mode for student sessions (anonymous team token vs sign-in).
3. Event policy for rate-limit thresholds and overflow behavior.

## Risks + Mitigations
1. Risk: Scope creep in persistence and auth.
Mitigation: Keep v1 session model minimal and event-focused.
2. Risk: Prompt-only command logic drifts from UI behavior.
Mitigation: Move command contract into code, keep prompt descriptive only.
3. Risk: Event-day outage from untested edge cases.
Mitigation: Add mandatory pre-event dry run and release gate.

## Non-Goals (This Cycle)
1. Multi-tenant classroom management portal.
2. Full LMS integration.
3. Real database-backed student app data inside WebContainers.

## Exit Gate (Ready To Productize)
1. All P0 acceptance criteria passed.
2. At least one full mock event run completed with no blocker defects.
3. Facilitator guide and student UX are aligned and validated in rehearsal.
