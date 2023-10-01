import Link from "next/link"
import { LanguageToggle } from "./language-toggle"
import { DarkModeToggle } from "./dark-mode"
import { Card } from "./ui/card"
import AuthNav from "./auth-nav"

export default async function Navbar() {
  return (
    <Card className="mx-8 mt-4 flex items-center justify-between p-4">
      <Link href="/" className="flex items-center space-x-4">
        <img
          src="https://wallpapercave.com/wp/8Ww0M0U.jpg"
          alt="Mountain"
          className="h-[50px] w-[50px] rounded-md object-cover"
        />
        <h1 className="text-2xl font-bold">Easy VPN</h1>
      </Link>

      <div className="hidden gap-x-4 xl:flex">
        <AuthNav />
        <LanguageToggle />
        <DarkModeToggle />
      </div>
    </Card>
  )
}
