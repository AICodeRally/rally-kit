import { NextResponse } from 'next/server'

// Fetches registered students from the website's campus registration API.
// Requires CAMPUS_ADMIN_KEY env var to authenticate.

interface Registration {
  id: number
  first_name: string
  last_name: string
  email: string
  preferred_track: string | null
  year: string | null
  major: string | null
  notes: string | null  // music preference
  registered_at: string
}

export async function GET(req: Request) {
  // Require judges passcode to protect student PII
  const auth = req.headers.get('x-judges-key')
  if (!auth || auth !== (process.env.JUDGES_PASSCODE || 'youshallnotpass')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const adminKey = process.env.CAMPUS_ADMIN_KEY
  if (!adminKey) {
    return NextResponse.json({ error: 'CAMPUS_ADMIN_KEY not configured' }, { status: 500 })
  }

  try {
    const res = await fetch('https://aicoderally.com/api/campus/register', {
      headers: { 'x-admin-key': adminKey },
      next: { revalidate: 30 },  // cache for 30s
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch roster' }, { status: 502 })
    }

    const data = await res.json() as { count: number; registrations: Registration[] }

    // Return simplified roster for the attendance panel
    const roster = (data.registrations ?? []).map((r) => ({
      name: `${r.first_name} ${r.last_name}`,
      firstName: r.first_name,
      email: r.email,
      track: r.preferred_track,
      year: r.year,
      music: r.notes,
    }))

    return NextResponse.json({ count: data.count, roster })
  } catch {
    return NextResponse.json({ error: 'Connection error' }, { status: 502 })
  }
}
