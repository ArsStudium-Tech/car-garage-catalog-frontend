import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClientAuthProvider } from '@/components/auth-provider'
import { GarageProvider } from '@/components/garage-provider'
import { QueryProvider } from '@/components/query-provider'
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
        <QueryProvider>
          <GarageProvider>
            <ClientAuthProvider>
              {children}
              <Toaster />
            </ClientAuthProvider>
          </GarageProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
