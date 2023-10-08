import { existsSync } from "fs"
import { getServerSession } from "next-auth"
import { db } from "@/db/drizzle-db"
import { currentServer, users } from "@/db/schema"
import { connectionStatus } from "./connection-status"
import { homedir } from "os"
import { eq } from "drizzle-orm"
import { VpnConnectType } from ".."
import asyncExec from "./async-exec"

export async function vpnConnect({
  serverName,
  country,
  countryCode,
}: VpnConnectType) {
  const payload = { name: serverName, time: Date.now(), country, countryCode }
  const home = homedir()
  const connectCmd = `sudo openvpn --daemon --config ${home}/vpns/${serverName}/vpn.ovpn --auth-user-pass ${home}/vpns/${serverName}/auth.txt --askpass ${home}/vpns/${serverName}/pass.txt`
  const disconnectCmd = "sudo killall openvpn"
  let error: string | null = null

  // Making sure user is logged in
  const session = await getServerSession()
  if (!session)
    return {
      success: false,
      error: "You must first be logged in.",
      connected: false,
    }
  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  })
  if (!user)
    return {
      success: false,
      error: "You must first be logged in.",
      connected: false,
    }

  const connected = await connectionStatus()
  const exists = existsSync(`${home}/vpns/${serverName}/vpn.ovpn`)

  // If the VPN exists, we connect to it
  if (connected) {
    error = await asyncExec(disconnectCmd, err => {
      if (err) return "Couldn't change the VPN status."
      return null
    })

    const server = await db.query.currentServer.findFirst()
    await db.delete(currentServer)

    // User is already connected, but is just switching vpns
    if (serverName !== server?.name) {
      error = await asyncExec(connectCmd, err => {
        if (err) error = "Couldn't change the VPN status."
        return null
      })
      db.insert(currentServer).values(payload).run()
    }
  } else if (exists) {
    // Connecting to an existing vpn
    error = await asyncExec(connectCmd, err => {
      if (err) error = "Couldn't change the VPN status."
      return null
    })

    // Updating the current server in the DB
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
      const initVpn = `${makeDir} && ${makeOvpn} && ${makeAuth} && ${makePass}`

      // Making all of the files and folders
      error = await asyncExec(initVpn, err => {
        if (err) return "An error happened when creating the VPN."
        return null
      })

      // Connecting to the VPN
      error = await asyncExec(connectCmd, err => {
        if (err) return "An error occurred when connecting to the VPN."
        return null
      })

      db.insert(currentServer).values(payload).run()
    } else {
      error = "Error connecting to VPN server."
    }
  }

  return { success: error ? false : true, connected: !connected, error }
}
