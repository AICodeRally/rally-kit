# Rally Kit Web Docs

This folder is the source-of-truth documentation for the current Rally Kit Web implementation in `web/`.

## Docs
- `product-overview.md`
- `architecture-data-flow.md`
- `api-chat.md`
- `api-telemetry.md`
- `operations-runbook.md`
- `developer-setup-deployment.md`
- `known-gaps-roadmap.md`

## Scope note
These docs intentionally describe the current implementation:
- AI tool contract is `writeApp` (full HTML replacement)
- Preview is `iframe srcDoc`
- Session persistence is browser `sessionStorage`
- Telemetry storage is in-memory on the server

Some older docs in the repo still mention WebContainers/file tools; treat this folder as canonical for current runtime behavior.
