import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClientAuthProvider } from '@/components/auth-provider'
import { PublicHeader } from '@/components/public-header'
import { Toaster } from '@/components/ui/toaster'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'AutoCore | Dealer Management Platform',
  description: 'The complete operating system for modern automotive retailers. Manage inventory, track leads, and close deals faster.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientAuthProvider>
          {children}
          <Toaster />
        </ClientAuthProvider>
      </body>
    </html>
  )
}
