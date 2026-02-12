"use client"

import { createContext, useContext, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { getGarage, type Garage } from "@/lib/api"

interface GarageContextType {
  garage: Garage | null
  isLoading: boolean
  isError: boolean
  error: Error | null
}

const GarageContext = createContext<GarageContextType | undefined>(undefined)

export function GarageProvider({ children }: { children: ReactNode }) {
  const { data: garage, isLoading, isError, error } = useQuery<Garage>({
    queryKey: ["garage"],
    queryFn: () => getGarage(),
    retry: 1,
    staleTime: Infinity, // Os dados da garagem não mudam frequentemente
    refetchOnWindowFocus: false,
  })

  const garageData = garage || (isError ? {
    id: "",
    name: "AutoCore",
    domain: "",
    active: true,
  } : null)

  return (
    <GarageContext.Provider
      value={{
        garage: garageData,
        isLoading,
        isError,
        error: error as Error | null,
      }}
    >
      {children}
    </GarageContext.Provider>
  )
}

export function useGarage() {
  const context = useContext(GarageContext)
  if (context === undefined) {
    throw new Error("useGarage must be used within a GarageProvider")
  }
  return context
}

