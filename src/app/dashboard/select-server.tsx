"use client"

import { Button } from "@/components/ui/button"
import VpnStore from "@/context/vpn-store"
import { Server } from "@/types/server.type"
import { trpc } from "../_trpc/client"
import Loading from "@/components/loading"
import { wait } from "@/lib/wait"

export default function SelectServer({ server }: { server: Server }) {
  const {
    data: currentServer,
    refetch: refetchCurrentServer,
    isLoading,
  } = trpc.getCurrentServer.useQuery()
  const { data: connected, refetch: refetchConnection } =
    trpc.connectionStatus.useQuery()
  const vpnConnect = trpc.vpnConnect.useMutation()
  const loading = VpnStore(state => state.loading)

  async function handleClick() {
    VpnStore.setState({ loading: true })
    await vpnConnect.mutateAsync({
      serverName: server.name,
      country: server.country,
      countryCode: server.country_code,
    })
    await wait(1)
    await refetchCurrentServer()
    await refetchConnection()
    VpnStore.setState({ server, loading: false, connected: true })
  }

  if (loading || isLoading) return <Loading className="h-8 w-20" noText />

  if (currentServer?.name === server.name && connected)
    return (
      <h1 className="flex h-8 w-20 items-center justify-center">Connected</h1>
    )

  return (
    <Button onClick={handleClick} variant="default" className="h-8 w-20">
      Connect
    </Button>
  )
}
