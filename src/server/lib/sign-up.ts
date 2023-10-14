import bcrypt from "bcryptjs"
import * as schema from "@/db/schema"
import { db } from "@/db/drizzle-db"
import { eq } from "drizzle-orm"
import { SignUpType } from ".."
import torRequest from "./tor-request"

export async function signUp({
  username,
  password,
  email,
  license,
}: SignUpType) {
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

  // If there's already a user, don't create a new user on the server
  if (totalUsers >= 1) {
    return {
      success: true,
      username: undefined,
      email: undefined,
      password: undefined,
    }
  }

  const res = await torRequest("/api/sign-up/", "POST", {
    username,
    password,
    email,
    product: license,
  })
  const data = res.data as {
    success: boolean
    errors: {
      username: string[] | null
      email: string[] | null
      password: string[] | null
    }
  }

  if (data.success) {
    return {
      success: true,
      username: undefined,
      email: undefined,
      password: undefined,
    }
  }

  return {
    success: false,
    username: data.errors.username?.join(" "),
    email: data.errors.email?.join(" "),
    password: data.errors.password?.join(" "),
  }
}
