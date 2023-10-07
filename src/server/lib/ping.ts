import asyncExec from "./async-exec"

export async function ping(input: string) {
  return await asyncExec(`ping ${input} -c 1 -i 1 -w 1 -W 1`, err => {
    if (err) return false
    else return true
  })
}
