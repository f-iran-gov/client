import Link from "next/link"
import { LanguageToggle } from "./language-toggle"
import { DarkModeToggle } from "./dark-mode"
import { Card } from "./ui/card"
import AuthNav from "./auth-nav"
import UpdateButton from "./update-button"
import useLocalStore from "@/context/locale-store"

export default function Navbar() {
  const locale = useLocalStore.getState()

  return (
    <Card className="mx-8 mt-4 flex items-center justify-between p-4">
      <Link href={`/${locale.lang}`} className="flex items-center space-x-4">
        <img
          src="https://wallpapercave.com/wp/8Ww0M0U.jpg"
          alt="Mountain"
          className="h-[50px] w-[50px] rounded-md object-cover"
        />
        <h1 className="text-2xl font-bold">{locale.dict.navbar.title}</h1>
      </Link>

      <div className="hidden gap-x-4 xl:flex">
        <AuthNav />
        <UpdateButton />
        <LanguageToggle />
        <DarkModeToggle />
      </div>
    </Card>
  )
}
