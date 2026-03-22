import { NextResponse } from 'next/server'
import { generateText, gateway } from 'ai'

function isAuthorized(req: Request): boolean {
  const key = req.headers.get('x-judges-key')
  return key === 'youshallnotpass'
}

// POST — test a specific provider model. Body: { model: "anthropic/claude-sonnet-4.6" }
export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let model: string
  try {
    const body = await req.json()
    model = body.model
    if (typeof model !== 'string' || !model.includes('/')) {
      return NextResponse.json({ error: 'invalid model string' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  const start = Date.now()
  try {
    const { text } = await generateText({
      model: gateway(model),
      prompt: 'Say "ok" and nothing else.',
      maxOutputTokens: 10,
    })
    return NextResponse.json({
      ok: true,
      model,
      latencyMs: Date.now() - start,
      response: text.slice(0, 50),
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      model,
      latencyMs: Date.now() - start,
      error: error instanceof Error ? error.message : 'unknown error',
    })
  }
}
