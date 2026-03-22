'use client'

import { useState, useEffect } from 'react'
import { AICRLogo } from '@/components/brand/AICRLogo'
import { Lock } from 'lucide-react'

interface PasscodeGateProps {
  passcode: string
  storageKey: string
  label?: string
  children: React.ReactNode
}

export function PasscodeGate({ passcode, storageKey, label = 'Enter Passcode', children }: PasscodeGateProps) {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === 'true') {
        setUnlocked(true)
      }
    } catch {}
    setChecking(false)
  }, [storageKey])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim().toUpperCase() === passcode.toUpperCase()) {
      try {
        sessionStorage.setItem(storageKey, 'true')
        // Store the actual passcode so authenticated fetches can use it
        sessionStorage.setItem('rally-judges-key', passcode.toLowerCase())
      } catch {}
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    )
  }

  if (unlocked) return <>{children}</>

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 gap-8"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="flex flex-col items-center gap-3">
        <AICRLogo size="lg" />
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Rally Kit
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div className="flex items-center gap-2 justify-center" style={{ color: 'var(--text-secondary)' }}>
          <Lock className="w-4 h-4" />
          <span className="text-base font-medium">{label}</span>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false) }}
          placeholder="Passcode"
          autoFocus
          autoComplete="off"
          className="w-full px-4 py-3 text-lg text-center tracking-widest font-mono rounded-lg focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--bg-muted)',
            color: 'var(--text-primary)',
            border: `2px solid ${error ? '#ef4444' : 'var(--border)'}`,
          }}
        />
        {error && (
          <p className="text-sm text-center" style={{ color: '#ef4444' }}>
            Wrong passcode. Try again.
          </p>
        )}
        <button
          type="submit"
          className="w-full py-3 text-white text-base font-semibold rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          Enter
        </button>
      </form>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        Ask your event coordinator for the passcode
      </p>
    </div>
  )
}
