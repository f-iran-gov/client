"use client"

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
import { trpc } from "@/app/_trpc/client"
import { User } from "@/server/lib/connected-users"
import Loading from "@/components/loading"
import { Dictionary } from "@/lib/dictionary"
import { Locale } from "@/types/i18n.type"

export default function ConnectedUsers({
  initialData,
  dict,
  lang,
}: {
  initialData: User[]
  dict: Dictionary
  lang: Locale
}) {
  const {
    data: users,
    refetch,
    isLoading,
  } = trpc.connectedUsers.useQuery(undefined, {
    initialData,
  })

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetch()
  //   }, 2000)

  //   return () => clearInterval(interval)
  // }, [])

  if (isLoading) {
    return (
      <Card className="col-span-2 md:col-span-2">
        <CardHeader className="flex flex-row items-center gap-x-4">
          <h1>{dict.dashboard.users}</h1>
          <Loading noText />
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="col-span-2 md:col-span-2">
      <CardHeader
        className="flex flex-row items-center gap-x-4"
        dir={lang === "fa" ? "rtl" : "ltr"}
      >
        <h1>{dict.dashboard.users}</h1>
        <RefreshCcw
          className="cursor-pointer transition duration-500 hover:rotate-180 hover:scale-105"
          size={20}
          onClick={() => {
            console.log("first")
            refetch()
          }}
        />
      </CardHeader>
      <CardContent dir={lang === "fa" ? "rtl" : "ltr"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dict.dashboard.name}</TableHead>
              <TableHead>{dict.dashboard.ip}</TableHead>
              <TableHead>{dict.dashboard.ip}</TableHead>
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
