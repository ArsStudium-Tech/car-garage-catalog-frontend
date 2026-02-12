"use client"

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CarFormData } from "./car-form-schema"
import { Brand } from "@/lib/api-admin"

interface BasicInfoSectionProps {
  brands: Brand[]
  isEdit?: boolean
}

const FUEL_OPTIONS = [
  { value: "Gasolina", label: "Gasolina" },
  { value: "Etanol", label: "Etanol" },
  { value: "Flex", label: "Flex" },
  { value: "Diesel", label: "Diesel" },
  { value: "Elétrico", label: "Elétrico" },
  { value: "Híbrido", label: "Híbrido" },
]

const TRANSMISSION_OPTIONS = [
  { value: "Manual", label: "Manual" },
  { value: "Automático", label: "Automático" },
  { value: "CVT", label: "CVT" },
  { value: "Automatizado", label: "Automatizado" },
]

export function BasicInfoSection({ brands, isEdit = false }: BasicInfoSectionProps) {
  const form = useFormContext<CarFormData>()
  const isSubmitting = form.formState.isSubmitting

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-6 text-foreground">Informações Básicas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Brand */}
        <FormField
          control={form.control}
          name="brandId"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Marca *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value ? String(field.value) : ""} 
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma marca" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={String(brand.id)}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Model */}
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Modelo *</FormLabel>
              <FormControl>
                <Input placeholder="Modelo" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Year */}
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Ano *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  disabled={isSubmitting}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => {
            const formatPrice = (value: number | undefined): string => {
              if (!value || value === 0) return ""
              // Formata com separadores de milhar (ponto) e mantém apenas números e vírgula/ponto
              return new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value)
            }

            const parsePrice = (value: string): number => {
              // Remove tudo exceto números
              const numbers = value.replace(/\D/g, "")
              return numbers ? parseInt(numbers) : 0
            }

            return (
              <FormItem className="space-y-1">
                <FormLabel>Preço (R$) *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      R$
                    </span>
                    <Input
                      type="text"
                      placeholder="0,00"
                      disabled={isSubmitting}
                      className="pl-10"
                      value={formatPrice(field.value)}
                      onChange={(e) => {
                        const numericValue = parsePrice(e.target.value)
                        field.onChange(numericValue)
                      }}
                      onBlur={field.onBlur}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* Mileage */}
        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Quilometragem (km)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  disabled={isSubmitting}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value ? parseInt(value) || null : null)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fuel */}
        <FormField
          control={form.control}
          name="fuel"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Combustível</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(value === "none" ? null : value)} 
                value={field.value ?? "none"} 
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o combustível" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {FUEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Color */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Cor</FormLabel>
              <FormControl>
                <Input placeholder="Cor do veículo" disabled={isSubmitting} {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Transmission */}
        <FormField
          control={form.control}
          name="transmission"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Câmbio</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(value === "none" ? null : value)} 
                value={field.value ?? "none"} 
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o câmbio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {TRANSMISSION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* License Plate */}
        <FormField
          control={form.control}
          name="licensePlate"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Placa</FormLabel>
              <FormControl>
                <Input placeholder="ABC-1234" disabled={isSubmitting} {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Financeable */}
        <FormField
          control={form.control}
          name="financeable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer">
                  Financiável
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {/* Status (Edit only) */}
        {isEdit && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-1" >
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || "AVAILABLE"} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Disponível</SelectItem>
                    <SelectItem value="SOLD">Vendido</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  )
}

