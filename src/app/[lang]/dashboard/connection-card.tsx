"use client"

import { Power } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/app/_trpc/client"
import { wait } from "@/lib/wait"
import VpnStore from "@/context/vpn-store"
import { useEffect } from "react"
import ConnectionDuration from "./connection-duration"
import { toast } from "react-toastify"
import useLocalStore from "@/context/locale-store"

export default function ConnectionCard() {
  const { data: server, refetch: refetchServer } =
    trpc.getCurrentServer.useQuery()
  const {
    data: connected,
    isLoading,
    refetch: refetchStatus,
  } = trpc.connectionStatus.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
  const dict = useLocalStore(state => state.dict)
  const lang = useLocalStore(state => state.lang)
  const proxyConnect = trpc.proxyConnect.useMutation()
  const loading = VpnStore(state => state.loading)

  useEffect(() => {
    VpnStore.setState({ connected, loading: false })
  }, [connected])

  async function toggleConnection() {
    const defaultServer = {
      serverName: connected ? "" : "NewYork-1",
      country: connected ? "" : "United States",
      countryCode: connected ? "" : "US",
    }
    VpnStore.setState({ loading: true })
    const res = await proxyConnect.mutateAsync(defaultServer)
    if (res.error) {
      toast.error(res.error)
    }
    await wait(1) // just so the user doesn't go crazy with vpn connection commands
    const { data } = await refetchStatus()
    await refetchServer()
    VpnStore.setState({ connected: data, loading: false })
  }

  if (isLoading || loading) {
    return (
      <Card className="col-span-2 py-4 text-lg md:col-span-2 md:h-[450px] lg:col-span-1">
        <CardContent>
          <Skeleton className="mx-auto h-[200px] w-[200px] rounded-full md:h-[150px] md:w-[150px] xl:h-[200px] xl:w-[200px]" />
        </CardContent>
        <CardFooter className="flex flex-col gap-y-8">
          <Skeleton className="h-[20px] w-full" />
          <Skeleton className="h-[20px] w-full" />
          <Skeleton className="h-[20px] w-full" />
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card
      className="col-span-2 py-4 md:col-span-2 md:h-[450px] lg:col-span-1 lg:text-lg"
      dir={lang === "fa" ? "rtl" : "ltr"}
    >
      <CardContent>
        <button
          onClick={toggleConnection}
          className={
            "mx-auto flex h-[200px] w-[200px] flex-col items-center justify-center gap-y-4 rounded-full border-8 transition hover:scale-105 md:h-[150px] md:w-[150px] xl:h-[200px] xl:w-[200px] " +
            (connected ? "border-green-500" : "border-[#2c66f5]")
          }
        >
          <Power size={40} />
          <h1>
            {connected ? dict.dashboard.disconnect : dict.dashboard.connect}
          </h1>
        </button>
      </CardContent>
      <CardFooter className="flex w-full flex-col gap-y-4">
        <div className="flex w-full justify-between">
          <h1>{dict.dashboard.status}</h1>
          <h1 className={connected ? "text-green-500" : "text-red-500"}>
            {connected ? dict.dashboard.connected : dict.dashboard.disconnected}
          </h1>
        </div>
        {connected && (
          <>
            <div className="flex w-full justify-between">
              <h1>{dict.dashboard.name}</h1>
              <h1>{server?.name}</h1>
            </div>
            <div className="flex w-full justify-between">
              <h1>{dict.dashboard.duration}</h1>
              <ConnectionDuration time={server?.time} />
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
