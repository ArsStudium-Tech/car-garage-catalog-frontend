"use client"

import { useRouter } from "next/navigation"
import { Search, Bell, Plus, LogOut, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

export function AppHeader() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full bg-muted border-none rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Search inventory, leads, or VIN..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="relative p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
          type="button"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
        </button>
        <Link
          href="/admin/inventory/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Listing</span>
        </Link>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            type="button"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
