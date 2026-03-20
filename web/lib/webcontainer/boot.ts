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

export async function bootWebContainer(
  onStatus: (status: BootStatus, detail?: string) => void,
): Promise<BootResult> {
  onStatus('booting')
  const wc = await WebContainer.boot()

  onStatus('mounting')
  await wc.mount(RALLY_KIT_FILES)

  onStatus('installing', 'Running npm install...')
  const installProcess = await wc.spawn('npm', ['install'])

  installProcess.output.pipeTo(
    new WritableStream({
      write(chunk) {
        console.log('[npm install]', chunk)
      },
    }),
  )

  const installExitCode = await installProcess.exit
  if (installExitCode !== 0) {
    onStatus('error', 'npm install failed')
    throw new Error('npm install failed')
  }

  onStatus('starting', 'Starting dev server...')
  await wc.spawn('npm', ['run', 'dev'])

  return new Promise((resolve) => {
    wc.on('server-ready', (port, url) => {
      onStatus('ready')
      resolve({ webcontainer: wc, previewUrl: url, port })
    })
  })
}
