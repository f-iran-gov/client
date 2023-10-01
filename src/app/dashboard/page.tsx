import { Metadata } from "next"
import AvailableServers from "./available-servers"
import ConnectedUsers from "./connected-users"
import ConnectionCard from "./connection-card"
import { serverClient } from "../_trpc/serverClient"

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "You can manage your VPN services here and connect to new servers and monitor the current users.",
}

export default async function Dashboard() {
  const users = await serverClient.connectedUsers()

  return (
    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
      <ConnectedUsers initialData={users} />
      <ConnectionCard />
      <AvailableServers />
    </div>
  )
}
