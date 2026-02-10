"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/api-admin"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Usa replace para evitar adicionar ao histórico
    if (isAuthenticated()) {
      router.replace("/admin/inventory")
    } else {
      router.replace("/admin/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}

