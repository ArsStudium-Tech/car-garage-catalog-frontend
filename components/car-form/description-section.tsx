"use client"

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { CarFormData } from "./car-form-schema"

export function DescriptionSection() {
  const form = useFormContext<CarFormData>()

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-6 text-foreground">Descrição</h3>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                className="min-h-[120px] resize-y"
                placeholder="Descreva o veículo..."
                disabled={form.formState.isSubmitting}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

