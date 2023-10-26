"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import useLocalStore from "@/context/locale-store"

export default function AuthNav() {
  const { status, update } = useSession()
  const { auth } = useLocalStore(state => state.dict)
  const path = usePathname()

  useEffect(() => {
    update()
  }, [path])

  if (status !== "unauthenticated") {
    return (
      <>
        <Button onClick={() => signOut({ callbackUrl: "/" })}>
          {auth.signOut}
        </Button>
      </>
    )
  }

  return (
    <>
      <Link href="sign-in">
        <Button>{auth.signIn}</Button>
      </Link>

      <Link href="sign-up">
        <Button>{auth.register}</Button>
      </Link>
    </>
  )
}
