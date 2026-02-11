"use client"

import { useFormContext } from "react-hook-form"
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react"
import { getCarImageUrl } from "@/lib/api-admin"
import { CarFormData } from "./car-form-schema"

interface ImagesSectionProps {
  isEdit?: boolean
}

export function ImagesSection({ isEdit = false }: ImagesSectionProps) {
  const form = useFormContext<CarFormData>()
  const existingImages = form.watch("existingImages") || []
  const images = form.watch("images") || []
  const imagesToKeep = form.watch("imagesToKeep") || []
  const isSubmitting = form.formState.isSubmitting

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const currentImages = form.getValues("images") || []
      form.setValue("images", [...currentImages, ...files], { shouldValidate: true })
    }
  }

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || []
    form.setValue("images", currentImages.filter((_, i) => i !== index), { shouldValidate: true })
  }

  const removeExistingImage = (imageUrl: string) => {
    if (isEdit) {
      const currentKeep = form.getValues("imagesToKeep") || []
      form.setValue("imagesToKeep", currentKeep.filter((url) => url !== imageUrl), { shouldValidate: true })
    }
  }

  const displayExistingImages = isEdit ? existingImages.filter((url) => imagesToKeep.includes(url)) : existingImages
  const totalImages = displayExistingImages.length + images.length

  return (
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
            disabled={isSubmitting}
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
        {totalImages > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-4">
              {totalImages} {totalImages === 1 ? "imagem" : "imagens"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Existing Images */}
              {displayExistingImages.map((imageUrl, index) => (
                <div
                  key={`existing-${index}`}
                  className="relative group aspect-video rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all"
                >
                  <img
                    src={getCarImageUrl(imageUrl)}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isEdit && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeExistingImage(imageUrl)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-all shadow-lg"
                        title="Remover imagem"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* New Images */}
              {images.map((image, index) => (
                <div
                  key={`new-${index}`}
                  className="relative group aspect-video rounded-lg overflow-hidden border-2 border-primary/50 hover:border-primary transition-all"
                >
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
        {totalImages === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma imagem adicionada</p>
            <p className="text-xs text-muted-foreground mt-1">
              Adicione imagens para melhorar a visualização do veículo
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

