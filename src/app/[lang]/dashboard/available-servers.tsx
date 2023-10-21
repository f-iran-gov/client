import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { serverClient } from "@/app/_trpc/serverClient"
import Image from "next/image"
import SelectServer from "./select-server"
import { Dictionary } from "@/lib/dictionary"
import { Locale } from "@/types/i18n.type"

export default async function AvailableServers({
  dict,
  lang,
}: {
  dict: Dictionary
  lang: Locale
}) {
  const data = await serverClient.getServers()
  if (!data) return <></>

  return (
    <Card className="col-span-2" dir={lang === "fa" ? "rtl" : "ltr"}>
      <CardHeader>{dict.dashboard.vpns}</CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dict.dashboard.country}</TableHead>
              <TableHead>{dict.dashboard.name}</TableHead>
              <TableHead>{dict.dashboard.status}</TableHead>
              <TableHead>{dict.dashboard.signal}</TableHead>
              <TableHead>{dict.dashboard.connect}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(server => (
              <TableRow key={server.id}>
                <TableCell className="p-1">
                  <div className="flex h-full w-full items-center gap-3">
                    <Image
                      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${server.country_code.toUpperCase()}.svg`}
                      width={20}
                      height={20}
                      alt={server.country_code}
                    />
                    <h1>{server.country}</h1>
                  </div>
                </TableCell>
                <TableCell>{server.name}</TableCell>
                <TableCell
                  className={
                    server.averagePing !== 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {server.averagePing !== 0
                    ? dict.dashboard.active
                    : dict.dashboard.inactive}
                </TableCell>
                <TableCell>{server.averagePing}</TableCell>
                <TableCell>
                  <div className="mx-auto w-fit">
                    <SelectServer server={server} dict={dict} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
