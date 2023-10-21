"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Languages } from "lucide-react"
import { Locale } from "@/types/i18n.type"
import { usePathname, useRouter } from "next/navigation"

export function LanguageToggle() {
  const pathname = usePathname()
  const router = useRouter()

  function changeLang(locale: Locale) {
    if (!pathname) return "/"
    const segments = pathname.split("/")
    segments[1] = locale
    router.push(segments.join("/"))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem] transition-all" />
          <span className="sr-only">Toggle Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLang("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLang("fa")}>
          Persian
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
