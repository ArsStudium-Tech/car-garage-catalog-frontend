"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import {
  LayoutDashboard,
  Car,
  UserSearch,
  ShoppingCart,
  BarChart3,
  Settings,
} from "lucide-react"
import { getSettings, getLogoUrl, GarageSettings } from "@/lib/api-admin"

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/admin/inventory", icon: Car },
  /* { label: "Leads", href: "/admin/leads", icon: UserSearch },
  { label: "Sales", href: "/admin/reports", icon: ShoppingCart },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 }, */
]

export function AppSidebar() {
  const pathname = usePathname()
  const [settings, setSettings] = useState<GarageSettings | null>(null)

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() => {
        // Fallback se não conseguir buscar as configurações
      })
  }, [])

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 hidden lg:flex flex-col">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          {settings?.logoUrl ? (
            <div className="w-8 h-8 relative flex items-center justify-center">
              <Image
                src={getLogoUrl(settings.logoUrl)}
                alt={settings.name || "Logo"}
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
          <span className="text-xl font-bold tracking-tight text-foreground">
            {settings?.name || "AutoCore"}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Nav */}
        <div className="p-4 border-t border-border">
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/admin/settings"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>

          <div className="mt-4 flex items-center gap-3 p-3 bg-muted rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              AS
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-foreground">
                Alex Sterling
              </p>
              <p className="text-xs text-muted-foreground truncate">
                General Manager
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
