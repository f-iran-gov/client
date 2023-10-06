import { Server } from "@/types/server.type"
import { avgPing } from "./average-ping"

export async function getServers() {
  let data: Server[] = []

  try {
    const res = await fetch(`${process.env.SERVER_URL}/api/get-all-vpns/`)
    data = await res.json()
  } catch {
    return null
  }

  for (const server of data) {
    const { averagePing } = await avgPing(server.ip.toString())
    data[data.indexOf(server)] = { ...server, averagePing }
  }

  return data
}
