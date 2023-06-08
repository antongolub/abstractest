import cp from 'node:child_process'

export const spawn = (
  cmd: string,
  args: ReadonlyArray<string>,
  opts: Record<string, any>
): Promise<{stdout: string, stderr: string}> => new Promise((resolve, reject) => {
  let status: number | null = 0
  const now = Date.now()
  const stderr: string[] = []
  const stdout: string[] = []
  const p = cp.spawn(cmd, args, opts)

  p.stdout.on('data', (data) => stdout.push(data.toString()))

  p.stderr.on('data', (data) => stderr.push(data.toString()))

  p.on('error', (e) => stderr.push(e.toString()))

  p.on('exit', (code) => {
    status = code
  })

  p.on('close', () => {
    const result = {
      stderr: stderr.join(''),
      stdout: stdout.join(''),
      status: status,
      signalCode: p.signalCode,
      duration: Date.now() - now,
    }

    if (!opts.silent) {
      result.stdout && console.log(result.stdout)
      result.stderr && console.error(result.stderr)
    }

    (status ? reject : resolve)(result)
  })
})
