import { WebContainer } from '@webcontainer/api'
import { RALLY_KIT_FILES } from './files'

export interface BootResult {
  webcontainer: WebContainer
  previewUrl: string
  port: number
}

export type BootStatus =
  | 'booting'
  | 'mounting'
  | 'installing'
  | 'starting'
  | 'ready'
  | 'error'

const BOOT_TIMEOUT_MS = 90_000 // 90 seconds total
const SERVER_READY_TIMEOUT_MS = 45_000 // 45 seconds for dev server

export async function bootWebContainer(
  onStatus: (status: BootStatus, detail?: string) => void,
): Promise<BootResult> {
  const bootStart = Date.now()

  function checkTimeout(phase: string) {
    if (Date.now() - bootStart > BOOT_TIMEOUT_MS) {
      throw new Error(`Sandbox timed out during ${phase} (>${BOOT_TIMEOUT_MS / 1000}s)`)
    }
  }

  // WebContainers require cross-origin isolation (COOP + COEP headers)
  if (typeof window !== 'undefined' && !window.crossOriginIsolated) {
    const msg = 'Cross-origin isolation not enabled — COOP/COEP headers may be missing'
    console.error('[WebContainer]', msg)
    onStatus('error', msg)
    throw new Error(msg)
  }

  onStatus('booting')
  let wc: WebContainer
  try {
    wc = await WebContainer.boot()
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown boot error'
    onStatus('error', `Failed to start sandbox: ${msg}`)
    throw err
  }

  checkTimeout('boot')
  onStatus('mounting')
  try {
    await wc.mount(RALLY_KIT_FILES)
  } catch (err) {
    onStatus('error', 'Failed to load project files')
    throw err
  }

  checkTimeout('mount')
  onStatus('installing', 'Running npm install...')
  let installProcess
  try {
    installProcess = await wc.spawn('npm', ['install'])
  } catch (err) {
    onStatus('error', 'Failed to start npm install')
    throw err
  }

  installProcess.output.pipeTo(
    new WritableStream({
      write(chunk) {
        console.log('[npm install]', chunk)
        // Stream last meaningful line to UI
        const line = chunk.trim().split('\n').pop()?.trim()
        if (line) {
          onStatus('installing', line)
        }
      },
    }),
  )

  const installExitCode = await installProcess.exit
  if (installExitCode !== 0) {
    onStatus('error', 'npm install failed — check browser console for details')
    throw new Error('npm install failed')
  }

  checkTimeout('install')
  onStatus('starting', 'Starting dev server...')
  try {
    await wc.spawn('npm', ['run', 'dev'])
  } catch (err) {
    onStatus('error', 'Failed to start dev server')
    throw err
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      onStatus('error', 'Dev server took too long to start — try refreshing')
      reject(new Error('Dev server timed out'))
    }, SERVER_READY_TIMEOUT_MS)

    wc.on('server-ready', (port, url) => {
      clearTimeout(timeout)
      onStatus('ready')
      resolve({ webcontainer: wc, previewUrl: url, port })
    })
  })
}
