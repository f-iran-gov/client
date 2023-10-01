"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Languages } from "lucide-react"

type LangType = "English" | "Persian"

export function LanguageToggle() {
  async function changeLang(lang: LangType) {}

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem] transition-all" />
          <span className="sr-only">Toggle Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLang("English")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLang("Persian")}>
          Persian
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
