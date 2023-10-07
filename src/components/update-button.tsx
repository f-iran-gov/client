"use client"

import { trpc } from "@/app/_trpc/client"
import { Button } from "./ui/button"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function UpdateButton() {
  const { data: updated, isLoading } = trpc.getIsUpdated.useQuery()
  const updateSystem = trpc.updateSystem.useMutation()
  const [finishedUpdating, setFinishedUpdating] = useState(false)
  const [state, setState] = useState<
    "confirm" | "pending" | "complete" | "error"
  >("confirm")

  async function update(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (state === "confirm") e.preventDefault()
    setState("pending")
    try {
      await updateSystem.mutateAsync()
    } catch (error) {
      setState("error")
      return
    }
    setFinishedUpdating(true)
    setState("complete")
  }

  if (!finishedUpdating && !updated && !isLoading)
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-[80px]">Update</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {state === "pending" && "Update in progress"}
              {state === "confirm" && "Update"}
              {state === "complete" && "Update complete"}
              {state === "error" && "Update failed"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {state === "pending" &&
                "This could take a few minutes, please wait..."}
              {state === "confirm" && "Are you sure you want to update?"}
              {state === "complete" && "You are all good to go!"}
              {state === "error" && "Update failed!"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {state === "confirm" && (
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            )}
            {state !== "pending" && (
              <AlertDialogAction onClick={update}>
                {state === "confirm" ? "Update" : "Close"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
}
