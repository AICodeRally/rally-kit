'use client'

import { use, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { RallyShell } from '@/components/rally/RallyShell'
import type { TeamInfo } from '@/lib/rally/types'

export default function RallyPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>
}) {
  const { teamSlug } = use(params)
  const searchParams = useSearchParams()
  const [team, setTeam] = useState<TeamInfo | null>(null)

  useEffect(() => {
    // 1. Try sessionStorage (same device, returning session)
    let stored: string | null = null
    try { stored = sessionStorage.getItem(`rally-${teamSlug}`) } catch {}
    if (stored) {
      try {
        setTeam(JSON.parse(stored))
        return
      } catch {
        try { sessionStorage.removeItem(`rally-${teamSlug}`) } catch {}
      }
    }

    // 2. Try URL params (shared link from team lead)
    const nameParam = searchParams.get('n')
    const membersParam = searchParams.get('m')
    const trackParam = searchParams.get('t')

    // Parse optional roles from URL
    const rolesParam = searchParams.get('r')
    let parsedRoles: Record<string, string> | undefined
    if (rolesParam) {
      try { parsedRoles = JSON.parse(rolesParam) } catch {}
    }

    const teamData: TeamInfo = {
      name: nameParam || teamSlug.replace(/-/g, ' '),
      slug: teamSlug,
      members: membersParam ? membersParam.split(',').map(s => s.trim()).filter(Boolean) : [],
      ...(parsedRoles ? { roles: parsedRoles as TeamInfo['roles'] } : {}),
      track: (['campus', 'startup', 'future'].includes(trackParam || '') ? trackParam : 'campus') as TeamInfo['track'],
    }

    // Persist to sessionStorage so page refreshes don't lose it
    try {
      sessionStorage.setItem(`rally-${teamSlug}`, JSON.stringify(teamData))
    } catch {}

    setTeam(teamData)
  }, [teamSlug, searchParams])

  if (!team) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return <RallyShell team={team} key={team.slug} />
}
