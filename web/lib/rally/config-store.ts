// In-memory runtime config for the rally event.
// Defaults come from env vars. Judges can override at runtime via /api/rally/config.
// Cold start resets to env var defaults (fine for a 3-hour event).

export interface ProviderConfig {
  id: string
  label: string
  model: string
  envKey: string
  hasKey: boolean
  enabled: boolean
}

export interface RallyConfig {
  primaryModel: string
  providers: ProviderConfig[]
  maxRetries: number
}

const DEFAULT_PROVIDERS: Omit<ProviderConfig, 'hasKey'>[] = [
  { id: 'anthropic', label: 'Anthropic', model: 'anthropic/claude-sonnet-4.6', envKey: 'ANTHROPIC_API_KEY', enabled: true },
  { id: 'openai', label: 'OpenAI', model: 'openai/gpt-5.4', envKey: 'OPENAI_API_KEY', enabled: true },
  { id: 'google', label: 'Google', model: 'google/gemini-2.0-flash', envKey: 'GOOGLE_API_KEY', enabled: true },
]

function buildDefaults(): RallyConfig {
  return {
    primaryModel: 'anthropic/claude-sonnet-4.6',
    providers: DEFAULT_PROVIDERS.map((p) => ({
      ...p,
      hasKey: !!process.env[p.envKey],
    })),
    maxRetries: 2,
  }
}

// Singleton in-memory config — survives across requests on the same instance
let runtimeConfig: RallyConfig | null = null

export function getConfig(): RallyConfig {
  if (!runtimeConfig) {
    runtimeConfig = buildDefaults()
  }
  return runtimeConfig
}

export function updateConfig(patch: {
  primaryModel?: string
  enabledProviders?: Record<string, boolean>
  maxRetries?: number
}): RallyConfig {
  const config = getConfig()

  if (patch.primaryModel) {
    // Validate it's one of our known models
    const valid = config.providers.some((p) => p.model === patch.primaryModel)
    if (valid) config.primaryModel = patch.primaryModel
  }

  if (patch.enabledProviders) {
    for (const provider of config.providers) {
      if (patch.enabledProviders[provider.id] !== undefined) {
        provider.enabled = patch.enabledProviders[provider.id]
      }
    }
  }

  if (patch.maxRetries !== undefined && patch.maxRetries >= 0 && patch.maxRetries <= 5) {
    config.maxRetries = patch.maxRetries
  }

  return config
}

// Used by chat route — returns primary model + fallback array + byok
export function getModelConfig() {
  const config = getConfig()
  const enabled = config.providers.filter((p) => p.enabled && p.hasKey)
  const primary = enabled.find((p) => p.model === config.primaryModel) || enabled[0]

  if (!primary) {
    return { primary: 'anthropic/claude-sonnet-4.6', fallbacks: [], byok: undefined, retries: config.maxRetries }
  }

  const fallbacks = enabled.filter((p) => p.model !== primary.model).map((p) => p.model)

  // Build BYOK from env vars for enabled providers
  const byok: Record<string, Array<{ apiKey: string }>> = {}
  for (const p of enabled) {
    const key = process.env[p.envKey]
    if (key) byok[p.id] = [{ apiKey: key }]
  }

  return {
    primary: primary.model,
    fallbacks,
    byok: Object.keys(byok).length > 0 ? byok : undefined,
    retries: config.maxRetries,
  }
}
