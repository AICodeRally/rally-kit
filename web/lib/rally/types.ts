export type TeamRole = 'CEO' | 'Designer' | 'Presenter' | 'Researcher'

export interface TeamInfo {
  name: string
  slug: string
  members: string[]
  roles?: Record<string, TeamRole>   // member name → role (optional)
  track: 'campus' | 'startup' | 'future'
}

export type Phase = 'design' | 'build' | 'polish'

export interface RallyState {
  team: TeamInfo
  phase: Phase
  phaseStartedAt: number
}

export interface DesignIdea {
  id: string
  title: string
  description: string
  category: 'problem' | 'pages' | 'data' | 'shell' | 'theme'
}
