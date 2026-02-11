import { z } from "zod"

export const carFormSchema = z.object({
  brandId: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1, "Ano inválido"),
  price: z.number().min(0, "Preço deve ser maior ou igual a zero"),
  mileage: z.number().min(0).nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["AVAILABLE", "SOLD"]).optional(),
  fuel: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  transmission: z.string().nullable().optional(),
  licensePlate: z.string().nullable().optional(),
  financeable: z.boolean().optional(),
  options: z.record(z.string(), z.boolean()).nullable().optional(),
  images: z.array(z.instanceof(File)).optional(),
  existingImages: z.array(z.string()).optional(),
  imagesToKeep: z.array(z.string()).optional(),
})

export type CarFormData = z.infer<typeof carFormSchema>

