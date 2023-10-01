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
import { Check, X } from "lucide-react"
import { trpc } from "../_trpc/client"
import { useEffect } from "react"
import { User } from "@/server/lib/connected-users"

export default function ConnectedUsers({
  initialData,
}: {
  initialData: User[]
}) {
  const { data: users, refetch } = trpc.connectedUsers.useQuery(undefined, {
    initialData,
  })

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetch()
  //   }, 2000)

  //   return () => clearInterval(interval)
  // }, [])

  return (
    <Card className="col-span-2 md:col-span-2">
      <CardHeader>Connected Users</CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>MAC Address</TableHead>
              <TableHead className="text-center">Connected</TableHead>
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
