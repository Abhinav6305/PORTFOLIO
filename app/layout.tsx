import type React from "react"
import type { Metadata } from "next"
import { Unbounded, Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const display = Unbounded({ subsets: ["latin"], weight: ["400", "600", "800"], variable: "--font-display" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "ABHINAV RISHI | AI Engineer & Full Stack Developer",
  description: "S Abhinav Rishi — AI engineer, full-stack developer and founder of VISIONIX, building intelligent systems that predict problems before they happen.",
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
      <body className={`${display.variable} ${inter.variable} ${mono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
