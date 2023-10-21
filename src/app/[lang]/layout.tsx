import { ThemeProvider } from "@/components/theme-provider"
import "../globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/navbar"
import Provider from "../_trpc/Provider"
import NextAuthSession from "@/components/next-auth-session"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Locale, i18n } from "@/types/i18n.type"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Home page",
  description: "CHANGE MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEe",
}

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Provider>
            <NextAuthSession>
              <Navbar />
              <div className="w-full p-8">{children}</div>
              <ToastContainer />
            </NextAuthSession>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
