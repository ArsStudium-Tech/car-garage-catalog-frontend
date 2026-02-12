"use client"

import { useState } from "react"
import Image from "next/image"
import { getCarImageUrl } from "@/lib/api"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarGalleryProps {
  images: string[]
  carName: string
}

export function CarGallery({ images, carName }: CarGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const mainImage = images && images.length > 0 ? images[currentIndex] : null

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!images || images.length === 0) {
    return (
      <div className="bg-card p-2 rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          <span className="text-2xl font-bold text-muted-foreground/30">Sem Imagens</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card p-2 rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Main Image */}
      <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
        <Image
          src={getCarImageUrl(mainImage)}
          alt={`${carName} - Imagem ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 80vw"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-0 top-5 bottom-0 w-16 text-card transition-all flex items-center justify-center"
              type="button"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-7 w-7 " />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-0 top-5 bottom-0 w-16 text-card transition-all flex items-center justify-center"
              type="button"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-foreground/60 text-card px-3 py-1.5 rounded-lg text-xs backdrop-blur-md flex items-center gap-1">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex mt-2 gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-32 aspect-video rounded-md overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-primary opacity-100"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
              type="button"
            >
              <div className="relative w-full h-full">
                <Image
                  src={getCarImageUrl(image)}
                  alt={`${carName} - Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

