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
import { Check, X } from "lucide-react"
import Loading from "./loading"

export default function UpdateButton() {
  const { data: updated, isLoading } = trpc.getIsUpdated.useQuery()
  const updateSystem = trpc.updateSystem.useMutation()
  const [state, setState] = useState<
    "confirm" | "pending" | "complete" | "error"
  >("confirm")

  async function update(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (state === "confirm") e.preventDefault()
    setState("pending")
    try {
      const data = await updateSystem.mutateAsync()
      setState("complete")
    } catch (error) {
      setState("error")
      return
    }
  }

  if (!updated && !isLoading)
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-[80px]">Update</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {state === "pending" && (
                <div className="flex items-center gap-3">
                  <Loading noText />
                  Update in progress
                </div>
              )}
              {state === "confirm" && "Update"}
              {state === "complete" && (
                <div className="flex items-center gap-3">
                  <Check color="green" />
                  Update complete
                </div>
              )}
              {state === "error" && (
                <div className="flex items-center gap-3">
                  <X color="red" />
                  Update failed
                </div>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {state === "pending" &&
                "This could take a few minutes, please wait..."}
              {state === "confirm" && "Are you sure you want to update?"}
              {state === "complete" && "You are all good to go!"}
              {state === "error" &&
                "We failed to update your device. Please try again later ;("}
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
