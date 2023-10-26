"use client"

import { Button } from "@/components/ui/button"
import VpnStore from "@/context/vpn-store"
import { Server } from "@/types/server.type"
import Loading from "@/components/loading"
import { wait } from "@/lib/wait"
import { toast } from "react-toastify"
import { trpc } from "@/app/_trpc/client"
import useLocalStore from "@/context/locale-store"

export default function SelectServer({ server }: { server: Server }) {
  const {
    data: currentServer,
    refetch: refetchCurrentServer,
    isLoading,
  } = trpc.getCurrentServer.useQuery()
  const { data: connected, refetch: refetchConnection } =
    trpc.connectionStatus.useQuery()
  const dict = useLocalStore(state => state.dict)
  const vpnConnect = trpc.vpnConnect.useMutation()
  const loading = VpnStore(state => state.loading)

  async function handleClick() {
    VpnStore.setState({ loading: true })
    const res = await vpnConnect.mutateAsync({
      serverName: server.name,
      country: server.country,
      countryCode: server.country_code,
    })
    if (res.error) {
      toast.error(res.error)
    }
    await wait(1)
    await refetchCurrentServer()
    await refetchConnection()
    VpnStore.setState({ server, loading: false, connected: true })
  }

  if (loading || isLoading) return <Loading className="h-8 w-20" noText />

  if (currentServer?.name === server.name && connected)
    return (
      <h1 className="flex h-8 w-20 items-center justify-center">
        {dict.dashboard.connected}
      </h1>
    )

  return (
    <Button onClick={handleClick} variant="default" className="h-8 w-20">
      {dict.dashboard.connect}
    </Button>
  )
}
