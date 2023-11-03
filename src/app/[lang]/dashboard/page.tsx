import { Metadata } from "next"
import AvailableServers from "./available-servers"
import ConnectedUsers from "./connected-users"
import ConnectionCard from "./connection-card"

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "You can manage your VPN services here and connect to new servers and monitor the current users.",
}

export default async function Dashboard() {
  return (
    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
      <ConnectedUsers />
      <ConnectionCard />
      <AvailableServers />
    </div>
  )
}
