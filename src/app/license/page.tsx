"use client"

import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import VpnStore from "@/context/vpn-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { trpc } from "../_trpc/client"

const formSchema = z.object({
  license: z
    .string()
    .length(24, "License key must be exactly 24 characters long."),
})

type FormSchema = z.infer<typeof formSchema>

export default function License() {
  const { data: serverUrl } = trpc.getEnvVar.useQuery("SERVER_URL")
  const license = VpnStore.getState().license
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { license: license || "" },
  })

  async function onSubmit(values: FormSchema) {
    setLoading(true)
    const license_ = values.license.trim()

    // Validate license key
    const res = await fetch(`${serverUrl}/api/validate-license/${license_}/`)
    const data: { valid: boolean } = await res.json()

    if (data.valid) {
      VpnStore.setState({ license: license_ })
      router.push("/sign-up")
    } else {
      form.setError("license", { message: "Invalid license key." })
    }

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform space-y-6 md:w-[50%]"
      >
        <FormField
          control={form.control}
          name="license"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Key</FormLabel>
              <FormControl>
                <Input
                  defaultValue={license || ""}
                  placeholder="License Key"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={loading}
          variant="default"
          className="w-full"
        >
          {loading ? <Loading /> : "Verify"}
        </Button>
      </form>
    </Form>
  )
}
