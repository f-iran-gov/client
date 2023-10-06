import { exec } from "child_process"
import { ping } from "./ping"

export type User = {
  id: number
  name: string
  ip: string
  mac: string
  connected: boolean
}

export async function connectedUsers() {
  const users: User[] = []

  await new Promise<void>(resolve => {
    const cmd =
      "sudo arp -a" + (process.env.NODE_ENV === "production" && " | grep 10.39")
    exec(cmd, async (err, stdout) => {
      if (err) return

      const lines = stdout.split("\n")

      for (let id = 0; id < lines.length; id++) {
        const line = lines[id]
        if (line === "") continue
        const sub = line.split(" ")
        const name =
          sub[0] === "?"
            ? "Unknown"
            : sub[0].split(".")[0].replace("_", " ").trim()
        const ip = sub[1].replace("(", "").replace(")", "")
        const mac = sub[3] === "<incomplete>" ? "Unknown" : sub[3]
        const connected = await ping(ip)

        users.push({ id, name, ip, mac, connected })
      }

      resolve()
    })
  })

  return users
}
