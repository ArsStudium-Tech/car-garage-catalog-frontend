"use client"

import { useState, useMemo, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { listCars, listBrandsWithCars, listYearsWithCars, type Brand } from "@/lib/api"
import { CarCard } from "@/components/car-card"
import { CarCardSkeleton } from "@/components/catalog/car-card-skeleton"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import { CatalogFilters } from "@/components/catalog/catalog-filters"
import { useGarage } from "@/components/garage-provider"

export default function CatalogPage() {
  const { garage, isLoading: isLoadingGarage } = useGarage()
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedFinanceable, setSelectedFinanceable] = useState<string>("all")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [orderBy, setOrderBy] = useState<"price_asc" | "price_desc" | "newest" | "oldest">("newest")

  const debouncedSearchTerm = useDebounce(searchTerm)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm, selectedBrand, selectedYear, selectedFinanceable, minPrice, maxPrice, orderBy])

  const { data: brandsData = [] } = useQuery<Brand[]>({
    queryKey: ["brands-with-cars"],
    queryFn: () => listBrandsWithCars(),
    enabled: !!garage, // Só carrega após a garagem estar carregada
  })

  const { data: yearsData = [] } = useQuery<number[]>({
    queryKey: ["years-with-cars"],
    queryFn: () => listYearsWithCars(),
    enabled: !!garage, // Só carrega após a garagem estar carregada
  })

  const queryParams = useMemo(() => {
    const params: any = {
      page,
      limit: 8,
      orderBy,
    }

    if (debouncedSearchTerm) params.search = debouncedSearchTerm
    if (selectedBrand !== "all") {
      const brand = brandsData.find((b) => b.name === selectedBrand)
      if (brand) params.brandId = brand.id
    }
    if (selectedYear !== "all") {
      const year = parseInt(selectedYear)
      if (!isNaN(year)) params.year = year
    }
    if (selectedFinanceable !== "all") {
      params.financeable = selectedFinanceable === "true"
    }
    if (minPrice) {
      const minPriceNum = parseInt(minPrice)
      if (!isNaN(minPriceNum) && minPriceNum >= 0) {
        params.minPrice = minPriceNum
      }
    }
    if (maxPrice) {
      const maxPriceNum = parseInt(maxPrice)
      if (!isNaN(maxPriceNum) && maxPriceNum >= 0) {
        params.maxPrice = maxPriceNum
      }
    }

    return params
  }, [page, debouncedSearchTerm, selectedBrand, selectedYear, selectedFinanceable, minPrice, maxPrice, orderBy, brandsData])

  const {
    data: carsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cars", queryParams],
    queryFn: () => listCars(queryParams),
    enabled: !!garage, // Só carrega após a garagem estar carregada
  })

  const handleFilterChange = () => {
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleApplyFilters = (filters: {
    brand: string
    year: string
    financeable: string
    minPrice: string
    maxPrice: string
    orderBy: "price_asc" | "price_desc" | "newest" | "oldest"
  }) => {
    setSelectedBrand(filters.brand)
    setSelectedYear(filters.year)
    setSelectedFinanceable(filters.financeable)
    setMinPrice(filters.minPrice)
    setMaxPrice(filters.maxPrice)
    setOrderBy(filters.orderBy)
    handleFilterChange()
  }

  const handleClearFilters = () => {
    setSelectedBrand("all")
    setSelectedYear("all")
    setSelectedFinanceable("all")
    setMinPrice("")
    setMaxPrice("")
    setOrderBy("newest")
    handleFilterChange()
  }

  const years = useMemo(() => {
    return yearsData.map(year => year.toString())
  }, [yearsData])

  const cars = carsData?.cars || []
  const totalPages = carsData?.totalPages || 0
  const total = carsData?.total || 0

  if (isLoadingGarage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />
      <div className="container mx-auto px-4 md:px-8 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Catálogo de Veículos</h1>
          <p className="text-muted-foreground">
            {isLoading ? (
              "Carregando..."
            ) : isError ? (
              "Erro ao carregar"
            ) : (
              <>
                {total} {total === 1 ? "veículo encontrado" : "veículos encontrados"}
              </>
            )}
          </p>
        </div>

        <CatalogFilters
          searchTerm={searchTerm}
          selectedBrand={selectedBrand}
          selectedYear={selectedYear}
          selectedFinanceable={selectedFinanceable}
          minPrice={minPrice}
          maxPrice={maxPrice}
          orderBy={orderBy}
          brandsData={brandsData}
          years={years}
          onSearchChange={handleSearchChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        {isError ? (
          <div className="text-center py-16">
            <p className="text-destructive text-lg mb-2">Erro ao carregar catálogo</p>
            <p className="text-muted-foreground text-sm mb-4">
              Tente recarregar a página ou ajustar os filtros
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Recarregar página
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <CarCardSkeleton key={index} />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-2">Nenhum veículo encontrado</p>
            <p className="text-muted-foreground text-sm">
              Tente ajustar os filtros de busca
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {cars?.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Página {page} de {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <PublicFooter />
    </div>
  )
}
