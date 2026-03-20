'use client'

import { use, useEffect, useState } from 'react'
import { RallyShell } from '@/components/rally/RallyShell'
import type { TeamInfo } from '@/lib/rally/types'

export default function RallyPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>
}) {
  const { teamSlug } = use(params)
  const [team, setTeam] = useState<TeamInfo | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem(`rally-${teamSlug}`)
    if (stored) {
      setTeam(JSON.parse(stored))
    } else {
      // Fallback: create team from slug
      setTeam({
        name: teamSlug.replace(/-/g, ' '),
        slug: teamSlug,
        members: [],
        track: 'campus',
      })
    }
  }, [teamSlug])

  if (!team) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return <RallyShell team={team} />
}
