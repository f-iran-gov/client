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
import { trpc } from "@/app/_trpc/client"
import useLocalStore from "@/context/locale-store"

const formSchema = z.object({
  license: z
    .string()
    .length(24, "License key must be exactly 24 characters long."),
})

type FormSchema = z.infer<typeof formSchema>

export default function License() {
  const { auth } = useLocalStore(state => state.dict)
  const lang = useLocalStore(state => state.lang)
  const license = VpnStore.getState().license
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const torRequest = trpc.torRequest.useMutation()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { license: license || "" },
  })

  async function onSubmit(values: FormSchema) {
    setLoading(true)
    const license_ = values.license.trim()

    // Validate license key
    const res = await torRequest.mutateAsync(
      `/api/validate-license/${license_}/`
    )
    const data = res.data as { valid: boolean }

    if (data.valid) {
      VpnStore.setState({ license: license_ })
      router.push("sign-up")
    } else {
      form.setError("license", { message: "Invalid license key." })
    }

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full transform space-y-6 md:w-[50%]"
        dir={lang === "fa" ? "rtl" : "ltr"}
      >
        <FormField
          control={form.control}
          name="license"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{auth.licenseKey}</FormLabel>
              <FormControl>
                <Input placeholder={auth.licenseKey} {...field} />
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
          {loading ? <Loading /> : auth.verify}
        </Button>
      </form>
    </Form>
  )
}
