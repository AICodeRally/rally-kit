import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import type { UIMessage } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { buildSystemPrompt } from '@/lib/ai/system-prompt'
import { rallyTools } from '@/lib/ai/tools'

function getModel() {
  // Use direct Anthropic SDK — works both locally (ANTHROPIC_API_KEY)
  // and on Vercel (same key in env vars)
  const anthropic = createAnthropic()
  return anthropic('claude-sonnet-4-6')
}

export async function POST(req: Request) {
  const url = new URL(req.url)
  const team = JSON.parse(url.searchParams.get('team') || '{}') as {
    name: string
    members: string[]
    track: 'campus' | 'startup' | 'future'
  }

  const { messages }: { messages: UIMessage[] } = await req.json()

  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: getModel(),
    system: buildSystemPrompt(team),
    messages: modelMessages,
    tools: rallyTools,
    stopWhen: stepCountIs(10),
  })

  return result.toUIMessageStreamResponse()
}
