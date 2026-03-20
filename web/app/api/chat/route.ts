import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import type { UIMessage } from 'ai'
import { gateway } from '@ai-sdk/gateway'
import { buildSystemPrompt } from '@/lib/ai/system-prompt'
import { rallyTools } from '@/lib/ai/tools'

export async function POST(req: Request) {
  const {
    messages,
    team,
  }: {
    messages: UIMessage[]
    team: {
      name: string
      members: string[]
      track: 'campus' | 'startup' | 'future'
    }
  } = await req.json()

  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4.6'),
    system: buildSystemPrompt(team),
    messages: modelMessages,
    tools: rallyTools,
    stopWhen: stepCountIs(10),
  })

  return result.toUIMessageStreamResponse()
}
