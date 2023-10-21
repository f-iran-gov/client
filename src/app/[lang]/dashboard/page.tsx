import { Metadata } from "next"
import AvailableServers from "./available-servers"
import ConnectedUsers from "./connected-users"
import ConnectionCard from "./connection-card"
import { serverClient } from "@/app/_trpc/serverClient"
import { getDictionary } from "@/lib/dictionary"
import { Locale } from "@/types/i18n.type"

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "You can manage your VPN services here and connect to new servers and monitor the current users.",
}

export default async function Dashboard({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const users = await serverClient.connectedUsers()
  const dict = await getDictionary(lang)

  return (
    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
      <ConnectedUsers initialData={users} dict={dict} lang={lang} />
      <ConnectionCard dict={dict} lang={lang} />
      <AvailableServers dict={dict} lang={lang} />
    </div>
  )
}
