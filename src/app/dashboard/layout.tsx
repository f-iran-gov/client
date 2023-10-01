"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { status } = useSession()
  if (status === "unauthenticated") router.push("/sign-in")

  return <>{children}</>
}
