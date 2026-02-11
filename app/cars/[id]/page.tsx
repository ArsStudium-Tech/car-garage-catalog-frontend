"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Share2, Phone, MessageCircle, CheckCircle } from "lucide-react"
import { getCar, getGarage, formatPrice, formatMileage, Car, Garage } from "@/lib/api"
import { CarGallery } from "@/components/car-gallery"
import { CarSpecs } from "@/components/car-specs"
import { PublicHeader } from "@/components/public-header"
import { useToast } from "@/hooks/use-toast"

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [car, setCar] = useState<Car | null>(null)
  const [garage, setGarage] = useState<Garage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [queroFinanciar, setQueroFinanciar] = useState(false)
  const [queroTroca, setQueroTroca] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [carData, garageData] = await Promise.all([
          getCar(params.id as string),
          getGarage().catch(() => null),
        ])
        setCar(carData)
        setGarage(garageData)
      } catch (err) {
        console.error("Error loading car:", err)
        setError("Veículo não encontrado")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [params.id])

  const handleWhatsApp = () => {
    if (!garage?.whatsapp || !car) return

    let message = `Olá! Tenho interesse no veículo ${car.brand.name} ${car.model} ${car.year}`
    
    const interesses = []
    if (queroFinanciar) {
      interesses.push("Quero financiar")
    }
    if (queroTroca) {
      interesses.push("Quero dar veículo na troca")
    }
    
    if (interesses.length > 0) {
      message += `\n\nInteresses:\n${interesses.join("\n")}`
    }

    const encodedMessage = encodeURIComponent(message)
    const nonDigitRegex = /\D/g
    const whatsappNumber = garage.whatsapp.replace(nonDigitRegex, "")
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  const handleShare = async () => {
    if (!car) return

    const url = typeof window !== "undefined" ? window.location.href : ""
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (isMobile && typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${car.brand.name} ${car.model} ${car.year}`,
          text: `Confira este veículo: ${car.brand.name} ${car.model} ${car.year}`,
          url: url,
        })
        return
      } catch (err: any) {
        if (err.name === "AbortError") {
          return
        }
      }
    }

    if (typeof window !== "undefined") {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url)
          toast({
            title: "Link copiado!",
            description: "O link foi copiado para a área de transferência.",
          })
          return
        }
      } catch (err) {
      }

      try {
        const textArea = document.createElement("textarea")
        textArea.value = url
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "0"
        textArea.setAttribute("readonly", "")
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand("copy")
        document.body.removeChild(textArea)
        
        if (successful) {
          toast({
            title: "Link copiado!",
            description: "O link foi copiado para a área de transferência.",
          })
        } else {
          toast({
            title: "Erro ao copiar",
            description: "Não foi possível copiar o link. Por favor, copie manualmente.",
            variant: "destructive",
          })
        }
      } catch (err) {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o link. Por favor, copie manualmente.",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando detalhes do veículo...</p>
        </div>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">{error || "Veículo não encontrado"}</p>
          <Link
            href="/"
            className="text-primary hover:underline inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    )
  }

  const carName = `${car.brand.name} ${car.model}`

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center text-sm gap-2">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Catálogo
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold text-foreground">{carName}</span>
          </div>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {car.brand.name} {car.model}
              </h1>
              <div className="flex items-center mt-2 gap-3 flex-wrap">
                <span className="text-muted-foreground text-sm">{car.year}</span>
                {car.mileage !== null && car.mileage !== undefined && car.mileage >= 0 && (
                  <>
                    <span className="text-muted-foreground text-sm">•</span>
                    <span className="text-muted-foreground text-sm">{formatMileage(car.mileage)}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {car.status === "AVAILABLE" && (
                <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  Disponível
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            {/* Gallery */}
            <CarGallery images={car.images} carName={carName} />

            {/* Specs & Description */}
            <div className="bg-card rounded-xl border border-border shadow-sm">
              <div className="p-8">
                <h2 className="text-xl font-bold mb-6 text-foreground">Especificações</h2>
                <CarSpecs car={car} />

                {/* Options */}
                {car.options && Object.keys(car.options).length > 0 && (
                  <div className="mt-12 pt-8 border-t border-border">
                    <h3 className="text-lg font-bold mb-4 text-foreground">Opcionais</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {Object.entries(car.options)
                        .filter(([_, value]) => value === true)
                        .map(([key, _]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span className="text-sm text-foreground">{key}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

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
              {/* Price & Actions Card */}
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground font-medium">Preço</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-3xl font-extrabold text-foreground">
                      {formatPrice(car.price)}
                    </h2>
                  </div>
                </div>

                {garage?.whatsapp && (
                  <>
                    <div className="border-t border-border my-4"></div>
                    
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={queroFinanciar}
                          onChange={(e) => setQueroFinanciar(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                        />
                        <span className="text-sm text-foreground">Quero financiar</span>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={queroTroca}
                          onChange={(e) => setQueroTroca(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                        />
                        <span className="text-sm text-foreground">Quero dar veículo na troca</span>
                      </label>
                    </div>

                    <div className="flex flex-col gap-3 mt-2">
                      <button
                        onClick={handleWhatsApp}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                        type="button"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Falar no WhatsApp
                      </button>
                    </div>
                  </>
                )}

                  {/* {garage?.whatsapp ? (
                    <button
                      onClick={handleWhatsApp}
                      className="w-full bg-card border border-border text-foreground font-bold py-2.5 rounded-lg hover:bg-muted transition-all flex items-center justify-center gap-2 text-sm"
                      type="button"
                    >
                      <Phone className="h-4 w-4" />
                      Entrar em Contato
                    </button>
                  ) : (
                    <button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                      type="button"
                    >
                      <Phone className="h-4 w-4" />
                      Solicitar Informações
                    </button>
                  )} */}

                <div className="flex flex-col gap-3 mt-3">
                  <button
                    onClick={handleShare}
                    className="w-full bg-card border border-border text-foreground font-bold py-2.5 rounded-lg hover:bg-muted transition-all flex items-center justify-center gap-2 text-sm"
                    type="button"
                  >
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              {car.status === "AVAILABLE" && (
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-1">
                        Veículo Disponível
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Este veículo está disponível para venda. Entre em contato para mais informações ou agendar uma visita.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

