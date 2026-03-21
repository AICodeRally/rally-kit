'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TeamRole } from '@/lib/rally/types'

const AVAILABLE_ROLES: { value: TeamRole; label: string; desc: string }[] = [
  { value: 'CEO', label: 'CEO', desc: 'Final decisions on features' },
  { value: 'Designer', label: 'Designer', desc: 'Layout, colors, UX feedback' },
  { value: 'Presenter', label: 'Presenter', desc: 'Prepares the demo pitch' },
  { value: 'Researcher', label: 'Researcher', desc: 'Ideas, competitor research' },
]

export function TeamSetupForm() {
  const router = useRouter()
  const [teamName, setTeamName] = useState('')
  const [members, setMembers] = useState(['', '', ''])
  const [roles, setRoles] = useState<Record<number, TeamRole>>({})
  const [showRoles, setShowRoles] = useState(false)
  const [track, setTrack] = useState<'campus' | 'startup' | 'future'>('campus')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!teamName.trim()) return

    const base = teamName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      || 'team'
    // Append 4-char random suffix to avoid slug collisions on shared devices
    const suffix = Math.random().toString(36).slice(2, 6)
    const slug = `${base}-${suffix}`

    const filledMembers = members.filter((m) => m.trim())

    // Build roles map: member name → role (only for members that have a role assigned)
    const roleMap: Record<string, TeamRole> = {}
    members.forEach((m, i) => {
      if (m.trim() && roles[i]) roleMap[m.trim()] = roles[i]
    })

    const teamData = {
      name: teamName,
      slug,
      members: filledMembers,
      ...(Object.keys(roleMap).length > 0 ? { roles: roleMap } : {}),
      track,
    }

    try {
      sessionStorage.setItem(`rally-${slug}`, JSON.stringify(teamData))
    } catch { /* storage denied or quota — still navigate, page will use slug fallback */ }

    // Encode team info in URL so the link can be shared with all team members
    const params = new URLSearchParams()
    if (filledMembers.length > 0) params.set('m', filledMembers.join(','))
    params.set('t', track)
    params.set('n', teamName)
    if (Object.keys(roleMap).length > 0) params.set('r', JSON.stringify(roleMap))
    const qs = params.toString()
    router.push(`/rally/${slug}${qs ? `?${qs}` : ''}`)
  }

  function updateMember(index: number, value: string) {
    const updated = [...members]
    updated[index] = value
    setMembers(updated)
  }

  function addMember() {
    if (members.length < 5) setMembers([...members, ''])
  }

  const TRACKS = [
    { value: 'campus' as const, label: 'Campus AI', desc: 'Student life tools' },
    { value: 'startup' as const, label: 'Startup AI', desc: 'Business builders' },
    { value: 'future' as const, label: 'Working Toward My Future', desc: 'Career prep' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div>
        <label
          className="block text-base font-medium mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          Team Name
        </label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="e.g. Thunder Squad"
          className="w-full px-4 py-3 text-lg rounded-lg focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--bg-muted)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          }}
          required
          autoFocus
        />
      </div>

      <div>
        <label
          className="block text-base font-medium mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          Team Members
        </label>
        <div className="space-y-2">
          {members.map((member, i) => (
            <input
              key={i}
              type="text"
              value={member}
              onChange={(e) => updateMember(i, e.target.value)}
              placeholder={`Member ${i + 1}`}
              className="w-full px-4 py-3 text-base rounded-lg focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            />
          ))}
          {members.length < 5 && (
            <button
              type="button"
              onClick={addMember}
              className="text-sm"
              style={{ color: 'var(--accent)' }}
            >
              + Add member
            </button>
          )}
        </div>

        {/* Optional role assignment */}
        {members.some((m) => m.trim()) && (
          <div className="mt-3">
            {!showRoles ? (
              <button
                type="button"
                onClick={() => setShowRoles(true)}
                className="text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                + Assign roles (optional)
              </button>
            ) : (
              <div className="space-y-2 mt-2">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Roles help the AI engage each team member. Judges look for teamwork!
                </p>
                {members.map((member, i) => {
                  if (!member.trim()) return null
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span
                        className="text-sm w-24 truncate shrink-0"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {member.trim()}
                      </span>
                      <select
                        value={roles[i] || ''}
                        onChange={(e) => {
                          const val = e.target.value as TeamRole | ''
                          setRoles((prev) => {
                            const next = { ...prev }
                            if (val) next[i] = val as TeamRole
                            else delete next[i]
                            return next
                          })
                        }}
                        className="flex-1 px-3 py-2 text-sm rounded-lg"
                        style={{
                          backgroundColor: 'var(--bg-muted)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <option value="">No role</option>
                        {AVAILABLE_ROLES.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label} — {r.desc}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <label
          className="block text-base font-medium mb-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          Track
        </label>
        <div className="space-y-2">
          {TRACKS.map((t) => (
            <label
              key={t.value}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
              style={{
                border: `1px solid ${track === t.value ? 'var(--accent)' : 'var(--border)'}`,
                backgroundColor: track === t.value ? 'var(--user-bubble)' : 'transparent',
              }}
            >
              <input
                type="radio"
                name="track"
                value={t.value}
                checked={track === t.value}
                onChange={() => setTrack(t.value)}
                className="accent-blue-600"
              />
              <div>
                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {t.label}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {t.desc}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-6 text-white text-lg font-semibold rounded-lg transition-colors"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        Start Building &rarr;
      </button>
    </form>
  )
}
