"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Pencil, Share2, CheckCircle, Trash2 } from "lucide-react"
import { getCarAdmin, deleteCarAdmin, formatPrice, formatMileage, getCarImageUrl, AdminCar } from "@/lib/api-admin"
import { CarGallery } from "@/components/car-gallery"
import Image from "next/image"
import { Car as CarIcon } from "lucide-react"

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEdit = searchParams.get("edit") === "true"
  const [car, setCar] = useState<AdminCar | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCar()
  }, [params.id])

  async function loadCar() {
    try {
      setLoading(true)
      const data = await getCarAdmin(params.id as string)
      setCar(data)
    } catch (err: any) {
      console.error("Error loading car:", err)
      setError("Veículo não encontrado")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este veículo?")) return

    try {
      await deleteCarAdmin(car!.id)
      router.push("/admin/inventory")
    } catch (error) {
      console.error("Error deleting car:", error)
      alert("Erro ao excluir veículo")
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando detalhes do veículo...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <p className="text-lg font-semibold text-foreground mb-2">{error || "Veículo não encontrado"}</p>
          <Link href="/inventory" className="text-primary hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao inventário
          </Link>
        </div>
      </div>
    )
  }

  const carName = `${car.brand.name} ${car.model}`

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/inventory" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center text-sm gap-2">
            <Link href="/inventory" className="text-muted-foreground hover:text-primary transition-colors">
              Inventory
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="font-semibold text-foreground">{carName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/admin/inventory/edit/${car.id}`)}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary text-sm font-medium"
            type="button"
          >
            <Pencil className="h-4 w-4" />
            Edit Details
          </button>
        </div>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {car.year} {car.brand.name} {car.model}
            </h1>
            <div className="flex items-center mt-2 gap-3 flex-wrap">
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">ID: {car.id.slice(0, 8)}</span>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-muted-foreground text-sm">{formatMileage(car.mileage)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
              car.status === "AVAILABLE" 
                ? "bg-emerald-100 text-emerald-600" 
                : "bg-slate-200 text-slate-700"
            }`}>
              <span className={`w-2 h-2 rounded-full ${car.status === "AVAILABLE" ? "bg-emerald-500" : "bg-slate-500"}`} />
              {car.status === "AVAILABLE" ? "Disponível" : "Vendido"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          {/* Gallery */}
          <CarGallery images={car.images} carName={carName} />

          {/* Specs */}
          <div className="bg-card rounded-xl border border-border shadow-sm">
            <div className="p-8">
              <h2 className="text-xl font-bold mb-6 text-foreground">Especificações</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12">
                <div>
                  <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Marca</p>
                  <p className="text-foreground font-medium">{car.brand.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Modelo</p>
                  <p className="text-foreground font-medium">{car.model}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Ano</p>
                  <p className="text-foreground font-medium">{car.year}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Quilometragem</p>
                  <p className="text-foreground font-medium">{formatMileage(car.mileage)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Status</p>
                  <p className="text-foreground font-medium">{car.status === "AVAILABLE" ? "Disponível" : "Vendido"}</p>
                </div>
              </div>
              {car.description && (
                <div className="mt-12 pt-8 border-t border-border">
                  <h3 className="text-lg font-bold mb-4 text-foreground">Descrição</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {car.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="sticky top-24 flex flex-col gap-6">
            {/* Price Card */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="mb-6">
                <span className="text-sm text-muted-foreground font-medium">Preço de Listagem</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h2 className="text-3xl font-extrabold text-foreground">
                    {formatPrice(car.price)}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push(`/admin/inventory/edit/${car.id}`)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                  type="button"
                >
                  <Pencil className="h-4 w-4" />
                  Editar Veículo
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDelete}
                    className="bg-card border border-border text-destructive font-bold py-2.5 rounded-lg hover:bg-destructive/5 transition-all flex items-center justify-center gap-1 text-sm"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                  <button
                    className="bg-card border border-border text-foreground font-bold py-2.5 rounded-lg hover:bg-muted transition-all flex items-center justify-center gap-1 text-sm"
                    type="button"
                  >
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${car.status === "AVAILABLE" ? "text-emerald-600" : "text-slate-500"}`} />
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    {car.status === "AVAILABLE" ? "Veículo Disponível" : "Veículo Vendido"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {car.status === "AVAILABLE" 
                      ? "Este veículo está disponível para venda e visível no catálogo público."
                      : "Este veículo foi vendido e não aparece mais no catálogo público."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
