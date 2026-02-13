"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { getCarAdmin, listBrands } from "@/lib/api-admin"
import { useCarForm } from "@/hooks/use-car-form"
import { BasicInfoSection } from "@/components/car-form/basic-info-section"
import { DescriptionSection } from "@/components/car-form/description-section"
import { ImagesSection } from "@/components/car-form/images-section"
import { OptionsSection } from "@/components/car-form/options-section"
import { CarFormData } from "@/components/car-form/car-form-schema"

export default function EditVehiclePage() {
  const params = useParams()
  const carId = params.id as string

  const { data: car, isLoading: loadingCar } = useQuery({
    queryKey: ["car", carId],
    queryFn: () => getCarAdmin(carId),
    enabled: !!carId,
  })

  const { data: brands = [], isLoading: loadingBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => listBrands(),
  })

  const defaultValues: Partial<CarFormData> | undefined = car ? {
    brandId: car.brandId ? String(car.brandId) : "",
    model: car.model || "",
    year: car.year,
    price: car.price,
    mileage: car.mileage ?? null,
    description: car.description ?? "",
    status: car.status,
    fuel: car.fuel ?? null,
    color: car.color ?? null,
    transmission: car.transmission ?? null,
    licensePlate: car.licensePlate ?? null,
    financeable: car.financeable ?? false,
    options: (car.options as Record<string, boolean>) ?? {},
    existingImages: car.images || [],
    imagesToKeep: car.images || [],
    images: [],
  } : undefined

  const { form, onSubmit, isSubmitting } = useCarForm({
    carId,
    defaultValues,
  })

  if (loadingCar) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados do veículo...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="text-center py-16">
          <p className="text-destructive text-lg mb-2">Veículo não encontrado</p>
          <Link href="/admin/inventory" className="text-primary hover:underline">
            Voltar para o inventário
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Link
          href={`/admin/inventory/${carId}`}
          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o inventário
        </Link>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Editar Veículo</h2>
        <p className="text-muted-foreground mt-1">Atualize os detalhes do veículo abaixo.</p>
      </div>

      <Form {...form} key={`form-${car.id}-${car.brandId}-${car.fuel}-${car.transmission}`}>
        <form onSubmit={onSubmit} className="space-y-6">
          <BasicInfoSection brands={brands} isEdit={true} />
          <DescriptionSection />
          <OptionsSection />
          <ImagesSection isEdit={true} />

          {/* Actions */}
          <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
            <Link
              href={`/admin/inventory/${carId}`}
              className="px-6 py-2.5 border border-border text-muted-foreground font-semibold rounded-lg hover:bg-muted transition-colors text-sm"
            >
              Cancelar
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting || loadingBrands}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Atualizando..." : "Atualizar Veículo"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
