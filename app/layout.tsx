import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClientAuthProvider } from '@/components/auth-provider'
import { GarageProvider } from '@/components/garage-provider'
import { QueryProvider } from '@/components/query-provider'
import { Toaster } from '@/components/ui/toaster'
import { WhatsAppFloatButton } from '@/components/whatsapp-float-button'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Catálogo de Veículos',
  description: 'Catálogo de Veículos',
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
              <WhatsAppFloatButton />
              <Toaster />
            </ClientAuthProvider>
          </GarageProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
