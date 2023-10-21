import { Button } from "@/components/ui/button"
import { getDictionary } from "@/lib/dictionary"
import { Locale } from "@/types/i18n.type"
import Link from "next/link"

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const { home } = await getDictionary(lang)

  return (
    <div className="">
      <h1 className="mb-12 text-center text-4xl font-bold">{home.title}</h1>
      <div className="mx-auto flex w-[50%] flex-col gap-4">
        <Link href="license">
          <Button className="w-full">{home.register}</Button>
        </Link>
        <Link href="sign-in">
          <Button className="w-full">{home.login}</Button>
        </Link>
      </div>
    </div>
  )
}
