import { spawn as _spawn } from 'node:child_process'

export const spawn = (
  cmd: string,
  args: ReadonlyArray<string>,
  opts: Record<string, any>
): Promise<{stdout: string, stderr: string}> => new Promise((resolve, reject) => {
  const cp = _spawn(cmd, args, opts)
  const stderr: string[] = []
  const stdout: string[] = []
  let failure: boolean

  cp.stdout.on('data', (data) => {
    stdout.push(data.toString())
  })

  cp.stderr.on('data', (data) => {
    stderr.push(data.toString())
  })

  cp.on('error', (e) => {
    failure = true
    stderr.push(e.toString())
  })

  cp.on('close', () => {
    const result = {
      stderr: stderr.join(''),
      stdout: stdout.join('')
    };

    (failure ? reject : resolve)(result)
  })
})
