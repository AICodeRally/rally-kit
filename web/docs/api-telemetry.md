# API Contract: `/api/telemetry`

## Purpose
Captures lightweight team activity for live event visibility.

## `POST /api/telemetry`
Request JSON:
```json
{
  "team": "Team Alpha",
  "status": "phase:build",
  "detail": "optional",
  "elapsedSec": 120
}
```

Validation:
- `team` required
- `status` required
- else HTTP `400`

Success:
```json
{"ok":true}
```

## `GET /api/telemetry`
Returns summary of in-memory event history by team with:
- `current`
- `detail`
- `elapsedSec`
- `lastSeen`
- `eventCount`
- `timeline`

## Storage behavior
- Backed by in-memory `Map`
- Retains last 50 events per team
- Resets on deploy/cold start/restart
- Not durable analytics storage
