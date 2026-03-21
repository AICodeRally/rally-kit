'use client'

import { Check } from 'lucide-react'
import type { DesignIdea } from '@/lib/rally/types'

const STEPS = [
  { key: 'problem', label: 'Problem' },
  { key: 'pages', label: 'Pages' },
  { key: 'data', label: 'Data' },
  { key: 'shell', label: 'Shell' },
  { key: 'theme', label: 'Theme' },
] as const

interface DesignStepperProps {
  ideas: DesignIdea[]
}

export function DesignStepper({ ideas }: DesignStepperProps) {
  const completedCategories = new Set(ideas.map((i) => i.category))

  // Current step = first incomplete category
  const currentIndex = STEPS.findIndex((s) => !completedCategories.has(s.key))
  const activeIndex = currentIndex === -1 ? STEPS.length : currentIndex

  return (
    <div
      className="flex items-center justify-center gap-1 px-4 py-3 shrink-0"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {STEPS.map((step, i) => {
        const done = completedCategories.has(step.key)
        const active = i === activeIndex

        return (
          <div key={step.key} className="flex items-center">
            {i > 0 && (
              <div
                className="w-6 h-px mx-1 hidden sm:block"
                style={{ backgroundColor: done ? 'var(--accent)' : 'var(--border)' }}
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                style={{
                  backgroundColor: done
                    ? 'var(--accent)'
                    : active
                      ? 'transparent'
                      : 'var(--bg-muted)',
                  color: done
                    ? '#ffffff'
                    : active
                      ? 'var(--accent)'
                      : 'var(--text-muted)',
                  border: active ? '2px solid var(--accent)' : done ? 'none' : '1px solid var(--border)',
                  animation: active ? 'pulse-ring 2s infinite' : undefined,
                }}
              >
                {done ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span
                className="text-xs font-medium hidden sm:inline"
                style={{
                  color: done || active ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
