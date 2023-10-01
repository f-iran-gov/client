import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db/drizzle-db"
import { eq } from "drizzle-orm"
import { users } from "@/db/schema"
import { compare } from "bcryptjs"
import { UserType } from "../../../../../next-auth"

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        })

        if (!user) {
          throw new Error("Either the email or password is incorrect.")
        }

        const copyUser = {
          ...user,
          id: user.id.toString(),
        }

        const matching = await compare(credentials.password, user.password)
        if (!matching) {
          throw new Error("Either the email or password is incorrect.")
        }

        return copyUser as UserType
      },
      type: "credentials",
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      return token
    },
    async session({ session, token }) {
      session.user = token as any
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
