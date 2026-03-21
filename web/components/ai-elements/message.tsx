'use client'

import React from 'react'

/**
 * Lightweight markdown renderer for AI messages.
 * Handles: paragraphs, bullet lists, numbered lists, bold, italic, inline code, headings.
 * No external dependencies.
 */
export function MessageResponse({ children }: { children: React.ReactNode }) {
  if (typeof children !== 'string') {
    return <div className="ai-prose">{children}</div>
  }

  const blocks = parseBlocks(children)

  return (
    <div className="ai-prose">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  )
}

type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: number; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }

function parseBlocks(text: string): Block[] {
  const lines = text.split('\n')
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) {
      i++
      continue
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)/)
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2] })
      i++
      continue
    }

    if (/^\s*[-*]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''))
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    if (/^\s*\d+[.)]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+[.)]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ''))
        i++
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{1,3}\s/.test(lines[i]) &&
      !/^\s*[-*]\s/.test(lines[i]) &&
      !/^\s*\d+[.)]\s/.test(lines[i])
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paraLines.join(' ') })
    }
  }

  return blocks
}

function renderBlock(block: Block, key: number): React.ReactElement {
  switch (block.type) {
    case 'heading': {
      const Tag = ('h' + block.level) as 'h1' | 'h2' | 'h3'
      const sizes: Record<string, string> = {
        h1: 'text-xl font-bold',
        h2: 'text-lg font-semibold',
        h3: 'text-base font-semibold',
      }
      return (
        <Tag
          key={key}
          className={sizes[Tag] + ' mt-3 mb-1'}
          style={{ color: 'var(--text-primary)' }}
        >
          {renderInline(block.text)}
        </Tag>
      )
    }
    case 'ul':
      return (
        <ul key={key} className="my-2 ml-4 space-y-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-base" style={{ color: 'var(--text-primary)' }}>
              <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={key} className="my-2 ml-4 space-y-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-base" style={{ color: 'var(--text-primary)' }}>
              <span
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium"
                style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
              >
                {i + 1}
              </span>
              <span className="pt-0.5">{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      )
    case 'paragraph':
      return (
        <p key={key} className="my-2 text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {renderInline(block.text)}
        </p>
      )
  }
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[2]) {
      parts.push(
        <strong key={match.index} className="font-semibold">
          {match[2]}
        </strong>
      )
    } else if (match[3]) {
      parts.push(
        <em key={match.index} className="italic">
          {match[3]}
        </em>
      )
    } else if (match[4]) {
      parts.push(
        <code
          key={match.index}
          className="px-1 py-0.5 rounded text-xs font-mono"
          style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--accent)' }}
        >
          {match[4]}
        </code>
      )
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length === 1 ? parts[0] : parts
}
