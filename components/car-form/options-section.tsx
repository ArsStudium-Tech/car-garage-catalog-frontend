"use client"

import { useFormContext } from "react-hook-form"
import { FormItem, FormControl } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CarFormData } from "./car-form-schema"

// Lista de opcionais (removendo duplicatas)
const CAR_OPTIONS = [
  "4x4",
  "Airbag",
  "Alarme",
  "Apoio De Braço",
  "Ar-condicionado",
  "Bancos De Couro",
  "Câmbio Automático",
  "Direção Elétrica",
  "Retrovisor Elétrico",
  "Som Multimídia",
  "Ar-condicionado Digital",
  "Banco Elétrico",
  "Câmera De Ré",
  "Capota Marítima",
  "Chave Reserva",
  "Air Bag Duplo",
  "Controle de Tração",
  "Encosto cab. traseiro",
  "Estribo",
  "Farol de neblina",
  "Freio a disco",
  "GPS",
  "IPVA pago",
  "Licenciado",
  "Painel digital",
  "Piloto Automatico",
  "Protetor de Caçamba",
  "Sensor de Estacionamento",
  "Som no Volante",
  "Tração 4x4",
  "Único Dono",
  "Vidros Elétricos",
]

export function OptionsSection() {
  const form = useFormContext<CarFormData>()
  const options = form.watch("options") || {}
  const isSubmitting = form.formState.isSubmitting

  const handleOptionChange = (optionName: string, checked: boolean) => {
    const currentOptions = form.getValues("options") || {}
    form.setValue(
      "options",
      {
        ...currentOptions,
        [optionName]: checked,
      },
      { shouldValidate: true }
    )
  }

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-6 text-foreground">Opcionais do Veículo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAR_OPTIONS.map((option) => (
          <FormItem key={option}>
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={options[option] || false}
                  onCheckedChange={(checked) => handleOptionChange(option, checked === true)}
                  disabled={isSubmitting}
                />
              </FormControl>
              <Label className="text-sm font-normal cursor-pointer">{option}</Label>
            </div>
          </FormItem>
        ))}
      </div>
    </div>
  )
}

