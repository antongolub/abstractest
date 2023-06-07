import { spawn as _spawn } from 'node:child_process'

export const spawn = (
  cmd: string,
  args: ReadonlyArray<string>,
  opts: Record<string, any>
): Promise<{stdout: string, stderr: string}> => new Promise((resolve, reject) => {
  const now = Date.now()
  const cp = _spawn(cmd, args, opts)
  const stderr: string[] = []
  const stdout: string[] = []
  let status: number | null = 0

  cp.stdout.on('data', (data) => stdout.push(data.toString()))

  cp.stderr.on('data', (data) => stderr.push(data.toString()))

  cp.on('error', (e) => stderr.push(e.toString()))

  cp.on('exit', (code) => {
    status = code
  })

  cp.on('close', () => {
    const result = {
      stderr: stderr.join(''),
      stdout: stdout.join(''),
      status: status,
      signalCode: cp.signalCode,
      duration: Date.now() - now,
    };

    if (!opts.silent) {
      result.stdout && console.log(result.stdout)
      result.stderr && console.error(result.stderr)
    }

    (status ? reject : resolve)(result)
  })
})
