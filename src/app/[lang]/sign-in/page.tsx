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

const formData = z.object({
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(8, "Minimum password length is 8 characters.")
    .max(100, "Maximum password length is 100 characters."),
})

type FormSchema = z.infer<typeof formData>

export default function SignInPage() {
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
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="default" className="w-full">
          {loading ? <Loading /> : "Sign In"}
        </Button>
        <Link href="/sign-up">
          <Button
            className="mt-2 h-0 px-0 text-sm transition-all hover:text-blue-400"
            variant="link"
          >
            No account yet? Register here.
          </Button>
        </Link>
      </form>
    </Form>
  )
}
