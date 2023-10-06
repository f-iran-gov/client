import { exec } from "child_process"

const gotoDir = "cd /var/www/client/"
const pull = "sudo git pull origin master"
const npmBuild = "npm i && npm run build"
const bunBuild = "bun install && bun run build"
const resetPM2 = "pm2 delete all && pm2 start npm --name client -- start"
const restartNginx = "sudo systemctl restart nginx"

export async function isUpdated() {
  const updated = await new Promise<boolean>(res => {
    exec(`${gotoDir} && ${pull}`, (err, stdout) => {
      if (err) return
      const updated = stdout.includes("Already up to date.")
      res(updated)
    })
  })

  return updated
}

export async function updateSystem(): Promise<{
  updated: boolean
  message: string
}> {
  const updated = await isUpdated()

  if (updated) {
    return { updated, message: "Already up to date." }
  } else {
    // Already in /var/www/client and pulled from git
    exec(`${bunBuild} && ${resetPM2} && ${restartNginx}`)
    return { updated, message: "Updated." }
  }
}
