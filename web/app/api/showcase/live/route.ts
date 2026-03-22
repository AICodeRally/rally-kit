import { NextResponse } from 'next/server'
import { getShowcaseSnapshots } from '@/lib/showcase/store'

export async function GET() {
  const snapshots = getShowcaseSnapshots()

  return NextResponse.json({
    snapshots,
    totalTeams: snapshots.length,
    serverTime: new Date().toISOString(),
  })
}
