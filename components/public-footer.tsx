"use client"

import { MapPin, Phone } from "lucide-react"
import { useGarage } from "./garage-provider"

export function PublicFooter() {
  const { garage, isLoading } = useGarage()

  if (isLoading || !garage) return null

  const endereco = garage.endereco

  const hasAddress =
    endereco &&
    (endereco.logradouro ||
      endereco.numero ||
      endereco.bairro ||
      endereco.cidade ||
      endereco.estado)

  const formatAddress = () => {
    if (!hasAddress) return null

    const parts: string[] = []

    if (endereco.logradouro) {
      const numero = endereco.numero ? `, ${endereco.numero}` : ""
      parts.push(`${endereco.logradouro}${numero}`)
    }

    if (endereco.bairro) {
      parts.push(endereco.bairro)
    }

    if (endereco.cidade || endereco.estado) {
      const cidadeEstado = [endereco.cidade, endereco.estado]
        .filter(Boolean)
        .join(" - ")
      if (cidadeEstado) parts.push(cidadeEstado)
    }

    return parts.length > 0 ? parts.join(", ") : null
  }

  const addressText = formatAddress()
  const hasCoordinates = endereco?.latitude && endereco?.longitude

  if (!addressText && !garage.whatsapp && !hasCoordinates) return null

  return (
    <footer className="w-full border-t bg-muted/30 mt-auto mt-20">
      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 text-center">
          
          {/* Identidade */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {garage.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Atendimento profissional e transparente para o seu veículo.
            </p>

            {addressText && (
            <div className="flex gap-3 justify-center">
              <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${endereco?.latitude},${endereco?.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline transition-colors"
                  >
                    {addressText}
                  </a>
                </div>
            </div>
          )}

            {garage.whatsapp && (
              <div className="flex gap-3 justify-center">
                <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <a
                    href={`https://wa.me/${garage.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-col gap-2 h-50">
              {hasCoordinates && <MapComponent latitude={endereco?.latitude!} longitude={endereco?.longitude!} garageName={garage.name} />}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {garage.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}

function MapComponent({
  latitude,
  longitude,
  garageName,
}: {
  latitude: number
  longitude: number
  garageName: string
}) {
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed&z=18`
  
  return (
    <div className="flex flex-col gap-2 h-[150px]">
      <p className="text-sm font-medium text-foreground mb-1">
        Localização
      </p>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full aspect-square rounded-lg overflow-hidden border border-border shadow-sm bg-muted/20 hover:opacity-90 transition-opacity"
        title={`Ver localização de ${garageName} no Google Maps`}
      >
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
          title={`Localização de ${garageName}`}
          className="pointer-events-none"
        />
      </a>
    </div>
  )
}
