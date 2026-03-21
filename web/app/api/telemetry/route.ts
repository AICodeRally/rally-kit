import { NextResponse } from 'next/server'

// In-memory store — resets on each deploy/cold start, which is fine for a 3-hour event.
// During the event, GET /api/telemetry shows live status of every team.
const teamEvents: Map<string, { status: string; detail?: string; elapsedSec?: number; ts: number }[]> = new Map()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { team, status, detail, elapsedSec } = body as {
      team?: string
      status?: string
      detail?: string
      elapsedSec?: number
    }

    if (!team || !status) {
      return NextResponse.json({ error: 'team and status required' }, { status: 400 })
    }

    const events = teamEvents.get(team) ?? []
    events.push({ status, detail, elapsedSec, ts: Date.now() })
    // Keep last 50 events per team
    if (events.length > 50) events.splice(0, events.length - 50)
    teamEvents.set(team, events)

    console.log(`[telemetry] ${team}: ${status} (${elapsedSec ?? '?'}s)${detail ? ` — ${detail}` : ''}`)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }
}

export async function GET() {
  const summary: Record<string, { current: string; detail?: string; elapsedSec?: number; lastSeen: string; eventCount: number; timeline: string[] }> = {}

  for (const [team, events] of teamEvents) {
    const last = events[events.length - 1]
    summary[team] = {
      current: last.status,
      detail: last.detail,
      elapsedSec: last.elapsedSec,
      lastSeen: new Date(last.ts).toISOString(),
      eventCount: events.length,
      timeline: events.map(e => `${e.status}@${e.elapsedSec ?? '?'}s`),
    }
  }

  return NextResponse.json({
    teams: summary,
    totalTeams: teamEvents.size,
    serverTime: new Date().toISOString(),
  })
}
