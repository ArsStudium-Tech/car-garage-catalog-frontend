"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, TrendingUp, DollarSign, Calendar, ShoppingBag } from "lucide-react"
import { listCarsAdmin, deleteCarAdmin, formatPrice, formatMileage, getCarImageUrl, AdminCar } from "@/lib/api-admin"
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
import { useToast } from "@/hooks/use-toast"

export default function InventoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cars, setCars] = useState<AdminCar[]>([])
  const [filteredCars, setFilteredCars] = useState<AdminCar[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [carToDelete, setCarToDelete] = useState<string | null>(null)

  useEffect(() => {
    loadCars()
  }, [])

  async function loadCars() {
    try {
      setLoading(true)
      const data = await listCarsAdmin()
      // Garantir que sempre seja um array
      const carsArray = Array.isArray(data) ? data : []
      setCars(carsArray)
      setFilteredCars(carsArray)
    } catch (error) {
      console.error("Error loading cars:", error)
      setCars([])
      setFilteredCars([])
      toast({
        title: "Erro ao carregar veículos",
        description: "Não foi possível carregar a lista de veículos. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!Array.isArray(cars)) {
      setFilteredCars([])
      return
    }

    let filtered = [...cars]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (car) =>
          car.brand?.name?.toLowerCase().includes(term) ||
          car.model?.toLowerCase().includes(term) ||
          car.year?.toString().includes(term)
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((car) => car.status === selectedStatus)
    }

    if (selectedBrand !== "all") {
      filtered = filtered.filter((car) => car.brand?.name === selectedBrand)
    }

    setFilteredCars(filtered)
  }, [searchTerm, selectedStatus, selectedBrand, cars])

  const handleDeleteClick = (id: string) => {
    setCarToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!carToDelete) return

    try {
      await deleteCarAdmin(carToDelete)
      await loadCars()
      setDeleteDialogOpen(false)
      setCarToDelete(null)
      toast({
        title: "Veículo excluído",
        description: "O veículo foi excluído com sucesso.",
      })
    } catch (error) {
      console.error("Error deleting car:", error)
      toast({
        title: "Erro ao excluir veículo",
        description: "Não foi possível excluir o veículo. Tente novamente.",
        variant: "destructive",
      })
    }
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

  const brands = Array.from(new Set((cars || []).map((car) => car.brand.name))).sort()

  // Calculate stats
  const totalValue = (cars || []).reduce((sum, car) => sum + car.price, 0)
  const availableCount = (cars || []).filter((car) => car.status === "AVAILABLE").length
  const soldCount = (cars || []).filter((car) => car.status === "SOLD").length

  const inventoryStats = [
    { 
      label: "Valor total do estoque", 
      value: formatPrice(totalValue), 
      sub: `${(cars || []).length} veículos`, 
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
      value: `${(cars || []).length} Veículos`, 
      sub: "Em estoque", 
      positive: true, 
      icon: Calendar 
    },
  ]

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando inventário...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span className="hover:text-primary cursor-pointer">Inventory</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">All Vehicles</span>
          </nav>
          <h1 className="text-2xl font-bold text-foreground">Vehicle Inventory</h1>
        </div>
        <Link
          href="/admin/inventory/new"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm text-sm"
        >
          <Plus className="h-4 w-4" />
          Add New Vehicle
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-sm"
              placeholder="Search by brand, model or year..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <select 
              className="w-full py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground text-sm"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="all">Marca: Todas</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <select 
              className="w-full py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Status: Todos</option>
              <option value="AVAILABLE">Disponível</option>
              <option value="SOLD">Vendido</option>
            </select>
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
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vehicle Details</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mileage</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhum veículo encontrado
                  </td>
                </tr>
              ) : (
                (filteredCars || []).map((car) => {
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
        {filteredCars.length > 0 && (
          <div className="px-6 py-4 bg-muted/50 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Mostrando {filteredCars.length} de {(cars || []).length} veículos
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
