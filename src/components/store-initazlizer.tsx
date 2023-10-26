"use client"

import useLocalStore from "@/context/locale-store"
import { Dictionary, Locale } from "@/types/i18n.type"
import { useRef } from "react"

export default function StoreInitializer({
  dict,
  lang,
}: {
  dict: Dictionary
  lang: Locale
}) {
  const initialized = useRef(false)
  if (!initialized.current) {
    useLocalStore.setState({ dict, lang })
    initialized.current = true
  }

  return null
}
