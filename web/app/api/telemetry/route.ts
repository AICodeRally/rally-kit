import { NextResponse } from 'next/server'

// In-memory store — resets on each deploy/cold start, which is fine for a 3-hour event.
// During the event, GET /api/telemetry shows live status of every team.
const teamEvents: Map<string, { status: string; detail?: string; ts: number }[]> = new Map()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { team, status, detail } = body as {
      team?: string
      status?: string
      detail?: string
    }

    if (!team || !status) {
      return NextResponse.json({ error: 'team and status required' }, { status: 400 })
    }

    const events = teamEvents.get(team) ?? []
    events.push({ status, detail, ts: Date.now() })
    // Keep last 50 events per team
    if (events.length > 50) events.splice(0, events.length - 50)
    teamEvents.set(team, events)

    console.log(`[telemetry] ${team}: ${status}${detail ? ` — ${detail}` : ''}`)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }
}

export async function GET() {
  const summary: Record<string, { current: string; detail?: string; lastSeen: string; eventCount: number }> = {}

  for (const [team, events] of teamEvents) {
    const last = events[events.length - 1]
    summary[team] = {
      current: last.status,
      detail: last.detail,
      lastSeen: new Date(last.ts).toISOString(),
      eventCount: events.length,
    }
  }

  return NextResponse.json({
    teams: summary,
    totalTeams: teamEvents.size,
    serverTime: new Date().toISOString(),
  })
}
