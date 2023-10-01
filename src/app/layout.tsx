import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/navbar"
import Provider from "./_trpc/Provider"
import NextAuthSession from "@/components/next-auth-session"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Home page",
  description: "CHANGE MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEe",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Provider>
            <NextAuthSession>
              <Navbar />
              <div className="w-full p-8">{children}</div>
            </NextAuthSession>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
