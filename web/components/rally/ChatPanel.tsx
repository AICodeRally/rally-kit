'use client'

import { useState, useRef, useEffect } from 'react'
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
import type { TeamInfo } from '@/lib/rally/types'
import { Send } from 'lucide-react'

interface ChatPanelProps {
  team: TeamInfo
  webcontainer: WebContainer | null
  onFileWritten: (path: string) => void
}

export function ChatPanel({ team, webcontainer, onFileWritten }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, addToolOutput, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),

    body: { team },

    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    async onToolCall({ toolCall }) {
      if (!webcontainer || toolCall.dynamic) return

      try {
        if (toolCall.toolName === 'writeFile') {
          const { path, content } = toolCall.input as { path: string; content: string }
          const result = await writeFile(webcontainer, path, content)
          onFileWritten(path)
          addToolOutput({
            tool: 'writeFile',
            toolCallId: toolCall.toolCallId,
            output: result,
          })
        } else if (toolCall.toolName === 'readFile') {
          const { path } = toolCall.input as { path: string }
          const result = await readFile(webcontainer, path)
          addToolOutput({
            tool: 'readFile',
            toolCallId: toolCall.toolCallId,
            output: result,
          })
        } else if (toolCall.toolName === 'listFiles') {
          const { path } = toolCall.input as { path: string }
          const result = await listFiles(webcontainer, path)
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
    },
  })

  // Auto-start rally when WebContainer is ready
  const hasStarted = useRef(false)
  useEffect(() => {
    if (webcontainer && !hasStarted.current) {
      hasStarted.current = true
      sendMessage({ text: '/rally' })
    }
  }, [webcontainer, sendMessage])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    if (!input.trim()) return
    sendMessage({ text: input })
    setInput('')
  }

  function handleCommand(command: string) {
    sendMessage({ text: command })
  }

  const isStreaming = status === 'streaming' || status === 'submitted'

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'ml-8' : 'mr-4'}>
            <div
              className={
                message.role === 'user'
                  ? 'bg-blue-50 rounded-lg p-3 text-sm'
                  : 'text-sm'
              }
            >
              {message.parts.map((part, i) => {
                if (part.type === 'text') {
                  return message.role === 'assistant' ? (
                    <MessageResponse key={i}>{part.text}</MessageResponse>
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                }
                // Show file change indicators for writeFile tool calls
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
      <SlashToolbar onCommand={handleCommand} />

      {/* Input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={isStreaming ? 'AI is working...' : 'Type a message...'}
            disabled={isStreaming}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
