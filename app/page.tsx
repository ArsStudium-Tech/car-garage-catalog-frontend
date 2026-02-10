"use client"

import { useState, useEffect } from "react"
import { Car, listCars, formatPrice } from "@/lib/api"
import { CarCard } from "@/components/car-card"
import { Search, Filter } from "lucide-react"
import { PublicHeader } from "@/components/public-header"

export default function CatalogPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  })

  useEffect(() => {
    async function loadCars() {
      try {
        setLoading(true)
        const data = await listCars()
        setCars(data)
        setFilteredCars(data)
      } catch (error) {
        console.error("Error loading cars:", error)
      } finally {
        setLoading(false)
      }
    }
    loadCars()
  }, [])

  // Get unique brands and years
  const brands = Array.from(new Set(cars.map((car) => car.brand.name))).sort()
  const years = Array.from(new Set(cars.map((car) => car.year)))
    .sort((a, b) => b - a)
    .map((y) => y.toString())

  // Filter cars
  useEffect(() => {
    let filtered = [...cars]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (car) =>
          car.brand.name.toLowerCase().includes(term) ||
          car.model.toLowerCase().includes(term) ||
          car.year.toString().includes(term)
      )
    }

    // Brand filter
    if (selectedBrand !== "all") {
      filtered = filtered.filter((car) => car.brand.name === selectedBrand)
    }

    // Year filter
    if (selectedYear !== "all") {
      filtered = filtered.filter((car) => car.year.toString() === selectedYear)
    }

    // Price filter
    if (priceRange.min) {
      const min = parseInt(priceRange.min.replace(/\D/g, ""))
      if (!isNaN(min)) {
        filtered = filtered.filter((car) => car.price >= min)
      }
    }
    if (priceRange.max) {
      const max = parseInt(priceRange.max.replace(/\D/g, ""))
      if (!isNaN(max)) {
        filtered = filtered.filter((car) => car.price <= max)
      }
    }

    setFilteredCars(filtered)
  }, [searchTerm, selectedBrand, selectedYear, priceRange, cars])

  const formatPriceInput = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (!numbers) return ""
    const num = parseInt(numbers)
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(num)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando catálogo...</p>
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
            {filteredCars.length} {filteredCars.length === 1 ? "veículo encontrado" : "veículos encontrados"}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-sm"
                placeholder="Buscar por marca, modelo ou ano..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Brand Filter */}
            <div className="md:col-span-2">
              <select
                className="w-full py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground text-sm"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="all">Marca: Todas</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="md:col-span-2">
              <select
                className="w-full py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground text-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="all">Ano: Todos</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Min */}
            <div className="md:col-span-2">
              <input
                className="w-full py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground text-sm"
                placeholder="Preço mínimo"
                type="text"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: formatPriceInput(e.target.value) })
                }
              />
            </div>

            {/* Price Max */}
            <div className="md:col-span-2">
              <input
                className="w-full py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground text-sm"
                placeholder="Preço máximo"
                type="text"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: formatPriceInput(e.target.value) })
                }
              />
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-2">Nenhum veículo encontrado</p>
            <p className="text-muted-foreground text-sm">
              Tente ajustar os filtros de busca
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
