'use client'

import { useEffect, useState } from 'react'
import { AICRLogo } from '@/components/brand/AICRLogo'
import { GCUBadge } from '@/components/brand/GCUBadge'

interface SplashScreenProps {
  teamName: string
  onComplete: () => void
}

export function SplashScreen({ teamName, onComplete }: SplashScreenProps) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2000)
    const doneTimer = setTimeout(onComplete, 2500)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  return (
    <div
      role="status"
      onClick={onComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
      style={{
        backgroundColor: '#030712',
        animation: fading ? 'splash-fade-out 0.5s ease-out forwards' : undefined,
      }}
    >
      <div
        className="flex flex-col items-center gap-6"
        style={{ animation: 'splash-scale 0.6s ease-out' }}
      >
        <div style={{ color: '#f3f4f6' }}>
          <AICRLogo size="lg" />
        </div>

        <h1
          className="text-3xl font-light tracking-widest uppercase"
          style={{ color: '#9ca3af' }}
        >
          Rally Kit
        </h1>

        <GCUBadge />

        <p className="mt-8 text-xl font-medium" style={{ color: '#d1d5db' }}>
          {teamName}
        </p>

        <p className="text-sm" style={{ color: '#6b7280' }}>
          Click anywhere to start
        </p>
      </div>
    </div>
  )
}
