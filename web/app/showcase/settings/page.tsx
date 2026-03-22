'use client'

import { useState, useEffect, useCallback } from 'react'
import { PasscodeGate } from '@/components/landing/PasscodeGate'
import { AICRLogo } from '@/components/brand/AICRLogo'
import { ArrowLeft, CheckCircle, XCircle, Loader2, Zap, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface ProviderConfig {
  id: string
  label: string
  model: string
  envKey: string
  hasKey: boolean
  enabled: boolean
}

interface RallyConfig {
  primaryModel: string
  providers: ProviderConfig[]
  maxRetries: number
}

interface TestResult {
  ok: boolean
  model: string
  latencyMs: number
  response?: string
  error?: string
}

function getJudgesKey() {
  try { return sessionStorage.getItem('rally-judges-key') || '' } catch { return '' }
}

function SettingsPanel() {
  const [config, setConfig] = useState<RallyConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testResults, setTestResults] = useState<Record<string, TestResult | 'testing'>>({})
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/rally/config', {
        headers: { 'x-judges-key': getJudgesKey() },
      })
      if (!res.ok) throw new Error(`${res.status}`)
      setConfig(await res.json())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load config')
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchConfig() }, [fetchConfig])

  async function saveConfig(patch: Record<string, unknown>) {
    setSaving(true)
    try {
      const res = await fetch('/api/rally/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-judges-key': getJudgesKey() },
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error(`${res.status}`)
      setConfig(await res.json())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    }
    setSaving(false)
  }

  async function testProvider(model: string) {
    setTestResults((prev) => ({ ...prev, [model]: 'testing' }))
    try {
      const res = await fetch('/api/rally/config/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-judges-key': getJudgesKey() },
        body: JSON.stringify({ model }),
      })
      const result = await res.json()
      setTestResults((prev) => ({ ...prev, [model]: result }))
    } catch {
      setTestResults((prev) => ({ ...prev, [model]: { ok: false, model, latencyMs: 0, error: 'Network error' } }))
    }
  }

  async function testAll() {
    if (!config) return
    for (const p of config.providers.filter((p) => p.hasKey && p.enabled)) {
      await testProvider(p.model)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    )
  }

  if (!config) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium" style={{ color: '#dc2626' }}>Failed to load config</p>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>{error}</p>
        <button onClick={fetchConfig} className="mt-4 px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--accent)' }}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>AI Provider Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Runtime config — changes take effect immediately, no redeploy needed
          </p>
        </div>
        <button
          onClick={testAll}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Zap className="w-4 h-4" />
          Test All
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5' }}>
          <p className="text-sm font-medium" style={{ color: '#dc2626' }}>{error}</p>
        </div>
      )}

      {/* Provider Cards */}
      <div className="space-y-4">
        {config.providers.map((provider) => {
          const isPrimary = provider.model === config.primaryModel
          const test = testResults[provider.model]
          const isTesting = test === 'testing'
          const testResult = typeof test === 'object' ? test : null

          return (
            <div
              key={provider.id}
              className="rounded-xl p-5"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: `2px solid ${isPrimary ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {provider.label}
                    </h3>
                    {isPrimary && (
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: 'var(--accent)' }}
                      >
                        PRIMARY
                      </span>
                    )}
                    {!isPrimary && provider.hasKey && provider.enabled && (
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }}
                      >
                        FALLBACK
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-mono mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {provider.model}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-2">
                  {provider.hasKey ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#10b981' }} />
                      <span className="text-xs font-medium" style={{ color: '#10b981' }}>Key Set</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                      <span className="text-xs font-medium" style={{ color: '#ef4444' }}>No Key</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Env var hint */}
              <p className="text-xs font-mono mt-2" style={{ color: 'var(--text-muted)' }}>
                Env: <code>{provider.envKey}</code>
                {!provider.hasKey && (
                  <span style={{ color: '#ef4444' }}> — add via Vercel dashboard or CLI</span>
                )}
              </p>

              {/* Controls */}
              <div className="flex items-center gap-3 mt-4">
                {/* Enable/disable toggle */}
                <button
                  onClick={() => saveConfig({ enabledProviders: { [provider.id]: !provider.enabled } })}
                  disabled={saving || !provider.hasKey}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-40"
                  style={{
                    backgroundColor: provider.enabled ? '#dcfce7' : 'var(--bg-muted)',
                    color: provider.enabled ? '#166534' : 'var(--text-muted)',
                    border: `1px solid ${provider.enabled ? '#86efac' : 'var(--border)'}`,
                  }}
                >
                  {provider.enabled ? 'Enabled' : 'Disabled'}
                </button>

                {/* Make primary */}
                {!isPrimary && provider.hasKey && provider.enabled && (
                  <button
                    onClick={() => saveConfig({ primaryModel: provider.model })}
                    disabled={saving}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg"
                    style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  >
                    Make Primary
                  </button>
                )}

                {/* Test button */}
                {provider.hasKey && (
                  <button
                    onClick={() => testProvider(provider.model)}
                    disabled={isTesting}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1.5"
                    style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  >
                    {isTesting ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Testing...</>
                    ) : (
                      <><RefreshCw className="w-3.5 h-3.5" /> Test</>
                    )}
                  </button>
                )}
              </div>

              {/* Test result */}
              {testResult && (
                <div
                  className="mt-3 px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
                  style={{
                    backgroundColor: testResult.ok ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${testResult.ok ? '#86efac' : '#fca5a5'}`,
                  }}
                >
                  {testResult.ok ? (
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#16a34a' }} />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0" style={{ color: '#dc2626' }} />
                  )}
                  <span style={{ color: testResult.ok ? '#166534' : '#991b1b' }}>
                    {testResult.ok
                      ? `OK — ${testResult.latencyMs}ms — "${testResult.response}"`
                      : `FAILED — ${testResult.error}`}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Retry Settings */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Retry Settings</h3>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Application-level retries for network/gateway failures (not provider errors — those use the fallback chain)
        </p>
        <div className="flex items-center gap-3 mt-3">
          <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Max retries:</label>
          {[0, 1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => saveConfig({ maxRetries: n })}
              disabled={saving}
              className="px-3 py-1.5 text-sm font-medium rounded-lg"
              style={{
                backgroundColor: config.maxRetries === n ? 'var(--accent)' : 'var(--bg-muted)',
                color: config.maxRetries === n ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${config.maxRetries === n ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl p-5" style={{ backgroundColor: '#eff6ff', border: '1px solid #93c5fd' }}>
        <h3 className="text-base font-semibold" style={{ color: '#1e40af' }}>Active Failover Chain</h3>
        <div className="mt-2 space-y-1">
          {(() => {
            const enabled = config.providers.filter((p) => p.hasKey && p.enabled)
            const primary = enabled.find((p) => p.model === config.primaryModel) || enabled[0]
            const fallbacks = enabled.filter((p) => p !== primary)
            return (
              <>
                {primary && (
                  <p className="text-sm font-mono" style={{ color: '#1e3a5f' }}>
                    1. {primary.model} <span className="font-sans font-medium">(primary)</span>
                  </p>
                )}
                {fallbacks.map((f, i) => (
                  <p key={f.id} className="text-sm font-mono" style={{ color: '#1e3a5f' }}>
                    {i + 2}. {f.model} <span className="font-sans font-medium">(fallback)</span>
                  </p>
                ))}
                {enabled.length === 0 && (
                  <p className="text-sm font-medium" style={{ color: '#dc2626' }}>
                    No providers configured! Add API keys via Vercel env vars.
                  </p>
                )}
              </>
            )
          })()}
        </div>
        <p className="text-xs mt-2" style={{ color: '#3b82f6' }}>
          + {config.maxRetries} application-level retries for network failures
        </p>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <PasscodeGate
      passcode="youshallnotpass"
      storageKey="rally-live-showcase-passcode"
      label="Judges Access"
    >
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-2xl mx-auto">
          {/* Nav */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/showcase/live"
              className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80"
              style={{ color: 'var(--accent)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Live Showcase
            </Link>
            <div className="flex items-center gap-2">
              <AICRLogo size="sm" />
              <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Rally Kit</span>
            </div>
          </div>

          <SettingsPanel />
        </div>
      </div>
    </PasscodeGate>
  )
}
