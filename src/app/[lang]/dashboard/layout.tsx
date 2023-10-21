"use client"

import Loading from "@/components/loading"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") router.push("sign-in")
  }, [status])

  if (status === "authenticated") {
    return <>{children}</>
  } else {
    return <Loading center />
  }
}
