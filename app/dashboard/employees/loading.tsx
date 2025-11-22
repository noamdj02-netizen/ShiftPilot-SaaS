import { SkeletonCard, SkeletonLoader } from "@/components/animations/skeleton-loader"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <SkeletonLoader variant="text" width="200px" height={32} />
            <SkeletonLoader variant="text" width="300px" height={20} />
          </div>
          <SkeletonLoader variant="rectangular" width="150px" height={40} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SkeletonLoader variant="rectangular" width="100%" height={40} />
          <SkeletonLoader variant="rectangular" width="150px" height={40} />
          <SkeletonLoader variant="rectangular" width="150px" height={40} />
        </div>

        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  )
}
