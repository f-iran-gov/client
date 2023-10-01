"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { status } = useSession()
  if (status === "authenticated") router.push("/dashboard")

  return <>{children}</>
}
