import { Dictionary, Locale, i18n } from "@/types/i18n.type"
import { create } from "zustand"

type LocalStoreType = {
  lang: Locale
  dict: Dictionary
}

const useLocalStore = create<LocalStoreType>(set => ({
  lang: i18n.defaultLocale,
  dict: {} as Dictionary,
}))

export default useLocalStore
