'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function TeamSetupForm() {
  const router = useRouter()
  const [teamName, setTeamName] = useState('')
  const [members, setMembers] = useState(['', '', ''])
  const [track, setTrack] = useState<'campus' | 'startup' | 'future'>('campus')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!teamName.trim()) return

    const slug = teamName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const filledMembers = members.filter((m) => m.trim())

    sessionStorage.setItem(
      `rally-${slug}`,
      JSON.stringify({ name: teamName, slug, members: filledMembers, track }),
    )

    router.push(`/rally/${slug}`)
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
          className="block text-sm font-medium mb-1"
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
          className="block text-sm font-medium mb-1"
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
              className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2"
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
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
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
