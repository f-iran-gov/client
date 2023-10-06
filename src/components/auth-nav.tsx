"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function AuthNav() {
  const { status, update } = useSession()
  const path = usePathname()

  useEffect(() => {
    update()
  }, [path])

  if (status !== "unauthenticated") {
    return (
      <>
        <Button onClick={() => signOut({ callbackUrl: "/" })}>Log out</Button>
      </>
    )
  }

  return (
    <>
      <Button>
        <Link href="/sign-in">Login</Link>
      </Button>
      <Button>
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    </>
  )
}
