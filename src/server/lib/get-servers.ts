import { Server } from "@/types/server.type"
import { avgPing } from "./average-ping"
import torRequest from "./tor-request"

export async function getServers() {
  let servers: Server[] = []

  try {
    const res = await torRequest("/api/get-all-vpns/")
    servers = res.data as Server[]
  } catch {
    return null
  }

  for (const server of servers) {
    const { averagePing } = await avgPing(server.ip.toString())
    servers[servers.indexOf(server)] = { ...server, averagePing }
  }

  return servers
}
