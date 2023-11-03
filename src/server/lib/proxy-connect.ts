import { getServerSession } from "next-auth"
import { db } from "@/db/drizzle-db"
import { currentServer, servers, users } from "@/db/schema"
import { connectionStatus } from "./connection-status"
import { homedir } from "os"
import { eq } from "drizzle-orm"
import { VpnConnectType } from ".."
import asyncExec from "./async-exec"
import torRequest from "./tor-request"

export async function proxyConnect({
  serverName,
  country,
  countryCode,
}: VpnConnectType) {
  const payload = { name: serverName, time: Date.now(), country, countryCode }
  const home = homedir()
  const connectCmd = `sudo ${home}/connect-redsocks.sh`
  const disconnectCmd = `sudo ${home}/disconnect-redsocks.sh`
  let error: string | null = null

  // Making sure user is logged in
  const session = await getServerSession()
  if (!session) {
    return {
      success: false,
      error: "You must first be logged in.",
      connected: false,
    }
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  })
  if (!user) {
    return {
      success: false,
      error: "You must first be logged in.",
      connected: false,
    }
  }

  const connected = await connectionStatus()
  const server = await db.query.servers.findFirst({
    where: eq(currentServer.name, serverName),
  })

  if (connected) {
    error = await asyncExec(disconnectCmd, err => {
      if (err) return "Couldn't change the VPN status."
      return null
    })

    const currServer = await db.query.currentServer.findFirst()
    console.log("currServer", currServer)
    console.log("server", serverName)

    await db.delete(currentServer)

    // User is already connected, but is just switching vpns
    if (serverName !== "" && serverName !== currServer?.name) {
      const target = await db.query.servers.findFirst({
        where: eq(servers.name, serverName),
      })
      await updateRedsocksConf(
        target!.ip,
        target!.port,
        target!.username,
        target!.password
      )
      error = await asyncExec(connectCmd, err => {
        if (err) error = "Couldn't change the VPN status."
        return null
      })
      db.insert(currentServer).values(payload).run()
    }
  } else if (server !== undefined) {
    // Update the redsocks config file
    await updateRedsocksConf(
      server.ip,
      server.port,
      server.username,
      server.password
    )

    // Connecting to an existing vpn
    error = await asyncExec(connectCmd, err => {
      if (err) error = "Couldn't change the VPN status."
      return null
    })

    // Updating the current server in the DB
    db.delete(currentServer).run()
    db.insert(currentServer).values(payload).run()
  } else {
    // Connecting to a new vpn
    const url = `/api/create-client/${serverName}/${user.license}/`
    const res = await torRequest(url)

    if (res.success) {
      const data: {
        error?: string
        ip: string
        port: number
        username: string
        password: string
      } = res.data as any

      if (data.error) return { success: false, error: data.error, connected }

      // Update the redsocks config file
      await updateRedsocksConf(data.ip, data.port, data.username, data.password)

      // Connecting to the VPN
      error = await asyncExec(connectCmd, err => {
        if (err) return "An error occurred when connecting to the VPN."
        return null
      })

      if (error) return { success: false, error, connected }

      // Updating the servers and the current server in the DB
      const values = {
        name: serverName,
        ip: data.ip,
        port: data.port,
        username: data.username,
        password: data.password,
        country,
        countryCode,
      }
      db.insert(servers).values(values).run()
      db.insert(currentServer).values(payload).run()
    } else {
      error = "Error connecting to VPN server."
    }
  }

  return { success: error ? false : true, connected: !connected, error }
}

async function updateRedsocksConf(
  ip: string,
  port: number,
  username: string,
  password: string
) {
  const newConf = `
    base {
      log_debug = off;
      log_info = on;
      log = \\"file:/var/log/redsocks.log\\";
      daemon = on;
      user = redsocks;
      group = redsocks;
      redirector = iptables;
    }

    redsocks {
      ip = ${ip};
      port = ${port};
      type = socks5;
      login = \\"${username}\\";
      password = \\"${password}\\";

      local_ip = 0.0.0.0;
      local_port = 12345;
    }

    redudp {
      ip = ${ip};
      port = ${port};
      login = \\"${username}\\";
      password = \\"${password}\\";

      dest_ip = 192.0.2.2;
      dest_port = 53;
      udp_timeout = 30;
      udp_timeout_stream = 180;
      local_ip = 0.0.0.0;
      local_port = 10053;
    }

    dnstc {
      local_ip = 0.0.0.0;
      local_port = 5300;
    }
  `

  const confPath = "/etc/redsocks.conf"
  const cmd = `echo "${newConf}" | sudo tee ${confPath}`
  await asyncExec(cmd)
  return true
}
