"use client"

import { useFormContext } from "react-hook-form"
import { FormItem, FormControl } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CarFormData } from "./car-form-schema"

const CAR_OPTIONS = [
  "Câmbio Automático",
  "Ar-condicionado",
  "Ar-condicionado Digital",
  "Alarme",
  "Airbag",
  "Air Bag Duplo",
  "Apoio De Braço",
  "Bancos De Couro",
  "Banco Elétrico",
  "Direção Elétrica",
  "Direção Hidráulica",
  "Retrovisores elétricos",
  "Vidros Elétricos",
  "Som Multimídia",
  "Câmera De Ré",
  "Sensor de Estacionamento",
  "GPS",
  "Painel digital",
  "Piloto Automatico",
  "Som no Volante",
  "Chave Reserva",
  "Controle de Tração",
  "Tração 4x4",
  "Encosto cab. traseiro",
  "Estribo",
  "Farol de led",
  "Farol de neblina",
  "Farol de milha",
  "Freio a disco",
  "Freios ABS",
  "Rodas de liga leve",
  "IPVA pago",
  "Capota Marítima",
  "Protetor de Caçamba",
  "Único Dono",
  "Placa preta"
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

