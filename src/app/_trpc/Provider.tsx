"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import React, { useState } from "react"
import { trpc } from "./client"

export default function Provider({ children }: { children: React.ReactNode }) {
  const url =
    (process.env.NEXT_PUBLIC_HOSTNAME ?? "http://localhost:3001") + "/api/trpc"

  const [queryClient] = useState(() => new QueryClient({}))
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url })],
    })
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
