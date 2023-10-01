import { exec } from "child_process"

export async function avgPing(input: string) {
  let averagePing = 0
  let success = true

  await new Promise<void>(resolve => {
    exec(`ping ${input} -c 10 -i 0.1`, (err, stdout) => {
      if (err) {
        success = false
        resolve()
        return
      }

      const ping: number[] = []

      // filter the results
      const lines = stdout
        .toString()
        .split("\n")
        .map(line => line.split("time=")[1]?.split("ms")[0]?.trim())
      for (const line of lines) {
        if (line) ping.push(parseFloat(line))
      }

      // print the average ping
      averagePing = ping.reduce((a, b) => a + b, 0) / ping.length
      averagePing = Math.round(averagePing)

      resolve()
    })
  })

  return { success, averagePing }
}
