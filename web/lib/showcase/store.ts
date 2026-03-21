export type ShowcasePhase = 'design' | 'build' | 'polish'

export interface ShowcaseSnapshot {
  teamId: string
  teamName: string
  track: 'campus' | 'startup' | 'future'
  phase: ShowcasePhase
  shell?: 'mobile' | 'dashboard' | 'portfolio'
  appHtml: string
  updatedAt: number
}

interface SnapshotStore {
  byTeam: Map<string, ShowcaseSnapshot>
  maxTeams: number
  maxHtmlChars: number
}

const store: SnapshotStore = {
  byTeam: new Map(),
  maxTeams: 60,
  maxHtmlChars: 1_500_000,
}

function clampText(input: string, maxChars: number): string {
  return input.length > maxChars ? input.slice(0, maxChars) : input
}

function clampHtml(input: string, maxChars: number): string {
  return input.length > maxChars ? input.slice(0, maxChars) : input
}

function evictOldestIfNeeded() {
  if (store.byTeam.size <= store.maxTeams) return

  let oldestKey = ''
  let oldestTs = Number.POSITIVE_INFINITY

  for (const [teamId, snapshot] of store.byTeam) {
    if (snapshot.updatedAt < oldestTs) {
      oldestTs = snapshot.updatedAt
      oldestKey = teamId
    }
  }

  if (oldestKey) store.byTeam.delete(oldestKey)
}

export function upsertShowcaseSnapshot(input: Omit<ShowcaseSnapshot, 'updatedAt'>) {
  const safeTeamId = clampText(input.teamId.trim(), 80)
  const safeTeamName = clampText(input.teamName.trim(), 80)
  const safeHtml = clampHtml(input.appHtml, store.maxHtmlChars)

  if (!safeTeamId || !safeTeamName || !safeHtml) return false

  store.byTeam.set(safeTeamId, {
    ...input,
    teamId: safeTeamId,
    teamName: safeTeamName,
    appHtml: safeHtml,
    updatedAt: Date.now(),
  })

  evictOldestIfNeeded()
  return true
}

export function getShowcaseSnapshots() {
  return Array.from(store.byTeam.values()).sort((a, b) => b.updatedAt - a.updatedAt)
}
