# API Contract: `POST /api/chat`

## Purpose
Streams assistant responses for Rally Kit sessions and exposes the `writeApp` tool contract.

## Request
- Method: `POST`
- URL: `/api/chat?team=<url-encoded-json>`
- Body: JSON with `messages` (AI SDK UI message format)

Example query `team` payload:
```json
{"name":"Team Alpha","members":["Ava","Noah"],"track":"campus"}
```

## Server behavior
Implementation (`web/app/api/chat/route.ts`):
1. Parses `team` from query string with `JSON.parse(...)`.
2. Parses request JSON and reads `messages`.
3. Converts messages via `convertToModelMessages`.
4. Calls `streamText` with:
- model: Anthropic `claude-sonnet-4-6`
- system prompt: `buildSystemPrompt(team)`
- tools: `rallyTools`
- stop condition: `stepCountIs(10)`
5. Returns `toUIMessageStreamResponse()`.

## Tool contract
Current tools (`web/lib/ai/tools.ts`):
- `writeApp`

Input:
```json
{"html":"<complete html document>"}
```

Semantics:
- HTML must be complete and self-contained.
- Each call fully replaces previous preview document.

## Current reliability notes
- No request schema validation in route.
- No rate limiting.
- No auth/session validation.
- Malformed `team` JSON can throw before a controlled error response.
