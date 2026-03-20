export interface TeamInfo {
  name: string
  slug: string
  members: string[]
  track: 'campus' | 'startup' | 'future'
}

export type Phase = 'design' | 'build' | 'polish'

export type SandboxStatus =
  | 'booting'
  | 'mounting'
  | 'installing'
  | 'starting'
  | 'ready'
  | 'error'

export interface RallyState {
  team: TeamInfo
  phase: Phase
  phaseStartedAt: number
  sandbox: {
    status: SandboxStatus
    previewUrl: string | null
  }
  modifiedFiles: string[]
}
