import { streamText, convertToModelMessages, stepCountIs, gateway } from 'ai'
import type { UIMessage } from 'ai'
import { buildSystemPrompt } from '@/lib/ai/system-prompt'
import { rallyTools } from '@/lib/ai/tools'

// Vercel AI Gateway — OIDC auth is automatic on Vercel deployments.
// Model routing, failover, cost tracking, and rate limit pooling handled by the gateway.
// No per-team API key rotation needed — the gateway manages provider capacity.
const model = gateway('anthropic/claude-sonnet-4.6')

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
    model,
    system: buildSystemPrompt(team),
    messages: modelMessages,
    tools: rallyTools,
    stopWhen: stepCountIs(3),
  })

  return result.toUIMessageStreamResponse()
}
