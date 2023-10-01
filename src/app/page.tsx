import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="">
      <h1 className="mb-12 text-center text-4xl font-bold">
        Welcome to your new VPN service provider.
      </h1>
      <div className="mx-auto flex w-[50%] flex-col gap-4">
        <Link href="license">
          <Button className="w-full" variant="outline">
            New User
          </Button>
        </Link>
        <Link href="sign-in">
          <Button className="w-full">Existing User</Button>
        </Link>
      </div>
    </div>
  )
}
