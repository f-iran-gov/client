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
import { toast } from "react-toastify"
import useLocalStore from "@/context/locale-store"

export default function UpdateButton() {
  const { navbar } = useLocalStore(state => state.dict)
  const { data: updated, isLoading, refetch } = trpc.getIsUpdated.useQuery()
  const updateSystem = trpc.updateSystem.useMutation()
  const [state, setState] = useState<
    "confirm" | "pending" | "complete" | "error"
  >("confirm")
  const [hide, setHide] = useState(false)

  async function update(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (state === "confirm") e.preventDefault()
    setState("pending")
    try {
      const data = await updateSystem.mutateAsync()
      if (!data.updated) {
        toast.error(navbar.updateFailed)
        setState("error")
      } else {
        setState("complete")
      }
    } catch (error) {
      toast.error(navbar.updateFailed)
      setState("error")
      return
    }
  }

  async function close() {
    setHide(true)
    await refetch()
  }

  if (!updated && !isLoading && !hide)
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-[80px]">{navbar.update}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {state === "pending" && (
                <div className="flex items-center gap-3">
                  <Loading noText />
                  {navbar.updateInProgress}
                </div>
              )}
              {state === "confirm" && "Update"}
              {state === "complete" && (
                <div className="flex items-center gap-3">
                  <Check color="green" />
                  {navbar.updateComplete}
                </div>
              )}
              {state === "error" && (
                <div className="flex items-center gap-3">
                  <X color="red" />
                  {navbar.updateFailed}
                </div>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {state === "pending" && navbar.updateWait}
              {state === "confirm" && navbar.updateConfirm}
              {state === "complete" && navbar.updateFinished}
              {state === "error" && navbar.updateError}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {state === "confirm" && (
              <>
                <AlertDialogCancel>{navbar.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={update}>
                  {navbar.update}
                </AlertDialogAction>
              </>
            )}
            {state === "complete" && (
              <AlertDialogCancel onClick={close}>
                {navbar.close}
              </AlertDialogCancel>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
}
