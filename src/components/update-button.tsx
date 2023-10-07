"use client"

import { trpc } from "@/app/_trpc/client"
import { Button } from "./ui/button"
import { useState } from "react"
import Loading from "./loading"
import { toast } from "react-toastify"

export default function UpdateButton() {
  // const { data: updated, isLoading } = trpc.getIsUpdated.useQuery()
  // const updateSystem = trpc.updateSystem.useMutation()
  // const [loading, setLoading] = useState(false)
  // const [finishedUpdating, setFinishedUpdating] = useState(false)
  // async function update() {
  //   setLoading(true)
  //   const data = await updateSystem.mutateAsync()
  //   toast.success(data.message)
  //   setFinishedUpdating(true)
  // }
  // if (isLoading || !updated || finishedUpdating) return <></>
  // else if (loading)
  //   return (
  //     <Button className="w-[80px]" disabled>
  //       <Loading noText />
  //     </Button>
  //   )
  // return (
  //   <Button className="w-[80px]" onClick={update}>
  //     Update
  //   </Button>
  // )
}
