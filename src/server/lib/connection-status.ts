import { exec } from "child_process"

export async function connectionStatus() {
  let connected = false

  await new Promise<void>((resolve, reject) => {
    exec("ps aux | pgrep openvpn", (err, stdout, stderr) => {
      if (err) {
        connected = false
      }
      if (stdout) {
        connected = true
      }
      resolve()
    })
  })

  if (!connected) return connected

  return connected
}
