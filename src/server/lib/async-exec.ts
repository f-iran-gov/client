import { ExecException, exec } from "child_process"

export default async function asyncExec<T>(
  cmd: string,
  func?: (err: ExecException | null, stdout: string) => T
) {
  return await new Promise<T>(resolve => {
    exec(cmd, (err, stdout) => {
      const response = func ? func(err, stdout) : (stdout as any)
      return resolve(response)
    })
  })
}
