'use client'

import { useState } from 'react'
import { Plus, X, Lightbulb, Layout, Database, Monitor, Palette } from 'lucide-react'
import type { DesignIdea } from '@/lib/rally/types'

const CATEGORY_CONFIG = {
  problem: { color: '#ef4444', icon: Lightbulb, label: 'Problem' },
  pages: { color: '#f59e0b', icon: Layout, label: 'Pages' },
  data: { color: '#10b981', icon: Database, label: 'Data' },
  shell: { color: '#6366f1', icon: Monitor, label: 'Shell' },
  theme: { color: '#ec4899', icon: Palette, label: 'Theme' },
} as const

interface IdeaBoardProps {
  ideas: DesignIdea[]
  onAddIdea: (idea: DesignIdea) => void
}

export function IdeaBoard({ ideas, onAddIdea }: IdeaBoardProps) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<DesignIdea['category']>('problem')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAddIdea({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      category,
    })
    setTitle('')
    setDescription('')
    setShowForm(false)
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          Ideas
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-1 rounded-md transition-colors"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Add idea"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Manual add form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-3 space-y-2 shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as DesignIdea['category'])}
            className="w-full px-2 py-1.5 text-xs rounded-md"
            style={{
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          >
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Idea title..."
            className="w-full px-2 py-1.5 text-xs rounded-md"
            style={{
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-2 py-1.5 text-xs rounded-md resize-none"
            style={{
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          />
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full py-1.5 text-xs font-medium rounded-md text-white disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Add Idea
          </button>
        </form>
      )}

      {/* Idea cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {ideas.length === 0 && (
          <div className="text-center py-8">
            <Lightbulb className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Ideas from your design chat will appear here
            </p>
          </div>
        )}
        {ideas.map((idea) => {
          const cfg = CATEGORY_CONFIG[idea.category]
          const Icon = cfg.icon
          return (
            <div
              key={idea.id}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                animation: 'slide-in-right 0.3s ease-out',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: cfg.color + '20', color: cfg.color }}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {idea.title}
                </span>
              </div>
              {idea.description && (
                <p className="text-sm ml-7" style={{ color: 'var(--text-secondary)' }}>
                  {idea.description}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
