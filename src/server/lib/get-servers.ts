import { Server } from "@/types/server.type"
import { avgPing } from "./average-ping"

export async function getServers() {
  let data: Server[] = []
  console.log("url: ", process.env.SERVER_URL)

  try {
    const res = await fetch(`${process.env.SERVER_URL}/api/get-all-vpns/`)
    data = await res.json()
    console.log("res: ", data)
  } catch {
    console.log("Error fetching servers")
    return null
  }

  for (const server of data) {
    const { averagePing } = await avgPing(server.ip.toString())
    data[data.indexOf(server)] = { ...server, averagePing }
  }

  return data
}
