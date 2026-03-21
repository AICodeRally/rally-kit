'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai'
import type { WebContainer } from '@webcontainer/api'
import { MessageResponse } from '@/components/ai-elements/message'
import { SlashToolbar } from './SlashToolbar'
import { FileChangeNotification } from '@/components/chat/FileChangeNotification'
import { writeFile, readFile, listFiles } from '@/lib/webcontainer/operations'
import type { TeamInfo, DesignIdea, Phase } from '@/lib/rally/types'
import { Send } from 'lucide-react'

// Regex to extract [IDEA:category:title]description[/IDEA] markers
const IDEA_REGEX = /\[IDEA:(problem|pages|data|shell|theme):([^\]]+)\]([\s\S]*?)\[\/IDEA\]/g

function extractIdeas(text: string): DesignIdea[] {
  const ideas: DesignIdea[] = []
  let match: RegExpExecArray | null
  while ((match = IDEA_REGEX.exec(text)) !== null) {
    ideas.push({
      id: crypto.randomUUID(),
      category: match[1] as DesignIdea['category'],
      title: match[2].trim(),
      description: match[3].trim(),
    })
  }
  return ideas
}

interface ChatPanelProps {
  team: TeamInfo
  webcontainer: WebContainer | null
  phase?: string
  onFileWritten: (path: string) => void
  onBuildRequested: () => void
  onIdeaCaptured?: (idea: DesignIdea) => void
  onPhaseChange?: (phase: Phase) => void
}

export function ChatPanel({
  team,
  webcontainer,
  phase,
  onFileWritten,
  onBuildRequested,
  onIdeaCaptured,
  onPhaseChange,
}: ChatPanelProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const capturedTitles = useRef<Set<string>>(new Set())
  const pendingToolCalls = useRef<Array<{ toolCall: { toolName: string; toolCallId: string; input: unknown; dynamic?: boolean } }>>([])

  const { messages, sendMessage, addToolOutput, status } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/chat?team=${encodeURIComponent(JSON.stringify(team))}`,
    }),

    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return

      // Any tool call means we're building — auto-transition
      onPhaseChange?.('build')

      if (!webcontainer) {
        onBuildRequested()
        // Queue tool call for execution when WebContainer boots
        pendingToolCalls.current.push({ toolCall })
        // Send tool output so AI SDK doesn't hang waiting
        addToolOutput({
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          output: `File queued — sandbox is booting, will write shortly.`,
        })
        return
      }

      await executeToolCall(toolCall, webcontainer)
    },
  })

  // Execute queued tool calls once WebContainer boots (side-effect only, output already sent)
  useEffect(() => {
    if (!webcontainer || pendingToolCalls.current.length === 0) return
    const pending = [...pendingToolCalls.current]
    pendingToolCalls.current = []
    for (const { toolCall } of pending) {
      executePendingToolCall(toolCall, webcontainer)
    }
  }, [webcontainer])

  // Execute a queued tool call (side-effect only — tool output was already returned)
  const executePendingToolCall = useCallback(async (
    toolCall: { toolName: string; toolCallId: string; input: unknown },
    wc: WebContainer,
  ) => {
    try {
      if (toolCall.toolName === 'writeFile') {
        const { path, content } = toolCall.input as { path: string; content: string }
        await writeFile(wc, path, content)
        onFileWritten(path)
      } else if (toolCall.toolName === 'readFile') {
        const { path } = toolCall.input as { path: string }
        await readFile(wc, path)
      } else if (toolCall.toolName === 'listFiles') {
        const { path } = toolCall.input as { path: string }
        await listFiles(wc, path)
      }
    } catch {
      // Silently ignore — tool output was already sent
    }
  }, [onFileWritten])

  const executeToolCall = useCallback(async (
    toolCall: { toolName: string; toolCallId: string; input: unknown },
    wc: WebContainer,
  ) => {
    try {
      if (toolCall.toolName === 'writeFile') {
        const { path, content } = toolCall.input as { path: string; content: string }
        const result = await writeFile(wc, path, content)
        onFileWritten(path)
        addToolOutput({
          tool: 'writeFile',
          toolCallId: toolCall.toolCallId,
          output: result,
        })
      } else if (toolCall.toolName === 'readFile') {
        const { path } = toolCall.input as { path: string }
        const result = await readFile(wc, path)
        addToolOutput({
          tool: 'readFile',
          toolCallId: toolCall.toolCallId,
          output: result,
        })
      } else if (toolCall.toolName === 'listFiles') {
        const { path } = toolCall.input as { path: string }
        const result = await listFiles(wc, path)
        addToolOutput({
          tool: 'listFiles',
          toolCallId: toolCall.toolCallId,
          output: result,
        })
      }
    } catch (err) {
      addToolOutput({
        tool: toolCall.toolName,
        toolCallId: toolCall.toolCallId,
        state: 'output-error',
        errorText: err instanceof Error ? err.message : 'Tool execution failed',
      })
    }
  }, [addToolOutput, onFileWritten])

  // Extract ideas from assistant messages
  useEffect(() => {
    if (!onIdeaCaptured) return
    for (const msg of messages) {
      if (msg.role !== 'assistant') continue
      for (const part of msg.parts) {
        if (part.type !== 'text') continue
        const ideas = extractIdeas(part.text)
        for (const idea of ideas) {
          if (!capturedTitles.current.has(idea.title)) {
            capturedTitles.current.add(idea.title)
            onIdeaCaptured(idea)
          }
        }
      }
    }
  }, [messages, onIdeaCaptured])

  // Auto-start rally immediately
  const hasStarted = useRef(false)
  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true
      sendMessage({ text: '/rally' })
    }
  }, [sendMessage])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function routeCommand(text: string) {
    if (text === '/build') {
      onBuildRequested()
      onPhaseChange?.('build')
    } else if (text === '/polish') {
      onPhaseChange?.('polish')
    } else if (text === '/reset') {
      if (!window.confirm('Start completely over? All progress will be lost.')) return false
    }
    return true
  }

  function handleSend() {
    if (!input.trim()) return
    const text = input.trim()
    if (!routeCommand(text)) return
    sendMessage({ text })
    setInput('')
  }

  function handleCommand(command: string) {
    if (!routeCommand(command)) return
    sendMessage({ text: command })
  }

  const isStreaming = status === 'streaming' || status === 'submitted'

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'ml-8' : 'mr-4'}>
            <div
              className={
                message.role === 'user'
                  ? 'rounded-lg p-3 text-base'
                  : 'text-base'
              }
              style={
                message.role === 'user'
                  ? { backgroundColor: 'var(--user-bubble)' }
                  : undefined
              }
            >
              {message.parts.map((part, i) => {
                if (part.type === 'text') {
                  // Strip IDEA markers from displayed text
                  const displayText = part.text.replace(IDEA_REGEX, '').trim()
                  if (!displayText) return null
                  return message.role === 'assistant' ? (
                    <MessageResponse key={i}>{displayText}</MessageResponse>
                  ) : (
                    <span key={i}>{displayText}</span>
                  )
                }
                if (
                  part.type === 'tool-writeFile' &&
                  (part.state === 'output-available' || part.state === 'input-available')
                ) {
                  return (
                    <FileChangeNotification
                      key={i}
                      path={(part.input as { path: string })?.path ?? 'unknown'}
                    />
                  )
                }
                return null
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Slash command toolbar */}
      <SlashToolbar onCommand={handleCommand} phase={phase} />

      {/* Input */}
      <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={isStreaming ? 'AI is working...' : 'Type a message...'}
            disabled={isStreaming}
            className="flex-1 px-4 py-3 min-h-[52px] text-base rounded-lg focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="p-3 min-w-[52px] min-h-[52px] flex items-center justify-center text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
