import { create } from "zustand"
import { Server } from "@/types/server.type"

type VpnStoreType = {
  license: string | null
  connected: boolean
  server: Server | null
  loading: boolean
}

const VpnStore = create<VpnStoreType>(set => ({
  license: null,
  connected: false,
  server: null,
  loading: true,
}))

export default VpnStore
