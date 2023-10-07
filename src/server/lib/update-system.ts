import asyncExec from "./async-exec"
import { homedir } from "os"

export async function isUpdated() {
  const cd = "cd /var/www/client/"
  const pull = "sudo git pull origin master"

  return await asyncExec(`${cd} && ${pull}`, (err, stdout) => {
    if (err) return false
    return stdout.includes("Already up to date.")
  })
}

export async function updateSystem(): Promise<{
  updated: boolean
  message: string
}> {
  const updated = await isUpdated()

  if (updated) {
    return { updated, message: "Already up to date." }
  }

  return await asyncExec(homedir() + "/update.sh", err => {
    if (err) return { updated: false, message: "Error updating." }
    return { updated: true, message: "Updated." }
  })
}
