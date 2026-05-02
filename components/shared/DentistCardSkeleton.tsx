export function DentistCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md md:flex-row">
      <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:p-5">
        <div className="flex justify-center md:justify-start">
          <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-border p-4 md:w-56 md:border-l md:border-t-0 md:p-5">
        <div className="h-9 w-full animate-pulse rounded-lg bg-gray-200" />
        <div className="h-9 w-full animate-pulse rounded-lg bg-gray-200" />
      </div>
    </article>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <DentistCardSkeleton key={index} />
      ))}
    </div>
  );
}
