import Link from "next/link"
import Image from "next/image"
import { Car } from "@/lib/api"
import { formatPrice, getCarImageUrl } from "@/lib/api"
import { Car as CarIcon } from "lucide-react"

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
  const mainImage = car.images && car.images.length > 0 ? car.images[0] : null
  const imageUrl = getCarImageUrl(mainImage)

  return (
    <Link href={`/cars/${car.id}`} className="group">
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-all">
        {/* Image */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {mainImage ? (
            <Image
              src={imageUrl}
              alt={`${car.brand.name} ${car.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
              <CarIcon className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold uppercase">
              Disponível
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
            {car.brand.name} {car.model}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {car.year} • {car.mileage ? `${(car.mileage / 1000).toFixed(0)}k km` : 'Novo'}
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-foreground">
              {formatPrice(car.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

