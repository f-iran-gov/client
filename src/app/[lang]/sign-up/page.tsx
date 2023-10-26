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
import { trpc } from "../../_trpc/client"
import useLocalStore from "@/context/locale-store"

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
  const { auth } = useLocalStore(state => state.dict)
  const lang = useLocalStore(state => state.lang)
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
      router.push("dashboard")
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
        dir={lang === "fa" ? "rtl" : "ltr"}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{auth.username}</FormLabel>
              <FormControl>
                <Input type="text" placeholder={auth.whatToCall} {...field} />
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
              <FormLabel>{auth.email}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={auth.emailAddress}
                  {...field}
                />
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
              <FormLabel>{auth.password}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={auth.password} {...field} />
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
              <FormLabel>{auth.passwordConfirm}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={auth.passwordConfirm}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="default" className="w-full">
          {loading ? <Loading /> : auth.register}
        </Button>
        <Link href="sign-in">
          <Button
            className="mt-2 h-0 px-0 text-sm transition-all hover:text-blue-400"
            variant="link"
          >
            {auth.goToSignIn}
          </Button>
        </Link>
      </form>
    </Form>
  )
}
