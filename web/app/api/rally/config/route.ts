import { NextResponse } from 'next/server'
import { getConfig, updateConfig } from '@/lib/rally/config-store'

function isAuthorized(req: Request): boolean {
  const key = req.headers.get('x-judges-key')
  return key === 'youshallnotpass'
}

// GET — read current config (status of all providers, primary model, etc.)
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const config = getConfig()
  return NextResponse.json(config)
}

// PUT — update runtime config (swap primary model, enable/disable providers)
export async function PUT(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const updated = updateConfig(body)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }
}
