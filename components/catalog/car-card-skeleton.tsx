import { Skeleton } from "@/components/ui/skeleton"

export function CarCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="relative aspect-video bg-muted overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <Skeleton className="h-8 w-2/3" />
      </div>
    </div>
  )
}

