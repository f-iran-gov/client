import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your account to access your dashboard and manage your VPN servers.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
