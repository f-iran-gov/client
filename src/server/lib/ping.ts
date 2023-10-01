import { exec } from "child_process"

export async function ping(input: string) {
  let connected = true

  await new Promise<void>(resolve => {
    exec(`ping ${input} -c 1 -i 1 -w 1 -W 1`, err => {
      if (err) connected = false
      resolve()
    })
  })

  return connected
}
