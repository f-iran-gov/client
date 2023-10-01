import { z } from "zod"
import { publicProcedure, router } from "./trpc"
import { connectionStatus } from "./lib/connection-status"
import { vpnConnect } from "./lib/vpn-connect"
import { connectedUsers } from "./lib/connected-users"
import { getServers } from "./lib/get-servers"
import { signUp } from "./lib/sign-up"
import { getCurrentServer } from "./lib/get-current-server"

export const appRouter = router({
  connectionStatus: publicProcedure.query(connectionStatus),
  getCurrentServer: publicProcedure.query(getCurrentServer),
  getEnvVar: publicProcedure.input(z.string()).query(c => process.env[c.input]),
  vpnConnect: publicProcedure
    .input(
      z.object({
        serverName: z.string(),
        country: z.string(),
        countryCode: z.string(),
      })
    )
    .mutation(c => vpnConnect(c.input)),
  connectedUsers: publicProcedure.query(connectedUsers),
  getServers: publicProcedure.query(getServers),
  signUp: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        email: z.string(),
        license: z.string(),
      })
    )
    .mutation(c => signUp(c.input)),
})

export type AppRouter = typeof appRouter
