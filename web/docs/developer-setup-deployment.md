# Developer Setup + Deployment

## Local development
```bash
cd /Users/toddlebaron/Development/rally-kit/web
npm install
npm run dev
```

Required env:
- `ANTHROPIC_API_KEY` in `web/.env.local`

## Production build
```bash
npm run build
npm run start
```

## Deploy target
Current docs reference Vercel deployment for `rally.aicoderally.com`.

## Post-deploy smoke test
1. Create team on landing page.
2. Open rally workspace.
3. Verify chat response.
4. Verify first preview render from `writeApp`.
5. Verify telemetry endpoint shows activity.

## Notes for contributors
- Current runtime model is `writeApp` + `iframe srcDoc`.
- Do not assume WebContainer/file-tool architecture in new changes unless explicitly reintroduced.
- Keep docs in `web/docs/` updated alongside behavior changes.
