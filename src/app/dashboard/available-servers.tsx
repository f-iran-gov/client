import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { serverClient } from "../_trpc/serverClient"
import Image from "next/image"
import SelectServer from "./select-server"

export default async function AvailableServers() {
  const data = await serverClient.getServers()
  if (!data) return <></>

  return (
    <Card className="col-span-2">
      <CardHeader>Available VPNs</CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Signal</TableHead>
              <TableHead className="text-center">Connect</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(server => (
              <TableRow key={server.id}>
                <TableCell>
                  <div className="flex h-full w-full items-center gap-3 text-center">
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
                  {server.averagePing !== 0 ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>{server.averagePing}</TableCell>
                <TableCell>
                  <div className="mx-auto w-fit">
                    <SelectServer server={server} />
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
