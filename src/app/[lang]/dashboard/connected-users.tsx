import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Check, RefreshCcw, X } from "lucide-react"
import useLocalStore from "@/context/locale-store"
import { serverClient } from "@/app/_trpc/serverClient"
import { revalidatePath } from "next/cache"
import { getDictionary } from "@/lib/dictionary"

export default async function ConnectedUsers() {
  const users = await serverClient.connectedUsers()
  const lang = useLocalStore.getState().lang
  const dict = await getDictionary(lang)

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetch()
  //   }, 2000)

  //   return () => clearInterval(interval)
  // }, [])

  // if (isLoading) {
  //   return (
  //     <Card className="col-span-2 md:col-span-2">
  //       <CardHeader className="flex flex-row items-center gap-x-4">
  //         <h1>{dict.dashboard.users}</h1>
  //         <Loading noText />
  //       </CardHeader>
  //     </Card>
  //   )
  // }

  return (
    <Card className="col-span-2 md:col-span-2">
      <CardHeader
        className="flex flex-row items-center gap-x-4"
        dir={lang === "fa" ? "rtl" : "ltr"}
      >
        <h1>{dict.dashboard.users}</h1>
        <form action="">
          <button
            formAction={async () => {
              "use server"
              console.log(`/${lang}/dashboard`)
              revalidatePath(`/${lang}/dashboard`)
            }}
            className="transition duration-500 hover:rotate-180 hover:scale-105"
          >
            <RefreshCcw size={20} />
          </button>
        </form>
      </CardHeader>
      <CardContent dir={lang === "fa" ? "rtl" : "ltr"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dict.dashboard.name}</TableHead>
              <TableHead>{dict.dashboard.ip}</TableHead>
              <TableHead>{dict.dashboard.mac}</TableHead>
              <TableHead>{dict.dashboard.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.ip}</TableCell>
                <TableCell>{user.mac}</TableCell>
                <TableCell className="flex justify-center">
                  {user.connected ? <Check /> : <X />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
