import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KindKart - Find Donation Centers Near You",
  description:
    "Connect with local donation centers and essential supply drop-offs to promote community support and resource sharing.",
  keywords: "donation centers, charity, food banks, clothing donations, community support",
  authors: [{ name: "KindKart Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
