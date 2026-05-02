export default function DoctorProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-48 w-full animate-pulse bg-gray-200" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_340px] lg:px-6">
        <div className="space-y-4">
          <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200" />
          <div className="h-28 w-full animate-pulse rounded-xl bg-gray-200" />
          <div className="h-28 w-full animate-pulse rounded-xl bg-gray-200" />
        </div>
        <div className="h-72 w-full animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}
