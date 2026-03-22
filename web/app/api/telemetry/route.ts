import { NextResponse } from 'next/server'

// In-memory store — resets on each deploy/cold start, which is fine for a 3-hour event.
// During the event, GET /api/telemetry shows live status of every team.

interface TeamState {
  displayName?: string
  track?: string
  phase: string
  phaseStartedAt: number
  appIterations: number
  lastSeen: number
  events: { status: string; detail?: string; ts: number }[]
}

const MAX_TEAMS = 50 // 15 teams expected, 50 is generous safety margin
const teamStore: Map<string, TeamState> = new Map()

export async function POST(req: Request) {
  // Simple shared secret — prevents random bots from polluting the live board
  if (req.headers.get('x-rally-key') !== 'gcu2526') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { team, status, detail, track } = body as {
      team?: string
      status?: string
      detail?: string
      track?: string
    }

    if (!team || !status) {
      return NextResponse.json({ error: 'team and status required' }, { status: 400 })
    }

    const state = teamStore.get(team) ?? {
      phase: 'design',
      phaseStartedAt: Date.now(),
      appIterations: 0,
      lastSeen: Date.now(),
      events: [],
    }

    // Update track if provided (sent on first telemetry call)
    if (track) state.track = track

    // session:start sends team display name as detail
    if (status === 'session:start' && detail) state.displayName = detail

    // Detect phase changes
    if (status.startsWith('phase:')) {
      state.phase = status.replace('phase:', '')
      state.phaseStartedAt = Date.now()
    }

    // Count app iterations
    if (status === 'app:updated') {
      state.appIterations++
    }

    state.lastSeen = Date.now()
    state.events.push({ status, detail, ts: Date.now() })
    // Keep last 100 events per team
    if (state.events.length > 100) state.events.splice(0, state.events.length - 100)
    teamStore.set(team, state)

    // Evict oldest team if over capacity (prevents unbounded memory growth)
    if (teamStore.size > MAX_TEAMS) {
      let oldestKey = ''
      let oldestSeen = Infinity
      for (const [k, v] of teamStore) {
        if (v.lastSeen < oldestSeen) { oldestSeen = v.lastSeen; oldestKey = k }
      }
      if (oldestKey) teamStore.delete(oldestKey)
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }
}

export async function GET() {
  const teams: Record<string, {
    track?: string
    phase: string
    phaseStartedAt: string
    appIterations: number
    lastSeen: string
    eventCount: number
    phaseElapsedSec: number
  }> = {}

  const now = Date.now()
  for (const [slug, state] of teamStore) {
    const label = state.displayName || slug
    teams[label] = {
      track: state.track,
      phase: state.phase,
      phaseStartedAt: new Date(state.phaseStartedAt).toISOString(),
      appIterations: state.appIterations,
      lastSeen: new Date(state.lastSeen).toISOString(),
      eventCount: state.events.length,
      phaseElapsedSec: Math.floor((now - state.phaseStartedAt) / 1000),
    }
  }

  return NextResponse.json({
    teams,
    totalTeams: teamStore.size,
    serverTime: new Date().toISOString(),
  })
}
