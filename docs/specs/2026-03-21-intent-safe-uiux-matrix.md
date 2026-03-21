# Rally Kit Web — Intent-Safe UI/UX Matrix

Date: March 21, 2026  
Purpose: Align UI/UX improvements to documented product intent without changing core rally flow.

## Source-of-truth Intent
1. Web app is chat-first with live preview and zero install ([README.md:3](/Users/toddlebaron/Development/rally-kit/README.md:3), [README.md:17](/Users/toddlebaron/Development/rally-kit/README.md:17), [docs/specs/2026-03-20-rally-kit-web-design.md:17](/Users/toddlebaron/Development/rally-kit/docs/specs/2026-03-20-rally-kit-web-design.md:17)).
2. 3-phase event flow is fixed (Design 30, Build 90, Polish 30) ([README.md:90](/Users/toddlebaron/Development/rally-kit/README.md:90), [web/README.md:29](/Users/toddlebaron/Development/rally-kit/web/README.md:29)).
3. Build layout intent: narrow chat + large preview ([docs/specs/2026-03-20-rally-kit-web-design.md:125](/Users/toddlebaron/Development/rally-kit/docs/specs/2026-03-20-rally-kit-web-design.md:125), [docs/specs/2026-03-20-rally-kit-web-design.md:126](/Users/toddlebaron/Development/rally-kit/docs/specs/2026-03-20-rally-kit-web-design.md:126)).
4. Mobile intent allows stack or tab-toggle ([docs/specs/2026-03-20-rally-kit-web-design.md:135](/Users/toddlebaron/Development/rally-kit/docs/specs/2026-03-20-rally-kit-web-design.md:135)).
5. Slash commands are first-class student controls ([README.md:97](/Users/toddlebaron/Development/rally-kit/README.md:97), [web/README.md:144](/Users/toddlebaron/Development/rally-kit/web/README.md:144), [docs/FACILITATOR.md:85](/Users/toddlebaron/Development/rally-kit/docs/FACILITATOR.md:85)).
6. Current design spec explicitly says no persistence needed for event mode ([docs/specs/2026-03-20-rally-kit-web-design.md:54](/Users/toddlebaron/Development/rally-kit/docs/specs/2026-03-20-rally-kit-web-design.md:54)).

## Decision Matrix (Do/Adjust/Defer)

| UX Issue | Current Implementation | Intent Alignment | Decision | Intent-Safe Action |
|---|---|---|---|---|
| Mobile 50/50 split makes both panes cramped | Build and design use `h-1/2` on mobile ([BuildWorkspace.tsx:39](/Users/toddlebaron/Development/rally-kit/web/components/rally/BuildWorkspace.tsx:39), [BuildWorkspace.tsx:52](/Users/toddlebaron/Development/rally-kit/web/components/rally/BuildWorkspace.tsx:52), [DesignWorkspace.tsx:38](/Users/toddlebaron/Development/rally-kit/web/components/rally/DesignWorkspace.tsx:38), [DesignWorkspace.tsx:51](/Users/toddlebaron/Development/rally-kit/web/components/rally/DesignWorkspace.tsx:51)) | Spec permits stack or tab-toggle on small screens ([docs/specs/...web-design.md:135](/Users/toddlebaron/Development/rally-kit/docs/specs/2026-03-20-rally-kit-web-design.md:135)) | **Do now** | Keep desktop layout untouched; on `<768px` switch to chat/preview tabs or weighted stack (not 50/50). |
| Slash commands shown but not fully reflected in UI state | Toolbar includes `/polish` etc. ([SlashToolbar.tsx:14](/Users/toddlebaron/Development/rally-kit/web/components/rally/SlashToolbar.tsx:14)); state handler only supports `'build'` ([RallyShell.tsx:53](/Users/toddlebaron/Development/rally-kit/web/components/rally/RallyShell.tsx:53)) | Misaligned with command intent in docs | **Do now** | Implement deterministic command->phase contract for `/build`, `/polish`, `/status`, `/reset(confirm)` without altering prompt style. |
| Phase timer doesn’t reset by phase | `phaseStartedAt` set once ([RallyShell.tsx:19](/Users/toddlebaron/Development/rally-kit/web/components/rally/RallyShell.tsx:19)); indicator uses one timestamp ([PhaseIndicator.tsx:23](/Users/toddlebaron/Development/rally-kit/web/components/rally/PhaseIndicator.tsx:23)) | Misaligned with fixed phase schedule intent | **Do now** | Reset phase start time on each phase transition. |
| Browser compatibility warning is soft only | Warns on `SharedArrayBuffer` but allows continue ([BrowserCheck.tsx:8](/Users/toddlebaron/Development/rally-kit/web/components/landing/BrowserCheck.tsx:8)) | Partially aligned; docs emphasize browser constraints ([docs/FACILITATOR.md:29](/Users/toddlebaron/Development/rally-kit/docs/FACILITATOR.md:29), [docs/specs/...web-design.md:316](/Users/toddlebaron/Development/rally-kit/docs/specs/2026-03-20-rally-kit-web-design.md:316)) | **Do now** | Keep zero-friction intent; add “hard block only when unsupported” with explicit fallback path. |
| Focus states and tap-target sizes are weak | Several controls are minimal/no visible focus styles ([PreviewPanel.tsx:33](/Users/toddlebaron/Development/rally-kit/web/components/rally/PreviewPanel.tsx:33), [RallyHeader.tsx:60](/Users/toddlebaron/Development/rally-kit/web/components/rally/RallyHeader.tsx:60)) | Fully aligned with accessibility and student usability intent | **Do now** | Add `focus-visible` rings and minimum 44px targets where practical; no layout concept changes. |
| “Code” tab label implies diff but only shows file names | Only recent file list shown ([PreviewPanel.tsx:70](/Users/toddlebaron/Development/rally-kit/web/components/rally/PreviewPanel.tsx:70)) | Misaligned with design spec wording (“read-only diff”) ([docs/specs/...web-design.md:130](/Users/toddlebaron/Development/rally-kit/docs/specs/2026-03-20-rally-kit-web-design.md:130)) | **Do now** | Either relabel to “File Activity” or add true read-only diff. Prefer relabel in MVP. |
| Build transition dismisses on click-anywhere | Click dismisses when steps visible ([BuildTransition.tsx:62](/Users/toddlebaron/Development/rally-kit/web/components/rally/BuildTransition.tsx:62)) | Aligned with facilitator guidance that students can click through ([docs/FACILITATOR.md:79](/Users/toddlebaron/Development/rally-kit/docs/FACILITATOR.md:79)) | **Keep** | Keep behavior; add subtle “dismissed while setup continues” confirmation only. |
| Header hides context on small screens | Team name and product label hidden on `sm` ([RallyHeader.tsx:33](/Users/toddlebaron/Development/rally-kit/web/components/rally/RallyHeader.tsx:33), [RallyHeader.tsx:67](/Users/toddlebaron/Development/rally-kit/web/components/rally/RallyHeader.tsx:67)) | Partially aligned with minimal header intent | **Adjust** | Keep compact header but preserve one context token (team initials or short name) on mobile. |
| Persistence mismatch in docs vs app | App only stores team setup in session storage ([TeamSetupForm.tsx:23](/Users/toddlebaron/Development/rally-kit/web/components/landing/TeamSetupForm.tsx:23)); facilitator says auto-save conversation ([docs/FACILITATOR.md:132](/Users/toddlebaron/Development/rally-kit/docs/FACILITATOR.md:132)) | Spec says in-memory/no persistence for event mode ([docs/specs/...web-design.md:54](/Users/toddlebaron/Development/rally-kit/docs/specs/2026-03-20-rally-kit-web-design.md:54)) | **Adjust docs now / Defer product persistence** | Correct facilitator docs immediately; persistence backend remains a productization decision, not forced into event MVP. |

## Guardrails To Preserve Intent
1. Keep chat-first interaction and fixed 3-phase narrative.
2. Keep desktop build layout: 400px chat, preview gets remaining width.
3. Do not add login/database requirements for event MVP.
4. Do not remove click-through transition behavior; only clarify it.
5. Prefer copy/interaction improvements before structural redesigns.

## Recommended “Intent-Safe” UI Sprint (One Pass)
1. Command-state parity (`/build`, `/polish`, `/status`, `/reset confirm`).
2. Phase timer reset behavior.
3. Mobile workspace mode (tabs or weighted stack) under 768px.
4. Accessibility pass for focus and touch targets.
5. Preview tab copy correction (“Code” -> “File Activity”) unless diff shipped.
6. Update facilitator docs to remove auto-save claim until implemented.

## Out of Scope For This Intent-Preserving Pass
1. Multi-session persistence platform.
2. Major visual redesign of landing/workspace.
3. New IA patterns that change chat-first flow.
