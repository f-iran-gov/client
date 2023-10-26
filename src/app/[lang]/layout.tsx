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
import { getDictionary } from "@/lib/dictionary"
import useLocalStore from "@/context/locale-store"
import StoreInitializer from "@/components/store-initazlizer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Home page",
  description: "CHANGE MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEe",
}

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  const dict = await getDictionary(params.lang)
  useLocalStore.setState({ dict, lang: params.lang })

  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Provider>
            <NextAuthSession>
              <StoreInitializer dict={dict} lang={params.lang} />
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
