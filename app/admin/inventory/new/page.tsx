"use client"

import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { listBrands } from "@/lib/api-admin"
import { useCarForm } from "@/hooks/use-car-form"
import { BasicInfoSection } from "@/components/car-form/basic-info-section"
import { DescriptionSection } from "@/components/car-form/description-section"
import { ImagesSection } from "@/components/car-form/images-section"
import { OptionsSection } from "@/components/car-form/options-section"

export default function AddVehiclePage() {
  const { form, onSubmit, isSubmitting } = useCarForm()

  const { data: brands = [], isLoading: loadingBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => listBrands(),
  })

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Link
          href="/admin/inventory"
          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o inventário
        </Link>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Adicionar Novo Veículo</h2>
        <p className="text-muted-foreground mt-1">Preencha os detalhes do veículo abaixo.</p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <BasicInfoSection brands={brands} isEdit={false} />
          <DescriptionSection />
          <OptionsSection />
          <ImagesSection isEdit={false} />

          {/* Actions */}
          <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
            <Link
              href="/admin/inventory"
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
              {isSubmitting ? "Salvando..." : "Salvar Veículo"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
