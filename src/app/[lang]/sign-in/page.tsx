"use client"

import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Loading from "@/components/loading"
import { signIn } from "next-auth/react"
import useLocalStore from "@/context/locale-store"

const formData = z.object({
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(8, "Minimum password length is 8 characters.")
    .max(100, "Maximum password length is 100 characters."),
})

type FormSchema = z.infer<typeof formData>

export default function SignInPage() {
  const { auth } = useLocalStore(state => state.dict)
  const lang = useLocalStore(state => state.lang)
  const form = useForm<FormSchema>({
    resolver: zodResolver(formData),
  })

  const [loading, setLoading] = useState(false)

  async function onSubmit(values: FormSchema) {
    setLoading(true)
    const user = await signIn("credentials", {
      ...values,
      redirect: false,
    })
    if (!user || user.error) {
      setLoading(false)
      form.setError("password", {
        type: "manual",
        message: "Either the email or password is incorrect.",
      })
      return
    }
    window.location.href = "/dashboard"
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full space-y-6 md:w-[50%]"
        dir={lang === "fa" ? "rtl" : "ltr"}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{auth.email}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={auth.email}
                  autoFocus={true}
                  autoComplete="on"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{auth.password}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={auth.password} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="default" className="w-full">
          {loading ? <Loading /> : auth.signIn}
        </Button>
        <Link href="sign-up">
          <Button
            className="mt-2 h-0 px-0 text-sm transition-all hover:text-blue-400"
            variant="link"
          >
            {auth.goToSignUp}
          </Button>
        </Link>
      </form>
    </Form>
  )
}
