import type React from "react"
import type { Metadata } from "next"
import { League_Spartan } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// League Spartan across the whole site (variable weight 100–900)
const spartan = League_Spartan({ subsets: ["latin"], variable: "--font-spartan", display: "swap" })

export const metadata: Metadata = {
  title: "ABHINAV RISHI | AI Engineer & Full Stack Developer",
  description: "S Abhinav Rishi — AI engineer and full-stack developer building intelligent systems that predict problems before they happen.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={spartan.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
