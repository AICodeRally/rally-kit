'use client'

import {
  Users, Lightbulb, ShoppingBag, Target, LayoutGrid, Tag,
  Monitor, Palette, ClipboardCheck,
} from 'lucide-react'

const STEPS = [
  { key: 'team', label: 'Team', icon: Users, color: '#f97316' },
  { key: 'idea', label: 'Idea', icon: Lightbulb, color: '#eab308' },
  { key: 'niche', label: 'Niche', icon: ShoppingBag, color: '#22c55e' },
  { key: 'users', label: 'Users', icon: Target, color: '#06b6d4' },
  { key: 'features', label: 'Features', icon: LayoutGrid, color: '#a855f7' },
  { key: 'name', label: 'Name', icon: Tag, color: '#ec4899' },
  { key: 'layout', label: 'Layout', icon: Monitor, color: '#0ea5e9' },
  { key: 'theme', label: 'Theme', icon: Palette, color: '#eab308' },
  { key: 'review', label: 'Review', icon: ClipboardCheck, color: '#22c55e' },
] as const

interface DesignStepperProps {
  ideas: { category: string }[]
}

export function DesignStepper({ ideas }: DesignStepperProps) {
  return (
    <div
      className="flex items-center justify-center gap-0.5 px-4 py-2 shrink-0"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center">
          {i > 0 && (
            <div
              className="w-4 h-px mx-0.5 hidden sm:block"
              style={{ backgroundColor: 'var(--border)' }}
            />
          )}
          <div className="flex items-center gap-1">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: step.color + '20' }}
            >
              <step.icon className="w-2.5 h-2.5" style={{ color: step.color }} />
            </div>
            <span
              className="text-[10px] font-semibold hidden sm:inline"
              style={{ color: step.color }}
            >
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
