import { sqliteTable, integer, text, primaryKey } from "drizzle-orm/sqlite-core"
import type { AdapterAccount } from "@auth/core/adapters"

export const users = sqliteTable("user", {
  id: integer("id").notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  license: text("license").notNull(),
  image: text("image"),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
})

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  account => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
)

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  vt => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
)

export const currentServer = sqliteTable("currentServer", {
  id: integer("id").notNull().primaryKey(),
  name: text("name").notNull(),
  time: integer("time").notNull(),
  country: text("country").notNull(),
  countryCode: text("country_code").notNull(),
})
