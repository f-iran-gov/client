import { exec } from "child_process"
import { existsSync } from "fs"
import { getServerSession } from "next-auth"
import { db } from "@/db/drizzle-db"
import { currentServer, users } from "@/db/schema"
import { connectionStatus } from "./connection-status"
import { homedir } from "os"
import { eq } from "drizzle-orm"

export async function vpnConnect({
  serverName,
  country,
  countryCode,
}: {
  serverName: string
  country: string
  countryCode: string
}) {
  const payload = { name: serverName, time: Date.now(), country, countryCode }
  const home = homedir()
  const connectCmd = `sudo openvpn --daemon --config ${home}/vpns/${serverName}/vpn.ovpn --auth-user-pass ${home}/vpns/${serverName}/auth.txt --askpass ${home}/vpns/${serverName}/pass.txt`
  const disconnectCmd = "sudo killall openvpn"
  let error: string | null = null

  // Making sure user is logged in
  const session = await getServerSession()
  if (!session) return { success: false, error: "You are not logged in." }
  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  })
  if (!user) return { success: false, error: "You are not logged in." }

  const connected = await connectionStatus()

  const exists = existsSync(`${home}/vpns/${serverName}/vpn.ovpn`)

  // If the VPN exists, we connect to it
  if (connected) {
    await new Promise<void>(resolve => {
      exec(disconnectCmd, err => {
        if (err) error = "Couldn't change the VPN status."
        resolve()
      })
    })

    await db.delete(currentServer)
  } else if (exists) {
    await new Promise<void>(resolve => {
      exec(connectCmd, err => {
        if (err) error = "Couldn't change the VPN status."
        resolve()
      })
    })

    await db.delete(currentServer)
    db.insert(currentServer).values(payload).run()
  } else {
    // Connecting to a new vpn
    const url = `${process.env.SERVER_URL}/api/create-client/${serverName}/${user.license}/`
    const res = await fetch(url)

    if (res.ok) {
      const data: {
        username: string
        password: string
        ovpn: string
      } = await res.json()

      const makeDir = `mkdir -p ${home}/vpns/${serverName}`
      const makeOvpn = `echo "${data.ovpn}" > ${home}/vpns/${serverName}/vpn.ovpn`
      const makeAuth = `echo "${data.username}\n${data.password}" > ${home}/vpns/${serverName}/auth.txt`
      const makePass = `echo "${data.password}" > ${home}/vpns/${serverName}/pass.txt`
      const cmd = `${makeDir} && ${makeOvpn} && ${makeAuth} && ${makePass}`

      // Making all of the files and folders
      await new Promise<void>(resolve => {
        exec(cmd, err => {
          if (err) error = "Error creating the VPN files."
          resolve()
        })
      })

      // Connecting to the VPN
      await new Promise<void>(resolve => {
        exec(connectCmd, err => {
          if (err) error = "Error connecting to VPN server."
          resolve()
        })
      })

      db.insert(currentServer).values(payload).run()
    } else {
      error = "Error connecting to VPN server."
    }
  }

  return { success: error ? false : true, connected: !connected, error }
}
