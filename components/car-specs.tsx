import { Car, formatMileage } from "@/lib/api"

interface CarSpecsProps {
  car: Car
}

export function CarSpecs({ car }: CarSpecsProps) {
  const specs = [
    { label: "Marca", value: car.brand.name },
    { label: "Modelo", value: car.model },
    { label: "Ano", value: car.year.toString() },
    { label: "Quilometragem", value: formatMileage(car.mileage) },
    { label: "Status", value: car.status === "AVAILABLE" ? "Disponível" : "Vendido" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12">
      {specs.map((spec) => (
        <div key={spec.label}>
          <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">
            {spec.label}
          </p>
          <p className="text-foreground font-medium">{spec.value}</p>
        </div>
      ))}
    </div>
  )
}

