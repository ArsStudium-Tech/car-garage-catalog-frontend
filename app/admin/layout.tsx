"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { AuthGuard } from "@/components/auth-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Não aplica AuthGuard para login e página raiz do admin
  const isPublicRoute = pathname === "/admin/login" || pathname === "/admin"
  
  if (isPublicRoute) {
    return <>{children}</>
  }
  
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <AppSidebar />
        <main className="lg:pl-64">
          <AppHeader />
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
