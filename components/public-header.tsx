"use client"

import Link from "next/link"
import { Car } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { getGarage, Garage, getLogoUrl } from "@/lib/api"

export function PublicHeader() {
  const [garage, setGarage] = useState<Garage | null>(null)

  useEffect(() => {
    getGarage()
      .then(setGarage)
      .catch(() => {
        // Fallback se não conseguir buscar a garagem
        setGarage({
          id: "",
          name: "AutoCore",
          domain: "",
          active: true,
        })
      })
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          {garage?.logoUrl ? (
            <div className="w-8 h-8 relative flex items-center justify-center">
              <Image
                src={getLogoUrl(garage.logoUrl)}
                alt={garage.name || "Logo"}
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
            {garage?.name || "AutoCore"}
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Catálogo
          </Link>
        </nav>
      </div>
    </header>
  )
}

