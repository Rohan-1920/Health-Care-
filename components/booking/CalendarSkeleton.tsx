export function CalendarSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, index) => (
          <div key={index} className="aspect-square animate-pulse rounded-md bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
