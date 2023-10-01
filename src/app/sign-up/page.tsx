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
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import VpnStore from "@/context/vpn-store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Loading from "@/components/loading"
import { trpc } from "../_trpc/client"

const formData = z
  .object({
    username: z
      .string()
      .min(3, "Minimum username length is 3 characters.")
      .max(20, "Maximum username length is 20 characters."),
    email: z.string().email("Invalid email address."),
    password1: z
      .string()
      .min(8, "Minimum password length is 8 characters.")
      .max(100, "Maximum password length is 100 characters."),
    password2: z
      .string()
      .min(8, "Minimum password length is 8 characters.")
      .max(100, "Maximum password length is 100 characters."),
  })
  .superRefine(({ password1, password2 }, ctx) => {
    if (password1 !== password2) {
      ctx.addIssue({
        path: ["password2"],
        code: "custom",
        message: "The passwords did not match",
      })
    }
  })

type FormSchema = z.infer<typeof formData>

export default function SignUp() {
  const router = useRouter()
  const license = VpnStore(state => state.license)
  const signUp = trpc.signUp.useMutation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!license) router.push("/license")
  }, [])

  if (!license) return <Loading center />

  const form = useForm<FormSchema>({
    resolver: zodResolver(formData),
  })

  async function onSubmit(values: FormSchema) {
    setLoading(true)

    const data = await signUp.mutateAsync({
      username: values.username,
      password: values.password1,
      email: values.email,
      license: license!,
    })

    if (data.success) {
      router.push("/dashboard")
      return
    }

    if (data.username)
      form.setError("username", {
        type: "manual",
        message: data.username,
      })
    if (data.email)
      form.setError("email", {
        type: "manual",
        message: data.email,
      })
    if (data.password)
      form.setError("password1", {
        type: "manual",
        message: data.password,
      })

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full space-y-6 md:w-[50%]"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="What should we call you?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password1"
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
        <FormField
          control={form.control}
          name="password2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Confirmation</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password Once Again"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="default" className="w-full">
          {loading ? <Loading /> : "Register"}
        </Button>
        <Link href="/sign-in">
          <Button
            className="mt-2 h-0 px-0 text-sm transition-all hover:text-blue-400"
            variant="link"
          >
            Already a member? Login here.
          </Button>
        </Link>
      </form>
    </Form>
  )
}
