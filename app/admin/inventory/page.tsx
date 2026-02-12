"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, TrendingUp, DollarSign, Calendar, ShoppingBag } from "lucide-react"
import { listCarsAdmin, deleteCarAdmin, formatPrice, formatMileage, getCarImageUrl, AdminCar, listBrands, Brand } from "@/lib/api-admin"
import Image from "next/image"
import { Car as CarIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { listBrandsWithCars } from "@/lib/api"

export default function InventoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("") // Input temporário
  const [searchTerm, setSearchTerm] = useState("") // Termo usado na query
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [carToDelete, setCarToDelete] = useState<string | null>(null)

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["brands-with-cars"],
    queryFn: () => listBrandsWithCars(),
  })

  const queryParams = useMemo(() => {
    const params: any = {
      page,
      limit: 10,
    }

    if (searchTerm) {
      params.search = searchTerm
    }

    if (selectedStatus !== "all") {
      params.status = selectedStatus
    }

    if (selectedBrand !== "all") {
      const brand = brands.find((b) => b.name === selectedBrand)
      if (brand) {
        params.brandId = brand.id
      }
    }

    return params
  }, [page, searchTerm, selectedStatus, selectedBrand, brands])

  // Buscar carros com React Query
  const {
    data: carsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-cars", queryParams],
    queryFn: () => listCarsAdmin(queryParams),
  })

  // Mutation para deletar
  const deleteMutation = useMutation({
    mutationFn: deleteCarAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] })
      setDeleteDialogOpen(false)
      setCarToDelete(null)
      toast({
        title: "Veículo excluído",
        description: "O veículo foi excluído com sucesso.",
      })
    },
    onError: () => {
      toast({
        title: "Erro ao excluir veículo",
        description: "Não foi possível excluir o veículo. Tente novamente.",
        variant: "destructive",
      })
    },
  })

  // Resetar para página 1 quando filtros mudarem
  const handleFilterChange = () => {
    setPage(1)
  }

  // Buscar quando pressionar Enter
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(searchInput)
      handleFilterChange()
    }
  }

  // Buscar quando clicar no botão de busca
  const handleSearchClick = () => {
    setSearchTerm(searchInput)
    handleFilterChange()
  }

  const cars = carsData?.cars || []
  const totalPages = carsData?.totalPages || 0
  const total = carsData?.total || 0

  const handleDeleteClick = (id: string) => {
    setCarToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!carToDelete) return
    deleteMutation.mutate(carToDelete)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-100 text-emerald-800"
      case "SOLD":
        return "bg-slate-200 text-slate-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Disponível"
      case "SOLD":
        return "Vendido"
      default:
        return status
    }
  }

  // Calculate stats - precisamos buscar todos os carros para stats precisos
  const { data: allCarsData } = useQuery({
    queryKey: ["admin-cars-stats"],
    queryFn: () => listCarsAdmin({ limit: 10000 }), // Buscar todos para stats
    staleTime: 5 * 60 * 1000, // Cache de 5 minutos
  })

  const allCars = allCarsData?.cars || []
  const totalValue = allCars.reduce((sum, car) => sum + car.price, 0)
  const availableCount = allCars.filter((car) => car.status === "AVAILABLE").length
  const soldCount = allCars.filter((car) => car.status === "SOLD").length

  const inventoryStats = [
    {
      label: "Valor total do estoque",
      value: formatPrice(totalValue),
      sub: `${allCars.length} veículos`,
      positive: true,
      icon: DollarSign
    },
    {
      label: "Veículos disponíveis",
      value: `${availableCount} Veículos`,
      sub: `${soldCount} vendidos`,
      positive: true,
      icon: ShoppingBag
    },
    {
      label: "Total de veículos",
      value: `${allCars.length} Veículos`,
      sub: "Em estoque",
      positive: true,
      icon: Calendar
    },
  ]


  return (
    <div className="pt-4 p-4 md:p-6 md:pt-5">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span className="hover:text-primary cursor-pointer">Inventário</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Todos os Veículos</span>
          </nav>
          <h1 className="text-2xl font-bold text-foreground">Inventário de Veículos</h1>
        </div>
        <Link
          href="/admin/inventory/new"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm text-sm"
        >
          <Plus className="h-4 w-4" />
          Adicionar Novo Veículo
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {inventoryStats.map((stat) => (
          <div key={stat.label} className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{stat.label}</span>
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className={`mt-2 text-sm flex items-center gap-1 ${stat.positive ? "text-emerald-600" : "text-muted-foreground"}`}>
              {stat.positive && <TrendingUp className="h-3 w-3" />}
              <span>{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm mb-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full pl-10 pr-10 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-sm"
              placeholder="Pesquisar por marca, modelo ou ano"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <button
              onClick={handleSearchClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted-foreground/10 rounded transition-colors"
              type="button"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="md:col-span-2">
            <Select
              value={selectedBrand}
              onValueChange={(value) => {
                setSelectedBrand(value)
                handleFilterChange()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Marca: Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Marca: Todas</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.name}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Select
              value={selectedStatus}
              onValueChange={(value) => {
                setSelectedStatus(value)
                handleFilterChange()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status: Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: Todos</SelectItem>
                <SelectItem value="AVAILABLE">Disponível</SelectItem>
                <SelectItem value="SOLD">Vendido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Thumbnail</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detalhes do Veículo</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preço</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kilometragem</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-muted-foreground text-sm">Carregando veículos...</p>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <p className="text-destructive text-sm mb-2">Erro ao carregar veículos</p>
                      <button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-cars"] })}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm"
                        type="button"
                      >
                        Tentar novamente
                      </button>
                    </div>
                  </td>
                </tr>
              ) : cars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhum veículo encontrado
                  </td>
                </tr>
              ) : (
                cars.map((car) => {
                  const mainImage = car.images && car.images.length > 0 ? car.images[0] : null
                  const imageUrl = getCarImageUrl(mainImage)

                  return (
                    <tr key={car.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-20 h-14 rounded-lg border border-border overflow-hidden bg-muted relative">
                          {mainImage ? (
                            <Image
                              src={imageUrl}
                              alt={`${car.brand.name} ${car.model}`}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <CarIcon className="h-6 w-6 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/inventory/${car.id}`} className="flex flex-col hover:text-primary transition-colors">
                          <span className="font-semibold text-foreground">{car.brand.name} {car.model}</span>
                          <span className="text-sm text-muted-foreground">{car.year} • {formatMileage(car.mileage)}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{formatPrice(car.price)}</td>
                      <td className="px-6 py-4 text-muted-foreground">{formatMileage(car.mileage)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
                          {getStatusLabel(car.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/inventory/${car.id}`} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => router.push(`/admin/inventory/edit/${car.id}`)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            type="button"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(car.id)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all"
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-muted/50 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Mostrando {cars.length} de {total} veículos (Página {page} de {totalPages})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-foreground font-medium">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir veículo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCarToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
