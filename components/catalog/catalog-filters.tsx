"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Filter, X, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { Brand } from "@/lib/api"

interface CatalogFiltersProps {
  searchTerm: string
  selectedBrand: string
  selectedYear: string
  selectedFinanceable: string
  minPrice: string
  maxPrice: string
  orderBy: "price_asc" | "price_desc" | "newest" | "oldest"
  brandsData: Brand[]
  years: string[]
  onSearchChange: (value: string) => void
  onApplyFilters: (filters: {
    brand: string
    year: string
    financeable: string
    minPrice: string
    maxPrice: string
    orderBy: "price_asc" | "price_desc" | "newest" | "oldest"
  }) => void
  onClearFilters: () => void
}

export function CatalogFilters({
  searchTerm,
  selectedBrand,
  selectedYear,
  selectedFinanceable,
  minPrice,
  maxPrice,
  orderBy,
  brandsData,
  years,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
}: CatalogFiltersProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  
  // Estados temporários para os filtros do drawer
  const [tempBrand, setTempBrand] = useState(selectedBrand)
  const [tempYear, setTempYear] = useState(selectedYear)
  const [tempFinanceable, setTempFinanceable] = useState(selectedFinanceable)
  const [tempMinPrice, setTempMinPrice] = useState(minPrice)
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice)
  const [tempOrderBy, setTempOrderBy] = useState(orderBy)

  // Sincroniza os estados temporários quando os valores reais mudam ou quando o drawer abre
  useEffect(() => {
    if (!filtersOpen) {
      setTempBrand(selectedBrand)
      setTempYear(selectedYear)
      setTempFinanceable(selectedFinanceable)
      setTempMinPrice(minPrice)
      setTempMaxPrice(maxPrice)
      setTempOrderBy(orderBy)
    }
  }, [selectedBrand, selectedYear, selectedFinanceable, minPrice, maxPrice, orderBy, filtersOpen])

  // Sincroniza os estados temporários quando o drawer abre
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempBrand(selectedBrand)
      setTempYear(selectedYear)
      setTempFinanceable(selectedFinanceable)
      setTempMinPrice(minPrice)
      setTempMaxPrice(maxPrice)
      setTempOrderBy(orderBy)
    }
    setFiltersOpen(open)
  }

  const handleApplyFilters = () => {
    onApplyFilters({
      brand: tempBrand,
      year: tempYear,
      financeable: tempFinanceable,
      minPrice: tempMinPrice,
      maxPrice: tempMaxPrice,
      orderBy: tempOrderBy,
    })
    setFiltersOpen(false)
  }

  const hasActiveFilters = useMemo(() => {
    return selectedBrand !== "all" || selectedYear !== "all" || selectedFinanceable !== "all" || minPrice !== "" || maxPrice !== "" || orderBy !== "newest"
  }, [selectedBrand, selectedYear, selectedFinanceable, minPrice, maxPrice, orderBy])

  const activeFiltersCount = useMemo(() => {
    return [selectedBrand !== "all", selectedYear !== "all", selectedFinanceable !== "all", minPrice !== "" || maxPrice !== "", orderBy !== "newest"].filter(Boolean).length
  }, [selectedBrand, selectedYear, selectedFinanceable, minPrice, maxPrice, orderBy])

  const formatCurrencyDisplay = (value: string): string => {
    if (!value) return ""
    const numValue = parseInt(value)
    if (isNaN(numValue)) return ""
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue)
  }


  const getOrderByLabel = (orderBy: "price_asc" | "price_desc" | "newest" | "oldest") => {
    switch (orderBy) {
      case "oldest":
        return "Mais Antigo"
      case "price_asc":
        return "Preço: Menor → Maior"
      case "price_desc":
        return "Preço: Maior → Menor"
      default:
        return ""
    }
  }

  return (
    <>
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              className="pl-10"
              placeholder="Buscar por marca, modelo ou ano..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex items-center md:items-center w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => setFiltersOpen(true)}
              className="flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {hasActiveFilters && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>


        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {selectedBrand !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Marca: {selectedBrand}
                <button
                  onClick={() => onApplyFilters({
                    brand: "all",
                    year: selectedYear,
                    financeable: selectedFinanceable,
                    minPrice,
                    maxPrice,
                    orderBy,
                  })}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                  aria-label="Remover filtro de marca"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedYear !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Ano: {selectedYear}
                <button
                  onClick={() => onApplyFilters({
                    brand: selectedBrand,
                    year: "all",
                    financeable: selectedFinanceable,
                    minPrice,
                    maxPrice,
                    orderBy,
                  })}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                  aria-label="Remover filtro de ano"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedFinanceable !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Financiável: {selectedFinanceable === "true" ? "Sim" : "Não"}
                <button
                  onClick={() => onApplyFilters({
                    brand: selectedBrand,
                    year: selectedYear,
                    financeable: "all",
                    minPrice,
                    maxPrice,
                    orderBy,
                  })}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                  aria-label="Remover filtro de financiável"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(minPrice !== "" || maxPrice !== "") && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Preço: {minPrice ? formatCurrencyDisplay(minPrice) : "..."} - {maxPrice ? formatCurrencyDisplay(maxPrice) : "..."}
                <button
                  onClick={() => onApplyFilters({
                    brand: selectedBrand,
                    year: selectedYear,
                    financeable: selectedFinanceable,
                    minPrice: "",
                    maxPrice: "",
                    orderBy,
                  })}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                  aria-label="Remover filtro de preço"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {orderBy !== "newest" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {getOrderByLabel(orderBy)}
                <button
                  onClick={() => onApplyFilters({
                    brand: selectedBrand,
                    year: selectedYear,
                    financeable: selectedFinanceable,
                    minPrice,
                    maxPrice,
                    orderBy: "newest",
                  })}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                  aria-label="Remover filtro de ordenação"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-6 text-xs"
            >
              Limpar todos
            </Button>
          </div>
        )}
      </div>

      <Drawer open={filtersOpen} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-h-[90vh] p-5">
          <DrawerHeader>
            <DrawerTitle>Filtros</DrawerTitle>
            <DrawerDescription>
              Aplique filtros para encontrar o veículo ideal
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-6 overflow-y-auto">
            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Marca</label>
              <Select value={tempBrand} onValueChange={setTempBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as marcas</SelectItem>
                  {brandsData.map((brand) => (
                    <SelectItem key={brand.id} value={brand.name}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Ano</label>
              <Select value={tempYear} onValueChange={setTempYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os anos</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Financiável</label>
              <Select value={tempFinanceable} onValueChange={setTempFinanceable}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Faixa de Preço</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Preço Mínimo</label>
                  <Input
                    type="text"
                    placeholder="R$ 0"
                    value={tempMinPrice ? formatCurrencyDisplay(tempMinPrice) : ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      setTempMinPrice(value)
                    }}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Preço Máximo</label>
                  <Input
                    type="text"
                    placeholder="R$ 0"
                    value={tempMaxPrice ? formatCurrencyDisplay(tempMaxPrice) : ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      setTempMaxPrice(value)
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Ordenar por</label>
              <Select value={tempOrderBy} onValueChange={(value) => setTempOrderBy(value as "price_asc" | "price_desc" | "newest" | "oldest")}>
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

          <DrawerFooter className="gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  onClearFilters()
                  setFiltersOpen(false)
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            )}
            <Button className="w-full" onClick={handleApplyFilters}>
              Aplicar Filtros
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

