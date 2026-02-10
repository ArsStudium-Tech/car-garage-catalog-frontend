"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { listCars, formatPrice, listBrands, type Brand } from "@/lib/api"
import { CarCard } from "@/components/car-card"
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import { PublicHeader } from "@/components/public-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CatalogPage() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [orderBy, setOrderBy] = useState<"price_asc" | "price_desc" | "newest" | "oldest">("newest")

  // Fetch brands for filter
  const { data: brandsData = [] } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: () => listBrands(),
  })

  // Build query params
  const queryParams = useMemo(() => {
    const params: any = {
      page,
      limit: 8,
      orderBy,
    }

    if (searchTerm) params.search = searchTerm
    if (selectedBrand !== "all") {
      const brand = brandsData.find((b) => b.name === selectedBrand)
      if (brand) params.brandId = brand.id
    }
    if (selectedYear !== "all") {
      const year = parseInt(selectedYear)
      if (!isNaN(year)) params.year = year
    }

    return params
  }, [page, searchTerm, selectedBrand, selectedYear, orderBy, brandsData])

  // Fetch cars with React Query
  const {
    data: carsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cars", queryParams],
    queryFn: () => listCars(queryParams),
  })

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    handleFilterChange()
  }

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value)
    handleFilterChange()
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
    handleFilterChange()
  }

  const handleOrderByChange = (value: "price_asc" | "price_desc" | "newest" | "oldest") => {
    setOrderBy(value)
    handleFilterChange()
  }

  // Get unique years from all cars (we'll need to fetch all years or use a separate endpoint)
  // For now, we'll generate a reasonable range
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const yearsArray: string[] = []
    for (let year = currentYear; year >= 2000; year--) {
      yearsArray.push(year.toString())
    }
    return yearsArray
  }, [])

  const cars = carsData?.cars || []
  const totalPages = carsData?.totalPages || 0
  const total = carsData?.total || 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando catálogo...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="text-center py-16">
            <p className="text-destructive text-lg mb-2">Erro ao carregar catálogo</p>
            <p className="text-muted-foreground text-sm">
              Tente recarregar a página
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Catálogo de Veículos</h1>
          <p className="text-muted-foreground">
            {total} {total === 1 ? "veículo encontrado" : "veículos encontrados"}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                className="pl-10"
                placeholder="Buscar por marca, modelo ou ano..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            {/* Brand Filter */}
            <div className="md:col-span-2">
              <Select value={selectedBrand} onValueChange={handleBrandChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Marca: Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Marca: Todas</SelectItem>
                  {brandsData.map((brand) => (
                    <SelectItem key={brand.id} value={brand.name}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Filter */}
            <div className="md:col-span-2">
              <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Ano: Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Ano: Todos</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Order By */}
            <div className="md:col-span-2">
              <Select value={orderBy} onValueChange={handleOrderByChange}>
                <SelectTrigger>
                  <div className="flex items-center gap-2 w-full">
                    <ArrowUpDown className="h-4 w-4 shrink-0" />
                    <SelectValue placeholder="Ordenar por" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais Novo</SelectItem>
                  <SelectItem value="oldest">Mais Antigo</SelectItem>
                  <SelectItem value="price_asc">Preço: Menor para Maior</SelectItem>
                  <SelectItem value="price_desc">Preço: Maior para Menor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        {cars.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-2">Nenhum veículo encontrado</p>
            <p className="text-muted-foreground text-sm">
              Tente ajustar os filtros de busca
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {/* Pagination */}
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
    </div>
  )
}
