import { db } from "@/db/drizzle-db"

export async function getCurrentServer() {
  const server = await db.query.currentServer.findFirst()
  if (!server) return null
  return server
}
