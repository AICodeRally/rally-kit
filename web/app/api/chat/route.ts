import { streamText, convertToModelMessages, stepCountIs, gateway } from 'ai'
import type { UIMessage } from 'ai'
import { buildSystemPrompt } from '@/lib/ai/system-prompt'
import { rallyTools } from '@/lib/ai/tools'
import { getModelConfig } from '@/lib/rally/config-store'

// ── Vercel AI Gateway — Full Failover Infrastructure ──────────────────
// Runtime config from lib/rally/config-store.ts — judges can swap models
// and enable/disable providers at runtime via /api/rally/config.
//
// Default failover chain:
//   1. anthropic/claude-sonnet-4.6  — primary (best for code gen)
//   2. openai/gpt-5.4               — fallback 1 (strong code gen)
//   3. google/gemini-2.0-flash      — fallback 2 (fast, high capacity)
//
// BYOK passes provider keys per-request so fallback works.
// Application-level retry handles network/gateway failures.
// ──────────────────────────────────────────────────────────────────────

const RETRY_DELAY_MS = 1000

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(req: Request) {
  const url = new URL(req.url)

  let team: { name: string; slug: string; members: string[]; roles?: Record<string, string>; track: 'campus' | 'startup' | 'future' }
  try {
    const raw = JSON.parse(url.searchParams.get('team') || '{}')
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

  // Read runtime config — judges can swap models live via /api/rally/config
  const { primary, fallbacks, byok, retries } = getModelConfig()

  // Application-level retry for network/gateway failures.
  // Model-level failover (429s, 5xx from providers) is handled by the gateway automatically.
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = streamText({
        model: gateway(primary),
        system: buildSystemPrompt(team),
        messages: modelMessages,
        tools: rallyTools,
        stopWhen: stepCountIs(3),
        providerOptions: {
          gateway: {
            ...(fallbacks.length > 0 ? { models: fallbacks } : {}),
            ...(byok ? { byok } : {}),
          },
        },
      })

      return result.toUIMessageStreamResponse()
    } catch (error) {
      lastError = error
      if (attempt < retries) {
        await sleep(RETRY_DELAY_MS * (attempt + 1))
      }
    }
  }

  // All retries exhausted — return a clear error so the client can show a retry prompt
  console.error('[rally-chat] All retries failed:', lastError)
  return new Response(
    JSON.stringify({ error: 'AI service temporarily unavailable. Please try again in a few seconds.' }),
    { status: 503, headers: { 'Content-Type': 'application/json', 'Retry-After': '5' } },
  )
}
