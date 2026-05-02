import { SkeletonGrid } from "@/components/shared/DentistCardSkeleton";

export default function DoctorsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <SkeletonGrid />
    </div>
  );
}
