import bcrypt from "bcryptjs"
import * as schema from "@/db/schema"
import { db } from "@/db/drizzle-db"
import { eq } from "drizzle-orm"

export async function signUp({
  username,
  password,
  email,
  license,
}: {
  username: string
  password: string
  email: string
  license: string
}) {
  // If user already exists, return error
  try {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    })
    if (user)
      return {
        success: false,
        username: undefined,
        email: "A user already exists with that email.",
        password: undefined,
      }
  } catch (error) {}

  const totalUsers = (await db.query.users.findMany()).length

  const hashedPassword = bcrypt.hashSync(password, 10)

  // Save user
  db.insert(schema.users)
    .values({
      name: username,
      email,
      password: hashedPassword,
      license,
    })
    .run()

  if (totalUsers >= 1) {
    return {
      success: true,
      username: undefined,
      email: undefined,
      password: undefined,
    }
  }

  const res = await fetch(`${process.env.SERVER_URL}/api/sign-up/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
      email: email,
      product: license,
    }),
  })
  const data2: {
    success: boolean
    errors: {
      username: string[] | null
      email: string[] | null
      password: string[] | null
    }
  } = await res.json()

  if (data2.success) {
    return {
      success: true,
      username: undefined,
      email: undefined,
      password: undefined,
    }
  }

  return {
    success: false,
    username: data2.errors.username?.join(" "),
    email: data2.errors.email?.join(" "),
    password: data2.errors.password?.join(" "),
  }
}
