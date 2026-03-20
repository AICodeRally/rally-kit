import type { WebContainer } from '@webcontainer/api'

export async function writeFile(
  wc: WebContainer,
  path: string,
  content: string,
): Promise<{ success: boolean; path: string }> {
  const dir = path.substring(0, path.lastIndexOf('/'))
  if (dir) {
    await wc.fs.mkdir(dir, { recursive: true })
  }
  await wc.fs.writeFile(path, content)
  return { success: true, path }
}

export async function readFile(
  wc: WebContainer,
  path: string,
): Promise<{ content: string }> {
  const content = await wc.fs.readFile(path, 'utf-8')
  return { content }
}

export async function listFiles(
  wc: WebContainer,
  path: string,
): Promise<{ files: string[] }> {
  const entries = await wc.fs.readdir(path, { withFileTypes: true })
  const files = entries.map((e) => {
    const name = typeof e === 'string' ? e : e.name
    const isDir = typeof e === 'string' ? false : e.isDirectory()
    return isDir ? `${name}/` : name
  })
  return { files }
}
