"use client"

import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { carFormSchema, CarFormData } from "@/components/car-form/car-form-schema"
import { createCarAdmin, updateCarAdmin, AdminCar } from "@/lib/api-admin"

interface UseCarFormOptions {
  carId?: string
  defaultValues?: Partial<CarFormData>
  onSuccess?: () => void
}

export function useCarForm({ carId, defaultValues, onSuccess }: UseCarFormOptions = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isEdit = !!carId

  const form = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      brandId: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: null,
      description: "",
      status: "AVAILABLE",
      fuel: null,
      color: null,
      transmission: null,
      licensePlate: null,
      financeable: false,
      options: {},
      images: [],
      existingImages: [],
      imagesToKeep: [],
    },
  })

  // Reset form when defaultValues change (for edit mode)
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0 && isEdit) {
      const resetValues: CarFormData = {
        brandId: defaultValues.brandId ? String(defaultValues.brandId) : "",
        model: defaultValues.model || "",
        year: defaultValues.year || new Date().getFullYear(),
        price: defaultValues.price || 0,
        mileage: defaultValues.mileage ?? null,
        description: defaultValues.description ?? "",
        status: (defaultValues.status as "AVAILABLE" | "SOLD") || "AVAILABLE",
        fuel: defaultValues.fuel ?? null,
        color: defaultValues.color ?? null,
        transmission: defaultValues.transmission ?? null,
        licensePlate: defaultValues.licensePlate ?? null,
        financeable: defaultValues.financeable ?? false,
        options: defaultValues.options ?? {},
        images: defaultValues.images || [],
        existingImages: defaultValues.existingImages || [],
        imagesToKeep: defaultValues.imagesToKeep || [],
      }
      // Use setTimeout to ensure reset happens after render
      const timer = setTimeout(() => {
        form.reset(resetValues, { keepDefaultValues: false })
      }, 0)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultValues?.brandId,
    defaultValues?.fuel,
    defaultValues?.transmission,
    defaultValues?.model,
    defaultValues?.year,
    defaultValues?.price,
    isEdit
  ])

  const createMutation = useMutation({
    mutationFn: async (data: CarFormData) => {
      const { images, existingImages, imagesToKeep, ...carData } = data
      return createCarAdmin({
        ...carData,
        mileage: carData.mileage ?? undefined,
        description: carData.description ?? undefined,
        fuel: carData.fuel ?? undefined,
        color: carData.color ?? undefined,
        transmission: carData.transmission ?? undefined,
        licensePlate: carData.licensePlate ?? undefined,
        options: carData.options ?? undefined,
        images: images || undefined,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] })
      toast({
        title: "Veículo criado",
        description: "O veículo foi criado com sucesso.",
      })
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/admin/inventory")
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar veículo",
        description: error.message || "Não foi possível criar o veículo. Tente novamente.",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: CarFormData) => {
      if (!carId) throw new Error("Car ID is required for update")
      const { images, existingImages, imagesToKeep, ...carData } = data
      return updateCarAdmin(carId, {
        ...carData,
        mileage: carData.mileage ?? undefined,
        description: carData.description ?? undefined,
        fuel: carData.fuel ?? undefined,
        color: carData.color ?? undefined,
        transmission: carData.transmission ?? undefined,
        licensePlate: carData.licensePlate ?? undefined,
        options: carData.options ?? undefined,
        images: images || undefined,
        imagesToKeep: imagesToKeep || existingImages,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] })
      queryClient.invalidateQueries({ queryKey: ["car", carId] })
      toast({
        title: "Veículo atualizado",
        description: "O veículo foi atualizado com sucesso.",
      })
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/admin/inventory/${carId}`)
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar veículo",
        description: error.message || "Não foi possível atualizar o veículo. Tente novamente.",
        variant: "destructive",
      })
    },
  })

  const onSubmit = async (data: CarFormData) => {
    if (isEdit) {
      await updateMutation.mutateAsync(data)
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isEdit,
  }
}

