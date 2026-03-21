import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import type { UIMessage } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { buildSystemPrompt } from '@/lib/ai/system-prompt'
import { rallyTools } from '@/lib/ai/tools'

// Multi-key rotation: distribute teams across API keys to avoid rate limits.
// Set ANTHROPIC_API_KEY_1, _2, _3 etc. in env vars. Falls back to ANTHROPIC_API_KEY.
// Gateway-ready: when AI Gateway is configured, swap this function to use gateway().
function getModel(teamSlug: string) {
  const numberedKeys = [
    process.env.ANTHROPIC_API_KEY_1,
    process.env.ANTHROPIC_API_KEY_2,
    process.env.ANTHROPIC_API_KEY_3,
    process.env.ANTHROPIC_API_KEY_4,
    process.env.ANTHROPIC_API_KEY_5,
  ].filter(Boolean) as string[]

  if (numberedKeys.length > 0) {
    // Deterministic hash — same team always gets same key
    const hash = [...teamSlug].reduce((a, c) => a + c.charCodeAt(0), 0)
    const key = numberedKeys[hash % numberedKeys.length]
    const anthropic = createAnthropic({ apiKey: key })
    return anthropic('claude-sonnet-4-6')
  }

  // Fallback: single key from ANTHROPIC_API_KEY
  const anthropic = createAnthropic()
  return anthropic('claude-sonnet-4-6')
}

export async function POST(req: Request) {
  const url = new URL(req.url)

  let team: { name: string; slug: string; members: string[]; roles?: Record<string, string>; track: 'campus' | 'startup' | 'future' }
  try {
    const raw = JSON.parse(url.searchParams.get('team') || '{}')
    // Parse optional roles map
    let roles: Record<string, string> | undefined
    if (raw.roles && typeof raw.roles === 'object' && !Array.isArray(raw.roles)) {
      roles = {}
      for (const [k, v] of Object.entries(raw.roles)) {
        if (typeof k === 'string' && typeof v === 'string') roles[k] = v
      }
      if (Object.keys(roles).length === 0) roles = undefined
    }
    team = {
      name: typeof raw.name === 'string' ? raw.name : 'Team',
      slug: typeof raw.slug === 'string' ? raw.slug : 'team',
      members: Array.isArray(raw.members) ? raw.members.filter((m: unknown) => typeof m === 'string') : [],
      ...(roles ? { roles } : {}),
      track: ['campus', 'startup', 'future'].includes(raw.track) ? raw.track : 'campus',
    }
  } catch {
    return new Response('Invalid team parameter', { status: 400 })
  }

  let messages: UIMessage[]
  try {
    const body = await req.json()
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response('messages must be a non-empty array', { status: 400 })
    }
    // Basic shape check — each message needs role and at least an id
    for (const msg of body.messages) {
      if (!msg || typeof msg.role !== 'string' || typeof msg.id !== 'string') {
        return new Response('each message must have role and id', { status: 400 })
      }
    }
    messages = body.messages
  } catch {
    return new Response('Invalid request body', { status: 400 })
  }

  let modelMessages
  try {
    modelMessages = await convertToModelMessages(messages)
  } catch {
    return new Response('Invalid message format', { status: 400 })
  }

  const result = streamText({
    model: getModel(team.slug),
    system: buildSystemPrompt(team),
    messages: modelMessages,
    tools: rallyTools,
    stopWhen: stepCountIs(3),
  })

  return result.toUIMessageStreamResponse()
}
