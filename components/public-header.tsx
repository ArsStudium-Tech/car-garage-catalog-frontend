"use client"

import Link from "next/link"
import { Car } from "lucide-react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { getGarage, Garage, getLogoUrl } from "@/lib/api"

const FALLBACK_GARAGE: Garage = {
  id: "",
  name: "Catálogo de Veículos",
  domain: "",
  active: true,
}

export function PublicHeader() {
  const { data: garage, isLoading } = useQuery<Garage>({
    queryKey: ["garage"],
    queryFn: getGarage,
    staleTime: 5 * 60 * 1000, 
    gcTime: 30 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const displayGarage = garage || FALLBACK_GARAGE

  if (isLoading) {
    return (
      <>
      </>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          {displayGarage.logoUrl ? (
            <div className="w-14 h-14 relative flex items-center justify-center">
              <Image
                src={getLogoUrl(displayGarage.logoUrl)}
                alt={displayGarage.name || "Logo"}
                fill
                className="object-contain"
                sizes="52px"
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
          <span className="text-xl font-bold tracking-tight text-foreground">
            {displayGarage.name}
          </span>
        </Link>

       {/*  <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Catálogo
          </Link>
        </nav> */}
      </div>
    </header>
  )
}

