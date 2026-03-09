import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 rounded",
        className
      )}
    />
  );
}

export function StayCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/3] rounded-card mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-2" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function StayDetailSkeleton() {
  return (
    <div className="pt-[72px] bg-bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-card overflow-hidden">
          <Skeleton className="md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto md:h-full" />
          <Skeleton className="aspect-[4/3] hidden md:block" />
          <Skeleton className="aspect-[4/3] hidden md:block" />
          <Skeleton className="aspect-[4/3] hidden md:block" />
          <Skeleton className="aspect-[4/3] hidden md:block" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-px w-full bg-gray-100" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-px w-full bg-gray-100" />
            <Skeleton className="h-5 w-24 mb-3" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div>
            <Skeleton className="h-[400px] rounded-modal" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
