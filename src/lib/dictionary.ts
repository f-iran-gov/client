import type { Locale } from "@/types/i18n.type"
import "server-only"

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then(module => module.default),
  fa: () => import("@/dictionaries/fa.json").then(module => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>