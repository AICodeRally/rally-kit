'use client'

import { useEffect, useState } from 'react'
import { AICRLogo } from '@/components/brand/AICRLogo'
import { Code, Layers, Palette, Rocket } from 'lucide-react'
import type { SandboxStatus } from '@/lib/rally/types'

const INSIGHTS = [
  { title: 'Domain Modeling', text: 'What you just did — mapping a business into data — is how every real app starts.' },
  { title: 'Component Architecture', text: 'Your app is built from reusable pieces called components. Each card, chart, and table is one.' },
  { title: 'The Wow Moment', text: 'The dashboard is the first thing judges see. A strong dashboard sets the tone for your whole demo.' },
  { title: 'Mock Data', text: 'Real apps use databases. Today we use mock data — it looks real but lives right in the code.' },
  { title: 'Responsive Design', text: 'Your app works on phones and laptops. The layout adapts automatically — that is called responsive design.' },
  { title: 'Design Systems', text: 'Every component uses the same colors, spacing, and typography. This consistency is called a design system.' },
]

const BOOT_STEPS: { status: SandboxStatus; label: string; icon: typeof Code }[] = [
  { status: 'booting', label: 'Starting sandbox', icon: Rocket },
  { status: 'mounting', label: 'Loading components', icon: Layers },
  { status: 'installing', label: 'Installing packages', icon: Code },
  { status: 'starting', label: 'Starting dev server', icon: Palette },
]

interface BuildTransitionProps {
  teamName: string
  sandboxStatus: SandboxStatus
  onComplete: () => void
}

export function BuildTransition({ teamName, sandboxStatus, onComplete }: BuildTransitionProps) {
  const [fading, setFading] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [insightIdx, setInsightIdx] = useState(() => Math.floor(Math.random() * INSIGHTS.length))

  // Show boot steps after a brief moment
  useEffect(() => {
    const timer = setTimeout(() => setShowSteps(true), 800)
    return () => clearTimeout(timer)
  }, [])

  // Rotate insights every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIdx((prev) => (prev + 1) % INSIGHTS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Auto-dismiss when sandbox is ready
  useEffect(() => {
    if (sandboxStatus === 'ready') {
      const fadeTimer = setTimeout(() => setFading(true), 500)
      const doneTimer = setTimeout(onComplete, 1000)
      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(doneTimer)
      }
    }
  }, [sandboxStatus, onComplete])

  // Also allow click-to-dismiss after steps are showing
  const handleClick = () => {
    if (showSteps) {
      setFading(true)
      setTimeout(onComplete, 500)
    }
  }

  return (
    <div
      role="status"
      onClick={handleClick}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#030712',
        cursor: showSteps ? 'pointer' : 'default',
        animation: fading ? 'splash-fade-out 0.5s ease-out forwards' : undefined,
      }}
    >
      <div
        className="flex flex-col items-center gap-6 max-w-md px-6 text-center"
        style={{ animation: 'splash-scale 0.6s ease-out' }}
      >
        {/* Logo */}
        <div style={{ color: '#f3f4f6' }}>
          <AICRLogo size="sm" />
        </div>

        {/* Phase announcement */}
        <div className="flex items-center gap-3">
          <div
            className="h-px flex-1"
            style={{ backgroundColor: '#374151' }}
          />
          <span
            className="text-xs font-medium tracking-widest uppercase"
            style={{ color: '#6b7280' }}
          >
            Phase 2
          </span>
          <div
            className="h-px flex-1"
            style={{ backgroundColor: '#374151' }}
          />
        </div>

        <h1
          className="text-3xl font-bold"
          style={{ color: '#f3f4f6' }}
        >
          Time to Build
        </h1>

        <p
          className="text-sm leading-relaxed"
          style={{ color: '#9ca3af' }}
        >
          First up — the shell and theme setup, then we'll build the Dashboard
          for that first big <strong style={{ color: '#f3f4f6' }}>wow moment</strong>.
        </p>

        {/* Boot progress */}
        {showSteps && (
          <div
            className="w-full mt-4 space-y-3"
            style={{ animation: 'splash-scale 0.4s ease-out' }}
          >
            {BOOT_STEPS.map((step) => {
              const currentIdx = BOOT_STEPS.findIndex((s) => s.status === sandboxStatus)
              const stepIdx = BOOT_STEPS.findIndex((s) => s.status === step.status)
              const isDone = stepIdx < currentIdx || sandboxStatus === 'ready'
              const isCurrent = step.status === sandboxStatus && sandboxStatus !== 'ready'
              const Icon = step.icon

              return (
                <div
                  key={step.status}
                  className="flex items-center gap-3"
                  style={{
                    opacity: isDone || isCurrent ? 1 : 0.3,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isDone
                        ? '#22c55e'
                        : isCurrent
                          ? '#3b82f6'
                          : '#1f2937',
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    {isDone ? (
                      <span className="text-white text-sm">&#10003;</span>
                    ) : (
                      <Icon
                        className="w-4 h-4"
                        style={{
                          color: isCurrent ? '#ffffff' : '#6b7280',
                          animation: isCurrent ? 'pulse-ring 1.5s ease-in-out infinite' : undefined,
                        }}
                      />
                    )}
                  </div>
                  <span
                    className="text-sm"
                    style={{
                      color: isDone ? '#22c55e' : isCurrent ? '#f3f4f6' : '#6b7280',
                      fontWeight: isCurrent ? 500 : 400,
                    }}
                  >
                    {step.label}
                    {isCurrent && (
                      <span className="ml-1 inline-block animate-pulse">...</span>
                    )}
                  </span>
                </div>
              )
            })}

            {sandboxStatus === 'ready' && (
              <div
                className="mt-4 pt-4 text-center"
                style={{
                  borderTop: '1px solid #374151',
                  animation: 'splash-scale 0.3s ease-out',
                }}
              >
                <p className="text-sm font-medium" style={{ color: '#22c55e' }}>
                  Your workspace is ready
                </p>
              </div>
            )}
          </div>
        )}

        {/* Rotating insight */}
        {showSteps && sandboxStatus !== 'ready' && (
          <div
            key={insightIdx}
            className="mt-2 px-4 py-3 rounded-lg text-left w-full"
            style={{
              backgroundColor: '#111827',
              border: '1px solid #1f2937',
              animation: 'insight-fade 0.4s ease-out',
            }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: '#3b82f6' }}>
              {INSIGHTS[insightIdx].title}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>
              {INSIGHTS[insightIdx].text}
            </p>
          </div>
        )}

        {/* Team name */}
        <p className="mt-4 text-sm" style={{ color: '#4b5563' }}>
          {teamName}
        </p>

        {showSteps && sandboxStatus !== 'ready' && (
          <p className="text-xs" style={{ color: '#374151' }}>
            Click anywhere to continue to chat while we set up
          </p>
        )}
      </div>
    </div>
  )
}
