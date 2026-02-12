"use client"

import { useFormContext } from "react-hook-form"
import { useState } from "react"
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react"
import { getCarImageUrl } from "@/lib/api-admin"
import { CarFormData } from "./car-form-schema"

interface ImagesSectionProps {
  isEdit?: boolean
}

type ImageItem = 
  | { type: "existing"; url: string }
  | { type: "new"; file: File; index: number }

export function ImagesSection({ isEdit = false }: ImagesSectionProps) {
  const form = useFormContext<CarFormData>()
  const existingImages = form.watch("existingImages") || []
  const images = form.watch("images") || []
  const imagesToKeep = form.watch("imagesToKeep") || []
  const isSubmitting = form.formState.isSubmitting
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const currentImages = form.getValues("images") || []
      form.setValue("images", [...currentImages, ...files], { shouldValidate: true })
    }
  }

  const displayExistingImages = isEdit ? existingImages.filter((url) => imagesToKeep.includes(url)) : existingImages
  
  // Criar array combinado para gerenciar ordem
  const combinedImages: ImageItem[] = [
    ...displayExistingImages.map((url) => ({ type: "existing" as const, url })),
    ...images.map((file, index) => ({ type: "new" as const, file, index }))
  ]

  const totalImages = combinedImages.length

  const removeImageByCombinedIndex = (combinedIndex: number) => {
    const item = combinedImages[combinedIndex]
    if (!item) return

    if (item.type === "existing") {
      if (isEdit) {
        const currentKeep = form.getValues("imagesToKeep") || []
        form.setValue("imagesToKeep", currentKeep.filter((url) => url !== item.url), { shouldValidate: true })
      } else {
        const currentExisting = form.getValues("existingImages") || []
        form.setValue("existingImages", currentExisting.filter((url) => url !== item.url), { shouldValidate: true })
      }
    } else {
      // Para imagens novas, precisamos encontrar o arquivo no array atual
      const currentImages = form.getValues("images") || []
      // Encontrar quantas imagens novas existem antes deste índice no array combinado
      let newImageIndex = 0
      for (let i = 0; i < combinedIndex; i++) {
        if (combinedImages[i].type === "new") {
          newImageIndex++
        }
      }
      form.setValue("images", currentImages.filter((_, i) => i !== newImageIndex), { shouldValidate: true })
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    const newCombinedImages = [...combinedImages]
    const [draggedItem] = newCombinedImages.splice(draggedIndex, 1)
    newCombinedImages.splice(dropIndex, 0, draggedItem)

    // Separar novamente em existing e new
    const newExistingImages: string[] = []
    const newImages: File[] = []

    newCombinedImages.forEach((item) => {
      if (item.type === "existing") {
        newExistingImages.push(item.url)
      } else {
        newImages.push(item.file)
      }
    })

    // Atualizar os arrays no form
    if (isEdit) {
      // Para edição, precisamos atualizar imagesToKeep também
      form.setValue("imagesToKeep", newExistingImages, { shouldValidate: true })
    } else {
      form.setValue("existingImages", newExistingImages, { shouldValidate: true })
    }
    form.setValue("images", newImages, { shouldValidate: true })

    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

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
              {combinedImages.map((item, index) => {
                const isExisting = item.type === "existing"

                return (
                  <div
                    key={isExisting ? `existing-${item.url}` : `new-${item.index}`}
                    draggable
                    onDragStart={(e) => {
                      // Não iniciar drag se clicou no botão
                      if ((e.target as HTMLElement).closest('button')) {
                        e.preventDefault()
                        return
                      }
                      handleDragStart(e, index)
                    }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-move ${
                      isExisting 
                        ? "border-border hover:border-primary" 
                        : "border-primary/50 hover:border-primary"
                    } ${
                      draggedIndex === index ? "opacity-50 scale-95" : ""
                    }`}
                  >
                    <img
                      src={isExisting ? getCarImageUrl(item.url) : URL.createObjectURL(item.file)}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    {!isExisting && (
                      <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded pointer-events-none">
                        Nova
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          removeImageByCombinedIndex(index)
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                        }}
                        onDragStart={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-all shadow-lg z-10"
                        title="Remover imagem"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
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

