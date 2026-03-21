'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai'
import { MessageResponse } from '@/components/ai-elements/message'
import { SlashToolbar } from './SlashToolbar'
import { FileChangeNotification } from '@/components/chat/FileChangeNotification'
import type { TeamInfo, DesignIdea, Phase } from '@/lib/rally/types'
import { Send } from 'lucide-react'

// Pattern for [IDEA:category:title]description[/IDEA] markers.
// IMPORTANT: Create a new regex per call — global regexes are stateful (lastIndex).
const IDEA_PATTERN = /\[IDEA:(problem|pages|data|shell|theme):([^\]]+)\]([\s\S]*?)\[\/IDEA\]/g

function extractIdeas(text: string): DesignIdea[] {
  const re = new RegExp(IDEA_PATTERN.source, IDEA_PATTERN.flags)
  const ideas: DesignIdea[] = []
  let match: RegExpExecArray | null
  while ((match = re.exec(text)) !== null) {
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
  phase?: string
  onAppUpdate: (html: string) => void
  onFileWritten: (path: string) => void
  onIdeaCaptured?: (idea: DesignIdea) => void
  onPhaseChange?: (phase: Phase) => void
}

export function ChatPanel({
  team,
  phase,
  onAppUpdate,
  onFileWritten,
  onIdeaCaptured,
  onPhaseChange,
}: ChatPanelProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const capturedTitles = useRef<Set<string>>(new Set())

  const transport = useMemo(
    () => new DefaultChatTransport({
      api: `/api/chat?team=${encodeURIComponent(JSON.stringify(team))}`,
    }),
    [team],
  )

  const { messages, sendMessage, addToolOutput, status, error } = useChat({
    transport,

    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return

      if (toolCall.toolName === 'writeApp') {
        const { html } = toolCall.input as { html: string }
        onAppUpdate(html)
        // addToolOutput FIRST — before any state change that might unmount this component
        addToolOutput({
          tool: 'writeApp',
          toolCallId: toolCall.toolCallId,
          output: 'App updated — preview refreshed.',
        })
        // Phase transition last — onFileWritten handles design→build transition
        onFileWritten('app')
      }
    },
  })

  // Extract ideas from assistant messages
  useEffect(() => {
    if (!onIdeaCaptured) return
    for (const msg of messages) {
      if (msg.role !== 'assistant') continue
      for (const part of msg.parts ?? []) {
        if (part.type !== 'text' || !part.text) continue
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

  // Auto-start rally in design phase (not after a refresh into build/polish)
  const hasStarted = useRef(false)
  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true
      if (phase === 'design') {
        // Send /rally which triggers the full welcome + first design question
        sendMessage({ text: '/rally' })
      } else {
        // Resuming a session — give context instead of restarting design flow
        sendMessage({ text: `/status` })
      }
    }
  }, [sendMessage, phase])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function routeCommand(text: string) {
    if (text === '/build') {
      onPhaseChange?.('build')
    } else if (text === '/polish') {
      onPhaseChange?.('polish')
    } else if (text === '/reset') {
      if (!window.confirm('Start completely over? All progress will be lost.')) return false
      // Clear THIS team's persisted state only — other teams on shared laptops are safe
      try {
        const teamPrefix = `rally-${team.slug}`
        const keys = Object.keys(sessionStorage).filter(k => k === teamPrefix || k.startsWith(`${teamPrefix}-`))
        keys.forEach(k => sessionStorage.removeItem(k))
      } catch {}
      window.location.reload()
      return false
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
              {(message.parts ?? []).map((part, i) => {
                try {
                  if (part.type === 'text') {
                    if (!part.text) return null
                    // Strip IDEA markers from displayed text
                    const displayText = part.text.replace(new RegExp(IDEA_PATTERN.source, IDEA_PATTERN.flags), '').trim()
                    if (!displayText) return null
                    return message.role === 'assistant' ? (
                      <MessageResponse key={i}>{displayText}</MessageResponse>
                    ) : (
                      <span key={i}>{displayText}</span>
                    )
                  }
                  if (
                    part.type === 'tool-writeApp' &&
                    part.state === 'output-available'
                  ) {
                    return (
                      <FileChangeNotification
                        key={i}
                        path="app"
                      />
                    )
                  }
                } catch {
                  // Swallow render errors for individual parts — never crash the whole chat
                  return null
                }
                return null
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error indicator — API failure, rate limit, network error */}
      {error && (
        <div className="px-4 py-3 mx-3 mb-1 rounded-lg" style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5' }}>
          <p className="text-sm font-medium" style={{ color: '#dc2626' }}>
            The AI hit a snag. Try sending your message again.
          </p>
          <p className="text-xs mt-1" style={{ color: '#7f1d1d' }}>
            {error.message?.includes('429') ? 'Too many requests — wait a few seconds and retry.' : 'If this keeps happening, ask your facilitator for help.'}
          </p>
        </div>
      )}

      {/* Streaming / thinking indicator */}
      {isStreaming && (
        <div className="px-4 py-2 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
          <span className="flex gap-1">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: 'var(--accent)',
                  animation: 'bounce 1s infinite',
                  animationDelay: `${delay}ms`,
                }}
              />
            ))}
          </span>
          <span className="text-sm font-medium">AI is working...</span>
          <style>{`@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }`}</style>
        </div>
      )}

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
