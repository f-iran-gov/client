import asyncExec from "./async-exec"

export async function avgPing(input: string) {
  const cmd = `ping ${input} -c 10 -i 0.1`
  let success = true

  const averagePing = await asyncExec(cmd, (err, stdout) => {
    if (err) {
      success = false
      return 0
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

    const avgPing = ping.reduce((a, b) => a + b, 0) / ping.length
    return Math.round(avgPing)
  })

  return { success, averagePing }
}
