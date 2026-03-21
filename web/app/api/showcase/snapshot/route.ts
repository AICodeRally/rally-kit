import { NextResponse } from 'next/server'
import { upsertShowcaseSnapshot } from '@/lib/showcase/store'

const VALID_PHASES = new Set(['design', 'build', 'polish'])
const VALID_TRACKS = new Set(['campus', 'startup', 'future'])
const VALID_SHELLS = new Set(['mobile', 'dashboard', 'portfolio'])

export async function POST(req: Request) {
  const requiredToken = process.env.SHOWCASE_INGEST_TOKEN
  if (requiredToken) {
    const provided = req.headers.get('x-showcase-token')
    if (provided !== requiredToken) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  try {
    const body = await req.json() as {
      teamId?: string
      teamName?: string
      track?: string
      phase?: string
      shell?: string
      appHtml?: string
    }

    if (!body.teamId || !body.teamName || !body.track || !body.phase || !body.appHtml) {
      return NextResponse.json({ error: 'missing required fields' }, { status: 400 })
    }

    // Reject oversized payloads before they hit the store
    if (body.appHtml.length > 1_500_000) {
      return NextResponse.json({ error: 'appHtml too large' }, { status: 413 })
    }

    if (!VALID_TRACKS.has(body.track) || !VALID_PHASES.has(body.phase)) {
      return NextResponse.json({ error: 'invalid track or phase' }, { status: 400 })
    }

    const shell = body.shell && VALID_SHELLS.has(body.shell)
      ? (body.shell as 'mobile' | 'dashboard' | 'portfolio')
      : undefined

    const ok = upsertShowcaseSnapshot({
      teamId: body.teamId,
      teamName: body.teamName,
      track: body.track as 'campus' | 'startup' | 'future',
      phase: body.phase as 'design' | 'build' | 'polish',
      shell,
      appHtml: body.appHtml,
    })

    if (!ok) {
      return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }
}
