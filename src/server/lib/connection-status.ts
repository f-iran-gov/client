import asyncExec from "./async-exec"

export async function connectionStatus() {
  return await asyncExec("ps aux | pgrep openvpn", (err, stdout) => {
    if (stdout) return true
    return false
  })
}
