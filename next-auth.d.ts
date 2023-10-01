import NextAuth from "next-auth/next"
import { type DefaultSession } from "next-auth"
import { users } from "./src/db/schema"
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm"

export interface UserType extends InferSelectModel<typeof users> {
  id: string
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & UserType
  }
}
