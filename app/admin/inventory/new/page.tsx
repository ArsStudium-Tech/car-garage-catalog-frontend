"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, X, Upload, Image as ImageIcon, Trash2 } from "lucide-react"
import { createCarAdmin, updateCarAdmin, getCarAdmin, AdminCar, getCarImageUrl, listBrands, Brand } from "@/lib/api-admin"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddVehiclePage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const isEdit = params.id !== undefined || searchParams.get("edit") === "true"
  const carId = params.id as string | undefined
  
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEdit)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    brandId: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: "",
    description: "",
    status: "AVAILABLE" as "AVAILABLE" | "SOLD",
  })
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loadingBrands, setLoadingBrands] = useState(true)

  useEffect(() => {
    loadBrands()
    if (isEdit && carId) {
      loadCar()
    }
  }, [isEdit, carId])

  async function loadBrands() {
    try {
      setLoadingBrands(true)
      const data = await listBrands()
      setBrands(data)
    } catch (err: any) {
      console.error("Erro ao carregar marcas:", err)
    } finally {
      setLoadingBrands(false)
    }
  }

  async function loadCar() {
    try {
      setLoadingData(true)
      const car = await getCarAdmin(carId!)
      setFormData({
        brandId: car.brandId,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage?.toString() || "",
        description: car.description || "",
        status: car.status,
      })
      setExistingImages(car.images || [])
    } catch (err: any) {
      setError("Erro ao carregar veículo")
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.brandId || !formData.model || !formData.year || !formData.price) {
        setError("Preencha todos os campos obrigatórios")
        setLoading(false)
        return
      }

      if (isEdit && carId) {
        await updateCarAdmin(carId, {
          brandId: formData.brandId,
          model: formData.model,
          year: formData.year,
          price: formData.price,
          mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
          description: formData.description || undefined,
          status: formData.status,
          images: images.length > 0 ? images : undefined,
        })
      } else {
        await createCarAdmin({
          brandId: formData.brandId,
          model: formData.model,
          year: formData.year,
          price: formData.price,
          mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
          description: formData.description || undefined,
          images: images.length > 0 ? images : undefined,
        })
      }

      router.push("/admin/inventory")
    } catch (err: any) {
      setError(err.message || `Erro ao ${isEdit ? "atualizar" : "criar"} veículo`)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages([...images, ...files])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin/inventory" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Link>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">{isEdit ? "Edit Vehicle" : "Add New Vehicle"}</h2>
        <p className="text-muted-foreground mt-1">{isEdit ? "Update the vehicle details below." : "Enter the vehicle details below."}</p>
      </div>

      {loadingData && (
        <div className="mb-6 p-4 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Carregando dados do veículo...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold mb-6 text-foreground">Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Marca *</label>
              <Select
                value={formData.brandId}
                onValueChange={(value) => setFormData({ ...formData, brandId: value })}
                disabled={loading || loadingBrands}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma marca" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Modelo *</label>
              <input
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Ano *</label>
              <input
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Preço (R$) *</label>
              <input
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Quilometragem (km)</label>
              <input
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
                type="number"
                min="0"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                disabled={loading || loadingData}
              />
            </div>
            {isEdit && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <select
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "AVAILABLE" | "SOLD" })}
                  disabled={loading || loadingData}
                >
                  <option value="AVAILABLE">Disponível</option>
                  <option value="SOLD">Vendido</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold mb-6 text-foreground">Descrição</h3>
          <textarea
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm min-h-[120px] resize-y"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descreva o veículo..."
            disabled={loading}
          />
        </div>

        {/* Images */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold mb-6 text-foreground">Imagens</h3>
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                id="image-upload"
                className="hidden"
                disabled={loading || loadingData}
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl bg-muted/50 hover:bg-muted hover:border-primary transition-all cursor-pointer group"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="mb-2 text-sm font-semibold text-foreground">
                    <span className="text-primary">Clique para fazer upload</span> ou arraste e solte
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, WEBP até 5MB cada</p>
                </div>
              </label>
            </div>

            {/* Images Grid */}
            {(existingImages.length > 0 || images.length > 0) && (
              <div>
                <p className="text-sm font-medium text-foreground mb-4">
                  {existingImages.length + images.length} {(existingImages.length + images.length) === 1 ? 'imagem' : 'imagens'}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Existing Images */}
                  {existingImages.map((imageUrl, index) => (
                    <div key={`existing-${index}`} className="relative group aspect-video rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all">
                      <img
                        src={getCarImageUrl(imageUrl)}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  
                  {/* New Images */}
                  {images.map((image, index) => (
                    <div key={`new-${index}`} className="relative group aspect-video rounded-lg overflow-hidden border-2 border-primary/50 hover:border-primary transition-all">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-all shadow-lg"
                          title="Remover imagem"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                        Nova
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {existingImages.length === 0 && images.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Nenhuma imagem adicionada</p>
                <p className="text-xs text-muted-foreground mt-1">Adicione imagens para melhorar a visualização do veículo</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
          <Link
            href="/inventory"
            className="px-6 py-2.5 border border-border text-muted-foreground font-semibold rounded-lg hover:bg-muted transition-colors text-sm"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {loading ? (isEdit ? "Atualizando..." : "Salvando...") : (isEdit ? "Atualizar Veículo" : "Salvar Veículo")}
          </button>
        </div>
      </form>
    </div>
  )
}
