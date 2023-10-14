import { z } from "zod"
import { publicProcedure, router } from "./trpc"
import { connectionStatus } from "./lib/connection-status"
import { vpnConnect } from "./lib/vpn-connect"
import { connectedUsers } from "./lib/connected-users"
import { getServers } from "./lib/get-servers"
import { signUp } from "./lib/sign-up"
import { getCurrentServer } from "./lib/get-current-server"
import { isUpdated, updateSystem } from "./lib/update-system"
import torRequest from "./lib/tor-request"

const VpnConnectZod = z.object({
  serverName: z.string(),
  country: z.string(),
  countryCode: z.string(),
})
export type VpnConnectType = z.infer<typeof VpnConnectZod>

const SignUpZod = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string(),
  license: z.string(),
})
export type SignUpType = z.infer<typeof SignUpZod>

export const appRouter = router({
  connectionStatus: publicProcedure.query(connectionStatus),
  getCurrentServer: publicProcedure.query(getCurrentServer),
  getIsUpdated: publicProcedure.query(isUpdated),
  updateSystem: publicProcedure.mutation(updateSystem),
  torRequest: publicProcedure
    .input(z.string())
    .mutation(c => torRequest(c.input)),
  vpnConnect: publicProcedure
    .input(VpnConnectZod)
    .mutation(({ input }) => vpnConnect(input)),
  connectedUsers: publicProcedure.query(connectedUsers),
  getServers: publicProcedure.query(getServers),
  signUp: publicProcedure.input(SignUpZod).mutation(c => signUp(c.input)),
})

export type AppRouter = typeof appRouter
